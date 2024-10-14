import React, { useState } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Box, Container } from '@mui/material';
import UserNavbar from "../components/UserNavbar"
import UpdateSecurityQuestions from './UpdateSecurtyQuestion';
const Security = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingVerifyAnswers, setLoadingVerifyAnswers] = useState(false);
  const [loadingVerifyPassword, setLoadingVerifyPassword] = useState(false);
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);
  const [securityVerified, setSecurityVerified] = useState(false);
  const [oldPasswordVerified, setOldPasswordVerified] = useState(false);
  const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(false);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Fetch security questions directly after clicking "Update Password"
  const fetchSecurityQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const securityQuestionsResponse = await axiosInstance.get('/security/get-questions');
      setSecurityQuestions(securityQuestionsResponse.data.questions);
      setMessage('Answer the security questions to proceed.');
      setError('');
    } catch (err) {
      setError('Failed to load security questions. Please try again.');
      console.log(err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Verify security question answers
  const verifySecurityQuestions = async () => {
    setLoadingVerifyAnswers(true);
    try {
      const response = await axiosInstance.post('/security/verify-questions', { answers });
      if (response.data.success) {
        setMessage('Security questions verified. Please enter your old password.');
        setSecurityVerified(true);
        setIsVerifyButtonDisabled(true);  // Disable the button after success
        setError('');
      }
    } catch (err) {
      setError('Invalid security answers. Please try again.');
      console.log(err);
    } finally {
      setLoadingVerifyAnswers(false);
    }
  };

  // Verify old password
  const verifyOldPassword = async () => {
    setLoadingVerifyPassword(true);
    try {
      const response = await axiosInstance.post('/security/verify-old-password', {
        email: user.email,
        oldPassword: passwords.oldPassword,
      });
      if (response.data.success) {
        setMessage('Old password verified. You may now reset your password.');
        setOldPasswordVerified(true);
        setError('');
      } else {
        setError('Old password is incorrect.');
      }
    } catch (err) {
      setError('Failed to verify old password.');
      console.log(err);
    } finally {
      setLoadingVerifyPassword(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordPattern.test(passwords.newPassword)) {
      setError('Password must be at least 8 characters long, include a special character, one uppercase letter, one lowercase letter, and a number.');
      return;
    }

    setLoadingUpdatePassword(true);
    try {
      const response = await axiosInstance.post('/security/update-password', {
        email: user.email,
        password: passwords.newPassword
      });
      setMessage(response.data.message);
      setError('');
      navigate('/login'); // Redirect to login after successful password reset
    } catch (err) {
      setError('Failed to update password.');
      console.log(err);
    } finally {
      setLoadingUpdatePassword(false);
    }
  };

  return (
    <>
    <UserNavbar/>
    <Container maxWidth="sm" className="p-6 bg-white rounded-lg shadow-lg mt-10">
      <Typography variant="h4" align="center" gutterBottom>
        Update Your Security Information
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Please follow the steps below to reset your password securely.
      </Typography>

      {!securityVerified && (
        <Box mt={4}>
          <Typography variant="body1">
            Click the button below to begin updating your password by verifying your security questions.
          </Typography>
          <Button
            onClick={fetchSecurityQuestions}
            disabled={loadingQuestions}
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            startIcon={loadingQuestions && <CircularProgress size={20} />}
          >
            {loadingQuestions ? 'Loading Questions...' : 'Update Password'}
          </Button>
        </Box>
      )}

      {securityQuestions.length > 0 && !securityVerified && (
        <Box mt={4}>
          <Typography variant="body1">Answer the security questions below:</Typography>
          {securityQuestions.map((question, index) => (
            <TextField
              key={index}
              fullWidth
              margin="normal"
              label={question.question}
              variant="outlined"
              onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })}
            />
          ))}
          <Button
            onClick={verifySecurityQuestions}
            disabled={loadingVerifyAnswers || isVerifyButtonDisabled} // Disable after success
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            startIcon={loadingVerifyAnswers && <CircularProgress size={20} />}
          >
            {loadingVerifyAnswers ? 'Verifying Answers...' : 'Verify Answers'}
          </Button>
        </Box>
      )}

      {securityVerified && !oldPasswordVerified && (
        <Box mt={4}>
          <Typography variant="body1">Please enter your old password:</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Old Password"
            type="password"
            variant="outlined"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
          <Button
            onClick={verifyOldPassword}
            disabled={loadingVerifyPassword}
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            startIcon={loadingVerifyPassword && <CircularProgress size={20} />}
          >
            {loadingVerifyPassword ? 'Verifying Password...' : 'Verify Old Password'}
          </Button>
        </Box>
      )}

      {oldPasswordVerified && (
        <Box mt={4}>
          <Typography variant="body1">Reset your password below:</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type="password"
            variant="outlined"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          />
          <Button
            onClick={updatePassword}
            disabled={loadingUpdatePassword}
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            startIcon={loadingUpdatePassword && <CircularProgress size={20} />}
          >
            {loadingUpdatePassword ? 'Updating Password...' : 'Update Password'}
          </Button>
        </Box>
      )}

      {message && <Typography className="mt-4 text-green-600">{message}</Typography>}
      {error && <Typography className="mt-4 text-red-600">{error}</Typography>}
    </Container>
    <UpdateSecurityQuestions/>
    </>
  );
};

export default Security;

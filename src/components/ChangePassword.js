import React, { useState } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, CircularProgress, Typography, Box, Container } from '@mui/material';

const Security = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Request OTP
  const requestOtp = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/generate-otp');
      setMessage(response.data.message);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError('Error requesting OTP. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and load security questions
  const verifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/verify-otp', { otp });
      setMessage(response.data.message);
      setError('');
      setOtp('');

      // Fetch security questions after OTP verification
      const securityQuestionsResponse = await axiosInstance.get('/security/get-questions');
      setSecurityQuestions(securityQuestionsResponse.data.questions);

    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Verify security question answers
  const verifySecurityQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/verify-questions', { answers });
      if (response.data.success) {
        setMessage('Security questions verified. You may now reset your password.');
      }
      setError('');
    } catch (err) {
      setError('Invalid security answers. Please try again.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/update-password', {
        email: user.email,  // Pass the email from the authenticated user
        password: passwords.newPassword
      });
      setMessage(response.data.message);
      setError('');
      navigate('/login'); // Redirect to login after successful password reset
    } catch (err) {
      setError('Failed to update password.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="p-6 bg-white rounded-lg shadow-lg mt-10">
      <Typography variant="h4" align="center" gutterBottom>
        Update Your Security Information
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Please follow the steps below to reset your password securely.
      </Typography>

      {!otpSent ? (
        <Box mt={4}>
          <Typography variant="body1">
            To proceed, click the button below to receive an OTP on your registered email.
          </Typography>
          <Button
            onClick={requestOtp}
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
            className="mt-4"
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </Box>
      ) : (
        <>
          {securityQuestions.length === 0 ? (
            <Box mt={4}>
              <Typography variant="body1">An OTP has been sent to your email. Enter it below to verify.</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
              />
              <Button
                onClick={verifyOtp}
                disabled={loading}
                fullWidth
                variant="contained"
                color="primary"
                className="mt-4"
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
            </Box>
          ) : (
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
                disabled={loading}
                fullWidth
                variant="contained"
                color="primary"
                className="mt-4"
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Verifying Answers...' : 'Verify Answers'}
              </Button>
            </Box>
          )}

          {message === 'Security questions verified. You may now reset your password.' && (
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
                disabled={loading}
                fullWidth
                variant="contained"
                color="primary"
                className="mt-4"
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </Box>
          )}
        </>
      )}

      {message && <Typography className="mt-4 text-green-600">{message}</Typography>}
      {error && <Typography className="mt-4 text-red-600">{error}</Typography>}
    </Container>
  );
};

export default Security;

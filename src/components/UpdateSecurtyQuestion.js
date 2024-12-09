import React, { useState } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import { TextField, Button, Typography, Box, MenuItem, Container } from '@mui/material';

const UpdateSecurityQuestions = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosInstance();

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [securityVerified, setSecurityVerified] = useState(false);
  const [newQuestions, setNewQuestions] = useState({ question1: '', question2: '' });
  

  const [answers, setAnswers] = useState({});
  const [newAnswers, setNewAnswers] = useState({ answer1: '', answer2: '' });
  const [oldAnswers, setOldAnswers] = useState({ answer1: '', answer2: '' });
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingVerifyAnswers, setLoadingVerifyAnswers] = useState(false);

  // Sample new security questions for the user to choose from
  const newSecurityQuestions = [
    { value: 'first-pet', label: 'What was the name of your first pet?' },
    { value: 'favorite-teacher', label: 'Who was your favorite teacher?' },
    { value: 'birthplace', label: 'In which city were you born?' },
    { value: 'mother-maiden', label: 'What is your mother’s maiden name?' },
    { value: 'first-job', label: 'What was your first job?' },
  ];

  // Fetch existing security questions after password is verified
  const fetchSecurityQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const securityQuestionsResponse = await axiosInstance.get('/security/options/security-questions');
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

  // Verify password function
  const verifyPassword = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/options/verify-old-password', { 
        email: user.email, 
        oldPassword: password
      });
      
      if (response.data.success) {
        setPasswordVerified(true);
        setError('');
        setMessage('Password verified. Please answer the security questions.');
        fetchSecurityQuestions();
      } else {
        setError('Incorrect password.');
      }
    } catch (err) {
      setError('Failed to verify password.');
    } finally {
      setLoading(false);
    }
  };

  // Verify old security answers
  const verifySecurityAnswers = async () => {
    setLoading(true);
    try {
      const payload = {
        email: user.email,
        answers, // Dynamically constructed answers object
      };
      console.log('Payload sent to server:', payload); // Log the payload for debugging
  
      const response = await axiosInstance.post('/security/options/verify-security-answers', payload);
  
      if (response.data.success) {
        setSecurityVerified(true);
        setError('');
        setMessage('Security answers verified. Now you can set new security questions.');
      } else {
        setError('Incorrect security answers.');
      }
    } catch (err) {
      console.error('Error verifying security answers:', err);
      setError('Failed to verify security answers.');
    } finally {
      setLoading(false);
    }
  };
  

  // Update new security questions
  const updateSecurityQuestions = async () => {
    if (newQuestions.question1 === newQuestions.question2) {
      setError('Security questions must not be the same.');
      return;
    }
    if (!newAnswers.answer1 || !newAnswers.answer2) {
      setError('Answers to new security questions must not be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/options/update-user-answers', {
        email: user.email,
        newQuestions,
        newAnswers
      });
      setMessage('Security questions updated successfully.');
      setError('');
    } catch (err) {
      setError('Failed to update security questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="p-6 bg-white rounded-lg shadow-lg mt-10">
      <Typography variant="h4" align="center" gutterBottom>
        Update Your Security Questions
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Follow the steps below to update your security questions.
      </Typography>

      {!passwordVerified && (
        <Box mt={4}>
          <TextField
            type="password"
            fullWidth
            label="Old Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={verifyPassword}
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
          >
            {loading ? 'Verifying Password...' : 'Verify Password'}
          </Button>
        </Box>
      )}

      {passwordVerified && !securityVerified && (
        <Box mt={4}>
          <Typography variant="body1">Answer the security questions below:</Typography>
          {securityQuestions.map((question, index) => (
           <TextField
           key={question._id}
           fullWidth
           margin="normal"
           label={`Answer for: ${question.question}`}
           variant="outlined"
           value={answers[question._id] || ''} // Use the answer for this question ID
           onChange={(e) =>
             setAnswers({ ...answers, [question._id]: e.target.value }) // Update the answer dynamically
           }
         />
          ))}
         <Button
  onClick={verifySecurityAnswers}
  disabled={loading}
  fullWidth
  variant="contained"
  color="primary"
>
  {loading ? 'Verifying Answers...' : 'Verify Security Answers'}
</Button>

        </Box>
      )}

      {securityVerified && (
        <Box mt={4}>
          <Typography variant="body1">Choose new security questions:</Typography>
          <TextField
            select
            fullWidth
            label="New Security Question 1"
            margin="normal"
            value={newQuestions.question1}
            onChange={(e) => setNewQuestions({ ...newQuestions, question1: e.target.value })}
          >
            {newSecurityQuestions.map((question) => (
              <MenuItem key={question.value} value={question.value}>
                {question.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="New Security Question 2"
            margin="normal"
            value={newQuestions.question2}
            onChange={(e) => setNewQuestions({ ...newQuestions, question2: e.target.value })}
          >
            {newSecurityQuestions.map((question) => (
              <MenuItem key={question.value} value={question.value}>
                {question.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Answer for Question 1"
            variant="outlined"
            value={newAnswers.answer1}
            onChange={(e) => setNewAnswers({ ...newAnswers, answer1: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Answer for Question 2"
            variant="outlined"
            value={newAnswers.answer2}
            onChange={(e) => setNewAnswers({ ...newAnswers, answer2: e.target.value })}
          />
          <Button
            onClick={updateSecurityQuestions}
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
          >
            {loading ? 'Updating Questions...' : 'Update Security Questions'}
          </Button>
        </Box>
      )}

      {message && <Typography className="mt-4 text-green-600">{message}</Typography>}
      {error && <Typography className="mt-4 text-red-600">{error}</Typography>}
    </Container>
  );
};

export default UpdateSecurityQuestions;

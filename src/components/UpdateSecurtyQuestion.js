import React, { useState } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import { TextField, Button, Typography, Box, MenuItem, Container } from '@mui/material';

const UpdateSecurityQuestions = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosInstance();

  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [securityVerified, setSecurityVerified] = useState(false);
  const [newQuestions, setNewQuestions] = useState({ question1: '', question2: '' });
  const [newAnswers, setNewAnswers] = useState({ answer1: '', answer2: '' });
  const [oldAnswers, setOldAnswers] = useState({ answer1: '', answer2: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Security questions to select from
  const securityQuestions = [
    { label: "What was the name of your first pet?", value: "pet" },
    { label: "What is your mother's maiden name?", value: "maiden" },
    { label: "What was the name of your first school?", value: "school" },
    { label: "What city were you born in?", value: "city" },
    { label: "What is your favorite food?", value: "food" },
  ];

  // Verify password function
  const verifyPassword = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/verify-old-password', { email: user.email, password });
      if (response.data.success) {
        setPasswordVerified(true);
        setError('');
        setMessage('Password verified. Please answer the security questions.');
      } else {
        setError('Incorrect password.');
      }
    } catch (err) {
      setError('Failed to verify password.');
    } finally {
      setLoading(false);
    }
  };

  // Verify existing security answers
  const verifySecurityQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/verify-questions', {
        email: user.email,
        answers: oldAnswers,
      });
      if (response.data.success) {
        setSecurityVerified(true);
        setMessage('Security questions verified. Now choose new security questions.');
        setError('');
      } else {
        setError('Security answers are incorrect.');
      }
    } catch (err) {
      setError('Failed to verify security questions.');
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
    if (newAnswers.answer1 !== newAnswers.answer2) {
      setError('Answers to security questions must match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/security/update-questions', {
        email: user.email,
        newQuestions,
        newAnswers: newAnswers.answer1, // Only sending one answer for both questions
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
          <Typography variant="body1">Answer your previous security questions:</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Old Answer 1"
            variant="outlined"
            onChange={(e) => setOldAnswers({ ...oldAnswers, answer1: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Old Answer 2"
            variant="outlined"
            onChange={(e) => setOldAnswers({ ...oldAnswers, answer2: e.target.value })}
          />
          <Button
            onClick={verifySecurityQuestions}
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
          >
            {loading ? 'Verifying Answers...' : 'Verify Security Questions'}
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
            {securityQuestions.map((question) => (
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
            {securityQuestions.map((question) => (
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
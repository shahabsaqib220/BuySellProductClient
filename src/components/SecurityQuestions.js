import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSecurityAnswers } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { Alert } from '@mui/material';

const securityQuestionsList = [
  'What was the name of your first pet?',
  'What is your mother’s maiden name?',
  'What was the name of your first school?',
  'What city were you born in?',
  'What is your favorite food?',
];

function SecurityQuestions() {
  const [questions, setQuestions] = useState([{ question: '', answer: '' }, { question: '', answer: '' }]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, password } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(''); // Clear previous alert

    // Check if all questions and answers are filled
    const hasEmptyField = questions.some(q => q.question === '' || q.answer === '');
    if (hasEmptyField) {
      setAlertMessage('Please answer all questions.');
      return;
    }

    // Check for duplicate questions
    const selectedQuestions = questions.map(q => q.question);
    const hasDuplicateQuestions = new Set(selectedQuestions).size !== selectedQuestions.length;
    if (hasDuplicateQuestions) {
      setAlertMessage('Both questions cannot be the same. Choose a different one.');
      return;
    }

    // Check for duplicate answers
    const selectedAnswers = questions.map(q => q.answer);
    const hasDuplicateAnswers = new Set(selectedAnswers).size !== selectedAnswers.length;
    if (hasDuplicateAnswers) {
      setAlertMessage('Both answers cannot be the same. Please provide different answers.');
      return;
    }

    // Hash the password and answers
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswers = await Promise.all(
      questions.map((q) => bcrypt.hash(q.answer, 10))
    );

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        securityQuestions: questions.map((q, index) => ({
          question: q.question,
          answer: hashedAnswers[index],
        })),
      });

      dispatch(setSecurityAnswers(questions));
      setAlertMessage('Registration completed successfully!');
      navigate('/login');
    } catch (error) {
      setAlertMessage('Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold">Security Questions</h2>
        {alertMessage && (
          <Alert severity="error" className="mb-4">
            {alertMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="mb-8">
              <label className="block text-gray-700 font-bold">Question {index + 1}</label>
              <select
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select a question</option>
                {securityQuestionsList.map((q, idx) => (
                  <option key={idx} value={q}>{q}</option>
                ))}
              </select>
              <input
                type="text"
                value={question.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder="Your answer"
              />
            </div>
          ))}
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Finishing...' : 'Finish Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SecurityQuestions;

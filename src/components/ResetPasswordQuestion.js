import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SecurityQuestionVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector(state => state.auth.userEmail); // Accessing userEmail from Redux

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch security questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(
            `http://localhost:5000/api/user/forgetpassword/fetch-security-questions?email=${email}`
          );
        setQuestions(response.data.questions);
        setAnswers(new Array(response.data.questions.length).fill(""));
      } catch (error) {
        setError("Failed to load security questions");
      }
    }

    fetchQuestions();
  }, [email]);

  // Handle answer input changes
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Submit answers
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/forgetpassword/verify-security-answers", {
        email,
        answers,
      });
      if (response.data.message === "Security answers verified successfully") {
        setSuccess(true);
        navigate("/new-user-password"); // Navigate to the next page upon successful verification
      }
    } catch (error) {
      setError("Incorrect answers. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Verify Security Questions
      </Typography>

      {questions.map((q, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">{q.question}</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter your answer"
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </Box>
      ))}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="primary" variant="body2" sx={{ mt: 2 }}>
          Answers verified successfully!
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Verify Answers
      </Button>
    </Box>
  );
}

export default SecurityQuestionVerification;

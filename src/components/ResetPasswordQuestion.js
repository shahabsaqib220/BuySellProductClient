import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, CircularProgress, Stepper, Step, StepLabel, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosInstance from "../ContextAPI/AxiosInstance";

function SecurityQuestionVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.userEmail); // Get user email from Redux

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInstance();

  const steps = ["Find Your Account", "Verify Answers", "Reset Password"];

  // Fetch security questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!email) return; // Prevent unnecessary API calls if email is not available

      setLoading(true); // Start loading state
      setError(""); // Clear previous errors

      try {
        const response = await axiosInstance.get(`/user/passowrd/get-questions/${email}`);
        if (response.data.securityQuestions) {
          setQuestions(response.data.securityQuestions);
          setAnswers(new Array(response.data.securityQuestions.length).fill(""));
        } else {
          setError("No security questions found.");
        }
      } catch (error) {
        setError("Failed to load security questions. Please try again.");
      } finally {
        setLoading(false); // Stop loading
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
    setLoading(true);
    setError("");
    setSuccess(false);
  
    try {
      const response = await axiosInstance.post("/user/passowrd/verify/answers", {
        email,
        answers,
      });
  
      if (response.data.message === "Security answers verified successfully") {
        setSuccess(true);
        navigate("/new-user-password"); // Navigate on success
      } else {
        setError("Incorrect answers. Please try again.");
      }
    } catch (error) {
      setError("Incorrect answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Step 3: Verify Answers
      </Typography>

      <Stepper activeStep={2} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography variant="h5" marginTop={3} gutterBottom>
        Verify Security Questions
      </Typography>

      {loading ? (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      ) : questions.length > 0 ? (
        questions.map((q, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <div className="mb-4">
              <label htmlFor={`answer-${index}`} className="block font-bold text-sm text-black mb-1">
                {q}
              </label>
              <input
                id={`answer-${index}`}
                placeholder="Enter your answer"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                type="text"
                className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>
          </Box>
        ))
      ) : (
        <Alert severity="warning">No security questions found for this account.</Alert>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || questions.length === 0}
        className="w-full py-2 bg-yellow-400 text-black rounded-lg mt-4 font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <CircularProgress size={20} color="inherit" />
            <span>Verifying...</span>
          </div>
        ) : (
          <span>Continue</span>
        )}
      </button>

      {/* Display alert messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Answers verified successfully!
        </Alert>
      )}
    </Box>
  );
}

export default SecurityQuestionVerification;

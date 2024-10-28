import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, CircularProgress, Stepper, Step, StepLabel, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdOutlineDomainVerification } from "react-icons/md";
function SecurityQuestionVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.userEmail); // Accessing userEmail from Redux

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading,setLoading]= useState(false)

  const steps = ["Find Your Account", "Verify the OTP", "Verify Answers", "Reset Password"];

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
        setError(""); // Clear any previous error
        navigate("/new-user-password"); // Navigate to the next page upon successful verification
      }
    } catch (error) {
      setError("Incorrect answers. Please try again.");
      setSuccess(false); // Clear any previous success message
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <div>
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
      </div>

      <Typography variant="h5" marginTop={3} gutterBottom>
        Verify Security Questions
      </Typography>

      {questions.map((q, index) => (
        <Box key={index} sx={{ mb: 2 }}>
         

          <div className="mb-8">
            <label htmlFor="email" className="block font-bold text-sm text-black mb-1">
            {q.question}
            </label>
            <input
            placeholder="Enter your answer"
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}

              type="text"
              
              
              
              className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </div>





         
        </Box>
      ))}

      
<button
  type="button"
  onClick={handleSubmit}
  disabled={loading}
  className="w-full py-2 mb-4 bg-yellow-400 text-black rounded-lg mt-4 font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-center"
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













    

      {/* Display alert below the button */}
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

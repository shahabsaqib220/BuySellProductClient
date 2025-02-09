import React, { useState } from "react";
import { useAuth } from '../../src/ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Container,
  Box,
} from "@mui/material";

// Security Questions List
const newSecurityQuestions = [
  { value: "first-pet", label: "What was the name of your first pet?" },
  { value: "favorite-teacher", label: "Who was your favorite teacher?" },
  { value: "birthplace", label: "In which city were you born?" },
  { value: "mother-maiden", label: "What is your mother’s maiden name?" },
  { value: "first-job", label: "What was your first job?" },
];

const UpdateSecurityQuestions = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosInstance();

  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [securityAnswers, setSecurityAnswers] = useState({});
  const [newQuestions, setNewQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Open modal
  const handleOpen = () => {
    setStep(1);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setError("");
    setPassword("");
    setSecurityAnswers({});
    setNewQuestions([
      { question: "", answer: "" },
      { question: "", answer: "" },
    ]);
  };

  // Show snackbar message
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 🔹 Step 1: Verify Password
  const handleVerifyPassword = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/security/options/verify-old-password", {
        email: user.email,
        oldPassword: password,
      });
      setStep(2);
      fetchSecurityQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Password verification failed.");
      showSnackbar(err.response?.data?.message || "Password verification failed.", "error");
    }
    setLoading(false);
  };

  // 🔹 Step 2: Fetch Security Questions
  const fetchSecurityQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/security/options/security-questions/${user.email}`);
      setSecurityQuestions(response.data.securityQuestions);
    } catch (err) {
      setError("Failed to fetch security questions.");
      showSnackbar("Failed to fetch security questions.", "error");
    }
    setLoading(false);
  };

  // 🔹 Step 2: Verify Security Answers
  const handleVerifyAnswers = async () => {
    setLoading(true);
    try {
      const answersArray = Object.values(securityAnswers);
      const response = await axiosInstance.post("/security/options/verify-security-answers", {
        email: user.email,
        answers: answersArray,
      });
      setStep(3); // Move to the next step if successful
    } catch (err) {
      setError(err.response?.data?.message || "Security answers verification failed.");
      showSnackbar(err.response?.data?.message || "Security answers verification failed.", "error");
    }
    setLoading(false);
  };

  // 🔹 Step 3: Update Security Questions
  const handleUpdateQuestions = async () => {
    setLoading(true);
    try {
      // Validate questions and answers
      const questions = newQuestions.map((q) => q.question);
      const answers = newQuestions.map((q) => q.answer);

      if (new Set(questions).size !== questions.length) {
        showSnackbar("Please select unique security questions.", "error");
        return;
      }

      if (new Set(answers).size !== answers.length) {
        showSnackbar("Please provide unique answers for each question.", "error");
        return;
      }

      await axiosInstance.post("/security/options/update-user-answers", {
        email: user.email,
        securityQuestions: newQuestions,
      });
      showSnackbar("Security questions updated successfully!", "success");
      handleClose();
    } catch (err) {
      setError("Failed to update security questions.");
      showSnackbar("Failed to update security questions.", "error");
    }
    setLoading(false);
  };

  // Check if questions and answers are unique
  const isFormValid = () => {
    const questions = newQuestions.map((q) => q.question);
    const answers = newQuestions.map((q) => q.answer);

    const areQuestionsUnique = new Set(questions).size === questions.length;
    const areAnswersUnique = new Set(answers).size === answers.length;

    return areQuestionsUnique && areAnswersUnique;
  };

  return (
    <Container maxWidth="sm" className="p-6 bg-white rounded-lg shadow-lg mt-10">




      
      <Box mt={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Update Your Security Questions
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Security questions help protect your account. Make sure to set unique answers that only you know.
        </Typography>
        <Button variant="contained" color="primary"  onClick={handleOpen}>
          Update Security Questions
        </Button>
      </Box>

      {/* 🔹 Modal: Password Verification */}
      <Dialog open={open && step === 1} onClose={handleClose}>
        <DialogTitle>Enter Your Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleVerifyPassword} color="primary" disabled={loading}>
            {loading ? "Verifying..." : "Next"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Modal: Security Questions Verification */}
      <Dialog open={open && step === 2} onClose={handleClose}>
        <DialogTitle>Verify Security Answers</DialogTitle>
        <DialogContent>
          {securityQuestions.map((question, index) => (
            <TextField
              key={index}
              fullWidth
              label={question}
              value={securityAnswers[question] || ""}
              onChange={(e) =>
                setSecurityAnswers({ ...securityAnswers, [question]: e.target.value })
              }
              margin="normal"
            />
          ))}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleVerifyAnswers} color="primary" disabled={loading}>
            {loading ? "Verifying..." : "Next"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Modal: Update Security Questions */}
      <Dialog open={open && step === 3} onClose={handleClose}>
  <DialogTitle>Update Security Questions</DialogTitle>
  <DialogContent>
    {/* 🔹 Instruction Paragraph */}
    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
      Select unique questions and provide answers to enable the save button.
    </Typography>

    {/* 🔹 Security Questions Selection */}
    {newQuestions.map((item, index) => (
      <Box key={index} mb={2}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Security Question {index + 1}</InputLabel>
          <Select
            value={item.question}
            onChange={(e) => {
              const updated = [...newQuestions];
              updated[index].question = e.target.value;
              setNewQuestions(updated);
            }}
          >
            {newSecurityQuestions.map((q) => (
              <MenuItem key={q.value} value={q.label}>
                {q.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Answer"
          margin="normal"
          value={item.answer}
          onChange={(e) => {
            const updated = [...newQuestions];
            updated[index].answer = e.target.value;
            setNewQuestions(updated);
          }}
        />
      </Box>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="secondary">Cancel</Button>
    <Button
      onClick={handleUpdateQuestions}
      color="primary"
      disabled={loading || !isFormValid()} // ✅ Save button disabled until valid
    >
      {loading ? "Updating..." : "Save"}
    </Button>
  </DialogActions>
</Dialog>


      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateSecurityQuestions;
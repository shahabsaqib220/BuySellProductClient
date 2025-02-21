import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSecurityAnswers } from '../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Alert, Step, StepLabel, Stepper } from '@mui/material';
import useAxiosInstance from '../ContextAPI/AxiosInstance';

const securityQuestionsList = [
  { en: "What was the name of your first pet?", ur: "آپ کے پہلے پالتو جانور کا نام کیا تھا؟" },
  { en: "What is your mother’s maiden name?", ur: "آپ کی والدہ کا شادی سے پہلے کا نام کیا تھا؟" },
  { en: "What was the name of your first school?", ur: "آپ کے پہلے اسکول کا نام کیا تھا؟" },
  { en: "What city were you born in?", ur: "آپ کس شہر میں پیدا ہوئے؟" },
  { en: "What is your favorite food?", ur: "آپ کا پسندیدہ کھانا کیا ہے؟" },
];

function SecurityQuestions() {
  
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([{ question: '', answer: '' }, { question: '', answer: '' }]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const dispatch = useDispatch();
  const axiosInstance = useAxiosInstance(); 
  const navigate = useNavigate();
  const { name, email, password } = useSelector((state) => state.userreg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(''); 

    const hasEmptyField = questions.some(q => q.question === '' || q.answer === '');
    if (hasEmptyField) {
      setAlertMessage(t('error_empty_questions'));
      return;
    }

    const selectedQuestions = questions.map(q => q.question);
    const hasDuplicateQuestions = new Set(selectedQuestions).size !== selectedQuestions.length;
    if (hasDuplicateQuestions) {
      setAlertMessage(t('error_duplicate_questions'));
      return;
    }

    const selectedAnswers = questions.map(q => q.answer);
    const hasDuplicateAnswers = new Set(selectedAnswers).size !== selectedAnswers.length;
    if (hasDuplicateAnswers) {
      setAlertMessage(t('error_duplicate_answers'));
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        securityQuestions: questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      });

      dispatch(setSecurityAnswers(questions));
      setAlertMessage(t('registration_success'));
      navigate('/login');
    } catch (error) {
      setAlertMessage(t('registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const steps = [
    t('step_basic_info'),
   
    t('step_security_questions'),
  ];

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <h2 className="text-center text-2xl font-bold">{t('security_questions_heading')}</h2>

        {alertMessage && (
          <Alert severity="error" className="mb-4">
            {alertMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="mb-8">
              <label className="block text-gray-700 font-bold">{t('question_label')} {index + 1}</label>
              <select
                value={question.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">{t('select_question')}</option>
                {securityQuestionsList.map((q, idx) => (
                  <option key={idx} value={q.en}>
                    {t('language') === 'ur' ? q.ur : q.en}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={question.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                placeholder={t('answer_placeholder')}
              />
            </div>
          ))}

          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? t('button_loading') : t('button_submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SecurityQuestions;

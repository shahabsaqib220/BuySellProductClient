import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { Alert, Step, StepLabel, Stepper } from '@mui/material';
import { toast } from 'react-toastify';
import useAxiosInstance from '../ContextAPI/AxiosInstance';

function VerifyOtp() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [timerExpired, setTimerExpired] = useState(false);
  const axiosInstance = useAxiosInstance(); 

  const navigate = useNavigate();
  const { email } = useSelector((state) => state.userreg);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimerExpired(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (otp.length !== 6) {
      toast.error(t('otpMustBe6Digits'));
      return;
    }
  
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      
      toast.success(t('otpVerifiedSuccessfully'));
      navigate('/security-questions');
    } catch (error) {
      const errorResponse = error.response?.data || {};
      const errorMessage = errorResponse.message || t('invalidOtp');
      toast.error(errorMessage);
  
      if (errorResponse.code === 'OTP_EXPIRED') {
        toast.error(t('otpExpiredRequestNew'));
      } else if (errorResponse.code === 'INVALID_OTP') {
        toast.error(t('incorrectOtpTryAgain'));
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    t("basicInformation"),
    t("verifyOTP"),
    t("setupSecurityQuestion"),
  ];

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <h2 className="text-center text-2xl font-bold">{t('enterOtp')}</h2>
        <div className="mb-4">
          {timerExpired ? (
            <Alert severity="error">{t('otpExpiredRequestNew')}</Alert>
          ) : (
            <Alert severity="info">{`و ٹی پی ${countdown} سیکنڈ میں ختم ہو جائے گا`}</Alert>

          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="otp" className="block text-gray-700 font-bold">{t('otpLabel')}</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder={t('enter6DigitOtp')}
              maxLength={6}
              disabled={timerExpired}
            />
          </div>
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 ${loading || timerExpired ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading || timerExpired}
          >
            {loading ? t('verifying') : t('verifyOtp')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;

import React, { useState } from 'react'; 
import { useAuth } from '../../src/ContextAPI/AuthContext'; 
import useAxiosInstance from '../ContextAPI/AxiosInstance'; 
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-center">Security</h2>

      {!otpSent ? (
        <div className="mt-6">
          <p>To proceed, click the button to receive an OTP on your registered email.</p>
          <button 
            onClick={requestOtp} 
            disabled={loading} 
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <>
          {securityQuestions.length === 0 ? (
            <div className="mt-6">
              <p>An OTP has been sent to your email. Enter it below to verify.</p>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Enter OTP" 
                className="mt-4 w-full border p-2 rounded"
              />
              <button 
                onClick={verifyOtp} 
                disabled={loading} 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                {loading ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <p>Answer the security questions below:</p>
              {securityQuestions.map((question, index) => (
                <div key={index} className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{question.question}</label>
                  <input 
                    type="text" 
                    className="mt-2 w-full border p-2 rounded"
                    onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })}
                  />
                </div>
              ))}
              <button 
                onClick={verifySecurityQuestions} 
                disabled={loading} 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                {loading ? 'Verifying Answers...' : 'Verify Answers'}
              </button>
            </div>
          )}

          {message === 'Security questions verified. You may now reset your password.' && (
            <div className="mt-6">
              <input 
                type="password" 
                value={passwords.newPassword} 
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                placeholder="New Password" 
                className="mt-4 w-full border p-2 rounded"
              />
              <input 
                type="password" 
                value={passwords.confirmPassword} 
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                placeholder="Confirm Password" 
                className="mt-4 w-full border p-2 rounded"
              />
              <button 
                onClick={updatePassword} 
                disabled={loading} 
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          )}
        </>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  ); 
}; 

export default Security;

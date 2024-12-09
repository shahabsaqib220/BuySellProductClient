import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon
import UserNavbar from './UserNavbar';
import LetterPullup from "./LetterPullup";
import UserLiveAds from "./UserLiveAds";

const ProfileImage = () => {
  const { user, isLoggedIn } = useAuth(); // Check if user is logged in
  const [profileImage, setProfileImage] = useState(null);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user?.username || ''); // State for username
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading when fetching profile data
  const [newName, setNewName] = useState(username);
  const [uploading, setUploading] = useState(false); // Loading state for image upload
  const axiosInstance = useAxiosInstance(); 

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get('/userlogin/profile-image');
        if (response.status === 200) {
          const data = response.data;
          setProfileImage(data.profileImageUrl);
          setUsername(data.username);
        } else {
          console.error('Error fetching profile data:', response.data.message);
        }
      } catch (err) {
        console.error('Error fetching profile data', err);
        navigate('/login'); // Redirect to login if fetching data fails
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [axiosInstance, navigate]);

  const handleEdit = async () => {
    if (newName) {
      try {
        const response = await axiosInstance.put('/userlogin/update-username', {
          newName,
        });
        if (response.status === 200) {
          setUsername(newName); // Update username locally
        } else {
          console.error('Error updating username:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating username:', error);
      } finally {
        setIsEditing(false);
        setNewName(''); // Clear the input after saving
      }
    } else {
      console.log('New username is required');
    }
  };

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); // Preview selected image
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]); // Read file as data URL
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('profileImage', file); 

    setUploading(true); // Set uploading to true when starting the upload
    try {
      const response = await axiosInstance.post('/userlogin/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setProfileImage(data.profileImageUrl); // Update the profile image
        
      } else {
        console.error('Error updating profile image:', response.data.message);
      }
    } catch (err) {
      console.error('Error updating profile image', err);
    } finally {
      setUploading(false); // Reset the uploading state after the process
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto mt-8">
        <h1 className="mb-4 text-2xl font-semibold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-2xl flex items-center space-x-2">
          <LetterPullup text="Welcome" delay={0.05} />
          <LetterPullup text={username} delay={0.05} />
        </h1>
        
        <h6 className="text-lg space-x-20 mt-9 mb-5 font-bold">
          <LetterPullup text="Update Your Profile Image" delay={0.05} />
        </h6>

        <div className="relative mb-6">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="rounded-full w-32 h-32 object-cover border-4 border-gray-300" />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-lg border-4 border-gray-300">
              No Image
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-yellow-400 text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        <button
          onClick={handleImageUpload}
          disabled={!file || uploading} // Disable the button when there's no file or during uploading
          className={`w-full py-2 px-4 rounded-lg text-white ${file && !uploading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} transition-colors font-semibold`}
        >
          {uploading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-2" /> Uploading...
            </div>
          ) : (
            'Update Image'
          )}
        </button>

        <h6 className="text-lg -ml-32 mt-9 font-bold">Change your Username</h6>

        <div className="flex items-center mt-7 space-x-2">
          <div className="relative w-full">
            <input
              type="text"
              value={isEditing ? newName : username}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={username}
              disabled={!isEditing}
              className={`block w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-yellow-400 transition-all duration-300 ease-in-out ${isEditing ? 'border-gray-300' : 'border-gray-300 bg-gray-100'}`}
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <FaEdit className="text-gray-500" />
            </span>
          </div>
          <button
            onClick={() => (isEditing ? handleEdit() : setIsEditing(true))}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ease-in-out ${isEditing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-400 hover:bg-yellow-500'}`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <UserLiveAds />
    </>
  );
};

export default ProfileImage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/ContextAPI/AuthContext';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileImage = () => {
  const { user, token } = useAuth(); // Get user and token from context
  const [profileImage, setProfileImage] = useState(null);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(''); // State for username
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(username);

  const handleEdit = async () => {
    if (newName) {
      try {
        const response = await fetch('http://localhost:5000/api/profile-image/update-username', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add your authentication header if necessary
            Authorization: `Bearer ${token}`, // Replace with actual token
          },
          body: JSON.stringify({ newName }),
        });

        const data = await response.json();
        if (response.ok) {
          // Optionally handle the success response
          console.log('Username updated successfully:', data.username);
        } else {
          console.error('Error updating username:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsEditing(false);
        setNewName(''); // Clear the input after saving
      }
    } else {
      console.log('New username is required');
    }
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile-image/profile-image`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProfileImage(data.profileImageUrl);
          setUsername(data.username); // Fetch and set username
        } else {
          console.error('Error fetching profile data:', data.message);
        }
      } catch (err) {
        console.error('Error fetching profile data', err);
      }
    };

    if (user && token) {
      fetchProfileData();
    }
  }, [user, token]);

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
  
    try {
      const response = await fetch('http://localhost:5000/api/profile-image/profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Send token from context
        },
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        setProfileImage(data.profileImageUrl);
        navigate('/dashboard');
      } else {
        console.error('Error updating profile image:', data.message);
      }
    } catch (err) {
      console.error('Error updating profile image', err);
    }
  };

  







  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto mt-8">
<h1 className="mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white">Welcome <mark className="px-2 text-white bg-yellow-400 rounded dark:bg-blue-500">{username}</mark></h1>
    <h6 className="text-lg -ml-32 mt-9 mb-5 font-bold dark:text-white">Update Your Profile Image</h6>

 {/* Display username */}

      <div className="relative mb-6">
        {profileImage ? (

          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-4 border-gray-300"
          />
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
        disabled={!file}
        className={`w-full py-2 px-4 rounded-lg text-white ${
          file
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400 cursor-not-allowed'
        } transition-colors font-semibold`}
      >
        Update Image
      </button>





      <h6 className="text-lg -ml-32 mt-9  font-bold dark:text-white">Change your Username</h6>

      <div className="flex items-center mt-7 space-x-2">
      <div className="relative w-full">
        <input
          type="text"
          value={isEditing ? newName : username}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={username}
          disabled={!isEditing}
          className={`block w-full p-3 pl-10 border rounded-lg focus:ring focus:ring-yellow-400 transition-all duration-300 ease-in-out ${
            isEditing ? 'border-gray-300' : 'border-gray-300 bg-gray-100'
          }`}
        />
        <span className="absolute inset-y-0 left-3 flex items-center">
          <FaEdit className="text-gray-500" />
        </span>
      </div>
      <button
        onClick={() => (isEditing ? handleEdit() : setIsEditing(true))}
        className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ease-in-out ${
          isEditing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-400 hover:bg-yellow-500'
        }`}
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>

    </div>
  );
};

export default ProfileImage;

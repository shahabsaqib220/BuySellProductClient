import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './Configurations/firebaseConfig'; 
import { toast } from 'react-toastify'; 
import axios from 'axios';

const Navbar = () => {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/profile-image/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProfileImageUrl(data.profileImageUrl);
          setUserName(data.name);
        } else {
          console.error('Error fetching profile image:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }
    const storageRef = ref(storage, `profileImages/${selectedFile.name}`);
    try {
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/profile-image', 
        { profileImageUrl: downloadURL },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setProfileImageUrl(downloadURL);
        toast.success('Profile image updated successfully!');
      } else {
        toast.error('Error updating profile image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-lg font-semibold">
        Welcome, {userName || 'User'}
      </div>
      <div className="relative">
        <img
          src={profileImageUrl || 'default-profile.png'} // Replace with a default image if none is provided
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        />
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full px-4 py-2 text-sm text-gray-700"
            />
            <button
              onClick={uploadProfileImage}
              className="w-full px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              Change Image
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

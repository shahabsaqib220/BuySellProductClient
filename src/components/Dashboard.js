import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Optional for notifications

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(''); // To hold the uploaded profile image URL
  const [loading, setLoading] = useState(false);

  // Function to handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);  // Store the selected file in state
  };

  // Function to upload profile image to the backend
  const uploadProfileImage = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first.');
      return;
    }

    setLoading(true);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      // Send the file to the backend
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await fetch('http://localhost:5000/api/profile-image/profile-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the header
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setProfileImageUrl(data.profileImageUrl); // Update the profile image URL in the state
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(`Error uploading image: ${data.message}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the stored profile image URL on component mount
  useEffect(() => {
    const fetchProfileImage = async () => {
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
        } else {
          console.error('Error fetching profile image:', data.message);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <div className="dashboard">
      <h2>User Dashboard</h2>

      {/* Input for selecting profile image */}
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={uploadProfileImage} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Profile Image'}
        </button>
      </div>

      {/* Display the uploaded profile image */}
      {profileImageUrl && (
        <div>
          <h3>Uploaded Profile Image:</h3>
          <img src={profileImageUrl} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

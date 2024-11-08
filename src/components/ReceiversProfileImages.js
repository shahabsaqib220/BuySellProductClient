import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const ProfileImageRow = () => {
  const user = useSelector((state) => state.user.user);
  const [receivers, setReceivers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceiverProfiles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/receivers/profile/image/receivers/${user.id}`);
        setReceivers(response.data);
      } catch (err) {
        setError('Failed to load receiver images.');
        console.error('Error fetching receiver profiles:', err);
      }
    };

    if (user && user.id) {
      fetchReceiverProfiles();
    }
  }, [user.id]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        User ID: {user.id}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Receiver Profile Images
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Stack direction="row" spacing={2}>
          {receivers.map((receiver) => (
            <Avatar
              key={receiver._id}
              src={receiver.profileImageUrl}
              alt={`Receiver ${receiver._id}`}
              sx={{ width: 56, height: 56 }}
            />
          ))}
        </Stack>
      )}
    </div>
  );
};

export default ProfileImageRow;

import React from 'react';
import { useParams } from 'react-router-dom';

const SellFast = () => {
  const { adId } = useParams(); // Get adId from URL
  console.log(adId)
  
  // Implement your component logic here
  return (
    <div>
      <h1 className='bg-blue-500 text-white'>Sell Fast for Ad ID: {adId}</h1>
      {/* Add form or details to enhance the ad's visibility */}
    </div>
  );
};

export default SellFast;

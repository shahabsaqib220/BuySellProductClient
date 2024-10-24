import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditAd = ({ match }) => {
  const [adData, setAdData] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);

  const adId = match.params.id;

  useEffect(() => {
    // Fetch ad data from backend
    axios.get(`/api/ads/${adId}`)
      .then(response => {
        setAdData(response.data);
        setImages(response.data.images);
      })
      .catch(error => console.log(error));
  }, [adId]);

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSetCoverImage = (index) => {
    setSelectedCoverImage(index);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Submit the updated ad data to backend (including updated image URLs)
    const updatedAdData = {
      ...adData,
      images,
    };
    try {
      await axios.put(`/api/ads/${adId}`, updatedAdData);
      alert('Ad updated successfully!');
    } catch (error) {
      console.error('Failed to update ad:', error);
    }
  };

  if (!adData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Category, brand, model, price, description, etc. */}
      <div>
        <label>Category</label>
        <input
          type="text"
          value={adData.category}
          onChange={(e) => setAdData({ ...adData, category: e.target.value })}
        />
      </div>
      {/* Add similar inputs for other fields: brand, model, etc. */}
      
      {/* Image editing section */}
      <div>
        <label>Uploaded Images</label>
        <div className="image-gallery">
          {images.map((imgUrl, index) => (
            <div key={index} className="image-item">
              <img
                src={imgUrl}
                alt={`ad-img-${index}`}
                className={selectedCoverImage === index ? 'cover-image' : ''}
                onClick={() => handleSetCoverImage(index)}
              />
              <span onClick={() => handleImageDelete(index)}>✖️</span>
              {selectedCoverImage === index && <p>Cover</p>}
            </div>
          ))}
        </div>
      </div>

      <button type="submit">Update Ad</button>
    </form>
  );
};

export default EditAd;

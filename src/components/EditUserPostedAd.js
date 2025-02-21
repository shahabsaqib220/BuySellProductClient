import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import LetterPullup from './LetterPullup';
import { Divider, Alert, CircularProgress, Skeleton } from '@mui/material';
// Import AuthContext
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import UserNavbar from './UserNavbar';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../src/ContextAPI/AuthContext';
import { useTranslation } from 'react-i18next';
import categoriesData from "../utils/categories";
import pakistanCities from "../utils/PakistanCities";



const EditAd = () => {
  
  const axiosInstance = useAxiosInstance(); 
  const navigate = useNavigate(); // Get navigate hook from react-router-dom
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [filteredCities, setFilteredCities] = useState(pakistanCities); // Show all cities initially

 
  const { adId } = useParams();
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [images, setImages] = useState([]);


  const [price, setPrice] = useState("");





  const { user, isLoggedIn } = useAuth(); 
  const [adDetails, setAdDetails] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const [initialAdDetails, setInitialAdDetails] = useState(null); // Store initial ad details


  const [mobileNumber, setMobileNumber] = useState("");

  

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (event) => {
    const selectedFiles = Array.from(event.target.files); // Get the new file objects
  
    setImages((prevImages) => {
      // Filter out any empty slots or placeholders
      const filteredPrevImages = prevImages.filter((img) => img);
  
      let updatedImages = [...filteredPrevImages]; // Create a copy of existing images
  
      let index = 0;
  
      // Replace empty slots or append new images
      for (let i = 0; i < updatedImages.length && index < selectedFiles.length; i++) {
        if (updatedImages[i] instanceof File) {
          continue; // Skip already uploaded files
        }
        if (!updatedImages[i]) {
          updatedImages[i] = selectedFiles[index++]; // Store the new file
        }
      }
  
      while (updatedImages.length < 5 && index < selectedFiles.length) {
        updatedImages.push(selectedFiles[index++]); // Add new files up to 5 total images
      }
  
      return updatedImages;
    });
  };
  

  const removeImage = (indexToRemove) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages[indexToRemove];
      if (typeof imageToRemove === "string") {
        // Track removed URLs
        setRemovedImages((prevRemoved) => [...prevRemoved, imageToRemove]);
      }
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };
  
  






  const [loading, setLoading] = useState(true);
  const [removedImages, setRemovedImages] = useState([]);
  


  


 const conditions = ["Brand New", "Used", "Refurbished"];

 const handleSuggestionClick = (suggestion) => {
  setLocation(suggestion.display_name);
  setLongitude(suggestion.lon);
  setLatitude(suggestion.lat);
  setSuggestions([]); // Clear suggestions after selecting one
};




useEffect(() => {
  const fetchAdDetails = async () => {
    if (!isLoggedIn) {
      navigate("/login")
      return; // Exit if the user is not logged in
    }
    

    try {
      const response = await axiosInstance.get(`/user-ads/edit/user/ad/${adId}`);
      setAdDetails(response.data);
      setInitialAdDetails(response.data); // Store initial ad details
      setImages(response.data.images || []);
      setDescription(response.data.description || "");
      setPrice(response.data.price || "");
      setMobileNumber(response.data.mobilePhone || "");
      setLocation(response.data.location.readable || "");
      
    } catch (error) {
      
      console.error('Error fetching ad details:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAdDetails();
}, [adId, isLoggedIn, axiosInstance]); // Add isLoggedIn to dependencies




 

// Render Logic
if (loading) {
  return <div>
  <Skeleton className='w-full h-full text-7xl mt-7' />
  <Skeleton className='w-full h-full text-7xl mt-7' />
  <Skeleton className='w-full h-full text-7xl mt-7' />
  <Skeleton className='w-full h-full text-7xl mt-7' />
  <Skeleton className='w-full h-full text-7xl mt-7' />
  <Skeleton className='w-full h-full text-7xl mt-7' />
  </div>; // Show a loading indicator while fetching data
}

// Render when adDetails is available
if (!adDetails) {
  return <div>Error loading ad details.</div>; // Handle cases where adDetails is null or undefined
}
const handleLocationChange = (e) => {
  setLocation(e.target.value);
};

const handleLocationInputChange = (e) => {
  const inputValue = e.target.value;
  setLocation(inputValue);

  // Filter cities dynamically
  if (inputValue.length > 0) {
    const filtered = pakistanCities.filter((city) =>
      city.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredCities(filtered);
  } else {
    setFilteredCities(pakistanCities);
  }
};

const handleSelectCity = (city) => {
  setLocation(city);
  // Do **not** hide the dropdown
};












  const handleSubmit = async (event) => {
    event.preventDefault();
    
    
    const formData = new FormData();
  
    // Append other form data
    formData.append("category", selectedCategory || initialAdDetails.category);
    formData.append("brand", selectedBrand || initialAdDetails.brand);
    formData.append("model", selectedModel || initialAdDetails.model);
    formData.append("description", description || initialAdDetails.description);
    formData.append("price", price || initialAdDetails.price);
    formData.append("mobilePhone", mobileNumber || initialAdDetails.mobilePhone);
    formData.append("condition", selectedCondition || initialAdDetails.condition);
    formData.append("location", location || initialAdDetails.location);
 
  
    // Separate images into new files and existing URLs
    const newImages = images.filter((img) => img instanceof File);
    const existingImages = images.filter((img) => typeof img === "string");
  
    // Ensure at least one image exists
    if (newImages.length === 0 && existingImages.length === 0) {
      setAlert({ message: "Atleast 1 new Image is required" , severity: "error" });
      
      return;
    }
  
    // Append new images
    newImages.forEach((file) => formData.append("images", file));
  
    // Append existing image URLs (updated after removal)
    formData.append("existingImages", JSON.stringify(existingImages));
  
    // Append removed images for the backend to handle deletion
    formData.append("removedImages", JSON.stringify(removedImages));
  
    // Backend request
    try {
      const response = await axiosInstance.put(`/updated/user/ad/${adId}`, formData);
  
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Ad updated successfully:", responseData);
        
        // Set success alert
        setAlert({ message: "Ad updated successfully!", severity: "success" });
        
        // Clear removedImages after successful update
        setRemovedImages([]);

        setTimeout(() => {
          navigate("/viewads");
      }, 500);
       


      } else {
        const errorData = await response.data; // Use response.data instead of response.json()
        console.error("Failed to update ad:", errorData);
        
        // Set error alert
        setAlert({ message: "Failed to update ad: " + errorData.message, severity: "error" });
      }
    } catch (error) {
      console.error("Error occurred while updating ad:", error);
      
      // Set error alert
      setAlert({ message: "An error occurred while updating the ad.", severity: "error" });
    }
  };
  const categories = Object.keys(categoriesData);
  // Get brands for the selected category
  const brands = selectedCategory ? Object.keys(categoriesData[selectedCategory]) : [];
  // Get models for the selected brand
  const models = selectedBrand ? categoriesData[selectedCategory][selectedBrand] : [];
  
  
  
  
  
  
  

 

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedBrand(""); // Reset brand when category changes
    setSelectedModel(""); // Reset model when category changes
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel(""); // Reset model when brand changes
  };

  // Extract category names

   
 



 
  

  

  return (
    <>
    <UserNavbar/>
    <div className="flex justify-center p-6 bg-white">
    
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
   

    <h2 className="mb-4 flex flex-wrap text-2xl font-extrabold ">
  <span className="text-yellow-500">
    <LetterPullup text="Update Exiting Ad: " delay={0.05} />
  </span>
  <span>
    <LetterPullup text="Update " delay={0.05} />
  </span>
  <span className="text-yellow-500">
    <LetterPullup text="Anything " delay={0.05} />
  </span>
  
</h2>

    <Divider className="bg-yellow-400 h-0.5 mx-6 space-y-10" />



      
      

        
         

        {/* Dropdowns Section */}
        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 gap-6 mb-6">
      {/* Category Dropdown */}
      <div>
        <label className="block text-md font-semibold text-gray-950 mb-2">
        {t('changeCategory')}
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow"
        >
          <option value="">{t('changeCategory')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Dropdown */}
      <div>
        <label className="block text-md font-semibold text-gray-950">
        {t('changeBrand')}
        </label>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow"
          disabled={!selectedCategory}
        >
          <option value="">{t('changeBrand')}</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Model Dropdown */}
      <div>
        <label className="block text-md font-semibold text-gray-950 mb-2">
        {t('changeModel')}
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow"
          disabled={!selectedBrand}
        >
          <option value="">{t('changeModel')}</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>


        {/* Mobile Phone Number Input - Conditional */}
        <div className="mb-6">
  <label
    htmlFor="mobileNumber"
    className="block text-md font-semibold text-gray-950  mb-2"
  >
    <span className="text-gray-950">{t('updateMobilePhoneNumber')}</span>
  </label>
  <div className="relative">
    <input
      type="tel"
      id="mobileNumber"
      value={mobileNumber}
      onChange={(e) => setMobileNumber(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 "
      placeholder={adDetails.mobilePhone}
    />
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
   {/* You may Iclude a Icon here */}
    </div>
  </div>
</div>
   {/* Location Input */}
   <div className="mb-6">
      <label
        htmlFor="location"
        className="block text-md font-semibold text-gray-950 mb-2"
      >
        {t("updateCity")}
      </label>
      <select
        id="location"
        value={location}
        onChange={handleLocationChange}
        className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out"
      >
        <option value="">{t("selectCity")}</option>
        {pakistanCities.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>




  {/* Description and Price Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  {/* Description Input */}
  <div>
    <label htmlFor="description" className="block text-md font-semibold text-gray-950  mb-2">
    {t('updateDescription')}
    </label>
    <textarea
      id="description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 "
      rows="4"
      placeholder={adDetails.description}
    />
  </div>

  {/* Price Input */}
  <div>
    <label htmlFor="price" className="block text-md font-semibold text-gray-950  mb-2">
    {t('updatePricePkr')}
    </label>
    <input
      type="number"
      id="price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 "
      placeholder={adDetails.price}
    />
  </div>
</div>

{/* Condition Dropdown */}
<div className="mb-6">
  <label htmlFor="condition" className="block text-md font-semibold text-gray-950  mb-2">
  {t('updateCondition')}
  </label>
  <select
    id="condition"
    value={selectedCondition}
    onChange={(e) => setSelectedCondition(e.target.value)}
    className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out "
  >
    <option value="">{t('updateCondition')}</option>
    {conditions.map((condition, index) => (
      <option key={index} value={condition}>
        {condition}
      </option>
    ))}
  </select>
</div>

<div className="mb-6">
  <label className="block text-md font-semibold text-gray-950 mb-2">
  {t('uploadImages')}
  </label>
  <input
    type="file"
    multiple
    onChange={handleImageUpload}
    accept="image/*"
    className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out"
  />

{images.length > 0 && (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {images.map((image, index) => (
      <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden shadow-md">
        {image ? (
          <>
            {image instanceof File ? (
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={image}
                alt={`Existing ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            {index === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white text-sm font-semibold">Cover</span>
              </div>
            )}
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition duration-200"
              title="Remove Image"
            >
              &times;
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            Empty Slot
          </div>
        )}
      </div>
    ))}
  </div>
)}

</div>

    


        {/* Submit Button */}
      
        <button
      type="submit"
      onClick={handleSubmit}
      disabled={loading}
      className="w-full mb-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-center"
    >
      {loading ? (
        <>
          <CircularProgress className="bg-black"/>
          Updating...
        </>
      ) : (
        t('update')
      )}
    </button>
          {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert("")} className="mb-4">
            {alert.message}
          </Alert>
        )}


      </div>
    </div>
    </>
    
  
  
  );
};

export default EditAd;

import React, { useEffect, useState } from "react";
import {  Alert } from "@mui/material";
import { Divider } from '@mui/material';
import LetterPullup from "./LetterPullup"; 
import categoriesData from "../utils/categories"; 
import { useTranslation } from "react-i18next";


import useAxiosInstance from '../ContextAPI/AxiosInstance';
import UserNavbar from "./UserNavbar";


const ProductForm = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const axiosInstance = useAxiosInstance(); 
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [showModelConfirmation, setShowModelConfirmation] = useState(false); // State to control modal visibility

  const [latitude, setLatitude] = useState(null);
  const PakistaniCities = [
    "Abbottabad", "Ahmadpur East", "Aliabad", "Arifwala", "Attock", 
    "Badin", "Bagh", "Bahawalnagar", "Bahawalpur", "Bannu", 
    "Basirpur", "Batkhela", "Bhakkar", "Burewala", "Chakwal", 
    "Chaman", "Charsadda", "Chiniot", "Chishtian", "Chitral", 
    "Dadu", "Dalbandin", "Dera Allah Yar", "Dera Bugti", "Dera Ghazi Khan", 
    "Dera Ismail Khan", "Digri", "Dina", "Diplo", "Doaba", 
    "Dudial", "Faisalabad", "Fateh Jang", "Ghotki", "Gilgit", 
    "Gojra", "Gujar Khan", "Gujranwala", "Gujrat", "Gwadar", 
    "Hafizabad", "Hangu", "Haripur", "Harnai", "Hassan Abdal", 
    "Hub", "Hyderabad", "Islamabad", "Jacobabad", "Jamshoro", 
    "Jaranwala", "Jatoi", "Jhang", "Jhelum", "Kabirwala", 
    "Kamalia", "Kambar", "Kamoke", "Kandhkot", "Kandiaro", 
    "Karachi", "Kasur", "Kashmore", "Khairpur", "Khanewal", 
    "Khanpur", "Khaplu", "Kharan", "Khushab", "Khuzdar", 
    "Kohat", "Kot Addu", "Kotli", "Kotri", "Kulachi", 
    "Kundian", "Lahore", "Lakki Marwat", "Lalamusa", "Larkana", 
    "Lasbela", "Layyah", "Lodhran", "Malakand", "Mandi Bahauddin", 
    "Mansehra", "Mardan", "Mastung", "Mian Channu", "Mianwali", 
    "Mingora", "Mirpur Khas", "Mirpur", "Mithi", "Multan", 
    "Muzaffargarh", "Muzaffarabad", "Nankana Sahib", "Narowal", "Naushahro Feroze", 
    "Nawabshah", "New Mirpur", "Nowshera", "Okara", "Ormara", 
    "Pakpattan", "Panjgur", "Parachinar", "Pasni", "Peshawar", 
    "Pir Mahal", "Qila Abdullah", "Qila Saifullah", "Quetta", "Rahim Yar Khan", 
    "Rajanpur", "Rangpur", "Rawalakot", "Rawalpindi", "Sadiqabad", 
    "Sahiwal", "Samundri", "Sanghar", "Sangla Hill", "Sargodha", 
    "Shakargarh", "Sheikhupura", "Shikarpur", "Shingar", "Sialkot", 
    "Sibi", "Sohbatpur", "Sukkur", "Swabi", "Swat", 
    "Tando Adam", "Tando Allahyar", "Tando Muhammad Khan", "Tank", "Taxila", 
    "Thatta", "Toba Tek Singh", "Turbat", "Umerkot", "Vehari", 
    "Wah Cantt", "Warah", "Wazirabad", "Zafarwal", "Zhob", 
    "Ziarat"
  ].sort();
  

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Log the token on initial render
    console.log('Token:', token);
  }, [token]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };



  
  




  

  




 





const handleSubmit = async (event) => {
  event.preventDefault();

  const longitude = 72.3631; // Replace with actual value
  const latitude = 33.7530;  // Replace with actual value

  if (!validateForm()) return;

  if (!selectedModel) {
      // If model is not selected, show confirmation modal
      setShowModelConfirmation(true);
      return;
  }

  // Continue with form submission if model is selected
  submitAd();
};


  // Conditions for the dropdown
  const conditions = ["Brand New", "Used", "Refurbished"];

  const submitAd = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append('category', selectedCategory);
    formData.append('brand', selectedBrand);
    formData.append('model', selectedModel);  // This will only be appended if model is selected
    formData.append('price', price);
    formData.append('description', description);
    formData.append('condition', selectedCondition);
    formData.append('MobilePhone', mobileNumber);

    formData.append("location", JSON.stringify({
        type: "Point",
        coordinates: [longitude, latitude], // Valid coordinates
        readable: selectedCity // Selected city name
    }));

    images.forEach((image) => {
        formData.append('images', image);
    });

    try {
        await axiosInstance.post('/user-ads/postads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setAlert({ message: t("adPostedSuccess"), severity: "success" });
    } catch (error) {
      setAlert({ message: t("adPostedError"), severity: "error" });
    } finally {
        setLoading(false);
    }
};

  
  

const handleCategoryChange = (event) => {
  const category = event.target.value;
  setSelectedCategory(category);
  setBrands(Object.keys(categoriesData[category] || {})); // Replace 'data' with 'categoriesData'
  setSelectedBrand("");
  setModels([]);
};

const handleBrandChange = (event) => {
  const brand = event.target.value;
  setSelectedBrand(brand);
  setModels(categoriesData[selectedCategory]?.[brand] || []); // Replace 'data' with 'categoriesData'
  setSelectedModel("");
};


const handleImageUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 1048576; // 1MB in bytes

  const validImages = [];
  const invalidFiles = [];

  selectedFiles.forEach((file) => {
    if (!validImageTypes.includes(file.type)) {
      invalidFiles.push(`${file.name} - Invalid file type`);
    } else if (file.size > maxSize) {
      invalidFiles.push(`${file.name} - File too large (max 1MB)`);
    } else {
      validImages.push(file);
    }
  });

  if (invalidFiles.length > 0) {
    setAlert({
      message: `Invalid files: ${invalidFiles.join(', ')}`,
      severity: "error"
    });
  }

  setImages((prevImages) => 
    [...prevImages, ...validImages].slice(0, 5)
  );
};
  const removeImage = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    if (!selectedCategory) {
      setAlert({ message: t("errors.selectCategory"), severity: "error" });
      return false;
    }
   
    if (!selectedBrand) {
      setAlert({ message: t("errors.selectBrand"), severity: "error" });
      return false;
    }
    if (!mobileNumber) {
      setAlert({ message: t("errors.mobileRequired"), severity: "error" });
      return false;
    }
    if (!selectedCondition) {
      setAlert({ message: t("errors.selectCondition"), severity: "error" });
      return false;
    }
    if (!description.trim()) {
      setAlert({ message: t("errors.provideDescription"), severity: "error" });
      return false;
    }
    if (!price || price <= 0) {
      setAlert({ message: t("errors.validPrice"), severity: "error" });
      return false;
    }
    if (images.length === 0) {
      setAlert({ message: t("errors.atLeastOneImage"), severity: "error" });
      return false;
    }
    if (!selectedCity) {
      setAlert({ message: t("errors.selectCity"), severity: "error" });
      return false;
    }
    return true;
  };
  
  
  return (
    <>
    <UserNavbar/>
    <div className="flex justify-center p-6 bg-white">
    
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl">
   

    <h2 className="mb-4 flex flex-wrap text-2xl font-extrabold ">
  <span className="text-yellow-500">
    <LetterPullup text="Post Your Ad: " delay={0.05} />
  </span>
  <span>
    <LetterPullup text="Evaluate User " delay={0.05} />
  </span>
  <span className="text-yellow-500">
    <LetterPullup text="Experience " delay={0.05} />
  </span>
  <span>
    <LetterPullup text="with Our Ad Form" delay={0.05} />
  </span>
</h2>

    <Divider className="bg-yellow-400 h-0.5 mx-6 space-y-10" />



      
      

        
         

        {/* Dropdowns Section */}
        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 gap-6 mb-6">
  {/* Category Dropdown */}
  <div>
    <label
      htmlFor="category"
      className="block text-md font-semibold text-gray-950 mb-2"
    >
      <span className="text-gray-950">{t("selectCategory")}</span>
    </label>
    <div className="relative">
    <select
  id="category"
  value={selectedCategory}
  onChange={handleCategoryChange}
  className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-800 focus:border-transparent transition duration-300 ease-in-out"
>
  <option value="">{t("selectCategory")}</option>
  {Object.keys(categoriesData).map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

    
    </div>
  </div>

  {/* Brand Dropdown */}
  <div>
    <label
      htmlFor="brand"
      className="block text-md font-semibold text-gray-950 "
    >
      <span className="text-gray-950">{t("selectBrand")}</span>
    </label>
    <div className="relative">
    <select
  id="brand"
  value={selectedBrand}
  onChange={handleBrandChange}
  className={`w-full p-3 border ${
    selectedCategory ? "border-gray-300 bg-gray-50" : "bg-gray-200"
  } text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out`}
  disabled={!selectedCategory}
>
  <option value="">{t("selectBrand")}</option>
  {selectedCategory &&
    Object.keys(categoriesData[selectedCategory]).map((brand) => (
      <option key={brand} value={brand}>
        {brand}
      </option>
    ))}
</select>

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* Model Dropdown */}
  <div>
    <label
      htmlFor="model"
      className="block text-md font-semibold text-gray-950  mb-2"
    >
      <span className="text-gray-950">{t("selectModel")}</span>
    </label>
    <div className="relative">
    <select
  id="model"
  value={selectedModel}
  onChange={(e) => setSelectedModel(e.target.value)}
  className={`w-full p-3 border ${
    selectedBrand ? "border-gray-300 bg-gray-50" : "bg-gray-200"
  } text-gray-700 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out`}
  disabled={!selectedBrand}
>
  <option value="">{t("selectModel")}</option>
  {selectedBrand &&
    categoriesData[selectedCategory][selectedBrand].map((model, index) => (
      <option key={index} value={model}>
        {model}
      </option>
    ))}
</select>

      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
</div>


        {/* Mobile Phone Number Input - Conditional */}
        <div className="mb-6">
  <label
    htmlFor="mobileNumber"
    className="block text-md font-semibold text-gray-950  mb-2"
  >
    <span className="text-gray-950">{t("mobilePhoneNumber")}</span>
  </label>
  <div className="relative">
  <input
  type="tel"
  id="mobileNumber"
  value={mobileNumber}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers and optional leading +
    if (/^\+?[0-9]*$/.test(value)) {
      setMobileNumber(value);
    }
  }}
  pattern="^(\+923\d{9}|03\d{9})$"
  maxLength="12"
  className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400"
  placeholder="e.g., 03123456789 or +923123456789"
/>
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
   {/* You may Iclude a Icon here */}
    </div>
  </div>
</div>
   {/* Location Input */}
   <div className="mb-6">
        <label
          htmlFor="city"
          className="block text-md font-semibold text-gray-950 mb-2"
        >
        {t("selectCity")}
        </label>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out"
        >
          <option value="" disabled>
          {t("selectCity")}
          </option>
          {PakistaniCities.map((city) => (
            <option key={city} value={city}>
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
    {t("description")}
    </label>
    <textarea
      id="description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 "
      rows="4"
      placeholder="Provide a detailed description of the product"
    />
  </div>

  {/* Price Input */}
  <div>
    <label htmlFor="price" className="block text-md font-semibold text-gray-950  mb-2">
    {t("price")}
    </label>
    <input
      type="number"
      id="price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out placeholder-gray-400 "
      placeholder="Enter price in PKR"
    />
  </div>
</div>

{/* Condition Dropdown */}
<div className="mb-6">
  <label htmlFor="condition" className="block text-md font-semibold text-gray-950  mb-2">
  {t("selectCondition")}
  </label>
  <select
    id="condition"
    value={selectedCondition}
    onChange={(e) => setSelectedCondition(e.target.value)}
    className="w-full p-4 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out "
  >
    <option value="">{t("selectCondition")}</option>
    {conditions.map((condition, index) => (
      <option key={index} value={condition}>
        {condition}
      </option>
    ))}
  </select>
</div>

{/* Image Uploads Section */}
<div className="mb-6">
  <label className="block text-md font-semibold text-gray-950  mb-2">
  {t("uploadImages")}
  </label>
  <input
    type="file"
    multiple
    onChange={handleImageUpload}
    accept="image/*"
    className="w-full p-4 text-gray-700 border border-gray-300 bg-gray-50 rounded-lg shadow focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition duration-300 ease-in-out "
  />

  {images.length > 0 && (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
          <img
            src={URL.createObjectURL(image)}
            alt={`Uploaded ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {index === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white text-sm font-semibold">Cover</span>
            </div>
          )}
          <button
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition duration-200"
          >
            &times;
          </button>
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
            className="w-full mb-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
             {loading ? t("posting") : t("postAd")}
          </button>
          {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert("")} className="mb-4">
            {alert.message}
          </Alert>
        )}
{showModelConfirmation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 className="text-xl font-bold mb-4">{t("modelConfirmation.title")}</h3>
      <p className="mb-4">{t("modelConfirmation.message")}</p>
      <div className="flex justify-between">
        <button
          onClick={() => {
            setShowModelConfirmation(false);
            submitAd();
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          {t("modelConfirmation.confirm")}
        </button>
        <button
          onClick={() => setShowModelConfirmation(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          {t("modelConfirmation.cancel")}
        </button>
      </div>
    </div>
  </div>
)}




      </div>
    </div>

    </>
  );
};

export default ProductForm;

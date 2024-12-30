import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaCrown } from "react-icons/fa";

const AdDetailsComponent = () => {
  const { adId } = useParams();
  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Basic');
  const [currentImage, setCurrentImage] = useState('');
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    // API call to fetch ad details
    const fetchAdDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users-fast/user-sell-fast/${adId}`); // Adjust the URL as needed
        setAdDetails(response.data);
        setCurrentImage(response.data.images[0]); // Set the first image as default
      } catch (error) {
        console.error("Error fetching ad details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  const handlePlanPayment = async (plan) => {
    try {
      await axiosInstance.put(`/users-fast/update-plan/${adId}`, { plan });

      alert(`${plan} Plan payment successfully updated.`);
    } catch (error) {
      console.error("Error updating plan:", error);
      alert(`Failed to update the ${plan} plan.`);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 class="mb-4 text-3xl font-extrabold mt-5  leading-none tracking-tight text-gray-900 md:text-3xl lg:text-3xl ">Get <mark class="px-2 text-gray-700 bg-yellow-400 rounded ">Noticed</mark> – Feature Your Ad on the  <mark class="px-2 text-gray-700 bg-yellow-400 rounded ">Front Page!</mark></h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Images */}
        <div className="md:w-1/2">
          {loading ? (
            <div className="space-y-4">
              <div className="h-80 bg-gray-200 animate-pulse"></div>

              <div className="flex space-x-4">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="w-24 h-24 bg-gray-200 animate-pulse"
                    ></div>
                  ))}
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-full h-80 border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={currentImage || adDetails.images[0]}
                  alt="Selected"
                  className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>
              <div className="flex mt-4 overflow-x-auto space-x-4">
                {adDetails.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-none w-24 h-24 border-2 border-gray-200 rounded-lg shadow-md"
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                      onClick={() => setCurrentImage(image)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side - Ad Details */}
        <div className="md:w-1/2">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-1/2 bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="flex items-center text-2xl font-bold mb-4 text-gray-800">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                  <strong>Price:</strong>
                </mark>
                <span className="text-black text-3xl mx-2">
                  Rs. {adDetails.price}/-
                </span>
              </p>
              <p className="mb-6 text-lg text-gray-600">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                  <strong>Description:</strong>
                </mark>
                <span className="font-medium"> {adDetails.description}</span>
              </p>
              <p className="mb-6 text-lg text-gray-600">
  <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
    <strong>Model:</strong>
  </mark>
  <span className="font-medium"> {/* Added ml-2 for margin-left */}
    {adDetails.model ?adDetails.model : "Not specified"}
  </span>
</p>

              <p className="mb-6 text-lg text-gray-600">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                  <strong>Condition:</strong>
                </mark>
                <span className="font-medium"> {adDetails.condition}</span>
              </p>
              <p className="mb-6 text-lg text-gray-600">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                  <strong>Mobile Phone:</strong>
                </mark>
                <span className="font-medium"> {adDetails.MobilePhone}</span>
              </p>
              <p className="mb-6 text-lg text-gray-600">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                  <strong>Category:</strong>
                </mark>
                <span className="font-medium"> {adDetails.category}</span>
              </p>
              <p className="mb-6 text-lg text-gray-600">
  <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
    <strong>Location:</strong>
  </mark>
  <span className="font-medium ml-2">{adDetails.location.readable}</span>
</p>

            </div>
          )}
        </div>
      </div>

      {/* Tabs Below */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          Choose Your <mark className="px-2 text-gray-600 bg-yellow-400 rounded">Payment</mark> – Be Seen <mark className="px-2 text-gray-700 bg-yellow-400 rounded">First!</mark>
        </h2>
        <div className="flex flex-col md:flex-row font-semibold bg-gray-100 rounded-lg overflow-hidden shadow-md">
          {['Basic', 'Standard', 'Premium'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 p-3 text-center font-medium ${
                activeTab === tab ? 'bg-yellow-500 text-gray-900 font-semibold' : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaCrown className={`${tab === 'Basic' ? 'text-gray-400' : tab === 'Standard' ? 'text-yellow-700' : 'text-blue-600'}`} />
                <span>{tab}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">{activeTab} Plan</h3>
          <p className="text-gray-600">
            Details about the {activeTab} plan will go here.
          </p>
          <button
            className="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 font-bold shadow-md"
            onClick={() => handlePlanPayment(activeTab)}
          >
            Pay {activeTab}
          </button>
        </div>
      </div>
  
    </div>
  );
};

export default AdDetailsComponent;

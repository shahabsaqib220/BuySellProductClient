import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaCrown } from "react-icons/fa";

const AdDetailsComponent = () => {
  const { adId } = useParams();
  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  const [selectedDays, setSelectedDays] = useState(7); // Default premium plan days
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users-fast/user-sell-fast/${adId}`);
        setAdDetails(response.data);
        setCurrentImage(response.data.images[0]);
      } catch (error) {
        console.error("Error fetching ad details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  const handlePlanPayment = async () => {
    try {
      await axiosInstance.put(`/users-fast/update-plan/${adId}`, {
        plan: "Premium",
        days: selectedDays,
      });
      alert(`Premium Plan payment successfully updated for ${selectedDays} days.`);
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Failed to update the Premium plan.");
    }
  };

  // Pricing for premium plans
  const premiumPlans = [
    { days: 7, price: 1500 },
    { days: 15, price: 2500 },
    { days: 30, price: 4000 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-extrabold mt-5 leading-none tracking-tight text-gray-900">
        Get <mark className="px-2 text-gray-700 bg-yellow-400 rounded">Noticed</mark> – Feature Your Ad on the <mark className="px-2 text-gray-700 bg-yellow-400 rounded">Front Page!</mark>
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          {loading ? (
            <div className="h-80 bg-gray-200 animate-pulse"></div>
          ) : (
            <>
              <div className="relative w-full h-80 border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={currentImage || adDetails.images[0]}
                  alt="Selected"
                  className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex mt-4 overflow-x-auto space-x-4">
                {adDetails.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-24 h-24 border-2 border-gray-200 rounded-lg cursor-pointer hover:scale-105"
                    onClick={() => setCurrentImage(image)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/2">
          {loading ? (
            <div className="h-6 w-1/2 bg-gray-200 animate-pulse"></div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-3xl font-bold text-gray-800">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">Price:</mark> Rs. {adDetails.price}/-
              </p>
              <p className="text-lg text-gray-600 mt-4">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">Description:</mark> {adDetails.description}
              </p>
              <p className="text-lg text-gray-600 mt-4">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">Condition:</mark> {adDetails.condition}
              </p>
              <p className="text-lg text-gray-600 mt-4">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">Mobile Phone:</mark> {adDetails.MobilePhone}
              </p>
              <p className="text-lg text-gray-600 mt-4">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">Location:</mark> {adDetails.location.readable}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold text-center md:text-left">
          Upgrade to <mark className="px-2 text-gray-700 bg-yellow-400 rounded">Premium</mark> – Stay on Top!
        </h2>
        <div className="bg-gray-100 rounded-lg shadow-md p-4 mt-4">
          <div className="flex items-center space-x-2">
            <FaCrown className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold">Premium Plan</h3>
          </div>
          <p className="text-gray-600 mt-2">
            Premium ads get <strong>top priority</strong>, ensuring maximum visibility and engagement. Choose the number of days to feature your ad prominently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {premiumPlans.map((plan) => (
              <div
                key={plan.days}
                className={`p-4 rounded-lg shadow-md ${
                  selectedDays === plan.days ? 'border-2 border-yellow-400' : 'border border-gray-200'
                }`}
                onClick={() => setSelectedDays(plan.days)}
              >
                <h4 className="text-lg font-bold text-gray-800">{plan.days} Days</h4>
                <p className="text-gray-600 mt-2">PKR {plan.price}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {plan.days === 7 && 'Perfect for short-term promotions'}
                  {plan.days === 15 && 'Great for extended campaigns'}
                  {plan.days === 30 && 'Ideal for long-term visibility'}
                </p>
              </div>
            ))}
          </div>
          <button
            className="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 font-bold shadow-md w-full"
            onClick={handlePlanPayment}
          >
            Pay for Premium ({selectedDays} Days) - PKR {premiumPlans.find((plan) => plan.days === selectedDays)?.price}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            *Premium ads are featured at the top of search results and category pages, ensuring maximum visibility.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsComponent;
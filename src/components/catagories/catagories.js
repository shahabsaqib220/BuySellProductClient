import { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";

function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown on hover
  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white py-2 px-4 relative">
      {/* Top Bar */}
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Categories */}
        <div
          className="relative z-30"
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
          ref={dropdownRef}
        >
          <button className="flex items-center space-x-1 font-semibold text-yellow-500 hover:text-yellow-400">
            <span>All Categories</span>
            <FaCaretDown />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full mt-2 bg-white text-black rounded-lg shadow-lg w-48 z-40">
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Electronics
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Home Appliances
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Furniture
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Sports
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Fashion and Beauty
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Bikes
              </a>
              <a href="/" className="block px-4 py-2 hover:bg-gray-200">
                Properties
              </a>
            </div>
          )}
        </div>

        {/* Other Categories */}
        <div className="hidden sm:flex space-x-6 text-sm">
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Mobile Phones
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Laptops
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Accessories
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Fashion and Beauty
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Electronics & Home Appliances
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Bikes
          </a>
          <a href="/" className="hover:text-yellow-500 font-semibold">
            Properties
          </a>
        </div>

        {/* Responsive for Small Devices */}
        <div className="flex sm:hidden space-x-6 text-sm mt-2">
          <a href="/" className="hover:text-yellow-500">
            Mobile Phones
          </a>
          <a href="/" className="hover:text-yellow-500">
            Laptops
          </a>
          <a href="/" className="hover:text-yellow-500">
            Accessories
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

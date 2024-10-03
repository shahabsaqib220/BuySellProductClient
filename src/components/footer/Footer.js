import React from 'react';
import "./footer.css"

const Footer = () => {
  return (
    <footer>
    <div className='footer_container'>
        <div className='footr_details_one'>
            <h3>Get to know Us</h3>
            <p>About Us</p>
            <p>Careers</p>
            <p>Press Release</p>
            <p>OLS Cares</p>

        </div>
        <div className='footr_details_one'>
            <h3>Connect with US</h3>
            <p>Facebook</p>
            <p>Twitter</p>
            <p>Instagram</p>
            <p>Linkdin</p>

        </div>
        <div className='footr_details_one'>
            <h3>Make Money with Us</h3>
            <p>Sell products on OLS</p>
            <p>Become an Affiliate</p>
            <p>Advertise Your Products</p>
            <p>Self-Publish with Us</p>
            <p>OLS Cares</p>
           
        </div>
        <div className='footr_details_one'>
            <h3>Amazon Payment Products</h3>
            <p>Shop with Points</p>
            <p>Reload Your Balance</p>
            <p>Press Release</p>
            <p>OLS Cares</p>

        </div>
        <div className='footr_details_one'>
            <h3>Let Us Help You</h3>
            <p>Shipping Rates & Policies</p>
            <p>Returns & Replacements</p>
            <p>Manage Your Content and Devices
            </p>
            <p>Help</p>

        </div>
      
    </div>
    <div className='lastdetails text-white mt-10 flex flex-col items-center'>
    <h2>Logo Here</h2>
    <p className='mt-2 text-center'>
        Condition of Use and sale &nbsp; Privacy Notice &nbsp; Interest-Based Ads
    </p>
</div>

    
    </footer>
  )
}

export default Footer

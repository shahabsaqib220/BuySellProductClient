import './App.css';
import Navbar from './components/header/Navbar';
import Catagories from './components/catagories/catagories';
import Footer from './components/footer/Footer';
import Sign_In from './components/signin_signup/Sign_In';
import Sign_Up from './components/signin_signup/Sign_Up';
import ProductItemsCard from './components/ProductItemsCard';
import OTPVerification from './components/OtpVerifications';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './Redux/store'; // Import the store
import PrivateRoute from './ContextAPI/PrivateRoute';
import CatagoryAds from "./components/CategoryAds"
import EditUserPostedAd from "./components/EditUserPostedAd"
import SecurityQuestions from './components/SecurityQuestions';
import Dashboard from './components/Dashboard';
import AdminNavbar from './components/AdminNavbar'
import UserAdsPosts from './components/UserAdsPosts'
import ProfileImage from './components/ProfileImage';
import UserAdsTable from './components/UserAdsTable';
import ProductDetails from './components/ProductDetails';
import SoldOutUserProduct from "./components/SoldOutUserProduct"
import CartComponent from './components/Cart';
import UserNavbar from './components/UserNavbar';
import EditUserAds from "./components/EditUserAds"
import ChangePassword from "./components/ChangePassword";
import FilteredAds from "./components/FilteredAds"
import ForgetPassword from "./components/ForgetPassword"
import ResetPasswordOtpVerfication from "./components/ResetPasswordOtpVerification";
import ResetPasswordQuestion from "./components/ResetPasswordQuestion";
import UserNewPassword from "./components/UserNewPassword"
import UserChat from './components/UsersChat';
import ReceiversProfileImages from "./components/ReceiversProfileImages"


function App() {
  return (
    <Provider store={store}> {/* Wrap everything inside Provider */}
      <BrowserRouter>
        <Navbar />
        {/* <Catagories /> */}
        
        <Routes>
          
          <Route path='/' element={<ProductItemsCard />} />
          <Route path="/category/:category" element={<CatagoryAds/>} />
          <Route path="/cart" element={<CartComponent />} />
          <Route path='/login' element={<Sign_In />} />
          <Route path='/register' element={<Sign_Up />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/security-questions" element={<SecurityQuestions />} />
        <Route path="/custom-filter" element={<FilteredAds />} />
        <Route path="/product/:id" element={<ProductDetails  />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/password-reset-optp-verfication" element={<ResetPasswordOtpVerfication />} />
        <Route path="/password-reset-questions-verfication" element={<ResetPasswordQuestion />} />
        <Route path="/new-user-password" element={<UserNewPassword />} />
        
     
        
        
        <Route path="/postad" element={<PrivateRoute element={<UserAdsPosts />} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfileImage />} />} />
      {/* <Route path="/edit-ad" element={<PrivateRoute element={<EditUserAds />} />} /> */}
      <Route path="/viewads" element={<PrivateRoute element={<UserAdsTable />} />} />
      <Route path="/soldoutproducts" element={<PrivateRoute element={<SoldOutUserProduct />} />} />
      <Route path="/edit-ad/:adId" element={<PrivateRoute element={<EditUserPostedAd />} />} />
      <Route path="/usernavbar" element={<PrivateRoute element={<UserNavbar />} />} />
      <Route path="/security" element={<PrivateRoute element={<ChangePassword />} />} />
      <Route path="/chat" element={<PrivateRoute element={<UserChat />} />} />
   
        
        </Routes>
        <Footer />
        
       
      </BrowserRouter>
    </Provider>
  );
}


export default App;

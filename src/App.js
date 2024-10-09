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



function App() {
  return (
    <Provider store={store}> {/* Wrap everything inside Provider */}
      <BrowserRouter>
        <Navbar />
        {/* <Catagories /> */}
        
        <Routes>
          <Route path='/' element={<ProductItemsCard />} />
          <Route path="/cart" element={<CartComponent />} />
          <Route path='/login' element={<Sign_In />} />
          <Route path='/register' element={<Sign_Up />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/security-questions" element={<SecurityQuestions />} />
        <Route path="/product/:id" element={<ProductDetails />} />
     
        
        
        <Route path="/postad" element={<PrivateRoute element={<UserAdsPosts />} />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfileImage />} />} />
      <Route path="/viewads" element={<PrivateRoute element={<UserAdsTable />} />} />
      <Route path="/soldoutproducts" element={<PrivateRoute element={<SoldOutUserProduct />} />} />
      <Route path="/usernavbar" element={<PrivateRoute element={<UserNavbar />} />} />
      
        
        </Routes>
        <Footer />
        
       
      </BrowserRouter>
    </Provider>
  );
}


export default App;

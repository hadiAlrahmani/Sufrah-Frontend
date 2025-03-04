import { useState, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import NavBar from './components/NavBar/NavBar';
import Restaurants from './components/Restaurants/Restaurants';
import Restaurant from "./components/Restaurant/Restaurant";
import Cart from './components/Cart/Cart';
import Orders from './components/Orders/Orders';
import Notifications from './components/Notifications/Notifications';
import SignupForm from './components/SignupForm/SignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import CreateRestaurant from "./components/AdminDashboard/CreateRestaurant/CreateRestaurant";
import ManageOrders from "./components/AdminDashboard/ManageOrders/ManageOrders";
import ManageMenu from "./components/AdminDashboard/ManageMenu/ManageMenu";

// Services
import * as authService from './services/authService'; 

// Authentication Context
export const AuthedUserContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(authService.getUser());

  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        <NavBar user={user} handleSignout={handleSignout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
  
          {/* Protected Routes */}
          {user ? (
            <>
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/notifications" element={<Notifications />} />
  
              {/* Admin Routes */}
              {user?.role === "admin" && (
                <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/create-restaurant" element={<CreateRestaurant />} />
                <Route path="/admin/order/:id" element={<ManageOrders />} />
                <Route path="/admin/restaurant/:id/menu" element={<ManageMenu />} />
                <Route path="/admin/restaurant/:id/menu" element={<ManageMenu />} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/cart" element={<Navigate to="/signin" />} />
              <Route path="/orders" element={<Navigate to="/signin" />} />
              <Route path="/notifications" element={<Navigate to="/signin" />} />
            </>
          )}
  
          {/* Auth Routes */}
          <Route path="/signup" element={<SignupForm setUser={setUser} />} />
          <Route path="/signin" element={<SigninForm setUser={setUser} />} />
        </Routes>
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;
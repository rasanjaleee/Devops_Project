import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import WorkshopPage from './Pages/WorkshopPage';
import Footer from './Components/Footer';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './Pages/AdminDashboardPage';
import ProfilePage from './Pages/ProfilePage';
import UnauthorizedPage from './Pages/UnauthorizedPage';
import './Styles/main.css';
import MyWorkshops from './Components/MyWorkshop';
import WorkshopDetails from './Pages/WorkshopDetailsPage';
import ContactPage from './Pages/ContactPage';
import ProtectedRoute from './Pages/ProtectedRoute';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/workshops" element={<WorkshopPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage/>}/>
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/my-workshops" element={<MyWorkshops />} />
          <Route path="/workshops/:id" element={<WorkshopDetails />} />
          <Route path="/contact" element={<ContactPage />} />

          

      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

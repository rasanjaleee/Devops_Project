import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import Footer from './Components/Footer';
import SignupPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/main.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css';
import Navbar from './components/navbar/Navbar';
import Register from './components/forms/register/Register'
import Login from './components/forms/login/Login'
import Home from './components/main/Home'
import Snack_bar from './components/web_components/snack_bar/Snack_bar';
import Otp_form from './components/forms/otp/Otp_form';
import CreatePost from './components/main/CreatePost'
import Logout from './components/main/Logout';
import Explore from './components/main/Explore';
function App() {

  const callback = (data) => {
    data();
  }
  const handleTabClose = () => {
    window.open('http://localhost:3000/logout')
    }
    
  useEffect(()=>{
    window.addEventListener('beforeunload',handleTabClose)
    return () => {
      window.removeEventListener('beforeunload',handleTabClose)
    }
  },[]) 
  
  const val = localStorage.getItem('id')
  console.log(val)
  return (
    <div className="App">
        <BrowserRouter>
        <div><Navbar/></div>
        <div>
          <Routes>
            <Route path='/' element={<Register />}></Route>
            <Route path='/otp' element={<Otp_form/>}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/main' element={<Home />}></Route>
            <Route path='/:id/create' element={<CreatePost/>}></Route>
            <Route path='/logout' element={<Logout/>}></Route>
            <Route path='/explore' element={<Explore/>}></Route>
          </Routes>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;

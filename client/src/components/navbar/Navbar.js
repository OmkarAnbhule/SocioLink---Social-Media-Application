import React, { useEffect, useState } from 'react';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import logo from './S.png'
import { useJwt } from 'react-jwt';
export default function Navbar() {
  const api = process.env.REACT_APP_API_URL;
  const { decodedToken, isExpired } = useJwt(localStorage.getItem('id'));
  const navigate = useNavigate();
  const id = localStorage.getItem('id')
  const [img, setImg] = useState('')
  const [open, setOpen] = useState(false)
  const isLoggedin = localStorage.getItem('login')
  const logout = async () => {
    let result = await fetch(`${api}user/logout/${decodedToken.user}`, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('id')
      }
    })
    result = await result.json()
    logout_navigate(result)
  }
  useEffect(() => {
    if (isLoggedin == 'true' && decodedToken) {
      getProfile()
    }
  }, [decodedToken])
  const getProfile = async () => {
    let result = await fetch(`${api}user/getProfile/${decodedToken ? decodedToken.user : null}`, {
      method: 'get',
      headers: {
        'Content-type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('id')
      }
    })
    result = await result.json()
    displayImage(result)
  }
  const displayImage = (res) => {
    if (res.Response == 'Success') {
      setImg(res.data.image)
    }
  }
  const logout_navigate = (res) => {
    if (res.Response == 'Success') {
      localStorage.clear();
      navigate('/login')
    }
    else {

    }
  }
  const create = () => {
    if (localStorage.getItem('Create') === 'True') {
      localStorage.setItem('Create', 'False')
      navigate('/main')
    }
    else {
      navigate('/create', {
        state: {
          Create: {
            id: id,
          }
        }
      })
      localStorage.setItem('Create', 'True')
    }
  }

  const handleNavigate = (path) => {
    return () => {
      navigate(path)
    }
  }

  const explore = () => {
    if (localStorage.getItem('Explore') === 'True') {
      localStorage.setItem('Explore', 'False')
      navigate('/main')
    }
    else {
      navigate('/explore')
      localStorage.setItem('Explore', 'True')
    }
  }
  return (
    <div className='Navbar'>
      <div className="logo" onClick={handleNavigate('/main')}>
        <div className='img'>
          <img src={logo} width={40} height={40}></img>
        </div>
        <h1>Socilink</h1>
      </div>
      <div className='ham'>
        <button onClick={() => setOpen(!open)}>
          <i className='bi bi-list'></i>
        </button>
      </div>
      {isLoggedin == 'true' ?
        <>
          <div className={`btn-group ${open.toString()}`}>
            <button onClick={logout}>Logout</button>
            <button onClick={create}>Create Post</button>
            <button onClick={explore}>Explore</button>
          </div>
          <div className='profile' onClick={() => navigate(`/profile/${decodedToken.user}`)}>
            <button onClick={handleNavigate('chats')}><i className='bi bi-chat-text'></i></button>
            {img != '' ? (<img src={img}></img>) : null}
          </div>
        </>
        : null}
    </div>
  );
}

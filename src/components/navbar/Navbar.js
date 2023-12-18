import React, { useEffect, useState } from 'react';
import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import logo from './S.png'
export default function Navbar() {
    var CryptoJS = require('crypto-js')
    const navigate = useNavigate();
    const id = localStorage.getItem('id')
    const [img,setImg] = useState('')
    const [EncryptedData,setEncryptedData] = useState('')
    const isLoggedin = localStorage.getItem('login')
    const logout = async () => {
        let result = await fetch("http://localhost:5000/logout", {
          method: 'post',
          body: JSON.stringify({ email: id }),
          headers: {
            'Content-type': 'application/json'
          }
        })
        result = await result.json()
        logout_navigate(result)
      }
      useEffect(()=>{
        if(isLoggedin=='true'){
          encrpyt()
        getProfile()}
      },[])
      const getProfile = async () => {
        let result = await fetch('http://localhost:5000/profile',{
          method:'post',
          body:JSON.stringify({email:id}),
          headers:{
            'Content-type':'application/json',
          }
        })
        result = await result.json()
        displayImage(result)
      }
      const displayImage = (res) => {
        if(res.Response=='Success')
        {
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
        encrpyt()
        navigate(`/${EncryptedData.substring(1,5)}/create`,{
          state:{
            Create:{
              id:id,
            }
          }
        })
      }
      const secrePass = 'XkhZG4fW2t2W'
      const encrpyt = async () => {
        const data = CryptoJS.AES.encrypt(
          id,
          secrePass
        ).toString()
        setEncryptedData(data)
        console.log(EncryptedData)
      }
        return (
            <div className='Navbar'>
                <div className="logo">
                    <div className='img'>
                    <img src={logo} width={40} height={40}></img>
                    </div>
                    <h1>Socilink</h1>
                    {isLoggedin == 'true' ? 
                    <>
                    <div className='btn-group'>
                    <button onClick={logout}>Logout</button>
                    <button>Notify</button>
                    <button onClick={create}>Create Post</button>
                    <img src=''></img>
                    </div>
                    <div className='profile'>
                        {img != '' ?(<img src = {require('../../images/profile/'+img)}></img>):null}
                      </div>
                    </>
                    :null}

                </div>
            </div>
        );
}

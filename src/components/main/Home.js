import React, { useEffect, useId, useState } from 'react'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
  const val = localStorage.getItem('id')
  const btn_id = useId();
  const btn_id1 = useId();
  const btn_id2 = useId();
  const [curr, setCurr] = useState(parseInt(localStorage.getItem('time')));
  const [pre, setPre] = useState(parseInt(localStorage.getItem('time')));
  let payload = {}
  // let ws = new WebSocket("ws://localhost:9000");

  const logout = async () => {
    let result = await fetch("http://localhost:5000/logout", {
      method: 'post',
      body: JSON.stringify({ email: val }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    result = await result.json()
    logout_navigate(result)
  }
  const logout_navigate = (res) => {
    if (res.Response == 'Success') {
      localStorage.clear();
      navigate('/login')
    }
    else {

    }
  }


  const activity = () => {
    window.addEventListener('mousemove', () => {
      setCurr(curr + 1)
    })
    window.addEventListener('keypress', () => {
      setCurr(curr + 1)
    })
  }
  useEffect(() => {
    activity()
    const id = setTimeout(() => {
      if (curr > pre) {
        setPre(curr)
      }
      else {
        if (curr == pre) {
          logout()
          clearTimeout(id)
        }
      }
    }, 1000 * 60 * 1)
  }, [curr])



  // socket config
  // ws.onmessage = message => {
  //   const Response = JSON.parse(message.data)
  //   if (Response.method == 'connect') {
      
  //   }

  //   ws.send(JSON.stringify(payload))
  // }
  return (
    <div className='home'>
      <div className='story'>
        <div className='your_story'>
          <img src=''></img>
          <p>Username</p>
        </div>
        <div>
          <img ></img>
          <p>Username</p>
        </div>
        <div>
          <img ></img>
          <p>Username</p>
        </div>
        <div>
          <img ></img>
          <p>Username</p>
        </div>
        <div>
          <img ></img>
          <p>Username Username</p>
        </div>
      </div>
      <div className='body'>
        <div className='post'>
          <div className='head'>
            <div className='profile'>
              <img></img>
              <p>Username</p>
            </div>
            <button><i className='bi bi-three-dots-vertical'></i></button>
          </div>
          <div className='media'></div>
          <div className='media_btn'>
            <p>139495likes</p>
            <div>
              <button><i className='bi bi-heart'></i></button>
              <button><i className='bi bi-chat' ></i></button>
              <button><i className='bi bi-send' ></i></button>
            </div>
          </div>
          <div className='foot'></div>
        </div>
        <div className='post'>
          <div className='head'>
            <div className='profile'>
              <img></img>
              <p>Username</p>
            </div>
            <button><i className='bi bi-three-dots-vertical'></i></button>
          </div>
          <div className='media'></div>
          <div className='media_btn'>
            <p>139495likes</p>
            <div>
              <button><i className='bi bi-heart'></i></button>
              <button><i className='bi bi-chat' ></i></button>
              <button><i className='bi bi-send' ></i></button>
            </div>
          </div>
          <div className='foot'></div>
        </div>
        <div className='post'>
          <div className='head'>
            <div className='profile'>
              <img></img>
              <p>Username</p>
            </div>
            <button><i className='bi bi-three-dots-vertical'></i></button>
          </div>
          <div className='media'></div>
          <div className='media_btn'>
            <p>139495likes</p>
            <div>
              <button><i className='bi bi-heart'></i></button>
              <button><i className='bi bi-chat' ></i></button>
              <button><i className='bi bi-send' ></i></button>
            </div>
          </div>
          <div className='foot'></div>
        </div>
      </div>
    </div>
  )
}

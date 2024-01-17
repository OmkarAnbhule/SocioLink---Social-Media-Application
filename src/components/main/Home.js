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
  const [scrollTop,setScrollTop] = useState(0)
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
    handlePosts()
    if(localStorage.getItem('Create') == 'True' || localStorage.getItem('Explore') === 'True')
    {

    }
    else{

    
    activity()
    const id = setTimeout(() => {
      if (curr > pre) {
        setPre(curr)
      }
      else {
        if (curr == pre) {
          localStorage.clear()
          logout()
          clearTimeout(id)
        }
      }
    }, 1000 * 60 * 30)
  }
  }, [curr,pre])

const handleScroll = (e) => {
  setScrollTop(Math.ceil(e.currentTarget.scrollLeft))
}
const handleClickScroll = (i) =>{
  document.getElementById('scroll').scrollLeft = i * 765
}
const handlePosts = async () => {
  let result = await fetch('http://localhost:5000/get-posts',{
    method:'post',
    body:JSON.stringify({id:localStorage.getItem('id')}),
    headers:{
      'Content-Type':'application/json',
    }
  })
  result = await result.json()
}

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
          <div className='media'>
            <div onScroll={handleScroll} id='scroll'>
            <div style={{background:'red'}} id='0'>{scrollTop}</div>
            <div style={{background:'blue'}} id='1'>{scrollTop}</div>
            <div style={{background:'green'}} id='2'>{scrollTop}</div>
            <div style={{background:'yellow'}} id='3'>{scrollTop}</div>
            </div>
            <div>
              <p style={{background:scrollTop === 765 * 0 ? 'red' : 'black'}} onClick={()=>handleClickScroll(0)}></p>
              <p style={{background:scrollTop === 765 * 1 ? 'red' : 'black'}} onClick={()=>handleClickScroll(1)}></p>
              <p style={{background:scrollTop === 765 * 2 ? 'red' : 'black'}} onClick={()=>handleClickScroll(2)}></p>
              <p style={{background:scrollTop === 765 * 3 ? 'red' : 'black'}} onClick={()=>handleClickScroll(3)}></p>
            </div>
          </div>
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

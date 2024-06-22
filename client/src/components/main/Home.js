import React, { useEffect, useId, useRef, useState } from 'react'
import './style.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Post from './post/Post';
import Loader from '../web_components/loader/Loader'

export default function Home() {
  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const val = localStorage.getItem('id')
  const [curr, setCurr] = useState(parseInt(localStorage.getItem('time')));
  const [pre, setPre] = useState(parseInt(localStorage.getItem('time')));
  const [posts, setPost] = useState([]);
  // let ws = new WebSocket("ws://localhost:9000");

  const logout = async () => {
    let result = await fetch(`${api}user/logout/${val}`, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'authorization':'Bearer '+localStorage.getItem('id')
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
    const id = setInterval(() => {
      handlePosts()
    }, 2000);
    return () => {
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('Create') == 'True' || localStorage.getItem('Explore') === 'True') {

    }
    else {
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
  }, [curr, pre])


  const handlePosts = async () => {
    let result = await fetch(`${api}post/get-posts/${localStorage.getItem('id')}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization':'Bearer '+localStorage.getItem('id')
      }
    })
    result = await result.json()
    if (result.Response == 'Success') {
      setPost(result.data[0])
    }
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
        {
          posts && posts.length > 0 ?
            posts && posts.map((item, index) => (
              <Post key={index} data={item} />
            ))
            :
            <Loader display={'block'} background={true} width={'60px'} height={'60px'} />
        }
      </div>
    </div>
  )
}

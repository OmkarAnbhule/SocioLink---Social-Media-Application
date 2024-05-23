import React, { useEffect, useRef, useState } from 'react'
import { useJwt } from 'react-jwt'

export default function ChatBox({ id }) {
    const api = process.env.REACT_APP_API_URL;
    const { decodedToken, isExpired } = useJwt(localStorage.getItem('id'));
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null)

    const getChat = async () => {
        let result = await fetch(`${api}chat/getChat/${id}/${localStorage.getItem('id')}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json();
        if (result.Response === 'Success') {
            setMessages(result.data[0].message)
            return result;
        }
    }

    const getProfile = async (User1, User2) => {
        console.log(User1)
        let result = await fetch(`${api}user/getProfile/${decodedToken ? User1 === decodedToken.user ? User2 : User1 : null}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json();
        if (result.Response === 'Success') {
            setUsername(result.data.username)
            setStatus(result.data.loginStatus)
            setTime(formatRelativeTime(result.data.lastLogged))
            setImage(result.data.image)
            setReceiverId(result.data._id)
        }
    }


    function formatRelativeTime(timestamp) {
        const currentDate = new Date();
        const providedDate = new Date(timestamp);

        const timeDifference = currentDate - providedDate;
        const secondsDifference = Math.floor(timeDifference / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        if (daysDifference >= 1) {
            return `${daysDifference}d`;
        } else if (hoursDifference >= 1) {
            return `${hoursDifference}h`;
        } else if (minutesDifference >= 1) {
            return `${minutesDifference}m`;
        } else {
            return `${secondsDifference}s`;
        }
    }
    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const sendMessage = async () => {
        let result = await fetch(`${api}chat/sendMessage`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            },
            body: JSON.stringify({
                chatId: id,
                message: message,
                id: localStorage.getItem('id'),
                receiver: receiverId
            })
        })
        result = await result.json();
        if (result.Response === 'Success') {
            setMessage('')
        }

    }


    useEffect(() => {
        if (id) {
            getChat().then((result) => {
                getProfile(result.data[0].User1, result.data[0].User2)
            })
        }
        const timeId = setInterval(() => {
            if (id) {
                getChat()
            }
        }, 2000);

        return () => {
            clearInterval(timeId)
        }
    }, [id])

    useEffect(() => {
        if (id != undefined || id != null) {
            setTimeout(() => {
                bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
            }, 120)
        }
    }, [id])

    return (
        <div className='chat-box'>
            {
                id ? (
                    <div className='chat'>
                        <div className='head'>
                            {
                                image ?
                                    <img width={50} height={50} src={require('../../../images/profile/' + image)}></img>
                                    : null
                            }
                            <p>{username}&nbsp;&nbsp;<small>{status ? 'online' : `last seen at ${time}`}</small></p>
                        </div>
                        <div className='messages' ref={bottomRef}>
                            {
                                messages &&
                                messages.map((item, index) => (
                                    <div className='message-box' key={index}>
                                        {
                                            decodedToken &&
                                                item.sender == decodedToken.user ?
                                                <div className='message send'>
                                                    <p>{item.message}</p>
                                                </div>
                                                :
                                                <div className='message receive'>
                                                    <p>{item.message}</p>
                                                </div>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className='message-input'>
                            <button className='add'><i className='bi bi-plus-lg'></i></button>
                            <input type='text' value={message} onChange={handleMessage}></input>
                            <button className='send' onClick={sendMessage}><i className='bi bi-send-fill'></i></button>
                        </div>
                    </div>
                )
                    :
                    (
                        <div className='empty'>
                            <svg aria-label class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="100" role="img" viewBox="0 0 96 96" width="100">
                                <path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path>
                            </svg>
                            <p>Your Messages</p>
                        </div >
                    )
            }
        </div >
    )
}

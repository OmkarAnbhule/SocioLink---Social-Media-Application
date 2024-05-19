import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import ChatBox from './ChatBox'
import ChatProfile from './ChatProfile'


export default function ChatList() {
    const api = process.env.REACT_APP_API_URL;
    const [search, setSearch] = useState('');
    const [chatId, setChatId] = useState(null);
    const [searchBox, setSearchBox] = useState(false);
    const divRef = useRef(null)
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);

    const handleSearch = async () => {
        let result = await fetch(`${api}chat/search/${localStorage.getItem('id')}/${search}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json'
            }
        })
        result = await result.json();
        setUsers(result.data);
    }
    const handleBlur = () => {
        if (searchBox) {
            document.addEventListener('click', (e) => {
                if (divRef.current && !divRef.current.contains(e.target)) {
                    setSearchBox(false);
                    setSearch('')
                }
                else {
                    setSearchBox(true);
                }
            })
        }
    }

    const handleChatBox = async (id) => {
        let result = await fetch(`${api}chat/CreateChat`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: localStorage.getItem('id'),
                receiver: id
            })
        })
        result = await result.json();
        if (result.Response === 'Success') {
            setChatId(result.id)
        }
    }

    const getChats = async () => {
        let result = await fetch(`${api}chat/getChats/${localStorage.getItem('id')}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json'
            }
        })
        result = await result.json();
        if (result.Response === 'Success') {
            setChats(result.data)
        }
    }

    useEffect(() => {
        handleBlur()

        return () => {
            document.removeEventListener('click', (e) => {
                setSearchBox(false)
            })
        }
    }, [searchBox]);

    useEffect(() => {
        if (search != '') {
            handleSearch()
        }
        else {
            setUsers([])
        }
    }, [search])

    useEffect(() => {
        const id = setInterval(()=>{
            getChats()
        },2000)
        return () => {
            clearInterval(id)
        }
    }, [users])

    const handleChatId = (chatId) => {
        setChatId(chatId)
    }
    return (
        <div className='chat-root'>
            <div className='chatlist'>
                <div className='chat-search'>
                    <input type='text' placeholder='Search to find people...' onChange={(e) => setTimeout(() => setSearch(e.target.value), 1000)} onFocus={() => setSearchBox(true)} onBlur={handleBlur}></input>
                    {
                        searchBox &&
                        <div className='search-output' ref={divRef}>
                            {
                                users.length > 0 ?
                                    users.map((item, index) => (
                                        <div className='search-output-container' key={index} onClick={() => handleChatBox(item._id)}>
                                            <img width={50} height={50} src={require('../../../images/profile/' + item.image)}></img>
                                            <p>{item.username}</p>
                                            <button><i className='bi bi-chat-text-fill'></i></button>
                                        </div>
                                    ))

                                    :
                                    <div className='search-output-container'>
                                        <h4>Nothing Found..</h4>
                                    </div>
                            }
                        </div>
                    }
                </div>
                <>
                    {
                        chats.length > 0 &&
                        chats.map((item, index) => (
                            <ChatProfile data={item} callback={handleChatId} key={index} />
                        ))
                    }
                </>
            </div>
            <ChatBox id={chatId} />
        </div>
    )
}

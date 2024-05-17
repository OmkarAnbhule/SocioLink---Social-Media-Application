import React from 'react'
import './style.css'
import ChatBox from './ChatBox'
import ChatProfile from './ChatProfile'


export default function ChatList() {
    const obj = {
        username: 'someone',
        recent: 'sent some time ago',
        isRead: true
    }
    return (
        <div className='chat-root'>
            <div className='chatlist'>
                <h1>Chats</h1>
                <ChatProfile data={obj} />
            </div>
            <ChatBox id={true} />
        </div>
    )
}

import React from 'react'

export default function ChatProfile({ data }) {
    return (
        <div className='chatlist-container'>
            <div className='chat'>
                <div className='head'>
                    <img width={50} height={50}></img>
                </div>
                <div className='body'>
                    <p>{data.username}</p>
                    <p>{data.recent}&nbsp;&nbsp;<small>3h</small></p>
                </div>
                <div className='foot'>
                    {
                        data.isRead ? null : (
                            <div className='notification'></div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

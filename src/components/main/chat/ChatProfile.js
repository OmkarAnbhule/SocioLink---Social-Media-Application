import React, { useEffect, useState } from 'react'

export default function ChatProfile({ data, callback }) {
    const api = process.env.REACT_APP_API_URL;
    const [img, setImg] = useState('');
    const [username, setUsername] = useState('');
    const [time, setTime] = useState('');
    const [show, setShow] = useState(data.User1 == localStorage.getItem('id') ? data.isSenderRead : data.isReceiverRead);


    const getProfile = async () => {
        let result = await fetch(`${api}user/getProfile/${data.User1 == localStorage.getItem('id') ? data.User2 : data.User1}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        result = await result.json();
        console.log(result)
        setImg(result.data.image);
        setUsername(result.data.username);
        setTime(formatRelativeTime(result.data.lastLogged));
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
    

    useEffect(() => {
        getProfile()
    }, [])

    return (
        <div className='chatlist-container' onClick={() => { callback(data._id); setShow(true) }}>
            <div className='chat'>
                <div className='head'>
                    {
                        img ?
                            <img width={50} height={50} src={require('../../../images/profile/' + img)}></img>
                            : null
                    }
                </div>
                <div className='body'>
                    <p>{username}</p>
                    <p style={{ fontSize: '13px' }}>{data.recent ? data.recent : 'last seen at'}&nbsp;&nbsp;{time}</p>
                </div>
                <div className='foot'>
                    {
                        show ? null : (
                            <div className='notification'></div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { useJwt } from 'react-jwt';


export default function ChatProfile({ data, callback }) {
    const api = process.env.REACT_APP_API_URL;
    const { decodedToken, isExpired } = useJwt(localStorage.getItem('id'))
    const [img, setImg] = useState('');
    const [username, setUsername] = useState('');
    const [time, setTime] = useState('');
    const [show, setShow] = useState(decodedToken ? data.User1 === decodedToken.user ? data.isSenderRead : data.isReceiverRead : null);


    const getProfile = async () => {
        let result = await fetch(`${api}user/getProfile/${decodedToken ? data.User1 == decodedToken.user ? data.User2 : data.User1 : null}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json();
        console.log(result)
        if (result.Response === 'Success') {
            setImg(result.data.image);
            setUsername(result.data.username);
            setTime(formatRelativeTime(result.data.lastLogged));
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


    useEffect(() => {
        setTimeout(() => {
            if (decodedToken)
                getProfile()
        }, 1000)
    }, [decodedToken])

    return (
        <div className='chatlist-container' onClick={() => { callback(data._id); setShow(true) }}>
            <div className='chat'>
                <div className='head'>
                    {
                        img && decodedToken ?
                            <img width={50} height={50} src={img}></img>
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

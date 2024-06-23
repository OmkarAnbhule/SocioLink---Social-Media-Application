import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


export default function Profile() {
    const api = process.env.REACT_APP_API_URL;
    const { id } = useParams()
    const [user, setUser] = useState()
    const [post, setPost] = useState()

    const getPost = async () => {
        let result = await fetch(`${api}post/getUserPost/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json()
        return result;
    }

    const getUser = async () => {
        let result = await fetch(`${api}user/getProfile/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json()
        return result;
    }

    useEffect(() => {
        getUser().then((res) => {
            if (res.Response === 'Success') {
                setUser(res.data)
                getPost().then((res) => {
                    if (res.Response === 'Success') {
                        setPost(res.data)
                    }
                })
            }
        })
    }, [])

    if (user)
        return (
            <div className='profile-root'>
                <div className='head'>
                    <div className='profile'>
                        <p>{user.username}</p>
                        <img width={50} height={50} src={user.image}></img>
                    </div>
                    <div className='details'>
                        <div className='details-item'>
                            <p>{user && user.followers && user.followers.length} <br /> <b>Followers</b></p>
                        </div>
                        <div className='details-item'>
                            <p>{user && user.following && user.following.length} <br /> <b>Following</b></p>
                        </div>
                        <div className='details-item'>
                            <p>0 <br /> <b>Posts</b></p>
                        </div>
                    </div>
                </div>
                <div className='body'>
                    <div className='name'>
                        <p><b>Name:&nbsp;&nbsp;</b>{user.name}</p>
                    </div>
                </div>
                <div className='foot'>
                    <h1>Your Posts</h1>
                    <div className='container'>
                        {
                            post && post.map((item, index) => (
                                <div className='item' key={index} >
                                    {
                                        item.files[0].split('/').includes('image')
                                            ?
                                            <img
                                                src={item.files[0]}
                                                alt="Post"></img>
                                            :
                                            <video
                                                src={item.files[0]}
                                                alt="Post"></video>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div >
        )
}

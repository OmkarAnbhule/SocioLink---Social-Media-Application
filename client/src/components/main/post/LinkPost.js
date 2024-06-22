import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useParams } from 'react-router-dom'

export default function LinkPost() {
    const api = process.env.REACT_APP_API_URL;
    const { id } = useParams()
    const [post, setPost] = useState()
    const getPost = async () => {
        let result = await fetch(`${api}post/get-post/${id}`, {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
                'authorization':'Bearer '+localStorage.getItem('id')
            }
        })
        let data = await result.json()
        setPost(data.data)
    }
    useEffect(() => {
        getPost()
    }, [])
    return (
        <div className='single-post'>
            <div className='body'>
                {post &&
                    <Post data={post} />
                }
            </div>
        </div>
    )
}

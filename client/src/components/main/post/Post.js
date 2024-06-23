import React, { useEffect, useId, useRef, useState } from 'react'
import Comment from './Comment'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Post(props) {
    const api = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [scrollTop, setScrollTop] = useState(0);
    const divRef = useRef(null);
    const id = jwtDecode(localStorage.getItem('id')).user;
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [obj, setObj] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [isShowOptions, setIsShowOptions] = useState(false);
    const [time, setTime] = useState('');
    const ref = useRef(null);
    const handleScroll = () => {
        const parent = divRef.current;
        const scrollIndex = Math.round(parent.scrollLeft / parent.clientWidth);
        setScrollTop(scrollIndex);
        props.data.files.forEach((item) => {
            console.log(item)
            if (item.index === scrollIndex && !item.mimetype.startsWith('image/')) {
                ref.current.pause();
            }
        })
    }
    const handleClickScroll = (index) => {
        const parent = divRef.current;
        const child = document.getElementById(`post${index}`);
        parent.scrollTo({
            left: child.offsetLeft,
            behavior: 'smooth'
        });
    }

    const handleCommentSection = () => {
        setShowComments(!showComments);
    }

    const unfollow = async (target) => {
        let result = await fetch(`${api}user/unfollowUser`, {
            method: 'post',
            body: JSON.stringify({
                id: jwtDecode(localStorage.getItem('id')).user,
                target: target
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
    }

    const getComments = async () => {
        try {
            let result = await fetch(`${api}post/get-comments/${props.data._id}`, {
                method: 'get',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('id')
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
                setObj(result.data)
            }
        }
        catch (e) {

        }
    }

    const handleDeletePost = async () => {
        try {
            let reuslt = await fetch(`${api}post/deletePost/${props.data._id}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('id')
                }
            })
        }
        catch (e) {
            console.error(e)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(process.env.REACT_APP_COPY_URL + props.data._id)
        alert('Link Copied')
    }

    const handleComment = async (postId) => {
        try {
            let result = await fetch(`${api}post/addComment`, {
                method: 'post',
                body: JSON.stringify({
                    comment: comment,
                    username: props.data.id.username,
                    type: 'comment',
                    postId: postId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('id')
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
                setComment('')
                handleCommentSection()
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleLike = async () => {
        if (!isLike) {
            try {
                let result = await fetch(`${api}post/${props.data._id}/like/add/${id}`, {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('id')
                    }
                })
                result = await result.json()
                if (result.Response == 'Success') {
                    setIsLike(true)
                    props.data.likeCount++;
                }
            }
            catch (e) {

            }
        }
        else {
            try {
                let result = await fetch(`${api}post/${props.data._id}/like/remove/${id}`, {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json',
                        'authorization': 'Bearer ' + localStorage.getItem('id')
                    }
                })
                result = await result.json()
                if (result.Response == 'Success') {
                    setIsLike(false)
                    props.data.likeCount--;
                }
            }
            catch (e) {

            }
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
        if (props.data.likedUsers.includes(jwtDecode(localStorage.getItem('id')).user)) {
            setIsLike(true)
        }
        const id2 = setInterval(() => {
            getComments()
        }, 2000)
        return () => {
            clearInterval(id2)
            clearTimeout(id)
        }
    }, [])
    return (
        <div className='post'>
            <div className='head'>
                <div className='profile' onClick={() => navigate(`/profile/${props.data.id._id}`)}>
                    {props.data.id.image != '' ? <img src={props.data.id.image}></img> : ''}
                    <p>{props.data.id.username}&nbsp;<small>{formatRelativeTime(props.data.date)} ago at {props.data.location}</small></p>
                </div>
                <button onClick={() => setIsShowOptions(!isShowOptions)}><i className={isShowOptions ? 'bi bi-x-lg' : 'bi bi-three-dots-vertical'}></i></button>
                <div style={{ transform: isShowOptions ? 'scaleX(1)' : 'scaleX(0)' }} className='post-options'>
                    {props.data.id._id === jwtDecode(localStorage.getItem('id')).user ? null : <p onClick={() => unfollow(props.data.id._id)}>UnFollow</p>}
                    {props.data.id._id === jwtDecode(localStorage.getItem('id')).user ? <p onClick={handleDeletePost}>Delete Post</p> : null}
                    <p onClick={handleCopy}>Copy Link</p>
                    <p>About this account</p>
                </div>
            </div>

            <div className='media'>

                <div onScroll={handleScroll} id='scroll' ref={divRef}>
                    {
                        props.data.files.map((item, index) => (
                            <div id={`post${index}`} key={index}>
                                {
                                    item.split('/').includes('image')
                                        ?
                                        <img
                                            src={item}
                                            alt="Post"
                                            style={{
                                                filter: `
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].brightness != undefined ? `brightness(${props.data.filters[index].brightness}%)` : "brightness(100%)"} 
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].contrast != undefined ? `contrast(${props.data.filters[index].contrast}%)` : "contrast(100%)"}
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].saturation != undefined ? `saturate(${props.data.filters[index].saturation}%)` : "saturation(100%)"}
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].sepia != undefined ? `sepia(${props.data.filters[index].sepia}%)` : "sepia(100%)"}
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].grayscale != undefined ? `grayscale(${props.data.filters[index].grayscale}%)` : "grayscale(100%)"}
                                                    ${props.data.filters[index] != undefined && props.data.filters[index].invert != undefined ? `invert(${props.data.filters[index].invert}%)` : "invert(100%)"}`
                                            }}
                                        />
                                        :
                                        <>
                                            <video src={item}
                                                onClick={(e) => { if (e.target.paused) { e.target.play() } else { e.target.pause() } }}
                                                ref={ref}
                                            ></video>
                                            {
                                                ref.current ? (
                                                    <button className='btn-volume' onClick={() => { ref.current.muted = !ref.current.muted }}>
                                                        <i className={ref.current.muted ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill'} style={{ color: ref && ref.current.muted ? 'black' : 'white' }}>
                                                        </i>
                                                    </button>
                                                )
                                                    : null}

                                        </>
                                }
                            </div>
                        ))
                    }
                </div>
                <div>
                    {
                        props.data.files.map((item, index) => (
                            <p style={{ background: scrollTop === index ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.13)' }} key={index} onClick={() => handleClickScroll(index)}></p>
                        ))
                    }
                </div>
            </div>
            <div className='media_btn'>
                <p>{props.data.likeCount} likes</p>
                <div>
                    <button onClick={handleLike}><i className={isLike ? 'bi bi-heart-fill' : 'bi bi-heart'} style={{ color: isLike ? 'red' : '' }}></i></button>
                    <button onClick={handleCommentSection}><i className={showComments ? 'bi bi-chat-fill' : 'bi bi-chat-dots'} style={{ color: showComments ? 'cyan' : 'black' }} ></i></button>
                </div>
            </div>
            <div className='foot'>
                <div className='caption'>
                    <p>
                        {props.data.caption}
                    </p>
                </div>
                <div className='tags'>
                    {props.data.tags.split(',').map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                </div>
            </div>

            <div className='comment-section' style={{ transform: showComments ? 'scaleY(1)' : 'scaleY(0)', opacity: showComments ? '1' : '0' }}>
                <div className='comments-scroll'>
                    {
                        obj.map((comment, index) => (
                            <Comment comments={comment} index={index} level={0} key={'0' + index} />
                        ))
                    }
                </div>
                <div className='comment-input-section'>
                    <input type='text' placeholder='add your comment here...' value={comment} onChange={(e) => setComment(e.target.value)}></input>
                    <button onClick={() => handleComment(props.data._id)}>Comment</button>
                </div>
            </div>
        </div >
    )
}

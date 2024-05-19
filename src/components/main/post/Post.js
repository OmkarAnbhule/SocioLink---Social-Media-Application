import React, { useEffect, useId, useRef, useState } from 'react'
import Comment from './Comment'
import { useNavigate } from 'react-router-dom';

export default function Post(props) {
    const api = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [scrollTop, setScrollTop] = useState(0);
    const divRef = useRef(null);
    const [img, setImg] = useState('');
    const [username, setUsername] = useState('');
    const id = localStorage.getItem('id');
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
                host: localStorage.getItem('id'),
                target: target
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const getComments = async () => {
        try {
            let result = await fetch(`${api}post/get-comments/${props.data._id}`, {
                method: 'get',
                headers: {
                    'Content-type': 'application/json'
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
                    'Content-Type': 'application/json'
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
                    username: username,
                    type: 'comment',
                    postId: postId
                }),
                headers: {
                    'Content-Type': 'application/json'
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
                        'Content-type': 'application/json'
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
                        'Content-type': 'application/json'
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
        if (props.data.likedUsers.includes(localStorage.getItem('id'))) {
            setIsLike(true)
        }
        async function update() {
            let result = await fetch(`${api}user/getProfile/${localStorage.getItem('id')}`, {
                method: 'get',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
                setImg(result.data.image)
                setUsername(result.data.username)
                setTime(formatRelativeTime(props.data.date))
            }
        }
        const id = setTimeout(() => {
            update()
        }, 3000)
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
                <div className='profile'>
                    {img != '' ? <img src={require('../../../images/profile/' + img)}></img> : ''}
                    <p>{username}&nbsp;<small>{time}</small></p>
                </div>
                <button onClick={() => setIsShowOptions(!isShowOptions)}><i className={isShowOptions ? 'bi bi-x-lg' : 'bi bi-three-dots-vertical'}></i></button>
                <div style={{ transform: isShowOptions ? 'scaleX(1)' : 'scaleX(0)' }} className='post-options'>
                    {props.data.id === localStorage.getItem('id') ? null : <p onClick={() => unfollow(props.data.id)}>UnFollow</p>}
                    {props.data.id === localStorage.getItem('id') ? <p onClick={handleDeletePost}>Delete Post</p> : null}
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
                                    item.mimetype.startsWith('image/')
                                        ?
                                        <img
                                            src={require(`../../../images/posts/${item.filename}`)}
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
                                            <video src={require('../../../images/posts/' + item.filename)}
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
                    <button><i className='bi bi-send'></i></button>
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

            <div className='share-section'>
                <div className='share-user-container'>
                    <div className='share-user'>
                        <img width={50} height={50}></img>
                    </div>
                </div>
                <div className='share-section-btn'>
                    <button>Share</button>
                </div>
            </div>
        </div >
    )
}

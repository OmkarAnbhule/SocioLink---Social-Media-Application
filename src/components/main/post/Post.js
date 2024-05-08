import React, { useEffect, useId, useRef, useState } from 'react'
import Comment from './Comment'

export default function Post(props) {
    const api = process.env.REACT_APP_API_URL;
    const [scrollTop, setScrollTop] = useState(0);
    const divRef = useRef(null);
    const [img, setImg] = useState('');
    const [username, setUsername] = useState('');
    const id = useId()
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [obj,setObj] = useState([]);
    const obj1 = [
        {
            comment: 'this is a comment this is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a commentthis is a comment',
            username: 'kkk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'jk',
                    timestamp: '3092039230',
                    isReply: true,
                    replycount: 1,
                    Replies: [
                        {
                            comment: 'this is a reply2',
                            username: 'gk',
                            timestamp: '3092039230',
                            isReply: false,
                            replycount: 0,
                        }
                    ]
                }
            ]
        },
        {
            comment: 'this is a comment',
            username: 'hk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'ak',
                    timestamp: '3092039230',
                    isReply: false,
                    replycount: 0
                }
            ]
        },
        {
            comment: 'this is a comment',
            username: 'hk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'ak',
                    timestamp: '3092039230',
                    isReply: false,
                    replycount: 0
                }
            ]
        },
        {
            comment: 'this is a comment',
            username: 'hk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'ak',
                    timestamp: '3092039230',
                    isReply: false,
                    replycount: 0
                }
            ]
        },
        {
            comment: 'this is a comment',
            username: 'hk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'ak',
                    timestamp: '3092039230',
                    isReply: false,
                    replycount: 0
                }
            ]
        },
        {
            comment: 'this is a comment',
            username: 'hk',
            timestamp: '3092039230',
            isReply: true,
            replycount: 1,
            Replies: [
                {
                    comment: 'this is a reply',
                    username: 'ak',
                    timestamp: '3092039230',
                    isReply: false,
                    replycount: 0
                }
            ]
        }
    ]
    const handleScroll = () => {
        const parent = divRef.current;
        const scrollIndex = Math.round(parent.scrollLeft / parent.clientWidth);
        setScrollTop(scrollIndex);
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


    useEffect(() => {
        async function update() {
            let result = await fetch(`${api}user/getProfile/${props.data.id}`, {
                method: 'get',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
                setImg(result.data.image)
                setUsername(result.data.username)
            }
        }
        const id = setTimeout(() => {
            update()
        }, 1000)
        const id2 = setInterval(()=>{
            getComments()
        },2000)
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
                    <p>{username}</p>
                </div>
                <button><i className='bi bi-three-dots-vertical'></i></button>
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
                                            <video src={require('../../../images/posts/' + item.filename)}></video>
                                            <button className='btn-volume'>
                                                <i className='bi bi-volume-mute-fill'>
                                                </i>
                                            </button>
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
                <p>139495likes</p>
                <div>
                    <button><i className='bi bi-heart'></i></button>
                    <button onClick={handleCommentSection}><i className='bi bi-chat' ></i></button>
                    <button><i className='bi bi-send' ></i></button>
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

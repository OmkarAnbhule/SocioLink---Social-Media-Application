import React, { useEffect, useRef, useState } from 'react'

export default function Comment({ comments, index, level }) {
    const api = process.env.REACT_APP_API_URL;
    const margin = level * 20
    const [isReplyInputShow, setIsReplyInputShow] = useState(false);
    const [reply, setReply] = useState('');
    const replyInputRef = useRef(null);
    const [isLike, setIsLike] = useState(false);
    const [isShowReply, setIsShowReply] = useState(false);
    const [time, setTime] = useState('');
    const id = localStorage.getItem('id');

    const handleReply = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/^\s+/g, '');
        setReply(temp);
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

    const handleCommentReply = async () => {
        try {
            let result = await fetch(`${api}post/addComment`, {
                method: 'post',
                body: JSON.stringify({
                    comment: reply,
                    username: comments.username,
                    type: 'reply',
                    objId: comments._id,
                    postId: comments.postId,
                    index: index,
                    level: level
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':'Bearer '+localStorage.getItem('id')
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleDelete = async()=> {
        let result = await fetch(`${api}post/delete-comment/${comments._id}/${level}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'authorization':'Bearer '+localStorage.getItem('id')
            }
        })
        result = await result.json();
        if (result.Response == 'Success') {
        }
    }

    const handleLike = async () => {
        if (!isLike) {
            let result = await fetch(`${api}post/like-comment`, {
                method: 'put',
                body: JSON.stringify({
                    commentId: comments._id,
                    index: index,
                    level: level,
                    username: id,
                    method: 'add'
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':'Bearer '+localStorage.getItem('id')
                }
            })
            result = await result.json();
            if (result.Response == 'Success') {
                setIsLike(true);
                comments.likeCount++;
            }
        }
        else {
            let result = await fetch(`${api}post/like-comment`, {
                method: 'put',
                body: JSON.stringify({
                    commentId: comments._id,
                    index: index,
                    level: level,
                    username: id,
                    method: 'remove'
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':'Bearer '+localStorage.getItem('id')
                }
            })
            result = await result.json();
            if (result.Response == 'Success') {
                setIsLike(false);
                comments.likeCount--;
            }
        }
    }

    const handleReplyShow = () => {
        setIsReplyInputShow(true);
        setTimeout(() => {
            replyInputRef.current.focus();
        }, 10)
    }
    useEffect(() => {
        setTime(formatRelativeTime(comments.timestamp));
        if (comments.likedUsers && comments.likedUsers.length > 0)
            setIsLike(comments.likedUsers.includes(id))
    }, []);
    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ marginLeft: margin + 'px' }} className='comment'>
                <p className='username'>{comments.username}&nbsp;<small style={{ fontSize: '12px' }}>{time}</small></p>
                <p className='text'>{comments.comment}</p>
                <div className='btn-grp'>
                    <button className='btn-reply' onClick={handleReplyShow}>Reply</button>
                    <button className='btn-like' onClick={handleLike} style={{ color: isLike ? 'red' : 'black' }}><i className={isLike ? 'bi bi-heart-fill' : 'bi bi-heart'}></i><p className='like-count'>{comments.likeCount == 0 && !isLike ? '' : comments.likeCount}</p></button>
                    <button className='btn-delete' onClick={handleDelete}><i className='bi bi-trash-fill'></i></button>
                </div>

            </div>
            {
                comments.isReply && !isShowReply && comments.replyCount > 0 ? (
                    <div className='reply-show-btn' style={{ marginLeft: margin + 'px' }}>
                        <button onClick={() => setIsShowReply(true)}>Show Replies ({comments.replyCount})</button>
                    </div>
                )
                    :
                    comments.replyCount > 0 ?
                        (<div className='reply-show-btn' style={{ marginLeft: margin + 'px' }}>
                            <button onClick={() => setIsShowReply(false)}>Hide Replies</button>
                        </div>) :
                        null
            }
            {
                isReplyInputShow ?
                    <div className='reply-input' style={{ marginLeft: margin + 'px' }} >
                        <input type='text' placeholder='Reply' value={reply} tabIndex={0} ref={replyInputRef} onBlur={() => { setTimeout(() => { setIsReplyInputShow(false) }, 2000) }} onChange={handleReply} />
                        <button className='btn-reply' onClick={handleCommentReply}>{`Reply to ${comments.username}`}</button>
                    </div>
                    : null
            }
            {
                comments.isReply && isShowReply ? (
                    comments.Replies.map((reply, index) => (
                        <Comment comments={reply} level={level + 1} index={index} key={`${level}${index}`} />
                    ))
                )
                    : null
            }
        </div>
    )
}

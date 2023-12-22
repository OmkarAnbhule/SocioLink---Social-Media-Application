import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import pip from '../../images/defaults/create_post.jpg'

export default function CreatePost() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const isLoggedin = localStorage.getItem('login')
    const [files, setfiles] = useState([])
    const [fileId, setFileId] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [isZooming, setZooming] = useState(false)
    const containerRef = useRef(null)
    const [draggedItem, setDraggedItem] = useState('')
    const [dragId, setDragId] = useState()
    const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
    const check_login = () => {
        if (isLoggedin != 'true')
            navigate('/login')
        else {
            verify_user()
        }
    }
    const verify_user = () => {
        const path = window.location.pathname
        const part = path.slice(1, 5)
        console.log(part)
        if (part != localStorage.getItem('key')) {
            navigate('/main')
        }
    }

    const handleMouseDown = () => {
        setZooming(true)
        const handleMouseUp = () => {
            setZooming(false)
            setZoom(1)
        }
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }
    

    const handleDragStart = (e, item, i) => {
        console.log('dragStart')
        setDraggedItem(item)
        setDragId(i)
    }
    const handleDragOver = (e) => {
        console.log('DragOver')
        e.preventDefault()
    }
    const handleDrop = (e, targetitem, i) => {
        console.log('Drop', dragId, i)
        e.preventDefault()

        const updatedItems = files.map((item, index) => {
            if (index === i) {
                return draggedItem
            }
            else if (index === dragId) {
                return targetitem
            }
            return item
        })

        setfiles(updatedItems)
        setDraggedItem(null)
    }
    useEffect(() => {
        check_login()
    }, [])
    useEffect(() => {
        setFileId(files.length - 1)
    }, [files])
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => {
            return file.type.startsWith('image/') || file.type.startsWith('video/');
        });

        setfiles(prevFiles => [...prevFiles, ...validFiles]);
    };
    const selectFile = (i) => {
        setFileId((files.length - 1) - i)
    }
    const zoomin = (e) => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - containerRect.left) / containerRect.width;
    const y = (e.clientY - containerRect.top) / containerRect.height;
    setClickCoordinates({ x, y });
        setZoom(prev => prev * 2)
    }
    const removeItem = (i) => {
        setfiles(
            files.filter((item, index) => (files.length - 1) - index !== i)
        )
    }
    const filteredFiles = files.filter((item, index) => index === fileId)
    return (
        <div className='create'>
            <h1>Create Your Post</h1>
            <div className='caption'>
                <h3>Write your caption</h3>
                <textarea cols={90} rows={8} placeholder='something about your post...'></textarea>
            </div>
            <div className='post'>
                <div>
                    {files.length < 1 ? (<label htmlFor='file'><img src={pip} width={300} height={300} style={{ transform: zoom }}></img></label>) : null}
                    <input type='file' id='file' style={{ display: 'none' }} onChangeCapture={handleFileChange} accept='image/*,video/*' multiple></input>
                    {files.length > 0 ? (<div className='display' ref={containerRef}>
                        {filteredFiles.map((item, index) => (
                            item.type.startsWith('image/') ? (
                                <img width={300} height={300} src={URL.createObjectURL(item)} key={index} onDoubleClick={zoomin} style={{ transform: `scale(${zoom})` }} draggable={false} onMouseDown={handleMouseDown}></img>
                            ) :
                                (<video width={500} height={350} src={URL.createObjectURL(item)} key={index} autoPlay></video>)
                        ))}
                    </div>) : null}
                </div>
                <div className='selected_files'>
                    {
                        files.toReversed().map((file, index) => (
                            file.type.startsWith('image/') ? (<div key={index} className='media-control' style={{ border: (files.length - 1) - index === fileId ? '4px solid cyan' : '2px solid black' }} onDragStart={(e) => handleDragStart(e, file, ((files.length - 1) - index))} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, file, ((files.length - 1) - index))} draggable onClick={() => selectFile(index)}><i className='bi bi-pencil-square'></i><i className='bi bi-x-circle' onClick={() => removeItem(index)} ></i><img width={50} height={50} src={URL.createObjectURL(file)}></img></div>) : (<div className='media-control' key={index} style={{ border: (files.length - 1) - index === fileId ? '4px solid cyan' : '2px solid black' }} ><i className='bi bi-pencil-square'></i><i className='bi bi-x-circle' onClick={() => removeItem()}></i><video width={50} height={50} src={URL.createObjectURL(file)}></video></div>)
                        ))
                    }
                    {files.length > 0 ? (<label htmlFor='file'><i className='bi bi-plus-circle'></i></label>) : null}
                </div>
            </div>
            <div className='details'>3</div>
            <div className='links'>4</div>
            <div className='btn'>5</div>
        </div>
    )
}
import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../web_components/loader/Loader'
import { jwtDecode } from 'jwt-decode'

export default function CreatePost() {
    const api = process.env.REACT_APP_API_URL;
    const navigate = useNavigate()
    const isLoggedin = localStorage.getItem('login')
    const [files, setfiles] = useState([])
    const [fileId, setFileId] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [isZooming, setZooming] = useState(false)
    const containerRef = useRef(null)
    const [draggedItem, setDraggedItem] = useState('')
    const [dragId, setDragId] = useState()
    const [tags, setTags] = useState()
    const [tagArr, setTagArr] = useState([])
    const [tagId, setTagId] = useState()
    const [caption, setCaption] = useState()
    const [border, setBorder] = useState()
    const [editFlag, setEditFlag] = useState(false)
    const [location, setLocation] = useState()
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [sepia, setSepia] = useState(0)
    const [saturation, setSaturation] = useState(100)
    const [grayscale, setGrayscale] = useState(0)
    const [invert, setInvert] = useState(0)
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [dropDown, setDropDown] = useState('block')
    const [filterArr, setFilterArr] = useState({});
    const dict = ['Bihar', 'Chhattisgarh', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Goa',
        'Punjab', 'Mizoram', 'West Bengal', 'Haryana', 'Himachal Pradesh', 'Tripura', 'Arunachal Pradesh',
        'Gujarat', 'Manipur', 'Assam', 'Jharkhand', 'Kerala', 'Rajasthan', 'Madhya Pradesh',
        'Tamil Nadu', 'Odisha', 'Nagaland', 'Sikkim', 'Uttar Pradesh', 'Meghalaya', 'Telangana',
        'Uttarakhand', 'Delhi', 'Jammu & Kashmir', "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Jaipur", "Lucknow",
        "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
        "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar",
        "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada",
        "Jodhpur", "Madurai", "Raipur", "Kota", "Chandrapur", "Guwahati", "Solapur", "Hubli-Dharwad", "Bareilly", "Moradabad",
        "Mysuru", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Mira-Bhayandar", "Warangal",
        "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Cuttack"

    ]
    const check_login = () => {
        if (isLoggedin != 'true') {
            navigate('/login')
        }
        else {
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

    const handleLocationChange = async (e) => {
        setLocation(e.target.value)
        setDropDown('block')
        let result = await fetch(`${api}fetch-location`, {
            method: 'post',
            body: JSON.stringify({ query: location }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        }
        )
        result = await result.json()
        displayLocation(result)
    }
    const displayLocation = (res) => {
        console.log(res.Response)
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
    const handleTags = (e) => {
        const newInputValue = e.target.value;

        // Check if the new input ends with '#'
        if (newInputValue.endsWith('#')) {
            // Clear the input value if it ends with '#'
            setTags('#');
            if (editFlag) {
                const tmpArr = [...tagArr]
                const newTag = newInputValue.slice(0, -1).trim();
                tmpArr[tagId] = newTag
                if (newInputValue.length <= 1 || newTag == '' || newTag === '#') {

                }
                else {
                    setTagArr(tmpArr)
                    setTagId('')
                    setEditFlag(false)
                }
            }
            else {
                const newTag = newInputValue.slice(0, -1).trim();
                if (newInputValue.length <= 1 || newTag == '' || newTag === '#') {
                }
                else {
                    setTagArr(prevTags => [...prevTags, newTag]);
                }
            }
        }
        else {
            // Update the input value if it doesn't end with '#'
            setTags(newInputValue);
        }

    }
    const selectTag = (index) => {
        setTags(tagArr[index])
        setTagId(index)
        setEditFlag(true)
    }
    const removeTag = (i) => {
        if (tagArr[i] == tags) {
            setTags('')
        }
        setTagArr(
            tagArr.filter((item, index) => (index !== i))
        )
    }
    const handleMouseEnter = (i) => {
        setBorder(i)
    }
    const handleMouseLeave = () => {
        setBorder('')
    }
    useEffect(() => {
        check_login()
    }, [])
    useEffect(() => {
        setFileId(files.length - 1)
    }, [files])
    const handleBrightness = (e) => {
        setBrightness(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'brightness': brightness
            },
        }))
        console.log(filterArr)
    }
    const handleContrast = (e) => {
        setContrast(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'contrast': contrast,
            },
        }))
        console.log(filterArr)

    }
    const handleSepia = (e) => {
        setSepia(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'sepia': sepia,
            },
        }))
        console.log(filterArr)

    }
    const handleSaturation = (e) => {
        setSaturation(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'saturation': saturation,
            },
        }))
        console.log(filterArr)

    }
    const handleGrayscale = (e) => {
        setGrayscale(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'grayscale': grayscale,
            },
        }))
        console.log(filterArr)

    }
    const handleInvert = (e) => {
        setInvert(e.target.value)
        setFilterArr((prevobj) => ({
            ...prevobj,
            [fileId]: {
                ...prevobj[fileId],
                'invert': invert,
            },
        }))
        console.log(filterArr)

    }
    const blurImage = async () => {
        try {
            const formData = FormData()
            formData.append('image', filteredFiles[0])
            let result = await fetch(`${api}blur_image`, {
                method: 'post',
                body: formData,
            })
            result = await result.json()
            displayImage(result.img)
        }
        catch (e) {
            console.error(e)
        }
    }
    const displayImage = (img) => {
        filteredFiles[0] = img
        console.log(filteredFiles, img)
    }
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => {
            return file.type.startsWith('image/') || file.type.startsWith('video/');
        });
        setfiles(prevFiles => [...prevFiles, ...validFiles]);
    };
    const selectFile = (i) => {
        setFileId((files.length - 1) - i)
        setBrightness(100)
        setContrast(100)
        setSepia(0)
        setSaturation(100)
        setGrayscale(0)
        setInvert(0)
    }
    const zoomin = (e) => {
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - containerRect.left) / containerRect.width;
        const y = (e.clientY - containerRect.top) / containerRect.height;
        setZoom(prev => prev * 2)
    }
    const removeItem = (i) => {
        setfiles(
            files.filter((item, index) => (files.length - 1) - index !== i)
        )
    }
    const filteredFiles = files.filter((item, index) => index === fileId)

    const handleCaptionChange = (e) => {
        setCaption(e.target.value)
    }

    const selectLocation = (item) => {
        setLocation(item)
        setDropDown('none')
    }
    const handleApplyAll = () => {
        for (let i = files.length - 1; i >= 0; i--) {
            setFilterArr((prevobj) => ({
                ...prevobj,
                [i]: {
                    ...prevobj[i],
                    'brightness': brightness,
                    'grayscale': grayscale,
                    'contrast': contrast,
                    'saturation': saturation,
                    'invert': invert,
                    'sepia': sepia
                }
            }))
        }
    }
    const handleSubmitPost = async () => {
        setIsLoading(true)
        const formData = new FormData()
        const jsonString = JSON.stringify(filterArr)
        for (var item of files.toReversed())
            formData.append('files', item)
        formData.append('id', jwtDecode(localStorage.getItem('id')).user)
        formData.append('filters', jsonString)
        formData.append('caption', caption)
        formData.append('location', location)
        formData.append('tags', tagArr)
        let result = await fetch(`${api}post/createPost`, {
            method: 'post',
            body: formData,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('id')
            }
        })
        result = await result.json()
        displayResult(result)
    }
    const displayResult = (result) => {
        if (result.Response == 'Success') {
            setIsLoading(false)
            navigate('/main', {
                state: {
                    id: localStorage.getItem('id')
                },
                msg: {
                    create: 'Success'
                }
            })
        }
        else {

        }
    }
    const reset = () => {
        setCaption('')
        setLocation('')
        setTagArr([])
        setfiles([])
        setFilterArr({})
        setBrightness(100)
        setContrast(100)
        setSaturation(100)
        setSepia(0)
        setInvert(0)
        setGrayscale(0)
    }
    return (
        <div className='create'>
            <h1>Create Your Post</h1>
            <div className='caption'>
                <h3>Write your caption</h3>
                <textarea cols={90} rows={8} placeholder='something about your post...' onChange={handleCaptionChange} value={caption}></textarea>
            </div>
            <div className='post'>
                <div>
                    {files.length < 1 ? (<label htmlFor='file'><img src={'https://res.cloudinary.com/dvpmx2xxb/image/upload/v1719130562/ieg4mghlzrmkmyppu1kg.jpg'} width={300} height={300} style={{ transform: zoom }}></img></label>) : null}
                    <input type='file' id='file' style={{ display: 'none' }} onChangeCapture={handleFileChange} accept='image/*,video/*' multiple></input>
                    {files.length > 0 ? (<div className='display' ref={containerRef}>

                        {filteredFiles.map((item, index) => (
                            item.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(item)} key={index} onDoubleClick={zoomin} style={{ transform: `scale(${zoom})`, filter: `contrast(${contrast}%) grayscale(${grayscale}%) invert(${invert}%) saturate(${saturation}%) sepia(${sepia}%) brightness(${brightness}%)` }} draggable={false} onMouseDown={handleMouseDown}></img>
                            ) :
                                (<video src={URL.createObjectURL(item)} key={index} draggable={false} onClick={(e) => { if (e.target.paused) { e.target.play() } else { e.target.pause() } }} style={{ transform: `scale(${zoom})`, filter: `contrast(${contrast}%) grayscale(${grayscale}%) invert(${invert}%) saturate(${saturation}%) sepia(${sepia}%) brightness(${brightness}%)` }} ></video>)
                        ))}
                    </div>) : null}
                    {files.length < 1 ? null : (<i class="bi bi-layers-fill" onClick={handleApplyAll}></i>)}
                </div>
                <div className='selected_files'>
                    {
                        files.toReversed().map((file, index) => (
                            file.type.startsWith('image/') ?
                                (
                                    <div key={index} className='media-control' style={{ border: (files.length - 1) - index === fileId ? '4px solid cyan' : '2px solid black' }} onDragStart={(e) => handleDragStart(e, file, ((files.length - 1) - index))} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, file, ((files.length - 1) - index))} draggable onClick={() => selectFile(index)}>
                                        <i className='bi bi-pencil-square'></i>
                                        <i className='bi bi-x-circle' onClick={() => removeItem(index)} ></i>
                                        <img width={50} height={50} src={URL.createObjectURL(file)}></img>
                                    </div>
                                )
                                :
                                (
                                    <div key={index} className='media-control' style={{ border: (files.length - 1) - index === fileId ? '4px solid cyan' : '2px solid black' }} onDragStart={(e) => handleDragStart(e, file, ((files.length - 1) - index))} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, file, ((files.length - 1) - index))} draggable onClick={() => selectFile(index)}>
                                        <i className='bi bi-pencil-square'></i>
                                        <i className='bi bi-x-circle' onClick={() => removeItem(index)}></i>
                                        <video width={50} height={50} src={URL.createObjectURL(file)}></video>
                                    </div>
                                )
                        ))
                    }
                    {files.length > 0 ? (<label htmlFor='file'><i className='bi bi-plus-circle'></i></label>) : null}
                </div>
            </div>
            <div className='details'>
                <div className="input-control">
                    <input type="text" placeholder="Pick your location..." onChange={handleLocationChange} value={location} />
                    {location !== '' && location !== undefined ? (<div style={{ display: dropDown }}>
                        {
                            dict.map((item, index) => ((item.toLowerCase().includes(location.toLowerCase())) ? <p onClick={() => selectLocation(item)} key={index}>{item}</p> : null))
                        }
                    </div>) : null}
                </div>
                <div className="tags-control">
                    <div>
                        <h4>Your Tags:</h4>
                        {
                            tagArr.length == 0 ? <b>None</b> :
                                tagArr.map((item, index) => (
                                    <p style={{ border: tagId === index ? '3px solid cyan' : border === index ? '2px solid black' : '2px solid gray' }} onMouseEnter={() => { handleMouseEnter(index) }} onMouseLeave={() => handleMouseLeave(index)} ><i className='bi bi-x-lg' onClick={() => removeTag(index)}></i><p onClick={() => selectTag(index)} key={index}>{item}</p></p>
                                ))
                        }
                    </div>
                    <input type="text" onChange={handleTags} placeholder="Add # before and end of tag... " value={tags} />
                </div>
            </div>
            {
                files.length == 0 ? null : (
                    <div className='filters'>
                        <div className='tabs'>
                            <p onClick={() => setShow(false)} style={{ background: show ? 'white' : '#B7E3FF' }}>Basic Effects</p>
                            <p onClick={() => setShow(true)} style={{ background: !show ? 'white' : '#B7E3FF' }}>Advanced Combinations</p>
                        </div>
                        <div className='content'>
                            <div className='basic-effects' style={{ display: show ? 'none' : 'grid' }}>
                                <div className='range-control'>
                                    <p>Brightness</p>
                                    <input type='range' min={100} max={200} onChange={handleBrightness} value={filterArr[fileId] ? (filterArr[fileId].brightness ? filterArr[fileId].brightness : brightness) : brightness}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].brightness ? filterArr[fileId].brightness - 100 : brightness - 100 : brightness - 100}%</p>
                                </div>
                                <div className='range-control'>
                                    <p>Contrast</p>
                                    <input type='range' min={100} max={200} onChange={handleContrast} value={filterArr[fileId] ? filterArr[fileId].contrast ? filterArr[fileId].contrast : contrast : contrast}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].contrast ? filterArr[fileId].contrast - 100 : contrast - 100 : contrast - 100}%</p>
                                </div>
                                <div className='range-control'>
                                    <p>Sepia</p>
                                    <input type='range' onChange={handleSepia} value={filterArr[fileId] ? filterArr[fileId].sepia ? filterArr[fileId].sepia : sepia : sepia}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].sepia ? filterArr[fileId].sepia : sepia : sepia}%</p>
                                </div>
                                <div className='range-control'>
                                    <p>Saturation</p>
                                    <input type='range' min={100} max={200} onChange={handleSaturation} value={filterArr[fileId] ? filterArr[fileId].saturation ? filterArr[fileId].saturation : saturation : saturation}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].saturation ? filterArr[fileId].saturation - 100 : saturation - 100 : saturation - 100}%</p>
                                </div>
                                <div className='range-control'>
                                    <p>Grayscale</p>
                                    <input type='range' onChange={handleGrayscale} value={filterArr[fileId] ? filterArr[fileId].grayscale ? filterArr[fileId].grayscale : grayscale : grayscale}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].grayscale ? filterArr[fileId].grayscale : grayscale : grayscale}%</p>
                                </div>
                                <div className='range-control'>
                                    <p>Invert</p>
                                    <input type='range' onChange={handleInvert} value={filterArr[fileId] ? filterArr[fileId].invert ? filterArr[fileId].invert : invert : invert}></input>
                                    <p>{filterArr[fileId] ? filterArr[fileId].invert ? filterArr[fileId].invert : invert : invert}%</p>
                                </div>
                            </div>
                        </div>
                    </div>)
            }
            <div className='btn'><button onClick={handleSubmitPost}>Submit {isLoading ? <div> <Loader display={'block'} /></div> : null} </button> <button onClick={reset}>Clear</button></div>
        </div >
    )
}
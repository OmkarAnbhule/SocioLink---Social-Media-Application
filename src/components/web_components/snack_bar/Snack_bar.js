import React, { useState, useEffect, useRef } from 'react'
import './Snack_bar.css'

export default function Snack_bar(props) {
    const [icon,seticon] = useState('');
    const [style, setstyle] = useState({
        transform: 'scaleX(0)',
        display: 'grid',
        pdisplay:'none'
    })
    const isMountingRef = useRef();
    const type = () =>{
        if(props.type=='Success')
        {
            setstyle({
                background:'limegreen',
            })
            seticon('bi bi-check-circle-fill');
        }
        if(props.type=='Warning')
        {
            setstyle({
                background:'orange'
            })
            seticon('bi bi-exclamation-triangle-fill');
        }
        if(props.type=='Failed')
        {
            setstyle({
                background:'red',
            })
            seticon('bi bi-exclamation-circle-fill');
        }
        if(props.type=='Info')
        {
            setstyle({
                background:'rgb(0, 195, 255)',
            })
            seticon('bi bi-info-circle-fill');
        }
    }
    useEffect(()=>{
        isMountingRef.current = true;
    },[])
    useEffect(()=>{
        if(!isMountingRef.current){
        setstyle({
            transform: 'scaleX(1)',
            display:'grid',
            pdisplay:'block',
        })
        progress_bar()
    }
    else{
        isMountingRef.current = false
    }
    },[props.type])
    const progress_bar = () => {
        setstyle({
            transform: 'scaleX(1)',
            display:'grid',
            pdisplay:'block'
        })
        type();
        setTimeout(()=>{
            display()
        },4000)
    }
    const display = () => {
        setstyle({
            display:'none',
            pdisplay:'block',
            transform:'scaleX(0)'
        })
    }
    
    // useEffect(() => {
    //     console.log('effect')
    //     if (count >= 350) return;
    //     const id = setInterval(() => {
    //         setcount((count) => count + 1);
    //         console.log('interval')
    //     }, 10);
    //     return () => {console.log('return');clearInterval(id);}
    // }, [ count ]);
    return (
        <div className='Snack_bar' style={{ display: style.display,background:style.background}}>
            <button style={{display:'none'}} ref={props.refer} onClick={progress_bar}>cli</button>
            <div className='text'><i className={icon}></i><>{props.message}</></div>
            <div className='close' onClick={display}><i className='bi bi-x-circle' ></i></div>
            <div className='progress' style={{ transform: style.transform , display:style.display }}></div>
        </div>
    )
}

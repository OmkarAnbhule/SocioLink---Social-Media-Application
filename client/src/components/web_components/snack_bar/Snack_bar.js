import React, { useState, useEffect, useRef, useTransition } from 'react'
import './Snack_bar.css'

export default function Snack_bar(props) {
    const [icon, seticon] = useState('');
    const [isPending,startTransition] = useTransition();
    const [style, setstyle] = useState({
        transform: 'scaleX(0)',
        display: 'grid',
        pdisplay: 'none'
    })
    const isMountingRef = useRef();
    const type = () => {
        if (props.type == 'Success') {
            startTransition(()=>{
                setstyle({
                    background: 'limegreen',
                    transform: 'scaleX(1)',
                    display: 'grid',
                    pdisplay: 'block'
                })
            })
            seticon('bi bi-check-circle-fill');
        }
        if (props.type == 'Warning') {
            startTransition(()=>{
                setstyle({
                    background: 'orange',
                    transform: 'scaleX(1)',
                    display: 'grid',
                    pdisplay: 'block'
                })
            })
            seticon('bi bi-exclamation-triangle-fill');
        }
        if (props.type == 'Failed') {
            startTransition(()=>{
                setstyle({
                    background: 'red',
                    transform: 'scaleX(1)',
                    display: 'grid',
                    pdisplay: 'block'
                })  
            })
            seticon('bi bi-exclamation-circle-fill');
        }
        if (props.type == 'Info') {
            startTransition(()=>{
                setstyle({
                    background: 'rgb(0, 195, 255)',
                    transform: 'scaleX(1)',
                    display: 'grid',
                    pdisplay: 'block'
                })
            })
            seticon('bi bi-info-circle-fill');
        }
    }
    useEffect(() => {
        isMountingRef.current = true;
    }, [])
    useEffect(() => {
            startTransition(()=>{
                setstyle({
                transform: 'scaleX(1)',
                display: 'grid',
                pdisplay: 'block',
            })
            })
            progress_bar()
    }, [props.type])
    const progress_bar = () => {
        startTransition(()=>{
                setstyle({
                transform: 'scaleX(1)',
                display: 'grid',
                pdisplay: 'block',
            })
            })
        type();
        setTimeout(() => {
            display()
        }, 5000)
    }
    const display = () => {
        setstyle({
            display: 'none',
            pdisplay: 'block',
            transform: 'scaleX(0)'
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
        <div className='Snack_bar' key={props.key} style={{ display: style.display, background: style.background }}>
            <button style={{ display: 'none' }} ref={props.refer} onClick={progress_bar}>cli</button>
            <div className='text'><i className={icon}></i><>{props.message}</></div>
            <div className='close' onClick={display}><i className='bi bi-x-circle' ></i></div>
            <div className='progress' style={{ transform: style.transform, display: style.display }}></div>
        </div>
    )
}

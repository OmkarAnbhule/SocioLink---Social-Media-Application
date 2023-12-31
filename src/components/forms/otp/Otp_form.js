import React, { useEffect, useRef, useState } from 'react'
import './Otp_form.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Snack_bar from '../../web_components/snack_bar/Snack_bar';
export default function Otp_form() {
    const { state } = useLocation();
    const { email, name, username, password, login, forgot_password } = state;
    const { log_id, log_val, log_pass } = login
    const { fp_email, fp_val } = forgot_password
    const navigate = useNavigate();
    const [first, setfirst] = useState();
    const [second, setsecond] = useState();
    const [third, setthird] = useState();
    const [fourth, setfourth] = useState();
    const [fifth, setfifth] = useState();
    const [sixth, setsixth] = useState();
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);

    const [msg, setmsg] = useState({
        display: 'none',
    })
    const [tstyle, setTstyle] = useState({
        display: 'block',
        background: 'rgba(29, 38, 41, 0.3)',
        btn: true
    })
    const [type, settype] = useState('')
    const [message, setmessage] = useState('')
    const inputref1 = useRef(null);
    const inputref2 = useRef(null);
    const inputref3 = useRef(null);
    const inputref4 = useRef(null);
    const inputref5 = useRef(null);
    const inputref6 = useRef(null);
    const handleChange1 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setfirst(temp)
        if (temp.length > 1) {
            setfirst(e.target.value % 10);
        }
        if (temp == '') {
            inputref1.current.focus();
        }
        else {
            inputref2.current.focus();
        }

    }

    const handleChange2 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setsecond(temp)
        if (temp.length > 1) {
            setsecond(e.target.value % 10);
        }
        if (temp == '') {
            inputref2.current.focus();
        }
        else {
            inputref3.current.focus();
        }
    }
    const handleChange3 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setthird(temp)
        if (temp.length > 1) {
            setthird(e.target.value % 10);
        }
        if (temp == '') {
            inputref3.current.focus();
        }
        else {
            inputref4.current.focus();
        }
    }
    const handleChange4 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setfourth(temp)
        if (temp.length > 1) {
            setfourth(e.target.value % 10);
        }
        if (temp == '') {
            inputref4.current.focus();
        }
        else {
            inputref5.current.focus();
        }

    }
    const handleChange5 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setfifth(temp)
        if (temp.length > 1) {
            setfifth(e.target.value % 10);
        }
        if (temp == '') {
            inputref5.current.focus();
        }
        else {
            inputref6.current.focus();
        }

    }
    const handleChange6 = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/[^0-9]/g, '');
        setsixth(temp)
        if (temp.length > 1) {
            setsixth(e.target.value % 10);
        }
        if (temp == '') {
            inputref6.current.focus();
        }
    }
    const handleReset = async () => {
        if (fp_email != '') {
            let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);
            if(email_valid)
            {
            try {
                console.log('yup1')
                let result = await fetch(
                    'http://localhost:5000/validate_user', {
                    method: "post",
                    body: JSON.stringify({ email: fp_email, val: fp_val }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json();
                display_data1(result)
            }
            catch (e) {
            }
        }
        else{

        }
        }
        else {
            if (log_id != '') {
                let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);
                if(email_valid)
                {
                try {
                    console.log('yup1')
                    let result = await fetch(
                        'http://localhost:5000/login', {
                        method: "post",
                        body: JSON.stringify({ log_id, val: log_val, password: log_pass }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    result = await result.json();
                    display_data1(result)
                }
                catch (e) {
                }
            }
            else{
                try {
                    console.log('yup1')
                    let result = await fetch(
                        'http://localhost:5000/login_sms', {
                        method: "post",
                        body: JSON.stringify({log_id, val: log_val, password: log_pass }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    result = await result.json();
                    display_data1(result)
                }
                catch (e) {
                }
            }
            }
            else {
                let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);
                if(email_valid)
                {
                try {
                    console.log('yup1')
                    let result = await fetch(
                        'http://localhost:5000/register', {
                        method: "post",
                        body: JSON.stringify({ email }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    result = await result.json();
                    display_data1(result)
                }
                catch (e) {
                }
            }
        
        else{
            try {
                console.log('yup1')
                let result = await fetch(
                    'http://localhost:5000/sms', {
                    method: "post",
                    body: JSON.stringify({ email }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                result = await result.json();
                display_data1(result)
            }
            catch (e) {
            }
        }
    }
        }
    }
    const handleClick = async () => {
        let otp = first + second + third + fourth + fifth + sixth;
        console.log(otp)
        if (otp.length < 6 || isNaN(otp)) {
            display_data('empty')
        }

        else {
            if (fp_email != '') {
                let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(log_id);
                if(email_valid)
                {
                    try {
                        console.log('yup')
                        let result = await fetch(
                            'http://localhost:5000//validate_otp', {
                            method: "post",
                            body: JSON.stringify({ text:fp_email, otp }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        result = await result.json();
                        display_data(result)
                    }
                    catch (e) {
                    }
                }
                else{
                    try {
                        console.log('yup')
                        let result = await fetch(
                            'http://localhost:5000//validate_otp', {
                            method: "post",
                            body: JSON.stringify({ text:fp_email, otp }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        result = await result.json();
                        display_data(result)
                    }
                    catch (e) {
                    }
                }
            }
            else {
                if (log_id != '') {
                    let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(log_id);
                    if (email_valid) {
                        try {
                            console.log('yup')
                            let result = await fetch(
                                'http://localhost:5000/otp_login', {
                                method: "post",
                                body: JSON.stringify({ log_id, otp }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            result = await result.json();
                            display_data(result)
                        }
                        catch (e) {
                        }
                    }
                    else {
                        try {
                            console.log('yup')
                            let result = await fetch(
                                'http://localhost:5000/otp_login_sms', {
                                method: "post",
                                body: JSON.stringify({ log_id , otp }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            result = await result.json();
                            display_data(result)
                        }
                        catch (e) {
                        }
                    }
                }
                else {
                    let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);
                    if (email_valid) {
                        try {
                            console.log('yup')
                            let result = await fetch(
                                'http://localhost:5000/otp', {
                                method: "post",
                                body: JSON.stringify({ email, name, password, username, otp }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            result = await result.json();
                            display_data(result)
                        }
                        catch (e) {
                        }
                    }
                    else {
                        try {
                            console.log('yup')
                            let result = await fetch(
                                'http://localhost:5000/otp_sms', {
                                method: "post",
                                body: JSON.stringify({ email, name, password, username, otp }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            result = await result.json();
                            display_data(result)
                        }
                        catch (e) {
                        }
                    }
                }
            }
        }
    }
    const timer = () => {
        let min = 4
        let sec = 59
        setTstyle({
            display: 'block',
            background: 'rgba(29, 38, 41, 0.3)',
            btn: true
        })
        const id = setInterval(() => {
            if (sec == 0) {
                min--
                sec = 59
                setMin(min)
                setSec(sec)
            }
            else {
                sec--
                setSec(sec)
                setMin(min)
            }
        }, 1000)
        clearid(id);
    }
    const clearid = (id) => {
        setTimeout(() => {
            clearInterval(id)
            setTstyle({
                display: 'none',
                background: 'rgb(27, 190, 244)',
                btn: false
            })
        }, 275400)
    }
    useEffect(() => {
        timer()
    }, []);
    const display_data1 = (result) => {
        setmsg({
            display: 'block',
        })
        if (result.Response == 'Success') {
            timer()
            settype('Success')
            setmessage('Otp Sent Successfully')
            setTimeout(() => {
                navigate('/main', { state: { email: email, name: name, username: username } })
            }, 2000)
        }
        else {
            settype('Warning')
            setmessage('Something Went Wrong')
        }
    }
    const display_data = (result) => {
        setmsg({
            display: 'block',
        })
        if (result == 'empty') {
            settype('Info')
            setmessage('Input Fields Are Empty')
        }
        if (result.Response == 'Invalid') {
            settype('Failed')
            setmessage('Your Otp is not valid')
        }
        else {
            if (result.Response == 'Failed') {
                settype('Warning')
                setmessage('Something Went Wrong')
            }
            else {
                if (result.Response == 'Success') {
                    settype('Success')
                    if (log_id != '')
                        setmessage('Login Successful')
                    else
                        setmessage('Registration Successful')
                }
            }
        }
    }
    return (
        <div className='form'>
            <div className='text'>
                <p>Otp Has Been succesfully Sent To <span style={{ fontWeight: 'bolder' }}>{email ? email : log_id}</span></p>
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange1}
                    value={first}
                    ref={inputref1}
                />
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange2}
                    value={second}
                    ref={inputref2} />
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange3}
                    value={third}
                    ref={inputref3} />
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange4}
                    value={fourth}
                    ref={inputref4} />
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange5}
                    value={fifth}
                    ref={inputref5} />
            </div>
            <div className='form-control'>
                <input type='text'
                    onChange={handleChange6}
                    value={sixth}
                    ref={inputref6} />
            </div>
            <div class='btn-control'>
                <button onClick={handleClick}>
                    Submit Otp
                </button>
                <button onClick={handleReset} style={{ background: tstyle.background }} disabled={tstyle.btn}>
                    Resend Otp&nbsp;&nbsp;
                    <div style={{ display: tstyle.display }}>{min}:{sec}</div>
                </button>
            </div>
            <div className='msg' style={{ display: msg.display }}>
                <Snack_bar type={type} message={message} />
            </div>
        </div>
    )
}

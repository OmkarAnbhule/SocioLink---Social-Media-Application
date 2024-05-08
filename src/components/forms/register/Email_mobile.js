import { set } from 'mongoose';
import React, { useEffect, useState } from 'react'

export default function Email_mobile(props) {
    const api = process.env.REACT_APP_API_URL;
    const [mobile, setmobile] = useState(false)
    const [Email, setEmail] = useState("");
    const [eicon, seteicon] = useState("");
    const [err_msg, seterr_msg] = useState("");
    const [checkerstyle, setcheckerstyle] = useState({
        borderColor: 'rgb(118, 116, 116)',
        outlineStyle: 'none',
        display: 'none',
        color: 'red'
    })
    const focusout = () => {
        props.callBack(Email, checkerstyle.borderColor)

        if (Email == '') {
            setcheckerstyle({
                borderColor: 'rgb(118, 116, 116)',
                outlineStyle: 'none',
                color: 'red'
            })
            seterr_msg('');
        }
        else {
            if (eicon == "bi bi-x-circle-fill" && err_msg == '') {
                seterr_msg("Invalid Email");
            }
        }
    }
    const focusin = () => {
        seterr_msg('');
    }
    const clearstate = () => {
        setEmail("");
        seteicon("");
        setcheckerstyle({
            borderColor: 'rgb(118, 116, 116)',
            outlineStyle: 'none',
            display: 'none',
            color: 'red'
        })
    }

    props.clearstatefunc(clearstate);

    const mail_valid = async () => {
        let temp = Email;
        temp = temp.split(' ').join('');
        temp = temp.replace(/\[\[\]\{\{\}\(\(\)+/g, '');
        temp = temp.toLowerCase();
        setEmail(temp);
        let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(temp);
        if (email_valid) {
            let result = await fetch(
                `${api}user/verify/email/${Email}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            result = await result.json();
            console.warn(result);
            if (result.Response == 'Failed') {
                setcheckerstyle({
                    borderColor: 'red',
                    color: 'red',
                    outlineStyle: 'none',
                })
                seteicon("bi bi-x-circle-fill");
                seterr_msg('Email Already Found');
            }
            else {
                if (result.Response == 'Success') {
                    seteicon("bi bi-check-circle-fill");
                    setcheckerstyle({
                        borderColor: 'limegreen',
                        color: 'limegreen',
                        outlineStyle: 'none',
                    })
                    seterr_msg('');
                }
                else {
                    seteicon('');
                    setcheckerstyle({
                        borderColor: 'rgb(118, 116, 116)',
                        outlineStyle: 'none',
                        display: 'none',
                        color: 'red'
                    })
                }
            }
        }
        else {
            //number
            if (temp.match(/^\d{10}$/)) {
                let result = await fetch(
                    `${api}user/verfiy/email${Email}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                )
                result = await result.json();
                console.warn(result);
                if (result.Response == 'Failed') {
                    setcheckerstyle({
                        borderColor: 'red',
                        color: 'red',
                        outlineStyle: 'none',
                    })
                    seteicon("bi bi-x-circle-fill");
                    seterr_msg('Mobile Number Already Found');
                }
                else {
                    if (result.Response == 'Success') {
                        seteicon("bi bi-check-circle-fill");
                        setcheckerstyle({
                            borderColor: 'limegreen',
                            color: 'limegreen',
                            outlineStyle: 'none',
                        })
                    }
                    else {
                        seteicon("");
                        setcheckerstyle({
                            borderColor: 'rgb(118, 116, 116)',
                            outlineStyle: 'none',
                            display: 'none',
                            color: 'red'
                        })
                    }
                }
            }
            else {
                if (Email == '') {
                    seteicon("");
                    setcheckerstyle({
                        borderColor: 'rgb(118, 116, 116)',
                        outlineStyle: 'none',
                        display: 'none',
                        color: 'red'
                    })
                }
                else {
                    setcheckerstyle({
                        borderColor: 'red',
                        color: 'red',
                        outlineStyle: 'none',
                    })
                    seteicon("bi bi-x-circle-fill");
                }
            }
        }


    }
    useEffect(() => {
        mail_valid();
    }, [Email])
    function onChangeEmail(e) {
        //email
        setEmail(e.target.value)
    }
    return (
        <div className="form_control">
            <input
                type='text'
                name='email_mobile'
                id='email_mobile'
                value={Email}
                onChange={onChangeEmail}
                onBlur={focusout}
                onFocus={focusin}
                placeholder='Mobile Number or Email'
                autoComplete='off'
                style={{
                    borderColor: checkerstyle.borderColor,
                    outlineStyle: checkerstyle.outlineStyle,
                }}
            />
            <div className='error_message'>
                <p>{err_msg}</p>
            </div>

            <div className="check_icon">
                <i className={eicon} id='eicon' style={{ color: checkerstyle.color }}></i>
            </div>
        </div>

    )
}

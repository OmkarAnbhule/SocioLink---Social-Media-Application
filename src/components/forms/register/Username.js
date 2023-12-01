import React, { useEffect, useState } from 'react'

export default function Username(props) {
    const [uicon, setuicon] = useState("");
    const [Username, setUsername] = useState("");
    const [err_msg,seterr_msg] = useState("");
    const [checkerstyle, setcheckerstyle] = useState({
        borderColor: 'rgb(118, 116, 116)',
        outlineStyle: 'none',
    })
    const focusout = () => {
            props.callBack(Username,checkerstyle.borderColor);

        if(Username == ''){
        setcheckerstyle({
            borderColor: 'rgb(118, 116, 116)',
            outlineStyle: 'none',
            color:'red'
        })
        seterr_msg("");
    }
        else{if(uicon === 'bi bi-x-circle-fill' && err_msg === '')
        {
            if(Username.length < 12)
            {
            seterr_msg('Username Length Should be minimum 12');
            }
            else{
                seterr_msg('Username must have Alphabets,numbers,and Underscore(_)');
            }
        }}
    }
    const focusin = () => {
        seterr_msg("");
    }

    const clearstate = () => {
        setUsername("");
        setuicon("");
        setcheckerstyle({
            borderColor: 'rgb(118, 116, 116)',
            outlineStyle: 'none',
        })
    }

    props.clearstatefunc(clearstate);
    const Username_valid = async () => {
        let temp = Username;
        temp = temp.split(' ').join('');
        temp = temp.replace(/[\[\]\(\)\{\}']+/g,'');
        setUsername(temp);
        let user_valid = /^[a-zA-Z0-9_]{12,}$/.test(temp);
        if (user_valid == true && temp.length >= 12) {

        let result = await fetch(
            'http://localhost:5000/user_verify', {
            method: "post",
            body: JSON.stringify({Username}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          result = await result.json();
          console.warn(result);
          if(result.Response == "Failed")
          {
            setcheckerstyle({
                borderColor: 'red',
                outlineStyle: 'none',
                color: 'red'
            })
            setuicon("bi bi-x-circle-fill");
            seterr_msg("Username Already Found");
          } 
          else{
            setcheckerstyle({
                borderColor: 'limegreen',
                outlineStyle: 'none',
                color: 'limegreen'
            })
            setuicon("bi bi-check-circle-fill");
            seterr_msg('');
          }
        }
        else{
            if(Username == '')
            {
                setcheckerstyle({
                    borderColor: 'rgb(118, 116, 116)',
                    outlineStyle: 'none',
                    color:'red'
                })
                setuicon("");
            }
            else{
            setcheckerstyle({
                borderColor: 'red',
                outlineStyle: 'none',
                color:'red'
            })
            setuicon("bi bi-x-circle-fill");
        }
        }
}
    useEffect(()=>{
        Username_valid();
    },[Username]);
    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    return (
        <div className="form_control">
            <input
                type='text'
                name='username'
                id='username'
                value={Username}
                onChange={onChangeUsername}
                onBlur={focusout}
                onFocus={focusin}
                placeholder='Username'
                autoComplete='off'
                style={{
                    borderColor: checkerstyle.borderColor,
                    outlineStyle: checkerstyle.outlineStyle
                }}
            />
            <div className='error_message'>
                <p>{err_msg}</p>
            </div>
            <div className="check_icon"><i className={uicon} id='uicon' style={{ color: checkerstyle.color }}></i></div>
        </div>
    )
}

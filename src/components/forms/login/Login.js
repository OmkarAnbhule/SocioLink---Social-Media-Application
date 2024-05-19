import React, { useRef, useState } from 'react';
import './Login.css'
import Password from '../register/Password';
import Loader from '../../web_components/loader/Loader';
import Snack_bar from '../../web_components/snack_bar/Snack_bar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login(props) {
  const api = process.env.REACT_APP_API_URL
  const { state } = useLocation();
  const [key, setkey] = useState(0);
  const [text, setText] = useState("");
  const [password, setpassword] = useState("");
  const [er, seter] = useState('');
  const [password1, setpassword1] = useState("");
  const [er1, seter1] = useState('');
  const [password2, setpassword2] = useState("");
  const [er2, seter2] = useState('');
  const [err_msg, seterr_msg] = useState('');
  const [eicon, seteicon] = useState('');
  const [click, setclick] = useState('none')
  const [val, setVal] = useState('');
  const navigate = useNavigate();
  const [header, setHeader] = useState('Sign In Form');
  const [fp_link, setFp_link] = useState('Forgot Password?')
  const [btn, setBtn] = useState('Login')
  const [checkerstyle, setcheckerstyle] = useState({
    color: 'red',
    borderColor: 'rgb(118, 116, 116)',
  })
  const [show1, setshow1] = useState('block');
  const [show2, setshow2] = useState('none');
  const [show3, setshow3] = useState('block');
  var clearPassword = null;
  const [type, setType] = useState();
  const [message, setMessage] = useState();
  const [msg, setMsg] = useState({
    display: 'none',
  })
  const childref = useRef()

  //functions 

  const random = (min, max) => {
    return Math.floor(Math.random() * (max * min + 1) + min)
  }
  const handleClick = () => {
    setkey(random(1, 20));
    childref.current.click()
    setclick('block')
    if (state && state.reset == true) {
      if (password1 == '' || password2 == '') {
        setMsg({
          display: 'block',
        })
        setType('Warning')
        setMessage('Empty Fields')
        setclick('none')
      }
      else {
        if (password1 !== password2) {
          setMsg({
            display: 'block',
          })
          setType('Alert')
          setMessage('Password Not Matching')
          setclick('none')
        }
        else {
          try {
            getData2()
          }
          catch (e) {
            console.log(e)
          }
        }
      }
    }

    else {
      if (show1 == 'none') {
        if (text == '') {
          setMsg({
            display: 'block',
          })
          setType('Warning')
          setMessage('Empty Fields')
          setclick('none')
        }
        else {
          try {
            getData1()
          }
          catch (e) {
            console.log(e)
          }
        }
      }
      else {
        if (password == '' || text == '' || val == '') {
          setMsg({
            display: 'block',
          })
          setType('Warning')
          setMessage('Empty Fields')
          setclick('none')
        }
        else {
          try {
            getData()
          }
          catch (e) {
            console.log('main' + e)
          }
        }
      }
    }

  }
  const getData2 = async () => {
    try {
      let result = await fetch(
        `${api}user/forgotPassword/resetPassword`, {
        method: "post",
        body: JSON.stringify({ text: state.id, password: password1 }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      result = await result.json()
      display2(result);
    }
    catch (e) {
      console.log(e)
    }
  }
  const getData1 = async () => {
    try {
      let result = await fetch(
        `${api}user/sendOTP`, {
        method: "post",
        body: JSON.stringify({ text, 'type': val }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      result = await result.json()
      display1(result);
    }
    catch (e) {
      console.log(e)
    }
  }
  const getData = async () => {
    if (val == 'number') {
      try {
        let result = await fetch(
          `${api}user/sendOTP`, {
          method: "post",
          body: JSON.stringify({ text, password, val, 'type': 'sms' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        result = await result.json()
        display(result);
      }
      catch (e) {
        console.log(e)
      }
    }
    else {
      try {
        let result = await fetch(
          `${api}user/sendOTP`, {
          method: "post",
          body: JSON.stringify({ email: text, password, val: 'login', 'type': 'email' }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        result = await result.json()
        display(result);
      }
      catch (e) {
        console.log(e)
      }
    }
  }
  const display = (res) => {
    if (res.Response == 'Success') {
      setMsg({
        display: 'block'
      })
      setType('Success')
      setMessage('Otp Sent Successfully')
      setTimeout(() => {
        navigate('/otp', {
          state: {
            login: {
              log_id: text,
              log_val: val,
              log_pass: password
            }
          }
        })
      }, 2000)
    }
    else {
      if (res.Response == 'Incorrect') {
        setMsg({
          display: 'block'
        })
        setType('Warning')
        setMessage('Incorrect Password')
        setclick('none')
      }
      else {
        if (res.Response == 'NF') {
          setMsg({
            display: 'block'
          })
          setType('Warning')
          setMessage('Invalid Credentials')
          setclick('none')
        }
        else {
          setMsg({
            display: 'block'
          })
          setType('Failed')
          setMessage('Something Went Wrong')
          setclick('none')
        }
      }
    }
  }

  const display1 = (res) => {
    if (res.Response == 'Success') {
      setMsg({
        display: 'block'
      })
      setType('Success')
      setMessage('Otp Sent Successfully')
      setclick('none')
      setTimeout(() => {
        navigate('/otp', {
          state: {
            forgot_password: {
              fp_email: res.email,
              fp_val: val
            }
          }
        })
      }, 2000)
    }
    else {
      if (res.Response == 'NF') {
        setMsg({
          display: 'block'
        })
        setType('Warning')
        setMessage('Invalid Credentials')
        setclick('none')
      }
      else {
        setMsg({
          display: 'block'
        })
        setType('Failed')
        setMessage('Something Went Wrong')
        setclick('none')
      }
    }
  }
  const display2 = (res) => {
    if (res.Response === 'Success') {
      setshow2('none');
      setshow1('block');
      setshow3('block');
      setMsg({
        display: 'block'
      })
      setType('Success')
      setMessage('Password Reset Successfully')
      setclick('none')
      setTimeout(() => {
        navigate('/login')
      }, 3000);
    }
    else {
      setMsg({
        display: 'block'
      })
      setType('Failed')
      setMessage('Something Went Wrong')
      setclick('none')
    }
  }



  const handleChange = (e) => {
    setText(e.target.value)
    let temp = e.target.value
    let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(temp);
    let user_valid = /^[a-zA-Z0-9_]{12,}$/.test(temp);
    if (email_valid) {
      setVal('email')
      setcheckerstyle({
        color: 'limegreen',
        borderColor: 'limegreen'
      })
      seteicon('bi bi-check-circle-fill');
    }
    else {
      if (temp.match(/^\d{10}$/)) {
        setVal('number')
        setcheckerstyle({
          color: 'limegreen',
          borderColor: 'limegreen'
        })
        seteicon('bi bi-check-circle-fill');
      }
      else {
        if (user_valid) {
          setVal('username')
          setcheckerstyle({
            color: 'limegreen',
            borderColor: 'limegreen'
          })
          seteicon('bi bi-check-circle-fill');
        }
        else {
          setcheckerstyle({
            color: 'red',
            borderColor: 'red'
          })
          seteicon('bi bi-x-circle-fill');
        }
      }
    }
  }
  const forgot_password = () => {
    if (show1 == 'none') {
      setshow1('block')
      setHeader('Sign In Form')
      setFp_link('Forgot Password?')
      setBtn('Login')
    }
    else {
      setshow1('none')
      setHeader('Reset Account Password')
      setFp_link('Return To Login')
      setBtn('Send Otp')
    }
  }
  const focusin = () => {
    if (text.length < 1) {
      setcheckerstyle({
        borderColor: 'rgb(118, 116, 116)',
      })
      seteicon('');
    }
  }
  const focusout = () => {
    if (text.length < 1) {
      setcheckerstyle({
        borderColor: 'rgb(118, 116, 116)',
      })
      seteicon('');
    }
  }
  function assignClearPassword(PasswordClearStateFunc) {
    clearPassword = PasswordClearStateFunc;
  };
  const handleCallBack = (data, err) => {
    setpassword(data)
    seter(err)
  }
  function assignClearPassword1(PasswordClearStateFunc) {
    clearPassword = PasswordClearStateFunc;
  };
  const handleCallBack1 = (data, err) => {
    setpassword1(data)
    seter1(err)
  }
  function assignClearPassword2(PasswordClearStateFunc) {
    clearPassword = PasswordClearStateFunc;
  };
  const handleCallBack2 = (data, err) => {
    setpassword2(data)
    seter2(err)
  }
  const register = () => {
    navigate('/')
  }

  return (
    <div className='form_l'>
      {state && state.reset == true ? <h1>Reset Account Password</h1> : <h1>{header}</h1>}
      <div className='form_group'>
        {state && state.reset == true ?
          (<div className='form_control' style={{ display: 'none' }}>
            <input
              type='text'
              onChange={handleChange}
              value={text}
              placeholder='Phone number,email address or username'
              onFocus={focusin}
              onBlur={focusout}
              style={{
                borderColor: checkerstyle.borderColor,
              }}
            />
            <div className='error_message'>
              <p>{err_msg}</p>
            </div>
            <div className="check_icon">
              <i className={eicon} id='eicon' style={{ color: checkerstyle.color }}></i>
            </div>
          </div>) :
          (<div className='form_control' style={{ display: show3 }}>
            <input
              type='text'
              onChange={handleChange}
              value={text}
              placeholder='Phone number,email address or username'
              onFocus={focusin}
              onBlur={focusout}
              style={{
                borderColor: checkerstyle.borderColor,
              }}
            />
            <div className='error_message'>
              <p>{err_msg}</p>
            </div>
            <div className="check_icon">
              <i className={eicon} id='eicon' style={{ color: checkerstyle.color }}></i>
            </div>
          </div>)
        }
        {state && state.reset == true ?
          (<div style={{ display: 'none' }}>
            <Password callBack={handleCallBack} clearstatefunc={assignClearPassword} />
          </div>) :
          (<div style={{ display: show1 }}>
            <Password callBack={handleCallBack} clearstatefunc={assignClearPassword} />
          </div>)
        }

        {state && state.reset == true ?
          (<div style={{ display: 'block' }}>
            <Password callBack={handleCallBack1} clearstatefunc={assignClearPassword1} />
            <Password callBack={handleCallBack2} clearstatefunc={assignClearPassword2} placeholder={'Confirm Password'} />
          </div>)
          : null}

      </div>
      <div className='fp_link'>
        <p onClick={forgot_password}>{fp_link}</p>
      </div>
      {state && state.reset == true ?
        <button className='btn' onClick={handleClick} >Reset Password <div><Loader display={click} /></div></button>
        : <button className='btn' onClick={handleClick} >{btn} <div><Loader display={click} /></div></button>

      }
      <div className='register_link'>
        <p>
          Don't Have An Account<br /> <a onClick={register}>Click to SignUp</a>
        </p>
      </div>
      <div className='msg' style={{ display: msg.display }}>
        <Snack_bar type={type} message={message} refer={childref} key={key} />
      </div>

    </div>
  )
}
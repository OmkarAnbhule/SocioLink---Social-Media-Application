import React, { useRef, useState } from 'react';
import './Login.css'
import Password from '../register/Password';
import Loader from '../../web_components/loader/Loader';
import Snack_bar from '../../web_components/snack_bar/Snack_bar';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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
  const [val,setVal] = useState('');
  const navigate = useNavigate();
  const [checkerstyle, setcheckerstyle] = useState({
    color: 'red',
    borderColor: 'rgb(118, 116, 116)',
  })     
  const [show1,setshow1] = useState('block');
  const [show2,setshow2] = useState('none'); 
  const [show3,setshow3] = useState('block');
  var clearPassword = null;
  const [type, setType] = useState();
  const [message, setMessage] = useState();
  const [msg, setMsg] = useState({
    display: 'none',
  })
  const childref = useRef()
  const handleClick = () => {
    childref.current.click()
    setclick('block')
    if(show1 == 'none')
    {
      getData1()
    }
    else{
      if(show2=='block')
      {
        getData2()
      }
      else{
    if (password == '' || text == '' || val =='') {
      setMsg({
        display:'block',
      })     
      setType('Warning')
      setMessage('Empty Fields')
    }
    else{
      try{
        getData()
      }
      catch(e){
        console.log('main' + e)
      }
    }
  }}
}
const getData2 = async () => {
  try {
    let result = await fetch(
      'http://localhost:5000/forgot_password', {
      method: "post",
      body:JSON.stringify({text,val}),
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
const getData1  = async () => {
  try {
    let result = await fetch(
      'http://localhost:5000/validate_user', {
      method: "post",
      body:JSON.stringify({text,val}),
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
    if(val == 'number')
    {
      try {
        let result = await fetch(
          'http://localhost:5000/login_sms', {
          method: "post",
          body:JSON.stringify({text,password,val}),
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
    else{
    try {
      let result = await fetch(
        'http://localhost:5000/login', {
        method: "post",
        body:JSON.stringify({text,password,val}),
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
    if(res.Response == 'Success')
    {
      setMsg({
        display:'block'
      })
      setType('Success')
      setMessage('Otp Sent Successfully')
      setTimeout(()=>{
        navigate('/otp',{
          state:{
            login:{
              log_id:res.email,
              log_val:val,
              log_pass:password
            }
          }
        })
      },2000)
    }
    else{
      if(res.Response == 'Incorrect')
      {
        setMsg({
          display:'block'
        })
        setType('Warning')
        setMessage('Incorrect Password')
      }
      else{
        if(res.Response == 'NF')
        {
          setMsg({
            display:'block'
          })
          setType('Warning')
          setMessage('Invalid Credentials')
        }
        else{
          setMsg({
            display:'block'
          })
          setType('Failed')
          setMessage('Something Went Wrong')
        }
      }
    }
  }
  
  const display1 = (res) => {
    if(res.Response == 'Success')
    {
      setMsg({
        display:'block'
      })
      setType('Success')
      setMessage('Otp Sent Successfully')
      setTimeout(()=>{
        navigate('/otp',{
          state:{
            forgot_password:{
              fp_email:res.email,
              fp_val:val
            }
          }
        })
      },2000)
    }
    else{
      if(res.Response == 'Incorrect')
      {
        setMsg({
          display:'block'
        })
        setType('Warning')
        setMessage('Incorrect Password')
      }
      else{
        if(res.Response == 'NF')
        {
          setMsg({
            display:'block'
          })
          setType('Warning')
          setMessage('Invalid Credentials')
        }
        else{
          setMsg({
            display:'block'
          })
          setType('Failed')
          setMessage('Something Went Wrong')
        }
      }
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
  const forgot_password =() =>{
    setshow1('none');
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
    window.location.href = '/'
  }

  return (
    <div className='form_l'>
      <div className='form_group'>
        <div className='form_control' style={{display:show3}}>
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
        </div>
        <div style={{display:show1}}>
        <Password callBack={handleCallBack} clearstatefunc={assignClearPassword} />
      </div>
      <div style={{display:show2}}>
        <Password callBack={handleCallBack1} clearstatefunc={assignClearPassword1} />
        <Password callBack={handleCallBack2} clearstatefunc={assignClearPassword2} placeholder={'Confirm Password'}/>
      </div>
      </div>
      <div>
        <p onClick={forgot_password}>Forgot Password?</p>
      </div>
      <button className='btn' onClick={handleClick} >Register <div><Loader display={click} /></div></button>
      <div className='msg' style={{ display: msg.display }}>
        <Snack_bar type={type} message={message} refer={childref} />
      </div>
    </div>
  )
}
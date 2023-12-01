import React, { useEffect, useRef, useState } from 'react'
import Email_mobile from './Email_mobile';
import './Register.css';
import Password from './Password';
import Name from './Name';
import Username from './Username';
import Loader from '../../web_components/loader/Loader';
import Snack_bar from '../../web_components/snack_bar/Snack_bar';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  var clearEmail_mobile = null;
  var clearName = null;
  var clearPassword = null;
  var clearUsername = null;
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [click, setclick] = useState("none");
  const [clicked, setclicked] = useState('');
  const [er1, seter1] = useState('');
  const [er2, seter2] = useState('');
  const [er3, seter3] = useState('');
  const [er4, seter4] = useState('');
  const [msg, setmsg] = useState({
    display: 'none'
  })
  const [type, settype] = useState('');
  const [message, setmessage] = useState('');
  const childref = useRef(null);
  //clear inputs
  function assignClearEmail_mobile(Email_mobileClearStateFunc) {
    clearEmail_mobile = Email_mobileClearStateFunc;
  };
  function assignClearName(NameClearStateFunc) {
    clearName = NameClearStateFunc;
  };
  function assignClearPassword(PasswordClearStateFunc) {
    clearPassword = PasswordClearStateFunc;
  };
  function assignClearUsername(UsernameClearStateFunc) {
    clearUsername = UsernameClearStateFunc;
  };


  function resetform() {
    clearEmail_mobile();
    clearName();
    clearPassword();
    clearUsername();
  }
  const login = () => {
    window.location.href = "/login"
  }
  function res(result){
    console.log(result)
    if (result.Response == "Success") {
        setclick("none")
        setmsg({
          display: 'block'
        })
        settype('Success')
        setmessage("Otp Sent Successfully")
        setTimeout(()=>{
          navigate('/otp',{state:{email:email,name:name,username:username,password:password}})
        },2000)
      }
      else {
        resetform();
        setemail("");
        setname("");
        setpassword("");
        setusername("");
        setclick("none")
        setmsg({
          display: 'block'
        })
        settype('Failed')
        setmessage("Something Went Wrong");
        setclicked('none')
        display();
      }
  }
  const senddata = async () => {
    let email_valid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);
    if(email_valid)
    {
      try {
        let result = await fetch(
          'http://localhost:5000/register', {
          method: "post",
          body:JSON.stringify({email}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        result = await result.json()
        res(result);
  
      }
      catch (e) {
        console.log('error')
      }
    }
    else{
    try {
      let result = await fetch(
        'http://localhost:5000/sms', {
        method: "post",
        body:JSON.stringify({email}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      result = await result.json()
      res(result);

    }
    catch (e) {
      console.log('error')
    }
  }
}
  
  function display(){
    setTimeout(() => {
      setmsg({
        display:'none',
      })
    }, (4000));
  }
  const handleSubmit = () => {
    childref.current.click();
    setclicked('done')
    setclick("block")
    console.log(type)
    if (email == '' || name == '' || password == '' || username == '') {
      setclick("none")
      setmsg({
        display: 'block'
      })
      setmessage('Empty Fields');
      settype('Info')
      setclicked('none')
      display()
    }
    else {
      if (er1 != 'limegreen' || er2 != 'limegreen' || er3 != 'limegreen' || er4 != 'limegreen') {
        setclick("none")
        setmsg({
          display: 'block'
        })
        setmessage('Invalid Fields');
        settype('Warning')
        setclicked('none')
        display()
      }
      else {
        senddata();
      }
    }
  }

  const handleCallBack1 = (data, err) => {
    setemail(data)
    seter1(err)
  }
  const handleCallBack2 = (data, err) => {
    setname(data)
    seter2(err)
  }
  const handleCallBack3 = (data, err) => {
    setpassword(data)
    seter3(err)
  }
  const handleCallBack4 = (data, err) => {
    setusername(data)
    seter4(err)
  }

  console.log(name, email, password, username);
  return (
    <div className='form_r'>
      <div className="form_group">
        <Email_mobile callBack={handleCallBack1} clearstatefunc={assignClearEmail_mobile} />
        <Name callBack={handleCallBack2} clearstatefunc={assignClearName} />
        <Password callBack={handleCallBack3} clearstatefunc={assignClearPassword} />
        <Username callBack={handleCallBack4} clearstatefunc={assignClearUsername} />
        <div className="form_control">
          <p className='terms'>
            People who use our service may have uploaded <br /> your contact information to Socilink. <strong><a>Learn <br /> More<br /></a></strong>
            <br />By signing up, you agree to our Terms ,<strong><a> Privacy Policy</a></strong> and <strong><a> Cookies Policy </a></strong>.
          </p>
        </div>
        <div className="form_control">
          <button className="btn" id="btn" onClick={handleSubmit}>
            Sign Up <div><Loader display={click} /></div>
          </button>
        </div>
        Already Signed in <a onClick={login}>Click To Login</a>
      </div>

      <div className="form_group">
        <div className="divider">
          <p>OR</p>
        </div>
      </div>
      <div className='msg' style={{display:msg.display}}>
        <Snack_bar type={type} message={message} refer={childref} />
      </div>
    </div>

  )
}

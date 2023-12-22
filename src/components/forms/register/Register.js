import React, { useEffect, useRef, useState } from 'react'
import Email_mobile from './Email_mobile';
import './Register.css';
import Password from './Password';
import Name from './Name';
import Username from './Username';
import Loader from '../../web_components/loader/Loader';
import Snack_bar from '../../web_components/snack_bar/Snack_bar';
import { useLocation, useNavigate } from 'react-router-dom';
import pip from './default.png'
export default function Register() {
  const { state } = useLocation();
  const [key, setkey] = useState(0)
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
  const [click1, setclick1] = useState("none");
  const [clicked, setclicked] = useState('');
  const [er1, seter1] = useState('');
  const [er2, seter2] = useState('');
  const [er3, seter3] = useState('');
  const [er4, seter4] = useState('');
  const [msg, setmsg] = useState({
    display: 'none'
  })
  const [select_file, setSelect_file] = useState('block')
  const [file, setFile] = useState(pip);
  const ImageFile = base64toFile(pip, 'default.png', 'image/png')
  const [Image, setImage] = useState(ImageFile);
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
  useEffect(()=>{
    if(localStorage.getItem('login') == 'true')
    {
      navigate('/main')
    }
  },[])

  function resetform() {
    clearEmail_mobile();
    clearName();
    clearPassword();
    clearUsername();
  }
  const random = (min, max) => {
    return Math.floor(Math.random() * (max * min + 1) + min)
  }
  const login = () => {
    window.location.href = "/login"
  }
  function res(result) {
    console.log(result)
    if (result.Response == "Success") {
      setclick("none")
      setmsg({
        display: 'block'
      })
      settype('Success')
      setmessage("Otp Sent Successfully")
      setTimeout(() => {
        navigate('/otp', { state: { email: email, name: name, username: username, password: password } })
      }, 2000)
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
    if (email_valid) {
      try {
        let result = await fetch(
          'http://localhost:5000/register', {
          method: "post",
          body: JSON.stringify({ email }),
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
    else {
      try {
        let result = await fetch(
          'http://localhost:5000/sms', {
          method: "post",
          body: JSON.stringify({ email }),
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

  function display() {
    setTimeout(() => {
      setmsg({
        display: 'none',
      })
    }, (4000));
  }
  const handleSubmit = () => {
    childref.current.click();
    setclicked('done')
    setclick("block")
    console.log(type)
    setkey(random(1, 20))
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
  const handleUpload = async () => {
    setclicked('done')
    setclick("block")
    try {
      const formdata = new FormData();
      formdata.append('Image', Image)
      formdata.append('email', localStorage.getItem('id'))
      let result = await fetch('http://localhost:5000/upload', {
        method: 'post',
        body: formdata,
      })
      result = await result.json()
      console.log(result)
      displayUpload(result)
    }
    catch (e) {
      console.log(e)
    }
  }
  const displayUpload = (res) => {
    if (res.Response == 'Success') {
      setmsg({
        display: 'block'
      })
      setmessage('Profile Picture Set Successfully')
      settype('Success')
      setclicked('done')
      setclick("block")
      setTimeout(() => {
        navigate('/main', {
          state: {
            email: email
          }
        })
      }, 2000)
    }
    else
    {
      if(res.Response == 'Failed')
      {
        setmsg({
        display: 'block'
      })
      setmessage('Upload Failed Try Again')
      settype('Failed')
      setclicked('done')
      setclick("block")
      }
    }
  }
  function base64toFile(base64Data, fileName, fileType) {
    const base64WithoutPrefix = base64Data.replace(/^data:[^;]+;base64,/, '');

    const byteCharacters = atob(base64WithoutPrefix);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: fileType });
    const file = new File([blob], fileName, { type: fileType });

    return file;
  }
  const handleSkip = async () => {
    setclicked('done')
    setclick1("block")
    const ImageFile = base64toFile(pip, 'default.png', 'image/png')
    try {
      const formdata = new FormData();
      formdata.append('Image', ImageFile)
      formdata.append('email', localStorage.getItem('id'))
      let result = await fetch('http://localhost:5000/upload', {
        method: 'post',
        body: formdata,
      })
      result = await result.json()
      displayUpload(result)
    }
    catch (e) {
      console.log(e)
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
  function handleImage(e) {
    if (e.target.files[0] == undefined) {
      setFile(pip)
      setSelect_file('block')
    }
    else {
      setImage(e.target.files[0])
      setFile(URL.createObjectURL(e.target.files[0]))
      setSelect_file('none')
    }
  }
  console.log(name, email, password, username);
  return (<>
    {(state && state.file == 'true') ? (
      <div className='form_r' style={{ height: '500px', width: '500px' }}>
        <h1 >Set Up Profile Picture</h1>
        <div className='form_group'>
          <div className='form_control'>
            <label htmlFor='file_input' className='label_file'><img src={file} width={'200px'} height={'200px'}></img><p style={{ display: select_file }}><i className='bi bi-plus-circle'></i> Add Picture</p></label>
            <input type='file' id='file_input' onChange={handleImage} style={{ display: 'none' }} accept='image/*'>
            </input>
          </div>
        </div>
        <div className="btn_container">
          <button className="btn" id="btn" onClick={handleUpload} style={{ width: '200px' }}>
            Set Up <div><Loader display={click} /></div>
          </button>
          <button className="btn" id="btn" onClick={handleSkip} style={{ width: '200px' }}>
            Skip <div><Loader display={click1} /></div>
          </button>
        </div>
        <div className='msg' style={{ display: msg.display }}>
          <Snack_bar type={type} message={message} refer={childref} key={key} />
        </div>
      </div>
    ) : (
      <div className='form_r'>
        <h1>Sign Up Form</h1>
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
          <p className='login_link'>Already Signed in <a onClick={login}>Click To Login</a></p>
        </div>

        <div className="form_group">
          <div className="divider">
            <p>OR</p>
          </div>
        </div>
        <div className='msg' style={{ display: msg.display }}>
          <Snack_bar type={type} message={message} refer={childref} key={key} />
        </div>
      </div>)}
  </>
  )
}

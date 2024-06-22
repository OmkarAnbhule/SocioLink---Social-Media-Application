import React, { useState } from 'react'

export default function Password(props) {
  const [progress, setProgress] = useState("");
  const [password, setPassword] = useState("");
  const [passtype, setpasstype] = useState("password");
  const [message, setMessage] = useState("");
  const [icon, seticon] = useState("bi bi-eye-fill");
  const [picon, setpicon] = useState("");
  const [length, setlength] = useState("bi bi-x-circle-fill");
  const [capital, setcapital] = useState("bi bi-x-circle-fill");
  const [small, setsmall] = useState("bi bi-x-circle-fill");
  const [number, setnumber] = useState("bi bi-x-circle-fill");
  const [special, setspecial] = useState("bi bi-x-circle-fill");


  const [checkerstyle, setcheckerstyle] = useState({
    borderColor: 'rgb(118, 116, 116)',
    outlineStyle: 'none',
    display: 'none',
    icon_display: 'none',
  })
  const focusout = () => {
    if (password.length !== 0) {
      setcheckerstyle({
        borderColor: getActiveColor(message),
        outlineStyle: 'none',
        display: 'none',
        icon_display: 'block'
      })
      props.callBack(password,checkerstyle.borderColor);
    }
    else {
      setcheckerstyle({
        borderColor: 'rgb(118, 116, 116)',
        outlineStyle: 'none',
        display: 'none',
        icon_display: 'block'
      })
    }
  }
  const focusin = () => {
    if (password.length !== 0) {
      setcheckerstyle({
        borderColor: getActiveColor(message),
        outlineStyle: 'none',
        display: 'block',
        icon_display: 'block'
      })
    }
    else {
      setcheckerstyle({
        borderColor: 'rgb(118, 116, 116)',
        outlineStyle: 'none',
        display: 'block',
        icon_display: 'block'
      })
    }
  }

  const clearstate = () => {
    setPassword("");
    setMessage("");
    setProgress("");
    setpicon("");
    setcapital("");
    setsmall("");
    setlength("");
    setnumber("");
    setspecial("");
    setcheckerstyle({
      borderColor: 'rgb(118, 116, 116)',
      outlineStyle: 'none',
      display: 'none',
      icon_display: 'none'
    });
  }
  props.clearstatefunc(clearstate);

  const onChangePassword = (passwordValue) => {
    const strengthChecks = {
      length: 0,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };
    strengthChecks.length = passwordValue.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(passwordValue);
    strengthChecks.hasLowerCase = /[a-z]+/.test(passwordValue);
    strengthChecks.hasDigit = /[0-9]+/.test(passwordValue);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(passwordValue);
    if (strengthChecks.length) {
      setlength("bi bi-check-circle-fill");
    }
    else {
      setlength("bi bi-x-circle-fill");
    }
    if (strengthChecks.hasUpperCase) {
      setcapital("bi bi-check-circle-fill");
    }
    else {
      setcapital("bi bi-x-circle-fill");
    }
    if (strengthChecks.hasLowerCase) {
      setsmall("bi bi-check-circle-fill");
    }
    else {
      setsmall("bi bi-x-circle-fill");
    }
    if (strengthChecks.hasDigit) {
      setnumber("bi bi-check-circle-fill");
    }
    else {
      setnumber("bi bi-x-circle-fill");
    }
    if (strengthChecks.hasSpecialChar) {
      setspecial("bi bi-check-circle-fill");
    }
    else {
      setspecial("bi bi-x-circle-fill");
    }
    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length == 5
        ? "Strong"
        : verifiedList.length >= 2
          ? "Medium"
          : "Weak";
    setPassword(passwordValue);
    let temp = passwordValue;
    temp = temp.replace(/\s+/g, '');

    setPassword(temp);
    setProgress(`${(verifiedList.length / 5) * 100}%`);
    setMessage(strength);
    setcheckerstyle({
      borderColor: getActiveColor(message),
      outlineStyle: 'none',
    })
    if (strength == "Strong") {
      setpicon("bi bi-check-circle-fill");
    }
    else {
      setpicon("bi bi-x-circle-fill");
    }
    console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  };
  const getActiveColor = (type) => {
    if (type === "Strong") return "limegreen";
    if (type === "Medium") return "#FEBD01";
    return "#FF0054";
  };
  const getColor = (type) => {
    if (type === "bi bi-x-circle-fill") {
      return "red";
    }
    else {
      return "limegreen";
    }
  }
  function TogglePassword() {
    if (document.getElementById('password').type != "text") {
      setpasstype('text');
      seticon('bi bi-eye-slash-fill');
    }
    else {
      setpasstype('password');
      seticon('bi bi-eye-fill');
    }
  }
  return (
    <div className="form_control">
      <input
        type={passtype}
        name='password'
        id='password'
        value={password}
        onChange={({ target }) => {
          onChangePassword(target.value);
        }}
        placeholder={props.placeholder != ''?'Password':props.placeholder}
        onBlur={focusout}
        onFocus={focusin}
        style={{
          borderColor: checkerstyle.borderColor,
          outlineStyle: checkerstyle.outlineStyle
        }}
      />

      <div className="checker" style={{ display: checkerstyle.display }}>
        {password.length !== 0 ? (
          <div className='password_chart'>
            <div
              className="progress"
              style={{
                width: progress,
                backgroundColor: getActiveColor(message),
                maxWidth: '250px',
                height: '5px'
              }}
            ></div>
            <div className='text_control'>
              <p>Password Length Minimum 8 Letters</p>
              <i className={length} style={{ color: getColor(length) }}></i>
            </div>
            <div className='text_control'>
              <p>Password Has An Upper Case Letter</p>
              <i className={capital} style={{ color: getColor(capital) }}></i>
            </div>
            <div className='text_control'>
              <p>Password Has An Lower Case Letter</p>
              <i className={small} style={{ color: getColor(small) }}></i>
            </div>
            <div className='text_control'>
              <p>Password Has An Number</p>
              <i className={number} style={{ color: getColor(number) }}></i>
            </div>
            <div className='text_control'>
              <p>Password Has An Special Character</p>
              <i className={special} style={{ color: getColor(special) }}></i>
            </div>
          </div>) : null}
      </div>
      <div className="icon"><i className={icon} id='p_icon' onClick={TogglePassword}></i></div>
      <div className="check_icon"><i className={picon} id='picon' style={{ display: checkerstyle.icon_display, color: getColor(picon) }}></i></div>


    </div>
  )
}

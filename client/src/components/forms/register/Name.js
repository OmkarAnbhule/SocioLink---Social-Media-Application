import React, { useState } from 'react'

export default function Name(props) {
  const [Name, setName] = useState("");
  const [nicon, setnicon] = useState("");
  const [checkerstyle, setcheckerstyle] = useState({
    borderColor: 'rgb(118, 116, 116)',
    outlineStyle: 'none'
  })
  const focusout = () => {
    if(Name == ''){
      setcheckerstyle({
        borderColor: 'rgb(118, 116, 116)',
        outlineStyle: 'none',
        Color:'red'
      })
    }
    let t = Name
    t = t.trim()
    setName(t)
    props.callBack(Name,checkerstyle.borderColor)

  }
  const clearstate = () => {
    setName("");
    setnicon("");
    setcheckerstyle({
      borderColor: 'rgb(118, 116, 116)',
      outlineStyle: 'none',
    })
  }

  props.clearstatefunc(clearstate);

  function onChangeName(e) {
    setName(e.target.value)
    let temp = e.target.value;
    temp = temp.replace(/^\s+/g, '');
    setName(temp);
    if (e.target.value.length > 0) {
      setnicon("bi bi-check-circle-fill");
      setcheckerstyle({
        borderColor: 'limegreen',
        outlineStyle: 'none',
        Color:'limegreen'
      })
    }
    else {
      setnicon("bi bi-x-circle-fill");
      setcheckerstyle({
        borderColor: 'red',
        outlineStyle: 'none',
        Color:'red'
      })
    }
  }


  return (
    <div className="form_control">
      <input
        type='text'
        name='name'
        id='name'
        value={Name}
        onChange={onChangeName}
        onBlur={focusout}
        placeholder='Full Name'
        autoComplete='off'
        style={{
          borderColor: checkerstyle.borderColor,
          outlineStyle: checkerstyle.outlineStyle
        }}

      />
      <div className="check_icon"><i className={nicon} id='nicon' style={{color:checkerstyle.Color}}></i></div>
    </div>
  )
}

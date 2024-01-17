import React, { useEffect, useState } from 'react'
export default function Explore() {
    const [Search,setSearch] = useState(null)
    const [path,setPath] = useState(null)
    const [user,setUser] = useState([])
    const handleSearch = (e) => {
        setSearch(e.target.value)
    } 
    useEffect(()=>{
        getData()
    },[Search])
    const getData = async () => {
        let result = await fetch('http://localhost:5000/get-users',{
            method:'post',
            body:JSON.stringify({host:localStorage.getItem('id'),target:Search}),
            headers:{
                'Content-Type':'application/json',
            }
        })
        result = await result.json()
        display(result)
    }
    const display = (res) => {
            if(Search === '' || Search === null){
                setUser([])
            }else{
            console.log(res.data)
            setUser(Object.entries(res.data))
            console.log(user)
            }
    } 
    const handleFollow = async (target) => {
        let result = await fetch('http://localhost:5000/follow',{
            method:'post',
            body:JSON.stringify({host:localStorage.getItem('id'),target}),
            headers:{
                'Content-Type':'application/json',
            }
        })
        result = await result.json()
    }
  return (
    <div className='explore'>
        <p>{Search}</p>
        <input type='text' onChange={handleSearch} value={Search}></input>
        <div>
            {user.length != 0 ? (
                user.map((item,index)=>(
                    item[1].email == localStorage.getItem('id') ? null :
                    (<div key={index}>
                    <img width={50} height={50} src={require(`../../images/profile/${item[1].image}`)}></img>
                    <p>{item[1].username}</p>
                    <button onClick={()=>handleFollow(item[1].email)}>Follow</button>
                    </div>)
                ))):null
            }
        </div>
    </div>
  )
}

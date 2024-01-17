import React, { useEffect } from 'react'

export default function Logout() {
    const id = localStorage.getItem('id')
    async function logout() {
        let result = await fetch("http://localhost:5000/logout", {
            method: 'post',
            body: JSON.stringify({ email: id }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        result = await result.json()
        logout_navigate(result)
        window.close()
    }
    const logout_navigate = (res) => {
        if (res.Response == 'Success') {
            localStorage.clear();
        }
    }
    useEffect(() => {
        logout()
    }, []);
    return null
}

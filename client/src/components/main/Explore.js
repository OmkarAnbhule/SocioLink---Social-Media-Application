import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Explore() {
    const api = process.env.REACT_APP_API_URL;
    const [search, setSearch] = useState('');
    const [user, setUser] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (search.trim() !== '') {
                getData();
            } else {
                setUser([]);
            }
        }, 1000); // Adjust delay time as needed (in milliseconds)

        return () => clearTimeout(delaySearch); // Cleanup function to clear timeout on component unmount
    }, [search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };



    const getData = async () => {
        try {
            const result = await fetch(`${api}user/get-users/${jwtDecode(localStorage.getItem('id')).user}/${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('id')
                },
            });

            const data = await result.json();
            display(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const display = (res) => {
        if (res && res.data) {
            setUser(res.data)
        } else {
            setUser([]);
        }
    };

    const handleFollow = async (target) => {
        try {
            const result = await fetch(`${api}user/followUser`, {
                method: 'POST',
                body: JSON.stringify({ id: jwtDecode(localStorage.getItem('id')).user, target }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('id')
                },
            });

            const data = await result.json();
            // Handle follow response as needed
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    return (
        <div className='explore'>
            <input type='text' onChange={handleSearch} value={search} placeholder='Enter usename or name of user you want to follow' />
            <div className='search-items'>
                <h1>Results</h1>
                {user && user.length > 0 ? (
                    user.map((item, index) => (
                        <div key={index}>
                            <img width={50} height={50} src={item.image} alt={item.username} />
                            <p>{item.username}</p>
                            <button onClick={() => handleFollow(item._id)}>Follow</button>
                        </div>
                    ))
                ) : null}
            </div>
        </div>
    );
}

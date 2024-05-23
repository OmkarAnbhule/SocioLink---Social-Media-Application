import React, { useEffect, useState } from 'react';

export default function Explore() {
    const api = process.env.REACT_APP_API_URL;
    const [search, setSearch] = useState('');
    const [user, setUser] = useState([]);

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
            const result = await fetch(`${api}user/get-users/${localStorage.getItem('id')}/${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':'Bearer '+localStorage.getItem('id')
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
            setUser(Object.entries(res.data).filter(([key, value]) => value._id !== localStorage.getItem('id')));
        } else {
            setUser([]);
        }
    };

    const handleFollow = async (target) => {
        try {
            const result = await fetch(`${api}user/followUser`, {
                method: 'POST',
                body: JSON.stringify({ id: localStorage.getItem('id'), target }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization':'Bearer '+localStorage.getItem('id')
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
            <p>{search}</p>
            <input type='text' onChange={handleSearch} value={search} />
            <div>
                {user.length !== 0 ? (
                    user.map(([key, item], index) => (
                        <div key={index}>
                            <img width={50} height={50} src={require(`../../images/profile/${item.image}`)} alt={item.username} />
                            <p>{item.username}</p>
                            <button onClick={() => handleFollow(item._id)}>Follow</button>
                        </div>
                    ))
                ) : null}
            </div>
        </div>
    );
}

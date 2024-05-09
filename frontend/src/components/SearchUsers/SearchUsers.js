import './SearchUsers.css'
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useUserContext } from '../../Context/UserContext';
import MyLoader from '../MyLoader';
import Friend from '../Friend/Friend';
import { useNavigate } from 'react-router-dom';

const SearchUsers = () => {

    const { user } = useUserContext()
    const [name, setName] = useState('')
    const [searchedUsers, setSearchedUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(name !== '') {
            setLoading(true)
            const timer = setTimeout(async () => {
                console.log("API Call Made")
                fetch(`http://localhost:2000/api/user/getUsers/${name}`, {
                    method: 'GET',
                    headers: {
                        "authorization": `Bearer ${user.access_token}`
                    }
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    setSearchedUsers(data.users)
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                    setLoading(false)
                })
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [name])

    const showFriendProfile = (id) => {
        setName('')
        navigate(`/profile/${id}`)
    }

    return (
        <div className='searchUsers'>
            <div className='searchIcon' onClick={() => setName('')}>
                <SearchIcon sx={{width: '100%', height: '100%', color: 'black'}} />
            </div>
            <input placeholder='Search Users' className='searchInput' value={name} onChange={e => setName(e.target.value)} />
            {name !== '' && 
            <div className='clearSearchIcon' onClick={() => setName('')}>
                <CloseIcon sx={{width: '100%', height: '100%', color: 'black'}} />
            </div>
            }
            {name !== '' && 
            <div className='foundUsersContainer'>
                {loading ? <MyLoader /> : searchedUsers.length === 0 ? <p style={{color: 'black'}}>No entries Found</p> : 
                searchedUsers.map(searchedUser => (
                    <Friend key={searchedUser._id} friend={searchedUser} showFriendProfile={() => showFriendProfile(searchedUser._id)} />
                ))
                }
            </div>
            }
        </div>
    );
}

export default SearchUsers;
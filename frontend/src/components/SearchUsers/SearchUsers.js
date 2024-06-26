import './SearchUsers.css'
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useUserContext } from '../../Context/UserContext';
import MyLoader from '../MyLoader';
import Friend from '../Friend/Friend';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../Context/ThemeContext';

const SearchUsers = ({ setOpenSearch, isMobile }) => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const [name, setName] = useState('')
    const [searchedUsers, setSearchedUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(name !== '') {
            setLoading(true)
            const timer = setTimeout(async () => {
                console.log("API Call Made")
                fetch(`${process.env.REACT_APP_BASE_URL}/api/user/getUsers/${name}`, {
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

    const closeclearSearch = () => {
        if(name === '')
            setOpenSearch(false)
        else setName('')
    }

    return (
        <div className={`searchUsers ${dark && 'searchUsersdark'}`}>
            <div className='searchIcon' onClick={() => setName('')}>
                <SearchIcon sx={{width: '100%', height: '100%', color: 'black'}} />
            </div>
            <input placeholder='Search Users' className={`searchInput ${dark && 'searchInputdark'}`} value={name} onChange={e => setName(e.target.value)} />
            {(isMobile || !isMobile && name !== '') && 
            <div className={`clearSearchIcon ${dark && 'clearSearchIcondark'}`} onClick={closeclearSearch}>
                <CloseIcon sx={{width: '100%', height: '100%', color: 'black'}} />
            </div>
            }
            {name !== '' && 
            <div className={`foundUsersContainer ${dark && 'foundUsersContainerdark'}`}>
                {loading ? <MyLoader /> : searchedUsers.length === 0 ? <p>No entries Found</p> : 
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
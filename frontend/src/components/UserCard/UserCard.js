import './UserCard.css'
import { useState, useEffect } from 'react';
import { Paper, IconButton, InputBase } from '@mui/material'
import MyButton from '../MyButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useUserContext } from '../../Context/UserContext';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import MessageIcon from '@mui/icons-material/Message';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../Firebase/firebaseConfig';
import { v4 } from 'uuid'
import MyModal from '../MyModal';
import MyLoader from '../MyLoader';
import Friend from '../Friend/Friend';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../Context/ThemeContext';
import { callPostApi } from '../../utils/callApi';
import { AvatarSkeletonsTwo } from '../Skeletons';

const UserCard = ({ profileUser }) => {

    useEffect(() => {
        setFollowing(profileUser.followers.includes(user.id))
        setTotalFollowers(profileUser.followers.length)
        setTotalFollowing(profileUser.following.length)
    }, [profileUser])

    const { user, setContextUser } = useUserContext()
    const { dark } = useThemeContext()

    const [profilePic, setProfilePic] = useState(null)
    const [open, setOpen] = useState(false)
    const [openfriend, setOpenFriend] = useState(false)
    const [loading, setLoading] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [friends, setFriends] = useState({friendType: '', friends: []})
    const [searchFriend, setSearchFriend] = useState('')
    const [following, setFollowing] = useState(profileUser.followers.includes(user.id))
    const [totalFollowers, setTotalFollowers] = useState(profileUser.followers.length)
    const [totalFollowing, setTotalFollowing] = useState(profileUser.following.length)

    const navigate = useNavigate()

    const uploadProfileImage = async () => {
        setLoading(true)
        const profileImageUrl = await uploadImage()
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/${user.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.access_token}`
            },
            body: JSON.stringify({profilePic: profileImageUrl})
        })
        .then(res => res.json())
        .then(data => {
            window.localStorage.setItem('user', JSON.stringify({...user, img: data.profilePic}))
            setContextUser({...user, img: data.profilePic})
            setLoading(false)
            setOpen(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
            setOpen(false)
        })
    }

    const uploadImage = async () => {
        try {
            const imageRef = ref(storage, `userImages/${profilePic.name + v4()}`)
            await uploadBytes(imageRef, profilePic)
            const postImageURL = await getDownloadURL(imageRef)
            return postImageURL
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        setProfilePic(null)
        setOpen(false)
    }

    const handleChange = (e) => {
        setProfilePic(e.target.files[0])
        e.target.value = ''
    }

    const getFriends = (friendType) => {
        setOpenFriend(true)
        setLoading(true)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/${profileUser._id}/${friendType}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            },
        })
        .then(res => res.json())
        .then(data => {
            friendType === 'followers' 
                ? 
                setFriends({friendType: 'Followers', friends: data.userfollowers}) 
                : 
                setFriends({friendType: 'Following', friends: data.userfollowings})
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }

    const search = () => {
        console.log(searchFriend)
        setSearchFriend('')
    }

    const showFriendProfile = (id) => {
        setOpenFriend(false)
        navigate(`/profile/${id}`)
    }

    const takeAction = (action) => {
        setButtonLoading(true)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/${action}/${profileUser._id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            },
        })
        .then(res => res.json())
        .then(() => {
            setFollowing(prev => !prev)
            action === 'follow' ? setTotalFollowers(prev => prev + 1) : setTotalFollowers(prev => prev - 1)
            setButtonLoading(false)
        })
        .catch(err => {
            console.error(err)
            setButtonLoading(false)
        })
    }

    const openConversation = async () => {
        try {
            setLoading(true)
            const res = await callPostApi('api/conversation/', user.access_token, {userId: profileUser._id} ,'POST')
            setLoading(false)
            navigate('/messages', { state: {
                conversationId: res._id, 
                member: {id: profileUser._id, username: profileUser.username, profilePic: profileUser.profilePic}
            }})
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <Paper elevation={1} className={`usercard ${dark && 'usercarddark'}`}>
            <div className='userprofile'>
                <div className='profilepic'>
                    <img src={user.id === profileUser._id ? user.img : profileUser.profilePic} />
                    {user.id === profileUser._id && 
                    <label htmlFor='uploadProfilePic' className={`uploadIconLabel ${dark && 'uploadIconLabeldark'}`} onClick={() => setOpen(true)} >
                        <AddAPhotoIcon sx={{fontSize: 30}} />
                        <input id='uploadProfilePic' type='file' onChange={handleChange} style={{display: 'none'}} />       
                    </label>
                    }
                </div>
                <div className='profileInfo'>
                    <h2 style={{margin: '0px'}}>{profileUser.username}</h2>
                    <p style={{marginTop: '2px', color: '#8f8f8f'}}>{profileUser.email}</p>
                </div>
            </div>
            <p style={{marginBottom: '30px'}}>Honestly I am here for a good time...</p>
            {user.id !== profileUser._id &&
            <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
                <div style={{marginRight: '10px'}}>
                    {following ? <MyButton color='error' startIcon={<DeleteIcon />} onClick={() => takeAction('unfollow')} disabled={buttonLoading} endIcon={buttonLoading && <MyLoader size={10} />}>Remove</MyButton>
                    : 
                    <MyButton startIcon={<AddIcon />} onClick={() => takeAction('follow')} disabled={buttonLoading} endIcon={buttonLoading && <MyLoader size={10} />}>Follow</MyButton>
                    }
                </div>
                <div>
                    <MyButton startIcon={<MessageIcon />} endIcon={buttonLoading && <MyLoader size={10} />} onClick={openConversation}>Message</MyButton>
                </div>
            </div>
            }
            <div className={`followWrapper ${dark && 'followWrapperdark'}`} onClick={() => {getFriends('followers')}}>
                Followers <span>{totalFollowers}</span>
            </div>
            <div className={`followWrapper ${dark && 'followWrapperdark'}`} onClick={() => getFriends('following')}>
                Following <span>{totalFollowing}</span>
            </div>
            {profilePic &&
            <MyModal open={open} close={closeModal}>
                <div className='uploadProfilePicModal'>
                    <div className='modalProfileImg'>
                        <img src={URL.createObjectURL(profilePic)} />
                    </div>
                    <div>
                        <MyButton 
                            onClick={uploadProfileImage} 
                            disabled={loading} 
                            endIcon={loading && <MyLoader size={10}/>}
                            startIcon={<UploadFileIcon />}
                        >
                            Upload
                        </MyButton>
                        <MyButton onClick={closeModal} color='error' sx={{marginLeft: '10px'}}>
                            Cancel
                        </MyButton>
                    </div>
                </div>
            </MyModal>
            }
            <MyModal open={openfriend} close={() => setOpenFriend(false)}>
                <div className={`friendModal ${dark && 'friendModaldark'}`}>
                    {loading ? <AvatarSkeletonsTwo /> :
                        <>
                        <div className='friendModalInfo'>
                            <div>
                                <span style={{fontSize: '18px', marginRight: '15px'}}>{friends.friendType}</span>
                                <span style={{fontWeight: 'bold', fontSize: '20px'}}>{friends.friends.length}</span>
                            </div>
                            <IconButton aria-label="close" sx={{width: '40px', height: '40px'}} className={dark ? 'closeIcondark' : ''} onClick={() => setOpenFriend(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className={`searchFriendInput ${dark && 'searchFriendInputdark'}`}>
                            <InputBase endAdornment={<IconButton onClick={search} className={dark ? 'sendIcondark' : ''}><SendIcon /></IconButton>} 
                                sx={{width: '100%', fontSize: '16px'}} 
                                placeholder='Search'
                                value={searchFriend}
                                onChange={e => setSearchFriend(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && search()}
                            />  
                        </div>
                        <div className='friendsList'>
                        {friends.friends.map(friend => (
                            <Friend key={friend._id} friend={friend} showFriendProfile={() => showFriendProfile(friend._id)} />
                        ))}
                        </div>
                        </>
                    }
                </div>
            </MyModal>
        </Paper>
    );
}

export default UserCard;
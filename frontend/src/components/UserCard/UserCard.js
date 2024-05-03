import './UserCard.css'
import { useState } from 'react';
import { Paper } from '@mui/material'
import MyButton from '../MyButton';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useUserContext } from '../../Context/UserContext';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../Firebase/firebaseConfig';
import { v4 } from 'uuid'
import MyModal from '../MyModal';
import MyLoader from '../MyLoader';

const UserCard = ({ profileUser }) => {

    const { user, setContextUser } = useUserContext()

    const [profilePic, setProfilePic] = useState(null)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const uploadProfilePic = () => {
        console.log(profilePic)
        setOpen(true)
    }

    const uploadProfileImage = async () => {
        setLoading(true)
        const profileImageUrl = await uploadImage()
        fetch(`http://localhost:2000/api/user/${user.id}`, {
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
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
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

    return (
        <Paper elevation={1} className='usercard'>
            <div className='userprofile'>
                <div className='profilepic'>
                    <img src={user.id === profileUser._id ? user.img : profileUser.profilePic} />
                    {user.id === profileUser._id && 
                    <label htmlFor='uploadProfilePic' className='uploadIconLabel' onClick={uploadProfilePic} >
                        <AddAPhotoIcon sx={{fontSize: 30}} />
                        <input id='uploadProfilePic' type='file' onChange={handleChange} style={{display: 'none'}} />       
                    </label>
                    }
                </div>
                <div className='profileInfo'>
                    <h2 style={{margin: '0px'}}>{profileUser.username}</h2>
                    <p style={{marginTop: '2px'}}>{profileUser.email}</p>
                </div>
            </div>
            <p style={{marginBottom: '30px'}}>Honestly I am here for a good time...</p>
            {user.id !== profileUser._id &&
            <div style={{marginBottom: '30px'}}>
                <MyButton startIcon={<MessageIcon />} color='error' sx={{marginRight: '15px'}}>Message</MyButton>
                <MyButton startIcon={<AddIcon />}>Follow</MyButton>
            </div>
            }
            <div className='followWrapper'>Followers {profileUser.followers.length}</div>
            <div className='followWrapper'>Following {profileUser.followers.length}</div>
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
        </Paper>
    );
}

export default UserCard;
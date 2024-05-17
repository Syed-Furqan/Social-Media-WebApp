import { InputBase, Avatar, Card } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import './CreatePost.css'
import MyButton from '../MyButton';
import { useState } from 'react';
import MyModal from '../MyModal';
import MyLoader from '../MyLoader';
import { useUserContext } from '../../Context/UserContext';
import { useThemeContext } from '../../Context/ThemeContext';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../Firebase/firebaseConfig';
import { useMediaQuery } from 'react-responsive';
import { v4 } from 'uuid';

const inputStyles = { 
    ml: 1, 
    flex: 1, 
    width: '100%', 
    background: 'rgb(238, 245, 251)', 
    padding: '5px 15px', 
    borderRadius: '16px',
    marginLeft: '10px',
}

const CreatePost = () => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const token = user.access_token

    const [loading, setLoading] = useState(false);

    const [postImg, setPostImg] = useState(null)
    const [desc, setDesc] = useState('')

    const [modalMessage, setModalMessage] = useState('')
    const [open, setOpen] = useState(false)

    const isMobile = useMediaQuery({query: '(max-width: 430px)'})

    const create = async () => {
        setLoading(true)
        let postImageURL = ''
        // Upload Image to Firebase Storage.
        if(postImg) {
            try {
                postImageURL = await uploadImage()
            } catch (error) {
                setLoading(false)
                setModalMessage('Unable to upload Image.')
                setOpen(true)
                return
            }
        }

        const post = {
            username: user.name,
            desc,
            userId: user.id,
            img: postImageURL
        }

        // Upload post with imageUrl to MongoDB.
        fetch(`${process.env.REACT_APP_BASE_URL}/api/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify(post)
        }).then(res => res.json())
        .then(data => {
            if(data?.status === 500) {
                setModalMessage(data.message)
                setOpen(true)
            }
            else {
                setModalMessage(data.message)
                setOpen(true)
            }
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            setModalMessage('Error from Server')
            setOpen(true)
        })
    }

    const uploadImage = async () => {
        try {
            const imageRef = ref(storage, `postImages/${postImg.name + v4()}`)
            await uploadBytes(imageRef, postImg)
            const postImageURL = await getDownloadURL(imageRef)
            return postImageURL
        } catch (error) {
            console.log(error)
        }
    }

    const postShared = () => {
        setPostImg(null)
        setDesc('')
        setOpen(false)
    }

    const avatarStyles = {
        width: isMobile ? '45px' : '60px',
        height: isMobile ? '45px' : '60px'
    }

    return (
        <>
            <Card className={`createpost ${dark && 'createpostdark'}`}>
                <div className='inputWrapper'>
                    {user.img ? <Avatar alt="Remy Sharp" src={user.img} sx={avatarStyles} /> : 
                    <Avatar sx={{ bgcolor: 'brown' }}>{user.name[0]}</Avatar>}
                    <InputBase
                        sx={inputStyles}
                        className={dark ? 'customsearchinputdark' : ''}
                        placeholder="What's on your mind?"
                        onChange={e => setDesc(e.target.value)}
                        value={desc}
                    />
                </div>
                {postImg && 
                    <div className='previewImg'>
                        <img src={URL.createObjectURL(postImg)} />
                    </div> 
                }
                <MyButton startIcon={<ImageIcon />}>
                    <label>
                        Image
                        <input type='file' accept='image/jpg, image/jpeg, image/png' 
                            style={{display: 'none'}}
                            onChange={(e) => setPostImg(e.target.files[0])} 
                        />
                    </label>
                </MyButton>
                <MyButton sx={{marginLeft: '10px'}} color="success" onClick={create} disabled={loading} endIcon={loading && <MyLoader size={10} />}>
                    Share
                </MyButton>
            </Card>
            <MyModal open={open} close={() => setOpen(false)}>
                <div style={{padding: '10px'}}>
                    <h3>{modalMessage}</h3>
                    <MyButton sx={{width: '30px'}} variant='outlined' onClick={postShared}>Ok</MyButton>
                </div>
            </MyModal>
        </>

    );
}

export default CreatePost;
import './NewPassword.css';
import { InputBase } from '@mui/material';
import { useEffect, useState } from 'react';
import MyButton from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import { useNavigate, useParams } from 'react-router-dom';

const inputStyles = { 
    ml: 1, 
    flex: 1, 
    width: '100%', 
    background: 'rgb(228 243 255)',
    padding: '0 20px',
    borderRadius: '24px',
    fontSize: '16px',
    height: '100%',
    margin: '0px'
}

const NewPassword = () => {

    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState({message: '', status: false})
    const [message, setMessage] = useState({message: '', status: false})
    const [id, setId] = useState(null)
    
    const navigate = useNavigate()

    const { token } = useParams()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/checkresetlink`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data?.status === 404) {
                setError({message: data.message, status: true})
            } else setId(data.id)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }, [])

    const changePassword = () => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/resetPassword/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({password})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data?.status === 404) {
                setError({message: data.message, status: true})
                setLoading(false)
            } else {
                setLoading(false)
                setMessage({message: data.message, status: true})
            }
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    return (
        <div className='newPassword'>
            {loading ? <MyLoader size={50} /> :
            error.status ? <p style={{color: 'red', textAlign: 'center'}}>{error.message}</p> :
            message.status 
                ? 
                <div>
                    <p style={{color: 'green'}}>{message.message}</p>
                    <p className='resettologin' onClick={() => navigate('/login')}>Back to Login</p>
                </div> 
                : 
            <>
            <h1 className='resetTitle'>Password Reset</h1>
            <div className='resetInputWrapper'>
                <InputBase sx={inputStyles} placeholder='Enter new Password' type='password' onChange={e => setPassword(e.target.value)} value={password} />
            </div>
            <div className='resetBtn'>
                <MyButton onClick={changePassword} disabled={loading} className='changeBtn' 
                    endIcon={loading && <MyLoader size={15} sx={{color: 'white'}} /> }>
                    Change
                </MyButton> 
            </div>
            </>
            }
        </div>
    );
}

export default NewPassword;
import './Reset.css';
import { useState } from 'react';
import { InputBase } from '@mui/material';
import MyButton from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import { useNavigate } from 'react-router-dom';

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

const Reset = () => {

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const [message, setMessage] = useState({message: '', status: false})
    const [error, setError] = useState({message: '', status: false})

    const navigate = useNavigate()

    const sendLink = () => {
        setError({message: '', status: false})
        setMessage({message: '', status: false})
        setLoading(true)
        fetch('http://localhost:2000/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email})
        }).then(res => res.json())
        .then(data => {
            if(data?.status === 404) {
                setLoading(false)
                setError({message: data.message, status: true})
            } else {
                setLoading(false)
                setMessage({message: data.message, status: true})
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="resetEmail">
            <h3 style={{textAlign: 'center', color: 'black'}}>Enter your registered email</h3>
            <div style={{width: '100%', height: '52px'}}>
                <InputBase 
                    type='email' 
                    placeholder='Email' 
                    sx={inputStyles} 
                    variant='outlined' 
                    onChange={e => setEmail(e.target.value)} 
                    value={email} 
                />
                <div className='resetBtn'>
                    <MyButton onClick={sendLink} disabled={loading} className='resetBtn' 
                        endIcon={loading && <MyLoader size={15} sx={{color: 'white'}} /> }>
                        Send Link
                    </MyButton> 
                </div>
                <p className='backtologin' onClick={() => navigate('/login')}>Back to Login</p>
                {error.status && <p style={{color: 'red', textAlign: 'center'}}>{error.message}</p>}
                {message.status && <p style={{color: 'green', textAlign: 'center'}}>{message.message}</p>}
            </div>
        </div>
    );
}

export default Reset;
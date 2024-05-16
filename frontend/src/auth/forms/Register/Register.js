import './Register.css';
import { InputBase } from '@mui/material';
import { useState } from 'react';
import MyLoader from '../../../components/MyLoader';
import MyButton from '../../../components/MyButton';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../Context/UserContext';
import Logo from '../../../components/Logo/Logo';
import { useMediaQuery } from 'react-responsive';

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

const Register = () => {
    const { setContextUser } = useUserContext()
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassWord] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({message: '', status: false})

    const register = () => {
        setError({message: '', status: false})
        setLoading(true)
        const newUser = { email, username, password }

        fetch('http://localhost:2000/api/auth/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            setLoading(false)
            if(data?.status === 404 || data?.status === 500) {
                setError({message: data.message, status: true})
            } else {
                localStorage.setItem('user', JSON.stringify(data))
                setContextUser(data)
                setLoading(false)
                navigate('/')
            }
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
            setError({message: 'Error From Server !', status: true})
        })
    }

    const isSmallDevice = useMediaQuery({query: '(max-width: 450px)'})

    return (
        <div className='registerWrapper'>
            <Logo styles={{borderRadius: isSmallDevice ? '0' : '8px 8px 0 0'}} />
            <div className='Register'>
                <h1 className='registerTitle'>Register</h1>
                <div className='authInputWrapper'>
                    <InputBase sx={inputStyles} placeholder='email' type='email' onChange={e => setEmail(e.target.value)} value={email} />
                </div>
                <div className='authInputWrapper'>
                    <InputBase sx={inputStyles} placeholder='Username' type='text' onChange={e => setUsername(e.target.value)} value={username} />
                </div>
                <div className='authInputWrapper'>
                    <InputBase sx={inputStyles} placeholder='Password' type='password' onChange={e => setPassWord(e.target.value)} value={password} />
                </div>
                <div className='authBtn'>
                <MyButton onClick={() => register()} disabled={loading} className='registerBtn' 
                    endIcon={loading && <MyLoader size={15} sx={{color: 'white'}} />}>
                    Register
                </MyButton>
                </div>
                <div className='alreadyAccount'>
                    <p>Already have an account?</p>
                    <p onClick={() => navigate('/login')} className='signuplink'>Sign In</p>
                </div>
                {error.status && <p style={{color: 'red'}}>{error.message}</p>}
            </div>
        </div>
    );
}

export default Register;
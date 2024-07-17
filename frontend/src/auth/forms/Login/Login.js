import { InputBase } from '@mui/material';
import MyButton from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../Context/UserContext';
import { useGoogleLogin } from '@react-oauth/google';
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

const Login = () => {
    const { setContextUser } = useUserContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({message: '', status: false})

    const login = () => {
        setError({message: '', status: false})
        setLoading(true)
        const user = { email, password }

        fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        }).then(res => res.json())
        .then(data => {
            if(data?.status === 404 || data?.status === 500) {
                setError({message: data.message, status: true})
                setLoading(false)
            } else {
                localStorage.setItem('user', JSON.stringify(data))
                setContextUser(data)
                setLoading(false)
                navigate('/')
            }
        })
        .catch(err => {
            setLoading(false)
            setError({message: err.message, status: true})
        })
    }

    const oauthsuccess = (response) => {
        console.log(response)
        setLoading(true)
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`)
            .then(res => res.json())
            .then(data => {
                fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/oauthgoogle`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if(data?.status === 404) {
                        setError({message: data.message, status: true})
                        setLoading(false)
                    } else {
                        localStorage.setItem('user', JSON.stringify(data))
                        setContextUser(data)
                        setLoading(false)
                        navigate('/')
                    }
                })
                .catch(err => {
                    setLoading(false)
                    setError({message: err.message, status: true})
                })
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const oauthLogin = useGoogleLogin({
        onSuccess: oauthsuccess,
        onError: err => {
            console.log(err)
            setError({message: err.message, status: true})
        }
    })

    const isSmallDevice = useMediaQuery({query: '(max-width: 450px)'})

    return (
        <div className='loginWrapper'>
            <Logo styles={{borderRadius: isSmallDevice ? '0' : '8px 8px 0 0'}} />
            <div className='Login'>
                <h1 className='loginTitle'>Login</h1>
                <div className='authInputWrapper'>
                    <InputBase type='email' placeholder='Email' sx={inputStyles} onChange={e => setEmail(e.target.value)} value={email} />
                </div>
                <div className='authInputWrapper'>
                    <InputBase type='password' placeholder='Password' sx={inputStyles} variant='outlined' onChange={e => setPassWord(e.target.value)} value={password} />
                </div>
                <p onClick={() => navigate('/resetPassword')} className='forgotpasslink'>Forgot Password?</p>
                <div className='authBtn'>
                    <MyButton onClick={login} disabled={loading} className='loginBtn' 
                        endIcon={loading && <MyLoader size={15} sx={{color: 'white'}} />}>
                       Sign In
                    </MyButton> 
                </div>
                <div className='alreadyAccount'>
                    <p>Don't have an account?</p>
                    <p onClick={() => navigate('/register')} className='signuplink'>Sign Up</p>
                </div>
                <div style={{marginBottom: '10px'}}>OR</div>
                <div className='authBtn'>
                    <MyButton onClick={oauthLogin} className='googleBtn' startIcon={<img src='/assets/icons/google.svg' style={{marginRight: '10px'}}/>}>Sign In with Google</MyButton>
                </div>
                {error.status && <p style={{color: 'red'}}>{error.message}</p>}
            </div>
        </div>
    );
}

export default Login;
import { OutlinedInput } from '@mui/material';
import MyButton from '../../../components/MyButton';
import MyLoader from '../../../components/MyLoader';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../Context/UserContext';

const Login = () => {

    const { setContextUser } = useUserContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({message: '', status: false})

    const login = () => {
        setLoading(true)
        const user = { email, password }

        fetch('http://localhost:2000/api/auth/login', {
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
            setError({message: 'Error From Server !', status: true})
        })
    }

    return (
        <div className='Login'>
            <OutlinedInput type='email' placeholder='email'  onChange={e => setEmail(e.target.value)} value={email} />
            <OutlinedInput type='password' placeholder='Password' variant='outlined' onChange={e => setPassWord(e.target.value)} value={password} />
            <MyButton onClick={() => login()} disabled={loading} >
                {loading ? <MyLoader /> : 'Login'}
            </MyButton>
            {error.status && <p style={{color: 'red'}}>{error.message}</p>}
        </div>
    );
}

export default Login;
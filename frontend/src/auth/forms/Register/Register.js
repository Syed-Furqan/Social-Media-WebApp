import './Register.css';
import { OutlinedInput } from '@mui/material';
import { useState } from 'react';
import MyLoader from '../../../components/MyLoader';
import MyButton from '../../../components/MyButton';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../Context/UserContext';

const Register = () => {
    const { setContextUser } = useUserContext()
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassWord] = useState('');
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({message: '', status: false})

    const register = () => {
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

    return (
        <div className='Register'>
            <h1>Register</h1>
            <OutlinedInput placeholder='email' style={{margin: '10px'}}  onChange={e => setEmail(e.target.value)} value={email} />
            <OutlinedInput placeholder='Username' style={{margin: '10px'}}  onChange={e => setUsername(e.target.value)} value={username} />
            <OutlinedInput placeholder='Password' style={{margin: '10px'}}  onChange={e => setPassWord(e.target.value)} value={password} />
            <MyButton  style={{margin: '10px'}}  onClick={() => register()} disabled={loading} >
                {loading ? <MyLoader /> : 'Register'}
            </MyButton>
            {error.status && <p style={{color: 'red'}}>{error.message}</p>}
        </div>
    );
}

export default Register;
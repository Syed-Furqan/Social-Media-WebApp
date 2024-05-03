import './App.css';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './root/pages/Home/Home';
import Login from './auth/forms/Login/Login';
import Register from './auth/forms/Register/Register';
import AuthLayout from './auth/authLayout';
import RootLayout from './root/rootLayout';
import Profile from './root/pages/Profile/Profile';
import MyLoader from './components/MyLoader';
import { useUserContext } from './Context/UserContext';
import Message from './root/pages/Message/Message';

function App() {  

  const [loading, setLoading] = useState(true)

  const { user, setContextUser } = useUserContext()

  useEffect(() => {
    const logged_user = localStorage.getItem('user')
    if(logged_user) {
      setContextUser(JSON.parse(logged_user))
      setLoading(false)
    } else setLoading(false)
  }, []);

  return (
    <>
      {loading ?
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '100px'}}>
          <MyLoader size={50}/>
        </div> 
        :
        <Routes>
          <Route element={user.access_token ? <RootLayout /> : <Navigate to='/login' />}>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Message />} />
            <Route path='/profile/:id'>
              <Route index element={<Profile />} />
              <Route path='settings' element={<p>Settings</p>}/>
            </Route>
          </Route>
        
          <Route element={!user.access_token ? <AuthLayout /> : <Navigate to='/'/>}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

        </Routes>
      }
    </>
  );
}

export default App;
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './root/pages/Home/Home';
import Login from './auth/forms/Login/Login';
import Register from './auth/forms/Register/Register';
import AuthLayout from './auth/authLayout';
import RootLayout from './root/rootLayout';
import Profile from './root/pages/Profile/Profile';
import About from './root/pages/About/About';
import Message from './root/pages/Message/Message';
import NewPassword from './auth/forms/NewPassword/NewPassword';
import Reset from './auth/forms/Reset/Reset';
import { useUserContext } from './Context/UserContext';
import { useThemeContext } from './Context/ThemeContext';
import Notification from './root/pages/Notifcation/Notification';

function App() {  

  const { user } = useUserContext()
  const { dark } = useThemeContext()

  return (
    <div className={dark ? 'Appdark' : 'App'}>
        <Routes>
          <Route element={user.access_token ? <RootLayout /> : <Navigate to='/login' />}>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Message />} />
            <Route path='/about' element={<About />} />
            <Route path='/notifications' element={<Notification />} />
            <Route path='/profile/:id'>
              <Route index element={<Profile />} />
              <Route path='settings' element={<p>Settings</p>}/>
            </Route>
          </Route>
        
          <Route element={!user.access_token ? <AuthLayout /> : <Navigate to='/'/>}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/resetPassword' element={<Reset />} />
            <Route path='/resetPassword/:token' element={<NewPassword />} />
          </Route>

          <Route path='*' element={<p>Page Not Found!!!</p>} />

        </Routes>
    </div>
  );
}

export default App;
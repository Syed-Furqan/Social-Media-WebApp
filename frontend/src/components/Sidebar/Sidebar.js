import './Sidebar.css'
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { useSocketContext } from '../../Context/SocketContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const iconstyles = {
    width: '100%',
    height: '100%',
}

const Sidebar = () => {

    const { user, setContextUser } = useUserContext()
    const { socket } = useSocketContext()

    const topItems = [
        {name: 'Home', icon: <HomeIcon sx={iconstyles} />, link: '/'}, 
        {name: 'Profile', icon: <PersonIcon sx={iconstyles} />, link: `/profile/${user.id}`},
        {name: 'Messages', icon: <MessageIcon sx={iconstyles} />, link: '/messages'}
    ]
    const bottomItems = [
        {name: 'Settings', icon: <SettingsIcon sx={iconstyles} />, link: `/profile/${user.id}/settings`}, 
        {name: 'About', icon: <InfoIcon sx={iconstyles} />, link: '/about'}
    ]

    const [currentItemLink, setCurrentItemLink] = useState('')
    const location = useLocation()
    const currentPath = location.pathname

    useEffect(() => {
        if(currentItemLink !== currentPath) {
            setCurrentItemLink(currentPath)
        }
    }, [location])

    const logout = () => {
        localStorage.removeItem('user')
        socket.disconnect()
        setContextUser({access_token: null, name: '', id: '', img: ''})
    }

    return (
        <div className='sidebar'>
            <div>
                {topItems.map(item => (
                <Link key={item.link} to={item.link} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className={`sidebaritem ${(currentItemLink === item.link) && 'activesidebaritem'}`}>
                        <div className='sidebaritemicon'>{item.icon}</div>
                        <div className='sidebariteminfo'>{item.name}</div>
                    </div>
                </Link>
                ))}
            </div>
            <div>
                {bottomItems.map(item => (
                <Link key={item.link} to={item.link} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className={`sidebaritem ${(currentItemLink === item.link) && 'activesidebaritem'}`}>
                        <div className='sidebaritemicon'>{item.icon}</div>
                        <div className='sidebariteminfo'>{item.name}</div>
                    </div>
                </Link>
                ))}
                <div className='sidebaritem' onClick={logout} >
                    <div className='sidebaritemicon'><LogoutIcon sx={iconstyles} /></div>
                    <div className='sidebariteminfo'>Logout</div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
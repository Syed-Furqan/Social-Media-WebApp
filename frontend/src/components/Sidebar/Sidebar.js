import './Sidebar.css'
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { useSocketContext } from '../../Context/SocketContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useThemeContext } from '../../Context/ThemeContext';
import { callGetApi } from '../../utils/callApi';
import MyLoader from '../MyLoader';

const iconstyles = {
    width: '100%',
    height: '100%',
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {

    const { user, setContextUser } = useUserContext()
    const { newNotifications, setNewNotifications } = useSocketContext() 
    const { socket } = useSocketContext()
    const { dark } = useThemeContext()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)

    const topItems = [
        {name: 'Home', icon: <HomeIcon sx={{...iconstyles, color: '#18a9bb'}} />, link: '/'}, 
        {name: 'Profile', icon: <PersonIcon sx={{...iconstyles, color: 'purple'}} />, link: `/profile/${user.id}`},
        {name: 'Messages', icon: <MessageIcon sx={{...iconstyles, color: 'green'}} />, link: '/messages'},
        {name: 'Notifications', icon: <NotificationsIcon sx={{...iconstyles, color: '#0074bf'}} />, link: '/notifications'}
    ]
    const bottomItems = [
        {name: 'Settings', icon: <SettingsIcon sx={{...iconstyles, color: '#646464'}} />, link: `/profile/${user.id}/settings`}, 
        {name: 'About', icon: <InfoIcon sx={{...iconstyles, color: '#cb8300'}} />, link: '/about'}
    ]

    const [currentItemLink, setCurrentItemLink] = useState('')
    const location = useLocation()
    const currentPath = location.pathname

    useEffect(() => {
        if(currentItemLink !== currentPath) {
            setCurrentItemLink(currentPath)
        }
    }, [location])

    useEffect(() => {
        setLoading(true)
        callGetApi('api/notification/new', user.access_token)
        .then(res => {
            setNewNotifications(res.count)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [])

    const handleSidebarLink = (link) => {
        setSidebarOpen(false)
        navigate(link)
    }

    const logout = () => {
        localStorage.removeItem('user')
        socket.disconnect()
        googleLogout()
        setContextUser({access_token: null, name: '', id: '', img: ''})
    }

    return (
        <div className={`sidebar ${dark && 'sidebardark'} ${sidebarOpen && 'tabletSidebar'}`}>
            {loading ? <MyLoader size={15} /> :
            <>
            <div>
                {topItems.map(item => (
                <div key={item.link} onClick={() => handleSidebarLink(item.link)}>
                    <div className={`sidebaritem ${ dark && 'sidebaritemdark'} ${(currentItemLink === item.link) && `activesidebaritem ${dark && 'activesidebaritemdark'}`}`}>
                        <div className='sidebaritemicon'>{item.icon}</div>
                        <div className='sidebariteminfo'>{item.name}</div>
                        {item.name === 'Notifications' && newNotifications != 0 && 
                        <div className='sidebaritemnotifications'>
                            {newNotifications}
                        </div>}
                    </div>
                </div>
                ))}
            </div>
            <div>
                {bottomItems.map(item => (
                <div key={item.link} to={item.link} onClick={() => handleSidebarLink(item.link)}>
                    <div className={`sidebaritem ${ dark && 'sidebaritemdark'} ${(currentItemLink === item.link) && `activesidebaritem ${dark && 'activesidebaritemdark'}`}`}>
                        <div className='sidebaritemicon'>{item.icon}</div>
                        <div className='sidebariteminfo'>{item.name}</div>
                    </div>
                </div>
                ))}
                <div className={`sidebaritem ${ dark && 'sidebaritemdark'}`} onClick={logout} >
                    <div className='sidebaritemicon'><LogoutIcon sx={{...iconstyles, color: '#ba0202'}} /></div>
                    <div className='sidebariteminfo'>Logout</div>
                </div>
            </div>
            </>
            }
        </div>
    );
}

export default Sidebar;
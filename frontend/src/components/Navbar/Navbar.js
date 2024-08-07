import './Navbar.css'
import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { useSocketContext } from '../../Context/SocketContext';
import SearchUsers from '../SearchUsers/SearchUsers';
import { googleLogout } from '@react-oauth/google';
import { useThemeContext } from '../../Context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Logo from '../Logo/Logo';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

const Navbar = ({sidebarOpen, setSidebarOpen, setRightbarOpen}) => {
  const { user, setContextUser } = useUserContext()
  const { socket } = useSocketContext()
  const { dark, setContextDark } = useThemeContext()

  const navigate = useNavigate()

  const isTablet = useMediaQuery({query: '(max-width: 1050px)'})
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const isSmallDevice = useMediaQuery({query: '(max-width: 450px)'})

  const [openSearch, setOpenSearch] = useState(false)

  const location = useLocation()
  const currentPath = location.pathname

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  const logout = () => {
      handleCloseUserMenu()
      // Logout
      localStorage.removeItem('user')
      socket.disconnect()
      googleLogout()
      setContextUser({access_token: null, name: '', id: '', img: ''})
  }

  const changeTheme = () => {
    localStorage.setItem('dark', JSON.stringify(!dark))
    setContextDark(prev => !prev)
  }

  const logoStyles = {
    width: isSmallDevice ? '110px' : isMobile ? '140px' : '180px', 
    height: isSmallDevice ? '45px' : isMobile ? '50px' : '60px', 
    background: 'none', 
    fontSize: isSmallDevice ? '17px' : isMobile ? '20px' : '25px' 
  }

  return (
    <AppBar position="static" sx={{height: '70px', boxShadow: 'none !important'}} className={dark ? 'appbardark' : ''}>
      <Container maxWidth="xl" sx={{height: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%'}} >
          <div className='logoWrapper'>
            {isTablet &&
            <IconButton onClick={() => setSidebarOpen(prev => !prev)}>
              {sidebarOpen ? <CloseIcon sx={{color: 'white'}} /> : <MenuIcon sx={{color: 'white'}} />}
            </IconButton>
            }
            <Logo styles={logoStyles} 
              onClick={() => navigate('/')} 
            />
            {isMobile && !openSearch && 
              <IconButton onClick={() => setOpenSearch(true)}>
                <SearchIcon sx={{color: 'white'}}/>
              </IconButton>
            }
          </div>
          {(!isMobile || isMobile && openSearch) && <SearchUsers setOpenSearch={setOpenSearch} isMobile={isMobile} />}
          <div className='navbarrightIcons'>
            {currentPath === '/' && isMobile &&
            <IconButton onClick={() => setRightbarOpen(prev => !prev)}>
              <PeopleIcon sx={{color: 'white'}} />
            </IconButton>
            }
            <IconButton onClick={changeTheme} sx={{marginRight: '20px'}}>
              {dark ? <LightModeIcon sx={{color: 'white'}}/> : <DarkModeIcon sx={{color: 'black'}} />}
            </IconButton>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user.img ? <Avatar alt="Remy Sharp" src={user.img} /> : 
                  <Avatar sx={{ bgcolor: 'brown' }}>{user.name[0]}</Avatar>}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                  <MenuItem onClick={handleCloseUserMenu}>
                      <Link to={`/profile/${user.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                          <Typography textAlign="center">Profile</Typography>
                      </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                      <Link to={`/profile/${user.id}/settings`} style={{textDecoration: 'none', color: 'inherit'}}>
                          <Typography textAlign="center">Settings</Typography>
                      </Link>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                      <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
      </Container>
    </AppBar>
    );
}

export default Navbar;
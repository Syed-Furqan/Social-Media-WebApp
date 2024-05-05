import './Navbar.css'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { useSocketContext } from '../../Context/SocketContext';

const Navbar = () => {
    const { user, setContextUser } = useUserContext()
    const { socket } = useSocketContext()

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        
        handleCloseUserMenu()

        // Show Modal

        // Logout
        localStorage.removeItem('user')
        socket.disconnect()
        setContextUser({access_token: null, name: '', id: '', img: ''})
        
    }

  return (
    <AppBar position="static" sx={{height: '60px'}}>
      <Container maxWidth="xl" sx={{height: '100%'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%'}} >
          <Link to='/'><img src='/assets/images/logo.svg' alt='logo' style={{width: '140px'}}/></Link>
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
      </Container>
    </AppBar>
    );
}

export default Navbar;
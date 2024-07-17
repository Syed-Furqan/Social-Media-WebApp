import './rootLayout.css';
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import AlertNotification from '../components/AlertNotification/AlertNotification';
import { useSocketContext } from '../Context/SocketContext';

const RootLayout = () => {

    const isTablet = useMediaQuery({query: '(max-width: 1050px)'})

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [rightbarOpen, setRightbarOpen] = useState(false)

    const { notificationAlert } = useSocketContext()

    return (
        <div className="rootLayout">
            {notificationAlert.status && <div className='alertBar'><AlertNotification data={notificationAlert.data}/></div>}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setRightbarOpen={setRightbarOpen} />
            <div className="rootWrapper">
                {(!isTablet || (isTablet && sidebarOpen)) && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> }
                <div className='rootOutlet'>
                    <Outlet context={rightbarOpen} />  
                </div>
            </div>
        </div>
    );
}

export default RootLayout;
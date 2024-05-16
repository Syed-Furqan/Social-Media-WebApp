import './rootLayout.css';
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const RootLayout = () => {

    const isTablet = useMediaQuery({query: '(max-width: 1050px)'})

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [rightbarOpen, setRightbarOpen] = useState(false)

    return (
        <div className="rootLayout">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setRightbarOpen={setRightbarOpen} />
            <div className="rootWrapper">
                {(!isTablet || isTablet && sidebarOpen) && <Sidebar sidebarOpen={sidebarOpen}/> }
                <div className='rootOutlet'>
                    <Outlet context={rightbarOpen} />  
                </div>
            </div>
        </div>
    );
}

export default RootLayout;
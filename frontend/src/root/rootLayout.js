import './rootLayout.css';
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const RootLayout = () => {
    return (
        <div className="rootLayout">
            <Navbar />
            <div className="rootWrapper">
                <Sidebar />
                <div className='rootOutlet'>
                    <Outlet />  
                </div>
            </div>
        </div>
    );
}

export default RootLayout;
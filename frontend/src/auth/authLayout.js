import './authLayout.css'
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="authLayout">
            <div className='authWrapper'>
                <Outlet context="You can pass anything here and it will be accessible to all children" />
            </div>
            <div className='sideImg'>
                <img src='/assets/images/side-img.svg' alt='sideLogo' />
            </div>
        </div>
    );
}

export default AuthLayout;
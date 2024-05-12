import './authLayout.css'
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="authLayout">
            <div style={{width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.8}}></div>
            <div className='authWrapper'>
                <Outlet context="You can pass anything here and it will be accessible to all children" />
            </div>
        </div>
    );
}

export default AuthLayout;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './Context/UserContext';
import { SocketProvider } from './Context/SocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './Context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <UserProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </UserProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
);
import { useEffect } from 'react';
import { Button, Box } from '@chakra-ui/react';
import {
  initializeGapiClient,
  gisLoaded,
  handleAuthClick,
  handleSignoutClick,
  }
  from "../google/auth"

const GoogleAuthButton = (prop) => {
  const setAuth = prop.setAuth
  const auth = prop.auth

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.onload = () => {
      window.gapi.load('client', initializeGapiClient);
    };
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.onload = () => {
      gisLoaded();
    };
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <Box p={4} m={7}>
      <Button id="authorize_button" onClick={() => handleAuthClick(setAuth)} style={{ display: !auth ? 'block' : 'none' }}>
        Iniciar sesión Google
      </Button>
      <Button id="signout_button" onClick={() => handleSignoutClick(setAuth)} style={{ display: auth ? 'block' : 'none' }}>
        Cerrar sesión
      </Button>
    </Box>
  );
};

export default GoogleAuthButton;

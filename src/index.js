import React from 'react';
import ReactDOM from 'react-dom/client';
//import './styles.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ChakraProvider>
        <Toaster />
        <App />
    </ChakraProvider>
);

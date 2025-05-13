import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import { theme } from './components/ColorModeSwitcher';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ChakraProvider theme={theme}>
        <CSSReset />
        <Toaster />
        <App />
    </ChakraProvider>
);

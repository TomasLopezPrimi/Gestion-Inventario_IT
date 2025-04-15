import React from 'react';
import { useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { extendTheme } from '@chakra-ui/react';

//Caracteristicas del tema
export const theme = extendTheme({
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    styles: {
      global: {
        body: {
          bg: 'gray.50', // Color de fondo para el modo claro
          color: 'gray.700', // Color de texto para el modo claro
        },
        _dark: {
          body: {
            bg: 'gray.700', // Color de fondo para el modo oscuro
            color: 'whiteAlpha.900', // Color de texto para el modo oscuro
          },
        },
      },
    },
    //No funcionan correctamente los estilos en la lista del buscador 
    components: {
      List: {
        baseStyle: {
          bg: 'white', // Color de fondo para el modo claro
        },
        variants: {
          dark: {
            bg: 'gray.500', // Color de fondo para el modo oscuro
          },
        },
      },
    },
  });
//Botón del switch
export const ColorModeSwitcher = () => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
    />
  );
};


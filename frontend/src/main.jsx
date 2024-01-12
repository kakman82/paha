import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from './store.js';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import './index.css';

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // iki kez useeffect çalışmasın diye bu şekilde yaptım StrictMode commnete aldım
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <ChakraProvider
        toastOptions={{ defaultOptions: { position: 'bottom' } }}
        theme={theme}
      >
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </ChakraProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);

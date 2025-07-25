import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App';
import AuthProvider from './contexts/AuthContext';
import { CartProvider } from "./contexts/CartContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { NotificationProvider } from "./contexts/NotificationContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </LoadingProvider>
  </BrowserRouter>,
);



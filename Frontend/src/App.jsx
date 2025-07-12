import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPass from './pages/ForgotPass';
import AdminHomePage from './pages/AdminHomePage';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<Authentication formType='login' />} />
                <Route path='/signup' element={<Authentication formType='signup' />} />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route path='/forgotpass' element={<ForgotPass />} />
                <Route path='/admin/home' element={<AdminHomePage />} />
            </Route>
        </Routes>
    );
}

export default App;
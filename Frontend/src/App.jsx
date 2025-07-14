import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPass from './pages/ForgotPass';
import AdminHomePage from './pages/AdminHomePage';
import AddPizzasPage from './pages/AddPizzasPage';
import AdminProtectedRoute from './pages/AdminProtectedRoutes';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<Authentication formType='login' />} />
                <Route path='/signup' element={<Authentication formType='signup' />} />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route path='/forgotpass' element={<ForgotPass />} />
                <Route
                    path="/admin/home"
                    element={
                        <AdminProtectedRoute>
                            <AdminHomePage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/addpizza"
                    element={
                        <AdminProtectedRoute>
                            <AddPizzasPage />
                        </AdminProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/commonPages/Authentication';
import MainLayout from './layout/MainLayout'
import HomePage from './pages/userPages/HomePage';
import VerifyEmail from './pages/commonPages/VerifyEmail';
import ForgotPass from './pages/commonPages/ForgotPass';
import AdminHomePage from './pages/adminPages/AdminHomePage';
import AddPizzasPage from './pages/adminPages/AddPizzasPage';
import AdminProtectedRoute from './routes/AdminProtectedRoutes';
import ShowPizzasPage from './pages/userPages/ShowPizzasPage';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<Authentication formType='login' />} />
                <Route path='/signup' element={<Authentication formType='signup' />} />
                <Route path='/verifyemail' element={<VerifyEmail />} />
                <Route path='/forgotpass' element={<ForgotPass />} />
                <Route path='/showallpizzas' element={<ShowPizzasPage />} />
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
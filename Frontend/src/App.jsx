import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/commonPages/Authentication';
import MainLayout from './layout/MainLayout'
import HomePage from './pages/userPages/HomePage';
import VerifyEmail from './pages/commonPages/VerifyEmail';
import ForgotPass from './pages/commonPages/ForgotPass';
import AdminHomePage from './pages/adminPages/AdminHomePage';
import AddPizzasPage from './pages/adminPages/AddPizzasPage';
import AdminProtectedRoute from './routes/AdminProtectedRoutes';
import ShowPizzasPage from './pages/commonPages/ShowPizzasPage';
import UpdatePizzaForm from './pages/adminPages/UpdatePizzaForm';
import InventoryManagementPage from './pages/adminPages/InventoryManagementPage';
import AddIngridientPage from './pages/adminPages/AddIngridientPage';
import UpdateIngredientForm from './pages/adminPages/UpdateIngredientForm';
import CreatePizzaPage from './pages/userPages/CreatePizzaPage';
import UserCreatedPizzas from './pages/userPages/UserCreatedPizzas';
import UpdateCustomizedPizza from './pages/userPages/UpdateCustomizedPizza';
import CartPanel from './components/CartComponent';
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();

    const showCartOnRoutes = [
        "/showallpizzas",
        "/allcustomizedpizza",
    ];

    const shouldShowCart = showCartOnRoutes.includes(location.pathname);
    return (
        <>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<Authentication formType='login' />} />
                    <Route path='/signup' element={<Authentication formType='signup' />} />
                    <Route path='/verifyemail' element={<VerifyEmail />} />
                    <Route path='/forgotpass' element={<ForgotPass />} />
                    <Route path='/showallpizzas' element={<ShowPizzasPage />} />
                    <Route path='/pizzas/updatepizza/:id' element={<UpdatePizzaForm />} />
                    <Route path='/customizepizza' element={<CreatePizzaPage />} />
                    <Route path='/allcustomizedpizza' element={<UserCreatedPizzas />} />
                    <Route path='/updatedcstpizza/:id' element={<UpdateCustomizedPizza />} />
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
                    <Route
                        path="/admin/inventory"
                        element={
                            <AdminProtectedRoute>
                                <InventoryManagementPage />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/inventory/addingridient"
                        element={
                            <AdminProtectedRoute>
                                <AddIngridientPage />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/inventory/updateingridient/:id"
                        element={
                            <AdminProtectedRoute>
                                <UpdateIngredientForm />
                            </AdminProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
            {shouldShowCart && <CartPanel />}
        </>
    );
}

export default App;
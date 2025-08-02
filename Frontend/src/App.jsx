import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Authentication from './pages/commonPages/Authentication';
import VerifyEmail from './pages/commonPages/VerifyEmail';
import ForgotPass from './pages/commonPages/ForgotPass';
import ShowPizzasPage from './pages/commonPages/ShowPizzasPage';
import HomePage from './pages/userPages/HomePage';
import CreatePizzaPage from './pages/userPages/CreatePizzaPage';
import UserCreatedPizzas from './pages/userPages/UserCreatedPizzas';
import UpdateCustomizedPizza from './pages/userPages/UpdateCustomizedPizza';
import ShowAllOrdersPage from './pages/userPages/ShowAllOrdersPage';
import SingleOrderPage from './pages/userPages/SIngleOrderPage';
import AdminHomePage from './pages/adminPages/AdminHomePage';
import AdminOrdersPage from './pages/adminPages/AdminOrdersPage';
import AddPizzasPage from './pages/adminPages/AddPizzasPage';
import UpdatePizzaForm from './pages/adminPages/UpdatePizzaForm';
import InventoryManagementPage from './pages/adminPages/InventoryManagementPage';
import AddIngridientPage from './pages/adminPages/AddIngridientPage';
import UpdateIngredientForm from './pages/adminPages/UpdateIngredientForm';
import CartPanel from './components/CartComponent';
import AdminProtectedRoute from './routes/AdminProtectedRoutes';
import UserProtectedRoute from './routes/UserProtectedRoutes';

function App() {
    const location = useLocation();

    const showCartOnRoutes = [
        "/showallpizzas",
        "/allcustomizedpizza",
        "/myorders"
    ];

    const shouldShowCart = showCartOnRoutes.includes(location.pathname);

    return (
        <>
            <Routes>
                <Route element={<MainLayout />}>

                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Authentication formType="login" />} />
                    <Route path="/signup" element={<Authentication formType="signup" />} />
                    <Route path="/verifyemail" element={<VerifyEmail />} />
                    <Route path="/forgotpass" element={<ForgotPass />} />
                    <Route path="/showallpizzas" element={<ShowPizzasPage />} />

                    {/* User Protected Routes */}
                    <Route
                        path="/customizepizza"
                        element={
                            <UserProtectedRoute>
                                <CreatePizzaPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/allcustomizedpizza"
                        element={
                            <UserProtectedRoute>
                                <UserCreatedPizzas />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/updatedcstpizza/:id"
                        element={
                            <UserProtectedRoute>
                                <UpdateCustomizedPizza />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/myorders"
                        element={
                            <UserProtectedRoute>
                                <ShowAllOrdersPage />
                            </UserProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:id"
                        element={
                            <UserProtectedRoute>
                                <SingleOrderPage />
                            </UserProtectedRoute>
                        }
                    />

                    {/* Admin Protected Routes */}
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
                    <Route
                        path="/pizzas/updatepizza/:id"
                        element={
                            <AdminProtectedRoute>
                                <UpdatePizzaForm />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/allorders"
                        element={
                            <AdminProtectedRoute>
                                <AdminOrdersPage />
                            </AdminProtectedRoute>
                        }
                    />

                </Route>
            </Routes>

            {shouldShowCart && (
                <UserProtectedRoute>
                    <CartPanel />
                </UserProtectedRoute>
            )}

        </>
    );
}

export default App;

import {
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/auth/Login";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CreateOrder from "../pages/customer/CreateOrder";
import MyOrders from "../pages/customer/MyOrders";
import OrderDetails from "../pages/customer/OrderDetails";

import AgentDashboard from "../pages/agent/AgentDashboard";
import AgentOrderDetails from "../pages/agent/AgentOrderDetails";
import AgentOrders from "../pages/agent/AgentOrders";

import AdminOrders from "../pages/admin/Orders";
import AdminAgents from "../pages/admin/Agents";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrderDetails from "../pages/admin/OrderDetails";
import AdminZones from "../pages/admin/Zones";
import AdminAreas from "../pages/admin/Areas";
import AdminRateCards from "../pages/admin/RateCards";
import LandingPage from "../pages/home/LandingPage";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../components/layout/AppLayout";

import {
    useAuth,
} from "../context/AuthContext";

const AppRoutes = () => {
    const {
        user,
        logout,
    } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={<LandingPage />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "CUSTOMER",
                        ]}
                    />
                }
            >
                <Route
                    element={
                        <AppLayout
                            user={user}
                            role={user?.role}
                            onLogout={logout}
                        />
                    }
                >
                    <Route
                        path="/customer"
                        element={
                            <CustomerDashboard />
                        }
                    />

                    <Route
                        path="/customer/orders/new"
                        element={
                            <CreateOrder />
                        }
                    />

                    <Route
                        path="/customer/orders"
                        element={
                            <MyOrders />
                        }
                    />

                    <Route
                        path="/customer/orders/:orderId"
                        element={
                            <OrderDetails />
                        }
                    />
                </Route>
            </Route>

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "DELIVERY_AGENT",
                        ]}
                    />
                }
            >
                <Route
                    element={
                        <AppLayout
                            user={user}
                            role={user?.role}
                            onLogout={logout}
                        />
                    }
                >
                    <Route
                        path="/agent"
                        element={
                            <AgentDashboard />
                        }
                    />

                    <Route
                        path="/agent/orders"
                        element={
                            <AgentOrders />
                        }
                    />

                    <Route
                        path="/agent/orders/:orderId"
                        element={
                            <AgentOrderDetails />
                        }
                    />



                </Route>
            </Route>

            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                        ]}
                    />
                }
            >
                <Route
                    element={
                        <AppLayout
                            user={user}
                            role={user?.role}
                            onLogout={logout}
                        />
                    }
                >
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard />
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminOrders />
                        }
                    />

                    <Route
                        path="/admin/orders/:orderId"
                        element={
                            <AdminOrderDetails />
                        }
                    />

                    <Route
                        path="/admin/agents"
                        element={
                            <AdminAgents />
                        }
                    />

                    <Route
                        path="/admin/zones"
                        element={
                            <AdminZones />
                        }
                    />

                    <Route
                        path="/admin/areas"
                        element={
                            <AdminAreas />
                        }
                    />

                    <Route
                        path="/admin/rate-cards"
                        element={
                            <AdminRateCards />
                        }
                    />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
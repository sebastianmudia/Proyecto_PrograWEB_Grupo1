// ==============================================
// routes/AppRouter.jsx
// Todas las rutas en un solo lugar
// ==============================================

import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";

const router = createBrowserRouter([
  { path: "/",                 element: <Login /> },
  { path: "/registro",         element: <Registro /> },
  { path: "/home",             element: <Home /> },
  { path: "/admin/dashboard",  element: <AdminDashboard /> },
]);

export default router;

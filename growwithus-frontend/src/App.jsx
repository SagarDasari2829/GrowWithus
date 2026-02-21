import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ROUTES } from "./constants/routes";
import { useAuth } from "./hooks/useAuth";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import RoadmapBySlug from "./pages/RoadmapBySlug";
import RoadmapDetails from "./pages/RoadmapDetails";
import Roadmaps from "./pages/Roadmaps";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route
          path={ROUTES.LOGIN}
          element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />}
        />
        <Route
          path={ROUTES.REGISTER}
          element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Register />}
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ROADMAPS}
          element={
            <ProtectedRoute>
              <Roadmaps />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ROADMAP_DETAILS}
          element={
            <ProtectedRoute>
              <RoadmapDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ROADMAP_BY_SLUG}
          element={
            <ProtectedRoute>
              <RoadmapBySlug />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ADMIN}
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

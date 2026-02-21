import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../common/Loader";

export default function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

function linkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to={ROUTES.HOME} className="text-xl font-bold tracking-tight text-slate-900">
          GrowWith<span className="text-indigo-600">US</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to={ROUTES.HOME} className={linkClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to={ROUTES.DASHBOARD} className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to={ROUTES.ROADMAPS} className={linkClass}>
                Roadmaps
              </NavLink>
              {user?.role === "admin" && (
                <NavLink to={ROUTES.ADMIN} className={linkClass}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:block">{user?.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-400 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-400 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

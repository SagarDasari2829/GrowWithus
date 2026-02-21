import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function iconClass(isActive) {
  return `h-5 w-5 ${isActive ? "text-indigo-700" : "text-slate-500 group-hover:text-slate-700"}`;
}

function sideClass({ isActive }) {
  return `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
    isActive
      ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export default function Sidebar({ isAdmin }) {
  return (
    <aside className="sticky top-24 h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <nav className="space-y-1" aria-label="Dashboard Navigation">
        <NavLink to={ROUTES.DASHBOARD} className={sideClass}>
          {({ isActive }) => (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass(isActive)}>
                <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />
              </svg>
              Overview
            </>
          )}
        </NavLink>

        <NavLink to={ROUTES.ROADMAPS} className={sideClass}>
          {({ isActive }) => (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass(isActive)}>
                <path d="M5 4h14a1 1 0 0 1 1 1v14l-3-2-3 2-3-2-3 2-3-2V5a1 1 0 0 1 1-1z" />
              </svg>
              Roadmaps
            </>
          )}
        </NavLink>

        {isAdmin && (
          <NavLink to={ROUTES.ADMIN} className={sideClass}>
            {({ isActive }) => (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClass(isActive)}>
                  <path d="M12 2l2.5 4.5L20 8l-3.5 3.5L17 17l-5-2.5L7 17l.5-5.5L4 8l5.5-1.5L12 2z" />
                </svg>
                Admin Panel
              </>
            )}
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

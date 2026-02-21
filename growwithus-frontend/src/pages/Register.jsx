import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { ROUTES } from "../constants/routes";
import { YEAR_OPTIONS } from "../constants/domains";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/helpers";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", year: 1 });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-10">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Year</label>
              <select
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))}
                required
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Alert message={error} type="error" />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">Login</Link>
        </p>
      </Card>
    </section>
  );
}
import { Link } from "react-router-dom";
import Card from "../components/common/Card";
import { ROUTES } from "../constants/routes";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <Card className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link to={ROUTES.HOME} className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
          Back to home
        </Link>
      </Card>
    </section>
  );
}
export default function Button({ children, variant = "primary", className = "", ...props }) {
  const styles =
    variant === "secondary"
      ? "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
      : "bg-brand-600 text-white hover:bg-brand-700";

  return (
    <button className={`rounded-lg px-4 py-2 text-sm font-medium transition ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
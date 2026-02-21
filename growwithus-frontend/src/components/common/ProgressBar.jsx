export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-600">{value}% completed</p>
    </div>
  );
}
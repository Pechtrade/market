export default function Section({ title, children }) {
  return (
    <div className="card mb-4">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}

export default DashboardCard;
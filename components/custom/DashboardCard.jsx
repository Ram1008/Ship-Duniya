import React from 'react'

const DashboardCard = ({title , value }) => {
  return (
<div className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow w-60">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
  </div>
  )
}

export default DashboardCard

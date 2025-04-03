import DashboardCard from '@/components/custom/DashboardCard';
import React from 'react';
// import DashboardCard from '@/components/custom/DashboardCard';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold">Performance Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard title="Average Resolution Time" value="2.3 days" />
          <DashboardCard title="Customer Satisfaction" value="4.7/5" />
          <DashboardCard title="On-Time Deliveries" value="98%" />
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Site Usage</h2>
        <div className="h-64 w-full bg-gray-200">
          {/* Placeholder for a chart or graph */}
          <div className="flex h-full items-center justify-center">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

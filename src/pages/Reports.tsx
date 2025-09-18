
import React from 'react';
import './chartjs-setup';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Tests Performed',
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      borderWidth: 1,
      hoverBackgroundColor: '#818cf8',
      hoverBorderColor: '#6366f1',
      data: [65, 59, 80, 81, 56, 55],
    },
  ],
};

const pieData = {
  labels: ['Blood', 'Urine', 'Imaging', 'Biopsy'],
  datasets: [
    {
      data: [150, 50, 90, 40],
      backgroundColor: ['#6366f1', '#f59e42', '#10b981', '#f43f5e'],
      hoverBackgroundColor: ['#818cf8', '#fbbf24', '#34d399', '#fb7185'],
    },
  ],
};

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Average Turnaround Time (hrs)',
      data: [24, 22, 20, 18, 19, 17],
      fill: false,
      borderColor: '#f59e42',
      backgroundColor: '#fbbf24',
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' as const },
    title: { display: false },
  },
};

export default function ReportsPage() {
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tests Performed (Monthly)</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Shows the number of tests performed each month. A steady increase indicates growing lab activity and patient engagement.
          </p>
        </CardHeader>
        <CardContent>
          <div style={{ height: 400 }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Test Types Distribution</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Breakdown of test types. Blood tests are most common, reflecting routine checkups and diagnostics.
          </p>
        </CardHeader>
        <CardContent>
          <div style={{ height: 400 }}>
            <Pie data={pieData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average Turnaround Time</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            Shows the average time (in hours) to deliver results. The downward trend suggests improved lab efficiency.
          </p>
        </CardHeader>
        <CardContent>
          <div style={{ height: 400 }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

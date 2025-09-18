import '@/pages/chartjs-setup';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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

const ReportsPage = () => (
  <div className="p-8 space-y-8">
    <Card>
      <CardHeader>
        <CardTitle>Tests Performed (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={barData} />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Test Types Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Pie data={pieData} />
      </CardContent>
    </Card>
  </div>
);

export default ReportsPage;

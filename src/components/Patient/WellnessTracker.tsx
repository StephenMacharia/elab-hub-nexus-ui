
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Heart, Activity, Zap } from 'lucide-react';

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

const WellnessTracker = () => {
  const [metrics] = useState<WellnessMetric[]>([
    {
      id: 'steps',
      name: 'Daily Steps',
      value: 8432,
      target: 10000,
      unit: 'steps',
      icon: Activity,
      color: 'blue'
    },
    {
      id: 'heartRate',
      name: 'Avg Heart Rate',
      value: 72,
      target: 70,
      unit: 'bpm',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'wellness',
      name: 'Wellness Score',
      value: 85,
      target: 90,
      unit: '%',
      icon: Zap,
      color: 'green'
    }
  ]);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600 bg-gray-100';
  };

  const getProgressColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      green: 'bg-green-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Wellness Tracker</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const percentage = Math.min((metric.value / metric.target) * 100, 100);
          const IconComponent = metric.icon;
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getColorClasses(metric.color)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
              </div>
              
              <div className="mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{metric.name}</h4>
                <p className="text-2xl font-bold text-gray-800">
                  {metric.value.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                </p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className={`h-2 rounded-full ${getProgressColor(metric.color)}`}
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Target: {metric.target.toLocaleString()} {metric.unit}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessTracker;

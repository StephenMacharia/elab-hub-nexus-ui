import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Heart, Activity, Apple, Brain, Shield } from 'lucide-react';

interface HealthTip {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
  basedOn: string;
}

const PersonalizedHealthTips = () => {
  const [tips] = useState<HealthTip[]>([
    {
      id: 'vitamin-d',
      category: 'Nutrition',
      title: 'Increase Vitamin D Intake',
      description: 'Based on your recent test results, consider adding vitamin D supplements or increasing sun exposure for 15-20 minutes daily.',
      icon: Apple,
      priority: 'high',
      basedOn: 'Recent Vitamin D test results'
    },
    {
      id: 'cardio-exercise',
      category: 'Fitness',
      title: 'Boost Cardiovascular Health',
      description: 'Your heart rate data suggests incorporating 30 minutes of moderate cardio exercise 3-4 times per week.',
      icon: Heart,
      priority: 'medium',
      basedOn: 'Heart rate monitoring data'
    },
    {
      id: 'stress-management',
      category: 'Mental Health',
      title: 'Practice Stress Management',
      description: 'Your wellness score indicates elevated stress levels. Try meditation or deep breathing exercises for 10 minutes daily.',
      icon: Brain,
      priority: 'high',
      basedOn: 'Wellness score trends'
    },
    {
      id: 'hydration',
      category: 'Wellness',
      title: 'Stay Hydrated',
      description: 'Aim for 8-10 glasses of water daily to support optimal organ function and energy levels.',
      icon: Shield,
      priority: 'low',
      basedOn: 'General wellness optimization'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nutrition': return Apple;
      case 'Fitness': return Activity;
      case 'Mental Health': return Brain;
      case 'Wellness': return Shield;
      default: return Lightbulb;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Personalized Health Tips</h3>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => {
          const IconComponent = getCategoryIcon(tip.category);
          
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${getPriorityColor(tip.priority)} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <IconComponent className="h-5 w-5 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{tip.title}</h4>
                      <span className="text-xs text-gray-500">{tip.category}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(tip.priority)}`}>
                      {tip.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{tip.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Based on:</span> {tip.basedOn}
                    </p>
                    <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Tips updated based on your latest health data
          </p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
            View All Tips
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedHealthTips;

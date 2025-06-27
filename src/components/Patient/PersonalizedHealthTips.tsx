import React, { useState, useEffect } from 'react';
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

const tipPool: HealthTip[] = [
  {
    id: 'vitamin-d',
    category: 'Nutrition',
    title: 'Increase Vitamin D Intake',
    description: 'Get more sun exposure or take supplements.',
    icon: Apple,
    priority: 'high',
    basedOn: 'Low vitamin D levels'
  },
  {
    id: 'cardio-exercise',
    category: 'Fitness',
    title: 'Boost Cardiovascular Health',
    description: 'Add 30 minutes of cardio 3-4 times a week.',
    icon: Heart,
    priority: 'medium',
    basedOn: 'Heart rate data'
  },
  {
    id: 'stress-management',
    category: 'Mental Health',
    title: 'Practice Stress Management',
    description: 'Try daily meditation or breathing exercises.',
    icon: Brain,
    priority: 'high',
    basedOn: 'Stress score'
  },
  {
    id: 'hydration',
    category: 'Wellness',
    title: 'Stay Hydrated',
    description: 'Drink 8-10 glasses of water daily.',
    icon: Shield,
    priority: 'low',
    basedOn: 'General wellness'
  },
  {
    id: 'sleep-hygiene',
    category: 'Wellness',
    title: 'Improve Sleep Hygiene',
    description: 'Stick to a consistent sleep schedule.',
    icon: Shield,
    priority: 'medium',
    basedOn: 'Sleep tracking'
  },
  {
    id: 'mindfulness',
    category: 'Mental Health',
    title: 'Mindfulness Moments',
    description: 'Take 5-minute breaks to stay present.',
    icon: Brain,
    priority: 'low',
    basedOn: 'Mental fatigue score'
  },
  {
    id: 'omega-3',
    category: 'Nutrition',
    title: 'Add Omega-3s',
    description: 'Include fatty fish or flaxseed oil.',
    icon: Apple,
    priority: 'medium',
    basedOn: 'Cholesterol analysis'
  },
  {
    id: 'muscle-strength',
    category: 'Fitness',
    title: 'Strength Training',
    description: 'Lift weights 2x a week.',
    icon: Activity,
    priority: 'high',
    basedOn: 'Muscle mass score'
  }
];

// Utility to select N random tips
const getRandomTips = (count: number): HealthTip[] => {
  const shuffled = [...tipPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PersonalizedHealthTips = () => {
  const [tips, setTips] = useState<HealthTip[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('healthTips');
    if (saved) {
      try {
        setTips(JSON.parse(saved));
      } catch {
        generateTips();
      }
    } else {
      generateTips();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('healthTips', JSON.stringify(tips));
  }, [tips]);

  const generateTips = () => {
    const randomTips = getRandomTips(4);
    setTips(randomTips);
    localStorage.setItem('healthTips', JSON.stringify(randomTips));
  };

  const dismissTip = (id: string) => {
    const updatedTips = tips.filter(tip => tip.id !== id);
    setTips(updatedTips);
  };

  const resetTips = () => {
    localStorage.removeItem('healthTips');
    generateTips();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nutrition':
        return Apple;
      case 'Fitness':
        return Activity;
      case 'Mental Health':
        return Brain;
      case 'Wellness':
        return Shield;
      default:
        return Lightbulb;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personalized Health Tips</h3>
        </div>
        <button
          onClick={resetTips}
          className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          Reset Tips
        </button>
      </div>

      <div className="space-y-4">
        {tips.length === 0 ? (
          <p className="text-sm text-gray-600">No tips available. You're all caught up!</p>
        ) : (
          tips.map((tip, index) => {
            const IconComponent = getCategoryIcon(tip.category);
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getPriorityColor(
                  tip.priority
                )} hover:shadow-md transition-shadow`}
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
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(
                          tip.priority
                        )}`}
                      >
                        {tip.priority}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{tip.description}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Based on:</span> {tip.basedOn}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                          Learn More
                        </button>
                        <button
                          onClick={() => dismissTip(tip.id)}
                          className="text-red-500 hover:text-red-600 text-xs"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
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

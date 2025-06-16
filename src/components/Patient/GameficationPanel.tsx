
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target, Zap, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  points: number;
  progress?: number;
  maxProgress?: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  deadline: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

const GameficationPanel = () => {
  const [currentPoints] = useState(1250);
  const [currentLevel] = useState(3);
  const [pointsToNextLevel] = useState(350);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-test',
      title: 'Health Explorer',
      description: 'Complete your first wellness test',
      icon: Star,
      unlocked: true,
      points: 100
    },
    {
      id: 'on-time',
      title: 'Punctual Patient',
      description: 'Attend 5 appointments on time',
      icon: Trophy,
      unlocked: true,
      points: 200,
      progress: 5,
      maxProgress: 5
    },
    {
      id: 'wellness-warrior',
      title: 'Wellness Warrior',
      description: 'Complete 10 wellness tests',
      icon: Medal,
      unlocked: false,
      points: 500,
      progress: 7,
      maxProgress: 10
    },
    {
      id: 'health-champion',
      title: 'Health Champion',
      description: 'Maintain wellness score above 80% for 30 days',
      icon: Award,
      unlocked: false,
      points: 750,
      progress: 12,
      maxProgress: 30
    }
  ];

  const [challenges] = useState<Challenge[]>([
    {
      id: 'weekly-checkup',
      title: 'Weekly Wellness',
      description: 'Complete your scheduled test this week',
      reward: 150,
      deadline: 'Dec 20, 2024',
      progress: 0,
      maxProgress: 1,
      completed: false
    },
    {
      id: 'referral-friend',
      title: 'Share the Health',
      description: 'Refer 3 friends to wellness testing',
      reward: 300,
      deadline: 'Dec 31, 2024',
      progress: 1,
      maxProgress: 3,
      completed: false
    }
  ]);

  const levelProgress = ((1600 - pointsToNextLevel) / 1600) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">Health Rewards</h3>
      </div>

      {/* Level Progress */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentLevel}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Level {currentLevel}</p>
              <p className="text-sm text-gray-600">{currentPoints.toLocaleString()} points</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Next Level</p>
            <p className="text-sm font-medium text-blue-600">{pointsToNextLevel} points to go</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Recent Achievements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.slice(0, 4).map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 ${
                  achievement.unlocked
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    {achievement.progress && achievement.maxProgress && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 bg-yellow-500 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    achievement.unlocked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    +{achievement.points}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Active Challenges</h4>
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{challenge.title}</p>
                  <p className="text-xs text-gray-600">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Zap className="h-3 w-3" />
                  <span className="text-xs font-medium">+{challenge.reward}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Due: {challenge.deadline}</span>
                <span>{challenge.progress}/{challenge.maxProgress}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameficationPanel;

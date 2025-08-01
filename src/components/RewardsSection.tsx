import React from 'react';
import { Award, DollarSign, Star, Trophy, Crown, Heart, Lock } from 'lucide-react';
import { Reward } from '../types';

interface RewardsSectionProps {
  rewards: Reward[];
  totalDonations: number;
}

const iconMap = {
  award: Award,
  'dollar-sign': DollarSign,
  star: Star,
  trophy: Trophy,
  crown: Crown,
  heart: Heart
};

export const RewardsSection: React.FC<RewardsSectionProps> = ({ rewards, totalDonations }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (requirement: number) => {
    if (requirement === 0) return 100;
    return Math.min((totalDonations / requirement) * 100, 100);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Rewards & Achievements</h2>
        <div className="text-sm text-gray-600">
          {rewards.filter(r => r.unlocked).length} of {rewards.length} unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const IconComponent = iconMap[reward.icon as keyof typeof iconMap];
          const progress = getProgressPercentage(reward.requirement);
          const isUnlocked = reward.unlocked;
          const isInProgress = !isUnlocked && totalDonations > 0 && progress > 0;

          return (
            <div
              key={reward.id}
              className={`relative rounded-lg p-4 border-2 transition-all duration-200 ${
                isUnlocked
                  ? 'border-green-200 bg-green-50 shadow-sm'
                  : isInProgress
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Status Indicator */}
              <div className="absolute top-2 right-2">
                {isUnlocked ? (
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <Award className="h-3 w-3" />
                  </div>
                ) : (
                  <div className="bg-gray-400 text-white rounded-full p-1">
                    <Lock className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg mb-3 ${
                isUnlocked
                  ? 'bg-green-100'
                  : isInProgress
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}>
                <IconComponent className={`h-6 w-6 ${
                  isUnlocked
                    ? 'text-green-600'
                    : isInProgress
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`} />
              </div>

              {/* Content */}
              <h3 className={`font-semibold mb-2 ${
                isUnlocked ? 'text-green-800' : isInProgress ? 'text-blue-800' : 'text-gray-600'
              }`}>
                {reward.title}
              </h3>
              
              <p className={`text-sm mb-3 ${
                isUnlocked ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {reward.description}
              </p>

              {/* Progress */}
              {reward.requirement > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className={isUnlocked ? 'text-green-600' : 'text-gray-500'}>
                      {isUnlocked ? 'Completed!' : `${formatCurrency(totalDonations)} / ${formatCurrency(reward.requirement)}`}
                    </span>
                    <span className={isUnlocked ? 'text-green-600' : 'text-gray-500'}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isUnlocked ? 'bg-green-500' : isInProgress ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
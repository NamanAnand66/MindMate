import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, CheckSquare, BarChart2, Brain } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Track Mood',
      description: 'Log how you\'re feeling right now',
      icon: <PenSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-50 dark:bg-primary-900/30',
      link: '/journal'
    },
    {
      title: 'Manage Tasks',
      description: 'Create or complete wellness goals',
      icon: <CheckSquare className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />,
      color: 'bg-secondary-50 dark:bg-secondary-900/30',
      link: '/tasks'
    },
    {
      title: 'View Insights',
      description: 'See patterns in your wellbeing',
      icon: <BarChart2 className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
      color: 'bg-accent-50 dark:bg-accent-900/30',
      link: '/insights'
    },
    {
      title: 'AI Reflection',
      description: 'Journal your thoughts with AI analysis',
      icon: <Brain className="h-6 w-6 text-success-600 dark:text-success-400" />,
      color: 'bg-success-50 dark:bg-success-900/30',
      link: '/journal'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.link}
          className={`${action.color} p-5 rounded-lg transition-transform duration-200 hover:scale-105 hover:shadow-md`}
        >
          <div className="flex flex-col h-full">
            <div className="mb-3">
              {action.icon}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {action.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';
import { FaDiscord, FaSlack, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { FaWandMagicSparkles } from 'react-icons/fa6';

// Define platform types for the communication
export type PlatformType = 'discord' | 'slack' | 'whatsapp' | 'telegram';

// Extend the base node data with HumanFeedback specific properties
export interface HumanFeedbackNodeData extends BaseNodeData {
  platform: PlatformType;
  channel: string;
  timeout: number; // in minutes
  timeoutAction: 'skip' | 'retry' | 'abort';
}

// Platform-specific colors and icons
const PLATFORM_CONFIG = {
  discord: {
    color: '#5865F2',
    name: 'Discord',
    icon: <FaDiscord />
  },
  slack: {
    color: '#4A154B',
    name: 'Slack',
    icon: <FaSlack />
  },
  whatsapp: {
    color: '#25D366',
    name: 'WhatsApp',
    icon: <FaWhatsapp />
  },
  telegram: {
    color: '#0088cc',
    name: 'Telegram',
    icon: <FaTelegram />
  } 
};

const HumanFeedbackNode = memo(({ data, ...props }: NodeProps<HumanFeedbackNodeData>) => {
  // Set default values if not provided
  const [platform, setPlatform] = useState<PlatformType>(data.platform || 'slack');
  const platformConfig = PLATFORM_CONFIG[platform];
  
  // Initialize with data from props or defaults
  const [channel, setChannel] = useState(data.channel || '');
  const [timeout, setTimeout] = useState(data.timeout || 30); // Default 30 minutes
  const [timeoutAction, setTimeoutAction] = useState(data.timeoutAction || 'skip');

  // Sync local state with node data
  useEffect(() => {
    setPlatform(data.platform || 'slack');
    setChannel(data.channel || '');
    setTimeout(data.timeout || 30);
    setTimeoutAction(data.timeoutAction || 'skip');
  }, [data.platform, data.channel, data.timeout, data.timeoutAction]);

  // Update node data when fields change
  const updateNodeData = useCallback((field: string, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
    
    // Also update local state
    switch(field) {
      case 'platform':
        // We need to set the platform in the data object directly
        data.platform = value as PlatformType;
        setPlatform(value as PlatformType);
        break;
      case 'channel':
        setChannel(value);
        break;
      case 'timeout':
        setTimeout(Number(value));
        break;
      case 'timeoutAction':
        setTimeoutAction(value);
        break;
    }
  }, [data]);

  // Set up node data for rendering
  const nodeData = {
    ...data,
    label: 'Human Feedback',
    type: 'humanFeedbackNode',
    icon: <FaWandMagicSparkles />,
    color: '#e53e3e', // Red color for human feedback
    category: 'Workflow Control'
  };

  return (
    <BaseNode
      data={nodeData}
      width={400}
      {...props}
    >
      <div className="px-4 py-3 space-y-3">
        {/* Header with explanation */}
        <div 
          className="text-sm font-medium p-2 rounded-lg"
          style={{ 
            backgroundColor: `${nodeData.color}15`,
            color: nodeData.color
          }}
        >
          Configure this node to collect human feedback during your workflow execution.
        </div>
        
        {/* Communication Platform - Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Communication Platform
          </label>
          <select
            value={platform}
            onChange={(e) => updateNodeData('platform', e.target.value as PlatformType)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Channel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Channel
          </label>
          <input
            type="text"
            value={channel}
            onChange={(e) => updateNodeData('channel', e.target.value)}
            placeholder={`Enter ${PLATFORM_CONFIG[platform].name} channel/user...`}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>
        
        {/* Timeout Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timeout (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="1440" // 24 hours
            value={timeout}
            onChange={(e) => updateNodeData('timeout', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
        </div>
        
        {/* Timeout Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            If Timeout Occurs
          </label>
          <select
            value={timeoutAction}
            onChange={(e) => updateNodeData('timeoutAction', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          >
            <option value="skip">Continue workflow (skip)</option>
            <option value="retry">Retry sending request</option>
            <option value="abort">Abort workflow</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
});

HumanFeedbackNode.displayName = 'HumanFeedbackNode';

export default HumanFeedbackNode; 
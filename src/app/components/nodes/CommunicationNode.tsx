'use client';

import { memo, useState, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';
import { FaDiscord } from 'react-icons/fa';
import { FaSlack } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';
// Define platform types
export type PlatformType = 'discord' | 'slack' | 'whatsapp' | 'telegram';
export type NodeDirection = 'input' | 'output';

// Extend the base node data with Communication specific properties
export interface CommunicationNodeData extends BaseNodeData {
  platform: PlatformType;
  direction: NodeDirection;
  // Authentication
  botInvokeCommand?: string;
  // Channel configuration
  channel: string;
  // For input nodes
  commandPrefix?: string;
  triggerType?: string;
  // For output nodes
  messageTemplate?: string;
  messageType?: string;
}

// Trigger types by platform
const TRIGGER_TYPES = {
  discord: ['onMessage', 'onCommand', 'onReaction', 'onJoin', 'onLeave'],
  slack: ['onMessage', 'onCommand', 'onMention', 'onReaction', 'onChannelJoin'],
  whatsapp: ['onMessage', 'onMedia', 'onLocation', 'onContact'],
  telegram: ['onMessage', 'onCommand', 'onReaction', 'onJoin', 'onLeave'],
};

// Message types by platform
const MESSAGE_TYPES = {
  discord: ['text', 'embed', 'image', 'file'],
  slack: ['text', 'blocks', 'attachment', 'file'],
  whatsapp: ['text', 'image', 'video', 'document', 'location'],
  telegram: ['text', 'image', 'document', 'location']
};

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

// Input node component - reusable across platforms
const InputNodeContent = ({ 
  platform, 
  triggerType, 
  commandPrefix, 
  channel, 
  updateNodeData 
}: { 
  platform: PlatformType;
  triggerType: string;
  commandPrefix: string;
  channel: string;
  updateNodeData: (field: string, value: any) => void;
}) => {
  return (
    <div className="space-y-4">
      {/* Channel Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Channel
        </label>
        <input
          type="text"
          value={channel}
          onChange={(e) => updateNodeData('channel', e.target.value)}
          placeholder={`Enter ${platform} channel name`}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Trigger Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Trigger Type
        </label>
        <select
          value={triggerType}
          onChange={(e) => updateNodeData('triggerType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="">Select a trigger type</option>
          {TRIGGER_TYPES[platform].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Command Prefix (only if trigger type is onCommand) */}
      {triggerType === 'onCommand' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Command Prefix
          </label>
          <input
            type="text"
            value={commandPrefix}
            onChange={(e) => updateNodeData('commandPrefix', e.target.value)}
            placeholder="e.g. !help, /start"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Command that will trigger this workflow (e.g. !help, /start)
          </p>
        </div>
      )}
    </div>
  );
};

// Output node component - reusable across platforms
const OutputNodeContent = ({ 
  platform, 
  channel, 
  messageTemplate,
  messageType,
  updateNodeData 
}: { 
  platform: PlatformType;
  channel: string;
  messageTemplate: string;
  messageType?: string;
  updateNodeData: (field: string, value: any) => void;
}) => {
  return (
    <div className="space-y-4">
      {/* Channel Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Channel
        </label>
        <input
          type="text"
          value={channel}
          onChange={(e) => updateNodeData('channel', e.target.value)}
          placeholder={`Enter ${platform} channel name`}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Message Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message Type
        </label>
        <select
          value={messageType || 'text'}
          onChange={(e) => updateNodeData('messageType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          {MESSAGE_TYPES[platform].map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select how your message will be delivered to users
        </p>
      </div>

      {/* Message Template */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message Template
        </label>
        <textarea
          value={messageTemplate}
          onChange={(e) => updateNodeData('messageTemplate', e.target.value)}
          placeholder="Enter your message template. Use {{variable}} for dynamic content."
          className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          You can use variables from previous nodes by using the {'{{'} variableName {'}}'}  syntax.
        </p>
      </div>
    </div>
  );
};

// Auth component - shared between input and output
const AuthSection = ({
  platform,
  botInvokeCommand,
  updateNodeData
}: {
  platform: PlatformType;
  botInvokeCommand?: string;
  updateNodeData: (field: string, value: any) => void;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Bot Configuration
      </label>
      
      {/* Bot Invoke Command */}
      <div>
        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
          Bot Invoke Command
        </label>
        <input
          type="text"
          value={botInvokeCommand || ''}
          onChange={(e) => updateNodeData('botInvokeCommand', e.target.value)}
          placeholder="!weatherBot"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Command users will type to invoke this bot (e.g. !weatherBot)
        </p>
      </div>
    </div>
  );
};

// Main node component
const CommunicationNode = memo(({ data, ...props }: NodeProps<CommunicationNodeData>) => {
  // Set default values if not provided
  const platform = data.platform || 'discord';
  const platformConfig = PLATFORM_CONFIG[platform];
  
  // Check if direction is already selected
  const [directionSelected, setDirectionSelected] = useState(!!data.direction);
  const direction = data.direction || 'input';
  
  // Initialize with data from props or defaults
  const [botInvokeCommand, setBotInvokeCommand] = useState(data.botInvokeCommand || '');
  const [channel, setChannel] = useState(data.channel || '');
  const [commandPrefix, setCommandPrefix] = useState(data.commandPrefix || '');
  const [triggerType, setTriggerType] = useState(data.triggerType || '');
  const [messageTemplate, setMessageTemplate] = useState(data.messageTemplate || '');
  const [messageType, setMessageType] = useState(data.messageType || 'text');

  // Update node data when fields change
  const updateNodeData = useCallback((field: string, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
    
    // Also update local state
    switch(field) {
      case 'direction':
        setDirectionSelected(true);
        break;
      case 'botInvokeCommand':
        setBotInvokeCommand(value);
        break;
      case 'channel':
        setChannel(value);
        break;
      case 'commandPrefix':
        setCommandPrefix(value);
        break;
      case 'triggerType':
        setTriggerType(value);
        break;
      case 'messageTemplate':
        setMessageTemplate(value);
        break;
      case 'messageType':
        setMessageType(value);
        break;
    }
  }, [data]);

  // Set up node data for rendering
  const nodeData = {
    ...data,
    label: `${platformConfig.name}${data.direction ? (data.direction === 'input' ? ' Input' : ' Output') : ''}`,
    type: 'communicationNode',
    icon: platformConfig.icon,
    color: platformConfig.color,
    category: 'Communication'
  };

  // Direction selector component
  const DirectionSelector = () => (
    <div className="px-6 py-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Select Node Type</h3>
        <p className="text-sm text-gray-500">Choose whether this {platformConfig.name} node will receive or send messages</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateNodeData('direction', 'input')}
          className="p-4 border-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
          style={{ borderColor: platformConfig.color }}
        >
          <div className="text-2xl mb-2">📥</div>
          <div className="font-medium" style={{ color: platformConfig.color }}>Input</div>
          <div className="text-xs text-gray-500 mt-1">Trigger workflow from {platformConfig.name} messages or events</div>
        </button>
        <button
          onClick={() => updateNodeData('direction', 'output')}
          className="p-4 border-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
          style={{ borderColor: platformConfig.color }}
        >
          <div className="text-2xl mb-2">📤</div>
          <div className="font-medium" style={{ color: platformConfig.color }}>Output</div>
          <div className="text-xs text-gray-500 mt-1">Send messages to {platformConfig.name}</div>
        </button>
      </div>
    </div>
  );

  return (
    <BaseNode
      data={nodeData}
      width={400}
      {...props}
    >
      {!directionSelected ? (
        <DirectionSelector />
      ) : (
        <div className="px-4 pb-4 pt-2 space-y-4">
          {/* Header section with platform info */}
          <div 
            className="text-sm font-medium p-3 rounded-lg"
            style={{ 
              backgroundColor: `${platformConfig.color}15`,
              color: platformConfig.color
            }}
          >
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">{platformConfig.icon}</span>
              <span className="font-medium">
                {platformConfig.name} {direction === 'input' ? 'Trigger' : 'Action'}
              </span>
            </div>
            {direction === 'input'
              ? `Configure this node to trigger your workflow from ${platformConfig.name}.`
              : `Configure this node to respond when your workflow is done on ${platformConfig.name}.`
            }
          </div>
          
          {/* Authentication section - only for input nodes */}
          {direction === 'input' && (
            <AuthSection 
              platform={platform}
              botInvokeCommand={botInvokeCommand}
              updateNodeData={updateNodeData}
            />
          )}
          
          {/* Input or Output specific content */}
          {direction === 'input' ? (
            <InputNodeContent
              platform={platform}
              triggerType={triggerType}
              commandPrefix={commandPrefix}
              channel={channel}
              updateNodeData={updateNodeData}
            />
          ) : (
            <OutputNodeContent
              platform={platform}
              channel={channel}
              messageTemplate={messageTemplate}
              messageType={messageType}
              updateNodeData={updateNodeData}
            />
          )}
        </div>
      )}
    </BaseNode>
  );
});

CommunicationNode.displayName = 'CommunicationNode';

export default CommunicationNode; 
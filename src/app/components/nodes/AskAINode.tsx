'use client';

import { memo, useState, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Extend the base node data with AskAI specific properties
export interface AskAINodeData extends BaseNodeData {
  prompt?: string;
  llmModel?: string;
  selectedTools?: string[];
  temperature?: number;
}

// Define available AI models
const AI_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-sonnet',
  'claude-3-opus',
  'gemini-pro',
];

// Define available AI tools
const AVAILABLE_TOOLS = [
  { id: 'weather', name: 'Weather', description: 'API to get current weather and forecast information for any city', icon: '🌤️' },
  { id: 'gmail', name: 'Gmail', description: 'RESTful API that enables sending, reading, and managing emails', icon: '📧' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'RESTful API that can be accessed through explicit HTTP calls', icon: '📅' },
  { id: 'github', name: 'GitHub', description: 'API to interact with GitHub programmatically including repository management', icon: '🐙' },
  { id: 'notion', name: 'Notion', description: 'REST API to manage Notion workspaces, organize work, and manage projects', icon: '📝' },
  { id: 'brave-search', name: 'Brave Search', description: 'REST API to query Brave Search and get back search results from the web', icon: '🦁' },
  // { id: 'exa-ai', name: 'Exa AI', description: 'Search engine made for AIs that finds the exact content you are looking for', icon: '🔍' },
//   { id: 'tavily', name: 'Tavily', description: 'Search tool that focuses on optimizing search for AI developers and autonomous AI agents', icon: '🔎' },
//   { id: 'slack', name: 'Slack', description: 'Team communication and collaboration tool API', icon: '💬' },
//   { id: 'coinmarketcap', name: 'CoinMarketCap', description: 'API provides cryptocurrency market data including listings and quotes', icon: '💰' },
  { id: 'google-docs', name: 'Google Docs', description: 'API allows developers to create, read, and update Google Docs documents', icon: '📄' },
//   { id: 'aipolabs-secrets', name: 'Aipolabs Secrets Manager', description: 'Allows you to store and retrieve secrets', icon: '🔒' },
  // { id: 'resend', name: 'Resend', description: 'Email API for developers to send transactional emails and track delivery status', icon: '📩' },
  { id: 'meta', name: 'Meta', description: 'An agent that has access to all of the available functions, and choose the best to use.', icon: '👤' },
  { id: 'hubspot', name: 'HubSpot', description: 'REST API to use HubSpot\'s suite of marketing, sales, and customer service tools', icon: '🔴' },
];

const AskAINode = memo(({ data, isConnectable, ...rest }: NodeProps<AskAINodeData>) => {
  // Initialize with data from props or defaults
  const [prompt, setPrompt] = useState<string>(data.prompt || '');
  const [llmModel, setLlmModel] = useState<string>(data.llmModel || 'gpt-4o-mini');
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const [selectedTools, setSelectedTools] = useState<string[]>(data.selectedTools || []);
  const [toolDropdownOpen, setToolDropdownOpen] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(data.temperature || 0.7);

  // Update node data when fields change
  const updateNodeData = useCallback((field: keyof AskAINodeData, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
  }, [data]);

  // Toggle tool selection
  const toggleTool = useCallback((toolId: string) => {
    let newSelectedTools: string[];
    
    if (selectedTools.includes(toolId)) {
      newSelectedTools = selectedTools.filter(id => id !== toolId);
    } else {
      newSelectedTools = [...selectedTools, toolId];
    }
    
    setSelectedTools(newSelectedTools);
    updateNodeData('selectedTools', newSelectedTools);
  }, [selectedTools, updateNodeData]);

  // Generate the node configuration UI
  const renderConfig = () => (
    <div className="space-y-5 p-1">
      <div className="text-sm text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
        Prompt an AI language model. Provide detailed instructions to get the best results.
      </div>
      
      {/* Prompt section */}
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Prompt</label>
          <div className="ml-1 text-gray-400 text-sm rounded-full bg-gray-100 dark:bg-gray-700 h-5 w-5 flex items-center justify-center">ⓘ</div>
        </div>
        <textarea
          className="w-full p-3 border border-purple-200 dark:border-purple-800 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none shadow-sm"
          placeholder="Summarize the article in the context"
          rows={3}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            updateNodeData('prompt', e.target.value);
          }}
        />
      </div>
      
      {/* AI model selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose AI model</label>
        <div className="relative">
          <select
            className="w-full p-3 border border-purple-200 dark:border-purple-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none"
            value={llmModel}
            onChange={(e) => {
              setLlmModel(e.target.value);
              updateNodeData('llmModel', e.target.value);
            }}
          >
            {AI_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 pointer-events-none">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Tools selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Agent Tools</label>
        <div className="relative">
          <button
            className="w-full p-3 border border-purple-200 dark:border-purple-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none text-left"
            onClick={() => setToolDropdownOpen(!toolDropdownOpen)}
          >
            {selectedTools.length === 0 
              ? 'Select tools' 
              : `${selectedTools.length} tool${selectedTools.length > 1 ? 's' : ''} selected`}
          </button>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 pointer-events-none">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {toolDropdownOpen && (
            <div 
              className="absolute z-10 top-full left-0 right-0 bg-gray-100 dark:bg-gray-700 border border-purple-200 dark:border-purple-800 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {AVAILABLE_TOOLS.map((tool) => (
                <div 
                  key={tool.id}
                  className={`px-3 py-2 cursor-pointer text-sm ${selectedTools.includes(tool.id) ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  onClick={() => toggleTool(tool.id)}
                >
                  {selectedTools.includes(tool.id) && <span className="mr-2">✓</span>}
                  {tool.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Show selected tools as chips */}
        {selectedTools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedTools.map(toolId => {
              const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
              return (
                <div 
                  key={toolId}
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 text-xs px-2.5 py-1.5 rounded-full flex items-center shadow-sm"
                >
                  <span className="mr-1">{tool?.icon}</span>
                  <span>{tool?.name || toolId}</span>
                  <button 
                    className="ml-1.5 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 w-4 h-4 flex items-center justify-center rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                    onClick={() => toggleTool(toolId)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* More options button */}
      <button
        className="w-full p-3 border border-purple-200 dark:border-purple-800 rounded-lg text-sm text-left flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm hover:bg-purple-50 dark:hover:bg-gray-750 transition-colors"
        onClick={() => setShowMoreOptions(!showMoreOptions)}
      >
        <span className="font-medium">{showMoreOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
        <span className="text-purple-500">
          {showMoreOptions ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </button>
      
      {/* Advanced options when expanded */}
      {showMoreOptions && (
        <div className="space-y-4 p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-950/20 shadow-inner">
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Advanced model settings</div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Temperature</label>
              <span className="text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                {temperature.toFixed(1)}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              className="w-full accent-purple-500"
              value={temperature}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setTemperature(value);
                updateNodeData('temperature', value);
              }}
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BaseNode
      data={{...data, color: '#8A2BE2'}} // Use consistent purple color
      isConnectable={isConnectable}
      width={400}
      {...rest}
    >
      {renderConfig()}
    </BaseNode>
  );
});

AskAINode.displayName = 'AskAINode';

export default AskAINode; 
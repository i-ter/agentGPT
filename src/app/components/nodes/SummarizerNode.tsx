'use client';

import { useEffect, useState, memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Extend the base node data with Summarizer specific properties
export interface SummarizerNodeData extends BaseNodeData {
  prompt: string;
  style: 'concise' | 'detailed' | 'bullet_points';
  temperature: number;
  llmModel?: string;
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

const SummarizerNode = memo(({ data, ...props }: NodeProps<SummarizerNodeData>) => {
  const [prompt, setprompt] = useState(data.prompt || '');
  const [style, setStyle] = useState<'concise' | 'detailed' | 'bullet_points'>(data.style || 'concise');
  const [temperature, setTemperature] = useState(data.temperature || 0.7);
  const [llmModel, setLlmModel] = useState<string>(data.llmModel || 'gpt-4o-mini');

  // Update parent data when local state changes
  useEffect(() => {
    data.prompt = prompt;
    data.style = style;
    data.temperature = temperature;
    data.llmModel = llmModel;
  }, [data, prompt, style, temperature, llmModel]);

  const nodeData = {
    ...data,
    label: data.label || 'Summarizer',
    type: 'summarizerNode',
    color: '#6366F1',
    category: 'Using AI'
  };

  return (
    <BaseNode
      data={nodeData}
      width={400}
      {...props}
    >
      <div className="px-4 pb-4 pt-2">
        <div className="mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">How to use</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Connect text content to the input handle. The summarizer will process the text according to your selected style and instructions.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            prompt Style
          </label>
          <div className="flex space-x-2">
            {(['concise', 'detailed', 'bullet_points'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setStyle(option)}
                className={`
                  py-1.5 px-3 text-sm rounded-md transition-colors
                  ${style === option 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {option === 'concise' && 'Concise'}
                {option === 'detailed' && 'Detailed'}
                {option === 'bullet_points' && 'Bullet Points'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Temperature: {temperature.toFixed(1)}
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Deterministic</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            AI Model
          </label>
          <div className="relative">
            <select
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-500 transition-colors appearance-none"
            >
              {AI_MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom Instructions (Optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setprompt(e.target.value)}
            placeholder="Add specific instructions for how to summarize content..."
            className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </BaseNode>
  );
});

SummarizerNode.displayName = 'SummarizerNode';

export default SummarizerNode; 
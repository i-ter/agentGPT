'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';
import { FaDatabase } from 'react-icons/fa';

// Extend the base node data with SQL Database specific properties
export interface SQLDatabaseNodeData extends BaseNodeData {
  databaseName?: string;
  databaseType?: 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'oracle';
  query?: string;
  prompt?: string;
  resultLimit?: number;
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

// Database types with their icons and colors
const DATABASE_TYPES = [
  { id: 'sqlite', name: 'SQLite', color: '#a18c00' },
  { id: 'supabase', name: 'Supabase', color: '#000000' },
  // { id: 'mysql', name: 'MySQL', color: '#0f80cc'},
  // { id: 'postgresql', name: 'PostgreSQL',  color: '#336791' },
  // { id: 'oracle', name: 'Oracle', color: '#F80000' },
];

const SQLDatabaseNode = memo(({ data, isConnectable, ...rest }: NodeProps<SQLDatabaseNodeData>) => {
  // Initialize with data from props or defaults
  const [databaseName, setDatabaseName] = useState<string>(data.databaseName || '');
  const [databaseType, setDatabaseType] = useState<'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'oracle'>(
    data.databaseType || 'mysql'
  );
  const [query, setQuery] = useState<string>(data.query || '');
  const [prompt, setprompt] = useState<string>(data.prompt || '');
  const [resultLimit, setResultLimit] = useState<number>(data.resultLimit || 100);
  const [showAskAI, setShowAskAI] = useState<boolean>(true);
  const [showRawQuery, setShowRawQuery] = useState<boolean>(false);
  const [llmModel, setLlmModel] = useState<string>(data.llmModel || 'gpt-4o-mini');

  // Update node data when fields change
  const updateNodeData = useCallback((field: keyof SQLDatabaseNodeData, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
  }, [data]);

  // Update query whenever query builder fields change
  useEffect(() => {
    if (prompt) {
      // This would be where you'd call an AI service to generate SQL
      updateNodeData('prompt', prompt);
    }
  }, [prompt, updateNodeData]);

  // Get database type details
  const getDbTypeDetails = () => {
    return DATABASE_TYPES.find(db => db.id === databaseType) || DATABASE_TYPES[0];
  };

  // Override base node data with our custom data
  const nodeData = {
    ...data,
    label: data.label || 'SQL Database',
    type: 'sqlDatabaseNode',
    icon: <FaDatabase />,
    color: getDbTypeDetails().color,
    category: 'Data Sources'
  };

  // Generate the node configuration UI
  const renderConfig = () => (
    <div className="space-y-4 p-1">
      <div className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
        Generate accurate SQL queries to find exactly the data you need. Works with Summarizer node.
      </div>
      
      {/* Database selections */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Type</label>
          <div className="relative">
            <select
              className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm"
              value={databaseType}
              onChange={(e) => {
                setDatabaseType(e.target.value as any);
                updateNodeData('databaseType', e.target.value);
              }}
            >
              {DATABASE_TYPES.map((db) => (
                <option key={db.id} value={db.id}>
                  {<FaDatabase />} {db.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none">
              <svg width="12" height="6" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Name</label>
          <input
            type="text"
            className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm bg-white dark:bg-gray-800 shadow-sm"
            placeholder="e.g., customer_db"
            value={databaseName}
            onChange={(e) => {
              setDatabaseName(e.target.value);
              updateNodeData('databaseName', e.target.value);
            }}
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-1.5 px-3 text-sm font-medium rounded-t-lg ${
            showAskAI 
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            setShowAskAI(true);
            setShowRawQuery(false);
          }}
        >
          Ask AI
        </button>
        <button
          className={`py-1.5 px-3 text-sm font-medium rounded-t-lg ${
            showRawQuery
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            setShowAskAI(false);
            setShowRawQuery(true);
          }}
        >
          Raw SQL
        </button>
      </div>
      
      {/* AskAI UI */}
      {showAskAI && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Describe the data you need</label>
            <textarea
              className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm resize-y h-[100px] bg-white dark:bg-gray-800 shadow-sm"
              placeholder="Example: 'Sales data for products with >100 units sold last quarter, including product name, category, and revenue.'"
              value={prompt}
              onChange={(e) => {
                setprompt(e.target.value);
                updateNodeData('prompt', e.target.value);
              }}
            />
          </div>
          
          {/* AI model selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">AI model</label>
            <div className="relative">
              <select
                className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm"
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
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none">
                <svg width="12" height="6" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs">
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              <strong>Tip:</strong> Include: tables, fields, filters, ordering, time periods
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Result Limit: {resultLimit}
            </label>
            <input 
              type="range" 
              min="1" 
              max="1000" 
              step="10" 
              value={resultLimit}
              onChange={(e) => {
                setResultLimit(parseInt(e.target.value));
                updateNodeData('resultLimit', parseInt(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>500</span>
              <span>1000</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Raw SQL editor */}
      {showRawQuery && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SQL Query</label>
          <textarea
            className="w-full p-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm resize-y h-[120px] font-mono bg-white dark:bg-gray-800 shadow-sm"
            placeholder="SELECT * FROM users WHERE created_at > '2023-01-01' LIMIT 100"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateNodeData('query', e.target.value);
            }}
          />
        </div>
      )}
      
      {/* Integration tip */}
      <div className="text-xs p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          <strong>Tip:</strong> Connect to a Summarizer node to generate reports and insights from your query results.
        </p>
      </div>
    </div>
  );

  return (
    <BaseNode
      data={nodeData}
      width={450}
      isConnectable={isConnectable}
      {...rest}
    >
      {renderConfig()}
    </BaseNode>
  );
});

SQLDatabaseNode.displayName = 'SQLDatabaseNode';

export default SQLDatabaseNode; 
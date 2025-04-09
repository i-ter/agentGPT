'use client';

import { memo, useState, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Extend the base node data with API Integration specific properties
export interface APIIntegrationNodeData extends BaseNodeData {
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  authType: 'None' | 'API Key' | 'Bearer Token' | 'Basic Auth' | 'OAuth2';
  headers: Array<{ key: string; value: string }>;
  arguments: Array<{ 
    name: string; 
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description?: string;
  }>;
  responseFormat: 'JSON' | 'XML' | 'Text';
}

// Available HTTP methods
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

// Available auth types
const AUTH_TYPES = ['None', 'API Key', 'Bearer Token', 'Basic Auth', 'OAuth2'] as const;

// Available argument types
const ARGUMENT_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const;

// Available response formats
const RESPONSE_FORMATS = ['JSON', 'XML', 'Text'] as const;

const APIIntegrationNode = memo(({ data, ...props }: NodeProps<APIIntegrationNodeData>) => {
  // Initialize with data from props or defaults
  const [description, setDescription] = useState(data.description || '');
  const [endpoint, setEndpoint] = useState(data.endpoint || '');
  const [method, setMethod] = useState<typeof HTTP_METHODS[number]>(data.method || 'GET');
  const [authType, setAuthType] = useState<typeof AUTH_TYPES[number]>(data.authType || 'None');
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(data.headers || []);
  const [arguments_, setArguments] = useState<Array<{ 
    name: string; 
    type: typeof ARGUMENT_TYPES[number];
    required: boolean;
    description?: string;
  }>>(data.arguments || []);
  const [responseFormat, setResponseFormat] = useState<typeof RESPONSE_FORMATS[number]>(data.responseFormat || 'JSON');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showArgumentForm, setShowArgumentForm] = useState(false);
  const [newArgument, setNewArgument] = useState({
    name: '',
    type: 'string' as typeof ARGUMENT_TYPES[number],
    required: false,
    description: ''
  });

  // Update node data when fields change
  const updateNodeData = useCallback((field: keyof APIIntegrationNodeData, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
  }, [data]);

  // Add new header
  const addHeader = useCallback(() => {
    const updatedHeaders = [...headers, { key: '', value: '' }];
    setHeaders(updatedHeaders);
    updateNodeData('headers', updatedHeaders);
  }, [headers, updateNodeData]);

  // Update header
  const updateHeader = useCallback((index: number, key: string, value: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { key, value };
    setHeaders(updatedHeaders);
    updateNodeData('headers', updatedHeaders);
  }, [headers, updateNodeData]);

  // Delete header
  const deleteHeader = useCallback((index: number) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
    updateNodeData('headers', updatedHeaders);
  }, [headers, updateNodeData]);

  // Add new argument
  const addArgument = useCallback(() => {
    if (!newArgument.name.trim()) return;
    
    const updatedArguments = [...arguments_, { ...newArgument }];
    setArguments(updatedArguments);
    updateNodeData('arguments', updatedArguments);
    
    // Reset form
    setNewArgument({
      name: '',
      type: 'string',
      required: false,
      description: ''
    });
    setShowArgumentForm(false);
  }, [arguments_, newArgument, updateNodeData]);

  // Delete argument
  const deleteArgument = useCallback((index: number) => {
    const updatedArguments = arguments_.filter((_, i) => i !== index);
    setArguments(updatedArguments);
    updateNodeData('arguments', updatedArguments);
  }, [arguments_, updateNodeData]);

  const nodeData = {
    ...data,
    label: data.label || 'API Integration',
    type: 'apiIntegrationNode',
    color: '#4285F4', // Google Blue color
    category: 'Integrations',
    description: description
  };

  return (
    <BaseNode
      data={nodeData}
      {...props}
    >
      <div className="px-4 pb-4 pt-2 space-y-4">
        
        <div className="text-sm text-blue-700 dark:text-blue-300 font-medium bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
          Create a custom API integration. Define the API endpoint, method, and expected arguments.
        </div>
        
        {/* Description field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              updateNodeData('description', e.target.value);
            }}
            placeholder="Describe what this API integration does..."
            className="w-full min-h-[60px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-500 transition-colors"
          />
        </div>
        
        {/* Endpoint URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            API Endpoint
          </label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => {
              setEndpoint(e.target.value);
              updateNodeData('endpoint', e.target.value);
            }}
            placeholder="https://api.example.com/v1/resource"
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-500 transition-colors"
          />
        </div>
        
        {/* HTTP Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            HTTP Method
          </label>
          <div className="flex space-x-2">
            {HTTP_METHODS.map((httpMethod) => (
              <button
                key={httpMethod}
                onClick={() => {
                  setMethod(httpMethod);
                  updateNodeData('method', httpMethod);
                }}
                className={`
                  py-1.5 px-3 text-sm rounded-md transition-colors
                  ${method === httpMethod 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {httpMethod}
              </button>
            ))}
          </div>
        </div>
        
        {/* Arguments section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Arguments
            </label>
            <button
              onClick={() => setShowArgumentForm(true)}
              className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Argument
            </button>
          </div>
          
          {/* Existing arguments */}
          {arguments_.length > 0 ? (
            <div className="space-y-2 mb-3">
              {arguments_.map((arg, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{arg.name}</span>
                      {arg.required && (
                        <span className="ml-1 text-xs text-red-500">*</span>
                      )}
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                        {arg.type}
                      </span>
                    </div>
                    {arg.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {arg.description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteArgument(index)}
                    className="ml-2 text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
              No arguments defined
            </div>
          )}
          
          {/* New argument form */}
          {showArgumentForm && (
            <div className="mt-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md bg-blue-50 dark:bg-blue-900/20">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">Add New Argument</div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newArgument.name}
                    onChange={(e) => setNewArgument({...newArgument, name: e.target.value})}
                    placeholder="argument_name"
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newArgument.type}
                    onChange={(e) => setNewArgument({...newArgument, type: e.target.value as any})}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                  >
                    {ARGUMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newArgument.description}
                  onChange={(e) => setNewArgument({...newArgument, description: e.target.value})}
                  placeholder="Brief description of this argument..."
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                />
              </div>
              
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="required"
                  checked={newArgument.required}
                  onChange={(e) => setNewArgument({...newArgument, required: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
                  Required argument
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowArgumentForm(false);
                    setNewArgument({
                      name: '',
                      type: 'string',
                      required: false,
                      description: ''
                    });
                  }}
                  className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={addArgument}
                  disabled={!newArgument.name.trim()}
                  className={`px-3 py-1.5 text-xs text-white rounded-md ${
                    newArgument.name.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-400 cursor-not-allowed'
                  }`}
                >
                  Add Argument
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Advanced Options toggle */}
        <button
          className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-left flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <span className="font-medium">{showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
          <span className="text-gray-500">
            {showAdvancedOptions ? (
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
        
        {/* Advanced options section */}
        {showAdvancedOptions && (
          <div className="space-y-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 shadow-inner">
            {/* Authentication Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Authentication Type
              </label>
              <select
                value={authType}
                onChange={(e) => {
                  setAuthType(e.target.value as typeof AUTH_TYPES[number]);
                  updateNodeData('authType', e.target.value);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
              >
                {AUTH_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Response Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Response Format
              </label>
              <div className="flex space-x-2">
                {RESPONSE_FORMATS.map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      setResponseFormat(format);
                      updateNodeData('responseFormat', format);
                    }}
                    className={`
                      py-1.5 px-3 text-sm rounded-md transition-colors flex-1
                      ${responseFormat === format 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Headers section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Headers
                </label>
                <button
                  onClick={addHeader}
                  className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Header
                </button>
              </div>
              
              {headers.length > 0 ? (
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, e.target.value, header.value)}
                        placeholder="Header name"
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, header.key, e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <button
                        onClick={() => deleteHeader(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                  No headers defined
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
});

APIIntegrationNode.displayName = 'APIIntegrationNode';

export default APIIntegrationNode; 
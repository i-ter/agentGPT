'use client';

import { memo, ReactNode, useState, useRef } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import NodeToolbar from './NodeToolbar';
import React from 'react';


export interface BaseNodeData {
  id?: string;
  label: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
  description?: string;
}

export interface BaseNodeProps extends NodeProps<BaseNodeData> {
  children?: ReactNode;
  showHandles?: boolean;
  isExpandable?: boolean;
  headerExtras?: ReactNode;
  width?: number | string;
  height?: number | string;
}

export interface NodeConfigProps {
  data: BaseNodeData;
  onChange?: (updatedData: Partial<BaseNodeData>) => void;
}


const BaseNode = memo(({ 
  data, 
  isConnectable, 
  children, 
  showHandles = true,
  isExpandable = true,
  headerExtras,
  selected,
  id,
  width = 450,
  height = 'auto'
}: BaseNodeProps) => {
  const [expanded, setExpanded] = useState(true); // Default to expanded
  const [showToolbar, setShowToolbar] = useState(false);

  // Function to update node data (to be implemented by child nodes)
  const updateNodeData = (newData: Partial<BaseNodeData>) => {
    // This is a placeholder - child components will implement this
    console.log('Update node data:', newData);
  };

  // Handle toolbar actions
  const handleDuplicate = () => {
    console.log('Duplicate node:', id);
  };

  const handleRename = () => {
    console.log('Rename node:', id);
  };

  const handleConfigureInputs = () => {
    console.log('Configure inputs for node:', id);
  };

  const handleDelete = () => {
    console.log('Delete node:', id);
  };
  return (
    <div className="group relative">
      {/* Toolbar - shows on group hover instead of node hover */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <NodeToolbar
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onConfigureInputs={handleConfigureInputs}
          onDelete={handleDelete}
        />
      </div>
      
      <div 
        className={`relative p-2 rounded-xl shadow-lg bg-white dark:bg-gray-800 border-2 min-w-[350px] transition-all duration-200 ${
          selected ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900' : ''
        }`}
        style={{ 
          borderColor: data.color,
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }}
      >
        {/* Input handle */}
        {showHandles && (
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            className="w-4 h-4 bg-blue-500 border-2 border-white dark:border-gray-800"
            style={{ left: -3 }}
          />
        )}
        
        {/* Node Header */}
        <div 
          className="px-5 py-4 flex items-center border-b border-gray-100 dark:border-gray-700"
          style={{ background: `${data.color}15` }} // Light version of the color
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-2xl shadow-sm"
            style={{ backgroundColor: data.color, color: "#FFF" }}
          >
            {data.icon}
          </div>
          <div className="flex-grow">
            <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{data.label}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {data.category || data.type}
            </div>
          </div>
          {headerExtras}
          {isExpandable && (
            <button 
              className="ml-2 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <svg width="12" height="7" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="7" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )}
        </div>
        
        {/* Node Content */}
        {expanded && children && (
          <div className="px-4 py-4 rounded-b-lg text-base">
            {children}
          </div>
        )}
        
        {/* Output handle */}
        {showHandles && (
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            className="w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800"
            style={{ right: -3 }}
          />
        )}
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode; 
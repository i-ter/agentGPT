'use client';

import dynamic from 'next/dynamic';
import NotificationProvider from '../components/NotificationManager';
import { useState } from 'react';
import Header from '../components/Header';

// Import the FlowEditor component with dynamic import to avoid SSR issues with ReactFlow
const FlowEditor = dynamic(() => import('../components/FlowEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex-grow flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
});

export default function EditorPage() {
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveWorkflow = () => {
    setIsSaving(true);
    // Trigger the save event that FlowEditor is listening for
    window.dispatchEvent(new CustomEvent('save-workflow', { 
      detail: { name: workflowName } 
    }));
    // This will be reset when FlowEditor completes saving
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Create custom right content with workflow name input and save button
  const customRightContent = (
    <div className="flex items-center space-x-3 mr-4">
      <input
        className="text-lg bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        placeholder="Workflow Name"
      />
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={handleSaveWorkflow}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Workflow'}
      </button>
    </div>
  );

  return (
    <NotificationProvider>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* <div className="container mx-auto pl-0 pr-4"> */}
            <Header 
              subtitle="Workflow Editor" 
              showBackButton={true}
              rightContent={customRightContent}
              imageName="/leaf_circuit.png"
            />
          {/* </div> */}
        </div>
        
        <main className="flex-grow overflow-hidden">
          <div id="flow-editor-container" className="h-full">
            <FlowEditor 
              initialWorkflowName={workflowName} 
              onWorkflowNameChange={setWorkflowName} 
            />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
} 
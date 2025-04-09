'use client';

import { useState, useEffect } from 'react';
import { getUserWorkflows, deleteWorkflow, WorkflowData } from '../firebase/workflowOperations';
import { 
  requestDeployment, 
  getUserDeployments, 
  cancelDeployment, 
  DeploymentData 
} from '../firebase/deploymentOperations';
import { useNotification } from './NotificationManager';
import Link from 'next/link';

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [deployments, setDeployments] = useState<DeploymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Fetch workflows
  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const userWorkflows = await getUserWorkflows();
      // Sort workflows by updatedAt date (newest first)
      const sortedWorkflows = sortWorkflowsByDate(userWorkflows);
      setWorkflows(sortedWorkflows);
      setError(null);
      
      // Fetch deployments after workflows are loaded
      fetchDeployments();
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to fetch workflows');
      showNotification('Error loading workflows', 'error');
      setLoading(false);
    }
  };

  // Fetch deployments
  const fetchDeployments = async () => {
    try {
      const userDeployments = await getUserDeployments();
      setDeployments(userDeployments);
    } catch (err) {
      console.error('Error fetching deployments:', err);
      showNotification('Error loading deployment information', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  // Sort workflows by updatedAt field (newest first)
  const sortWorkflowsByDate = (workflows: WorkflowData[]): WorkflowData[] => {
    return [...workflows].sort((a, b) => {
      const dateA = getDateValue(a.updatedAt);
      const dateB = getDateValue(b.updatedAt);
      return dateB - dateA; // Descending order (newest first)
    });
  };

  // Helper function to convert different date formats to timestamp for comparison
  const getDateValue = (date: any): number => {
    if (!date) return 0;
    
    try {
      // Handle Firebase Timestamp objects
      if (date && typeof date === 'object' && 'toDate' in date) {
        return date.toDate().getTime();
      }
      
      // Handle date strings
      if (typeof date === 'string') {
        return new Date(date).getTime();
      }
      
      // Handle regular Date objects
      if (date instanceof Date) {
        return date.getTime();
      }
      
      // Handle timestamps (seconds or milliseconds)
      if (typeof date === 'number') {
        // If date is in seconds (Firebase timestamp), convert to milliseconds
        return date < 1000000000000 ? date * 1000 : date;
      }
      
      // Handle objects with seconds and nanoseconds (Firebase timestamp format)
      if (date && typeof date === 'object' && 'seconds' in date) {
        return date.seconds * 1000;
      }
      
      return 0;
    } catch (error) {
      console.error('Error processing date for sorting:', error, date);
      return 0;
    }
  };

  // Check if a workflow has an active deployment
  const getActiveDeployment = (workflowId: string): DeploymentData | undefined => {
    return deployments.find(
      deployment => 
        deployment.workflow_id === workflowId && 
        (deployment.status === 'requested' || deployment.status === 'running')
    );
  };

  // Get status badge styles based on deployment status
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'requested':
        return {
          badge: 'bg-amber-100 text-amber-800',
          dot: 'bg-amber-400',
          dotInner: 'bg-amber-500'
        };
      case 'running':
        return {
          badge: 'bg-green-100 text-green-800',
          dot: 'bg-green-400',
          dotInner: 'bg-green-500'
        };
      case 'success':
        return {
          badge: 'bg-blue-100 text-blue-800',
          dot: 'bg-blue-400',
          dotInner: 'bg-blue-500'
        };
      case 'failed':
        return {
          badge: 'bg-red-100 text-red-800',
          dot: 'bg-red-400',
          dotInner: 'bg-red-500'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800',
          dot: 'bg-gray-400',
          dotInner: 'bg-gray-500'
        };
    }
  };

  // Handle workflow deletion
  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!workflowId) return;
    
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        showNotification('Workflow deleted successfully', 'success');
        
        // Refresh the list
        fetchWorkflows();
      } catch (err) {
        console.error('Error deleting workflow:', err);
        showNotification('Error deleting workflow', 'error');
      }
    }
  };

  // Handle workflow deployment
  const handleDeployWorkflow = async (workflow: WorkflowData) => {
    if (!workflow.id) return;
    
    try {
      await requestDeployment(workflow.id, workflow.name);
      showNotification('Deployment requested successfully', 'success');
      // Refresh deployments
      fetchDeployments();
    } catch (err) {
      console.error('Error requesting deployment:', err);
      showNotification('Error requesting deployment', 'error');
    }
  };

  // Handle deployment cancellation
  const handleCancelDeployment = async (deploymentId: string) => {
    if (!deploymentId) return;
    
    if (confirm('Are you sure you want to cancel this deployment?')) {
      try {
        await cancelDeployment(deploymentId);
        showNotification('Deployment cancelled successfully', 'success');
        fetchDeployments();
      } catch (err) {
        console.error('Error cancelling deployment:', err);
        showNotification('Error cancelling deployment', 'error');
      }
    }
  };

  // Format date for display
  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    try {
      // Handle Firebase Timestamp objects
      if (date && typeof date === 'object' && 'toDate' in date) {
        return date.toDate().toLocaleString();
      }
      
      // Handle date strings
      if (typeof date === 'string') {
        return new Date(date).toLocaleString();
      }
      
      // Handle regular Date objects
      if (date instanceof Date) {
        return date.toLocaleString();
      }
      
      // Handle timestamps (seconds or milliseconds)
      if (typeof date === 'number') {
        // If date is in seconds (Firebase timestamp), convert to milliseconds
        const timestamp = date < 1000000000000 ? date * 1000 : date;
        return new Date(timestamp).toLocaleString();
      }
      
      // Handle objects with seconds and nanoseconds (Firebase timestamp format)
      if (date && typeof date === 'object' && 'seconds' in date) {
        return new Date(date.seconds * 1000).toLocaleString();
      }
      
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Workflows</h1>
        <Link href="/editor" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2">
          <span>Create New Workflow</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : workflows.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center shadow-md">
          <p className="text-lg mb-4">You don't have any workflows yet.</p>
          <Link href="/editor" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            Create Your First Workflow
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => {
            const activeDeployment = workflow.id ? getActiveDeployment(workflow.id) : undefined;
            
            return (
              <div key={workflow.id} className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="p-5 flex-grow">
                  <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{workflow.name}</h2>
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated: {formatDate(workflow.updatedAt)}
                    </p>
                    <p className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {workflow.nodes.length} nodes, {workflow.edges.length} connections
                    </p>
                  </div>
                  
                  {/* Reserve space for deployment status */}
                  <div className="h-8 mt-2">
                    {activeDeployment && (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        getStatusStyles(activeDeployment.status).badge
                      }`}>
                        <span className="relative flex h-2 w-2 mr-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                            getStatusStyles(activeDeployment.status).dot
                          } opacity-75`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            getStatusStyles(activeDeployment.status).dotInner
                          }`}></span>
                        </span>
                        Deployment {activeDeployment.status} ({formatDate(activeDeployment.requested_at)})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900 mt-auto">
                  <div className="flex space-x-3">
                    <Link 
                      href={`/editor?id=${workflow.id}`} 
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => workflow.id && handleDeleteWorkflow(workflow.id)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                  
                  {activeDeployment ? (
                    <button
                      onClick={() => activeDeployment.id && handleCancelDeployment(activeDeployment.id)}
                      className={`inline-flex items-center transition-colors font-medium ${
                        activeDeployment.status === 'requested' 
                          ? 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300' 
                          : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Deploy
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeployWorkflow(workflow)}
                      className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Deploy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 
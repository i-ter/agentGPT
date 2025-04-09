'use client';

import NotificationProvider from '../components/NotificationManager';
import WorkflowList from '../components/WorkflowList';
import Header from '../components/Header';

export default function WorkflowsPage() {
  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* <div className="container mx-auto pl-0 pr-4"> */}
            <Header subtitle="Your Workflows" showBackButton={true} rightContent="none" />
          {/* </div> */}
        </div>
        
        <main className="flex-grow p-4">
          <WorkflowList />
        </main>
      </div>
    </NotificationProvider>
  );
} 
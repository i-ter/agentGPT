'use client';

import Link from 'next/link';
import NotificationProvider from './components/NotificationManager';
import Header from './components/Header';
import BackgroundAnimation from './components/BackgroundAnimation';

export default function Home() {
  return (
    <NotificationProvider>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative">
        <BackgroundAnimation />
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative z-10">
          {/* <div className="container mx-auto pl-0 pr-4"> */}
          <Header rightContent='default' />
          {/* </div> */}
        </div>
        
        <main className="flex-grow p-8 flex items-center justify-center relative z-10">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
              Build Intelligent Agent Workflows
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transition transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Workflow</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Build a new intelligent workflow from scratch using our visual editor
                </p>
                <Link 
                  href="/editor"
                  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                >
                  New Workflow
                </Link>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 transition transform hover:scale-105 border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">My Workflows</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  View, edit, and manage your existing workflows
                </p>
                <Link 
                  href="/workflows"
                  className="inline-block px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition"
                >
                  View Workflows
                </Link>
              </div>
            </div>
            
            <div className="mt-12 text-center text-gray-500 dark:text-gray-400">
              <p>
                Connect AI agents, file operations, API integrations, and communication platforms.
                <br />Build powerful automation workflows with a visual drag-and-drop interface.
              </p>
            </div>
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}

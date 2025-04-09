import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiSettings } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { TbPlugConnected } from 'react-icons/tb';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  imageName?: string;
  rightContent?: 'default' | 'none' | 'editor' | ReactNode;
}

export default function Header({ 
  title = "AgentGPT", 
  subtitle = "Build, customize, and connect AI agents",
  imageName = "/leaf_circuit.png",
  showBackButton = false,
  rightContent = 'default'
}: HeaderProps) {
  
  // Render right content based on the option
  const renderRightContent = () => {
    if (rightContent === 'none') {
      return null;
    } else if (rightContent === 'default') {
      return (
        <div className="flex items-center gap-4 mr-4">
          <button 
            onClick={() => window.open('https://platform.aci.dev/apps', '_blank')}
            className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
          >
            <TbPlugConnected className="text-lg" /> aci.dev integrations
          </button>
          <button className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm">
            <IoDocumentTextOutline className="text-lg" /> Docs
          </button>
          <button className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm">
            <FiSettings className="text-lg" /> Settings
          </button>
        </div>
      );
    } else if (rightContent === 'editor') {
      return null; // The editor content is passed as custom content to the parent component
    } else {
      // If rightContent is a ReactNode, render it directly
      return rightContent;
    }
  };

  return (
    <header className="py-3 pl-0 flex items-center justify-between w-full">
      <div className="flex items-center ml-4">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={imageName}
            alt="Logo"
            width={32}
            height={32}
            priority
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{title}</h1>
            {showBackButton && (
              <Link href="/" className="flex items-center ml-4 text-gray-500 hover:text-blue-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Back to Home</span>
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {renderRightContent()}
    </header>
  );
} 
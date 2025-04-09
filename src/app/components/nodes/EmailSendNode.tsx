'use client';

import { memo, useState, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';
import { MdEmail } from 'react-icons/md';

// Extend the base node data with Email specific properties
export interface EmailSendNodeData extends BaseNodeData {
  // Email configuration
  recipients: string;
  subject: string;
  emailBody: string;
}

// Main node component
const EmailSendNode = memo(({ data, ...props }: NodeProps<EmailSendNodeData>) => {
  // Initialize with data from props or defaults
  const [recipients, setRecipients] = useState(data.recipients || '');
  const [subject, setSubject] = useState(data.subject || '');
  const [emailBody, setEmailBody] = useState(data.emailBody || 'Your email content here. Use {"{input}"} to include incoming data.');

  // Update node data when fields change
  const updateNodeData = useCallback((field: string, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
    
    // Also update local state
    switch(field) {
      case 'recipients':
        setRecipients(value);
        break;
      case 'subject':
        setSubject(value);
        break;
      case 'emailBody':
        setEmailBody(value);
        break;
    }
  }, [data]);

  // Set up node data for rendering
  const nodeData = {
    ...data,
    label: 'Email Sender',
    type: 'emailSendNode',
    icon: <MdEmail />,
    color: '#00B2FF',
    category: 'Communication'
  };

  return (
    <BaseNode
      data={nodeData}
      width={400}
      {...props}
    >
      <div className="px-4 pb-4 pt-2 space-y-4">
        {/* Header with email info */}
        <div 
          className="text-sm font-medium p-3 rounded-lg"
          style={{ 
            backgroundColor: `${nodeData.color}15`,
            color: nodeData.color
          }}
        >
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2"><MdEmail /></span>
            <span className="font-medium">
              SendGrid Email
            </span>
          </div>
          Configure this node to send emails using the SendGrid API. You can include dynamic content from previous nodes using {"{input}"} placeholder.
        </div>
        
        {/* Email Content Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipients
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => updateNodeData('recipients', e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Comma-separated list of email addresses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => updateNodeData('subject', e.target.value)}
              placeholder="Email subject line"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Body
            </label>
            <textarea
              value={emailBody}
              onChange={(e) => updateNodeData('emailBody', e.target.value)}
              placeholder="Enter your email content. Use {'{input}'} to include incoming data."
              className="w-full min-h-[150px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              You can use the {"{input}"} placeholder to include data from previous nodes
            </p>
          </div>
        </div>
      </div>
    </BaseNode>
  );
});

EmailSendNode.displayName = 'EmailSendNode';

export default EmailSendNode; 
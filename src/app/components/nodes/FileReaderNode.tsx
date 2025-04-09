'use client';

import { useCallback, useState, memo } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Extend the base node data with FileReader specific properties
export interface FileReaderNodeData extends BaseNodeData {
  fileType: string;
  filePath: string;
  extractStrategy: 'full' | 'chunks' | 'summary';
  chunkSize: number;
  sourceType: 'local' | 'google_doc';
}

const FILE_TYPES = [
  'Text',
  'PDF',
  'Word',
  'Excel',
  'CSV',
  'JSON',
  'HTML',
  'Markdown',
];

const FileReaderNode = memo(({ data, ...props }: NodeProps<FileReaderNodeData>) => {
  const [fileType, setFileType] = useState<string>(data.fileType || 'Text');
  const [filePath, setFilePath] = useState<string>(data.filePath || '');
  const [extractStrategy, setExtractStrategy] = useState<'full' | 'chunks' | 'summary'>(
    data.extractStrategy || 'full'
  );
  const [chunkSize, setChunkSize] = useState<number>(data.chunkSize || 1000);
  const [sourceType, setSourceType] = useState<'local' | 'google_doc'>(
    data.sourceType || 'local'
  );

  // Update node data when fields change
  const updateNodeData = useCallback((field: keyof FileReaderNodeData, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
  }, [data]);

  // Handle file type change
  const handleFileTypeChange = useCallback((type: string) => {
    setFileType(type);
    updateNodeData('fileType', type);
  }, [updateNodeData]);

  // Handle file path change
  const handleFilePathChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const path = e.target.value;
    setFilePath(path);
    updateNodeData('filePath', path);
  }, [updateNodeData]);

  // Handle extraction strategy change
  const handleStrategyChange = useCallback((strategy: 'full' | 'chunks' | 'summary') => {
    setExtractStrategy(strategy);
    updateNodeData('extractStrategy', strategy);
  }, [updateNodeData]);

  // Handle chunk size change
  const handleChunkSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setChunkSize(size);
    updateNodeData('chunkSize', size);
  }, [updateNodeData]);

  // Handle source type change
  const handleSourceTypeChange = useCallback((type: 'local' | 'google_doc') => {
    setSourceType(type);
    updateNodeData('sourceType', type);
  }, [updateNodeData]);

  const nodeData = {
    ...data,
    label: data.label || 'File Reader',
    type: 'fileReaderNode',
    color: '#10B981', // Emerald color
    category: 'Data Sources'
  };

  return (
    <BaseNode
      data={nodeData}
      width={400}
      {...props}
    >
      <div className="px-4 pb-4 pt-2">
        {/* How to use section - moved to the top */}
        <div className="mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">HOW TO USE</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            The File Reader node reads content from local files or Google Docs and makes it available to downstream nodes.
          </p>
        </div>

        {/* Source Type Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Source Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSourceTypeChange('local')}
              className={`
                py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center
                ${sourceType === 'local' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15L12 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Local File
            </button>
            <button
              onClick={() => handleSourceTypeChange('google_doc')}
              className={`
                py-2 px-3 text-sm rounded-md transition-colors flex items-center justify-center
                ${sourceType === 'google_doc' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12C9 12.5523 9.44772 13 10 13Z" fill="currentColor" />
                <path d="M14 13C14.5523 13 15 12.5523 15 12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12C13 12.5523 13.4477 13 14 13Z" fill="currentColor" />
                <path d="M12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6C9 7.65685 10.3431 9 12 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 20.2895V20.29C3 17.18 5.22 14.61 8.26 14.09C8.84 14.01 9.43 13.97 10.03 13.97C10.63 13.97 11.22 14.01 11.79 14.09C13.22 14.32 14.48 14.99 15.4 15.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 15H21M21 15L19 13M21 15L19 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 20.5L17.5 18L15 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Google Doc
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {sourceType === 'local' ? 'File Path' : 'Google Doc URL'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={filePath}
              onChange={handleFilePathChange}
              placeholder={sourceType === 'local' ? "/path/to/your/file.txt" : "https://docs.google.com/document/d/..."}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-600 dark:focus:border-emerald-500 transition-colors"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 transition-colors"
              onClick={() => {
                if (sourceType === 'local') {
                  console.log('Browse files...');
                  // In a real implementation, this would open a file picker
                } else {
                  console.log('Validate Google Doc URL...');
                  // In a real implementation, this would validate the Google Doc URL
                }
              }}
            >
              {sourceType === 'local' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L19.5528 7.72361C19.8343 7.58281 20 7.30339 20 7V5.5C20 4.67157 19.3284 4 18.5 4H5.5C4.67157 4 4 4.67157 4 5.5V7C4 7.30339 4.16571 7.58281 4.44721 7.72361L9 10M15 10L9 10M15 10L15 19C15 19.5523 14.5523 20 14 20H10C9.44772 20 9 19.5523 9 19L9 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          {sourceType === 'local' && (
            <div className="mt-2 flex justify-center">
              <label className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-emerald-300 dark:border-emerald-700 rounded-md cursor-pointer bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                <svg className="w-5 h-5 mr-2 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L2.621 19.485C2.72915 19.9177 2.97882 20.3018 3.33033 20.5763C3.68184 20.8508 4.11501 20.9999 4.561 21H19.439C19.885 20.9999 20.3182 20.8508 20.6697 20.5763C21.0212 20.3018 21.2708 19.9177 21.379 19.485L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">Upload file</span>
                <input type="file" className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FILE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleFileTypeChange(type)}
                className={`
                  py-1.5 px-2 text-sm rounded-md transition-colors text-center
                  ${fileType === type 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content Extraction
          </label>
          <div className="flex space-x-2">
            {(['full', 'chunks', 'summary'] as const).map((strategy) => (
              <button
                key={strategy}
                onClick={() => handleStrategyChange(strategy)}
                className={`
                  py-1.5 px-3 text-sm rounded-md transition-colors flex-1
                  ${extractStrategy === strategy 
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {strategy === 'full' && 'Full Content'}
                {strategy === 'chunks' && 'In Chunks'}
                {strategy === 'summary' && 'Summarized'}
              </button>
            ))}
          </div>
        </div>

        {extractStrategy === 'chunks' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chunk Size: {chunkSize} characters
            </label>
            <input 
              type="range"
              min="100"
              max="10000"
              step="100"
              value={chunkSize}
              onChange={handleChunkSizeChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Small chunks</span>
              <span>Large chunks</span>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
});

FileReaderNode.displayName = 'FileReaderNode';

export default FileReaderNode; 
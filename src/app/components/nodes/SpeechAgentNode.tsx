'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Extend the base node data with SpeechAgent specific properties
export interface SpeechAgentNodeData extends BaseNodeData {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  clarity?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
  useOriginalMedia?: boolean;
  textInput?: string;
}

// Available ElevenLabs voice models
const VOICE_MODELS = [
  { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual v2' },
  { id: 'eleven_monolingual_v1', name: 'Eleven English v1' },
  { id: 'eleven_turbo_v2', name: 'Eleven Turbo v2' },
];

// Pre-defined voices
const PREDEFINED_VOICES = [
  { id: 'adam', name: 'Adam', description: 'Deep, authoritative male voice' },
  { id: 'bella', name: 'Bella', description: 'Smooth, professional female voice' },
  { id: 'charlie', name: 'Charlie', description: 'Friendly, conversational male voice' },
  { id: 'diana', name: 'Diana', description: 'Soft, empathetic female voice' },
  { id: 'ethan', name: 'Ethan', description: 'Young, energetic male voice' },
  { id: 'fiona', name: 'Fiona', description: 'Mature, sophisticated female voice' },
  { id: 'george', name: 'George', description: 'Deep, wise male voice with slight accent' },
  { id: 'hannah', name: 'Hannah', description: 'Clear, articulate female voice' },
];

const SpeechAgentNode = memo(({ data, isConnectable, ...rest }: NodeProps<SpeechAgentNodeData>) => {
  // Initialize with data from props or defaults
  const [voiceId, setVoiceId] = useState<string>(data.voiceId || 'adam');
  const [modelId, setModelId] = useState<string>(data.modelId || 'eleven_multilingual_v2');
  const [stability, setStability] = useState<number>(data.stability || 0.5);
  const [clarity, setClarity] = useState<number>(data.clarity || 0.75);
  const [similarityBoost, setSimilarityBoost] = useState<number>(data.similarityBoost || 0.75);
  const [style, setStyle] = useState<number>(data.style || 0);
  const [speakerBoost, setSpeakerBoost] = useState<boolean>(data.speakerBoost || true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  const [useOriginalMedia, setUseOriginalMedia] = useState<boolean>(data.useOriginalMedia || false);
  const [textInput, setTextInput] = useState<string>(data.textInput || '');

  // Update node data when fields change
  const updateNodeData = useCallback((field: keyof SpeechAgentNodeData, value: any) => {
    // Type assertion to handle dynamic property assignment
    (data as any)[field] = value;
  }, [data]);

  // Update parent data when local state changes
  useEffect(() => {
    data.voiceId = voiceId;
    data.modelId = modelId;
    data.stability = stability;
    data.clarity = clarity;
    data.similarityBoost = similarityBoost;
    data.style = style;
    data.speakerBoost = speakerBoost;
    data.useOriginalMedia = useOriginalMedia;
    data.textInput = textInput;
  }, [
    data, 
    voiceId, 
    modelId, 
    stability, 
    clarity, 
    similarityBoost, 
    style, 
    speakerBoost, 
    useOriginalMedia,
    textInput
  ]);

  const nodeData = {
    ...data,
    label: data.label || 'Speech Agent',
    type: 'speechAgentNode',
    color: '#FF5500', // Orange color
    category: 'Text-to-Speech'
  };

  // Generate the node configuration UI
  const renderConfig = () => (
    <div className="space-y-5 p-1">
      <div className="text-sm text-orange-700 dark:text-orange-300 font-medium bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
        Convert text to natural-sounding speech using ElevenLabs text-to-speech technology.
      </div>
      
      {/* Text input (optional - mainly for testing) */}
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Text Input (Optional)</label>
          <div className="ml-1 text-gray-400 text-sm rounded-full bg-gray-100 dark:bg-gray-700 h-5 w-5 flex items-center justify-center">ⓘ</div>
        </div>
        <textarea
          className="w-full p-3 border border-orange-200 dark:border-orange-800 rounded-lg text-sm resize-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none shadow-sm"
          placeholder="Enter text to convert to speech, or leave empty to use text from connected nodes."
          rows={3}
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value);
            updateNodeData('textInput', e.target.value);
          }}
        />
      </div>
      
      {/* Voice selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voice</label>
        <div className="relative">
          <select
            className="w-full p-3 border border-orange-200 dark:border-orange-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
            value={voiceId}
            onChange={(e) => {
              setVoiceId(e.target.value);
              updateNodeData('voiceId', e.target.value);
            }}
          >
            {PREDEFINED_VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} - {voice.description}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 pointer-events-none">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Model selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voice Model</label>
        <div className="relative">
          <select
            className="w-full p-3 border border-orange-200 dark:border-orange-800 rounded-lg appearance-none text-sm bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:outline-none"
            value={modelId}
            onChange={(e) => {
              setModelId(e.target.value);
              updateNodeData('modelId', e.target.value);
            }}
          >
            {VOICE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 pointer-events-none">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Basic voice settings */}
      <div className="space-y-2">
        {/* Stability has been moved to advanced options */}
      </div>
      
      {/* Show/hide advanced options button */}
      <button
        className="w-full py-2 px-4 rounded-lg border border-orange-200 dark:border-orange-800 text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
      </button>
      
      {/* Advanced options section */}
      {showAdvancedOptions && (
        <div className="space-y-5 p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-950/20">
          {/* Stability slider - moved from basic settings */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stability: {stability.toFixed(2)}</label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              className="w-full accent-orange-500" 
              value={stability}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setStability(value);
                updateNodeData('stability', value);
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>More variable</span>
              <span>More stable</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Clarity/Similarity Enhancement: {clarity.toFixed(2)}</label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              className="w-full accent-orange-500" 
              value={clarity}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setClarity(value);
                updateNodeData('clarity', value);
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Lower clarity</span>
              <span>Higher clarity</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Similarity Boost: {similarityBoost.toFixed(2)}</label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              className="w-full accent-orange-500" 
              value={similarityBoost}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setSimilarityBoost(value);
                updateNodeData('similarityBoost', value);
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Less similar to original</span>
              <span>More similar to original</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Style Exaggeration: {style.toFixed(2)}</label>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              className="w-full accent-orange-500" 
              value={style}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setStyle(value);
                updateNodeData('style', value);
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Less style</span>
              <span>More style</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={speakerBoost}
                onChange={(e) => {
                  setSpeakerBoost(e.target.checked);
                  updateNodeData('speakerBoost', e.target.checked);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Speaker Boost</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={useOriginalMedia}
                onChange={(e) => {
                  setUseOriginalMedia(e.target.checked);
                  updateNodeData('useOriginalMedia', e.target.checked);
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Use Original Media</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BaseNode
      data={nodeData}
      isConnectable={isConnectable}
      width={400}
      {...rest}
    >
      {renderConfig()}
    </BaseNode>
  );
});

SpeechAgentNode.displayName = 'SpeechAgentNode';

export default SpeechAgentNode; 
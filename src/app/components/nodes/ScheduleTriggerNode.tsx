'use client';

import { memo, useState, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import BaseNode, { BaseNodeData } from './BaseNode';

// Define frequency types
export type FrequencyType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// Extend the base node data with Schedule Trigger specific properties
export interface ScheduleTriggerNodeData extends BaseNodeData {
  frequency: FrequencyType;
  time: string; // time in 24hr format (HH:MM)
  date?: string; // for 'once' frequency or specific day of month
  dayOfWeek?: number; // 0-6 (Sunday to Saturday) for weekly frequency
  monthDay?: number; // 1-31 for monthly frequency
  month?: number; // 0-11 (January to December) for yearly frequency
  timezone: string;
  description?: string;
}

// Day of the week options
const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

// Month options for yearly frequency
const MONTHS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

// Common timezones
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland'
];

// Generate day of month options (1-31)
const generateDaysOfMonth = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push({ value: i, label: i.toString() });
  }
  return days;
};

const DAYS_OF_MONTH = generateDaysOfMonth();

const ScheduleTriggerNode = memo(({ data, isConnectable, ...props }: NodeProps<ScheduleTriggerNodeData>) => {
  // Use default values if not provided
  const [frequency, setFrequency] = useState<FrequencyType>(data.frequency || 'daily');
  const [time, setTime] = useState(data.time || '12:00');
  const [date, setDate] = useState(data.date || '');
  const [dayOfWeek, setDayOfWeek] = useState(data.dayOfWeek !== undefined ? data.dayOfWeek : 1);
  const [monthDay, setMonthDay] = useState(data.monthDay || 1);
  const [month, setMonth] = useState(data.month !== undefined ? data.month : 0);
  const [timezone, setTimezone] = useState(data.timezone || 'UTC');
  const [description, setDescription] = useState(data.description || '');

  // Function to update node data
  const updateNodeData = useCallback((field: string, value: any) => {
    // This would ideally be connected to your flow's state management
    console.log(`Update ${field} to ${value}`);
    
    // Local state updates
    switch (field) {
      case 'frequency':
        setFrequency(value as FrequencyType);
        (data as any)[field] = value;
        break;
      case 'time':
        setTime(value);
        (data as any)[field] = value;
        break;
      case 'date':
        setDate(value);
        (data as any)[field] = value;
        break;
      case 'dayOfWeek':
        setDayOfWeek(Number(value));
        (data as any)[field] = Number(value);
        break;
      case 'monthDay':
        setMonthDay(Number(value));
        (data as any)[field] = Number(value);
        break;
      case 'month':
        setMonth(Number(value));
        (data as any)[field] = Number(value);
        break;
      case 'timezone':
        setTimezone(value);
        (data as any)[field] = value;
        break;
      case 'description':
        setDescription(value);
        (data as any)[field] = value;
        break;
      default:
        break;
    }
  }, [data]);

  // Function to get the summary of the schedule
  const getScheduleSummary = () => {
    let summary = '';
    switch (frequency) {
      case 'once':
        summary = `Once on ${date} at ${time}`;
        break;
      case 'daily':
        summary = `Daily at ${time}`;
        break;
      case 'weekly':
        const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || '';
        summary = `Weekly on ${day} at ${time}`;
        break;
      case 'monthly':
        summary = `Monthly on day ${monthDay} at ${time}`;
        break;
      case 'yearly':
        const monthName = MONTHS.find(m => m.value === month)?.label || '';
        summary = `Yearly on ${monthName} ${monthDay} at ${time}`;
        break;
      default:
        summary = `Scheduled at ${time}`;
    }
    
    return `${summary} (${timezone})`;
  };

  // Render the appropriate form fields based on frequency type
  const renderFrequencyFields = () => {
    switch (frequency) {
      case 'once':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => updateNodeData('date', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        );
        
      case 'weekly':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => updateNodeData('dayOfWeek', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'monthly':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Day of Month
            </label>
            <select
              value={monthDay}
              onChange={(e) => updateNodeData('monthDay', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              {DAYS_OF_MONTH.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        );
        
      case 'yearly':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => updateNodeData('month', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day of Month
              </label>
              <select
                value={monthDay}
                onChange={(e) => updateNodeData('monthDay', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {DAYS_OF_MONTH.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
        
      // For 'daily', no additional fields needed
      default:
        return null;
    }
  };

  // Override base node data with our custom data
  const nodeData = {
    ...data,
    label: data.label || 'Schedule Trigger',
    type: 'scheduleTriggerNode',
    color: '#FF7F50'
  };

  return (
    <BaseNode
      data={nodeData}
      isConnectable={isConnectable}
      {...props}
      showHandles={true}
      isExpandable={true}
    >
      <div className="space-y-4">
        {/* Schedule Summary */}
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="text-sm font-medium">Current Schedule:</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">{getScheduleSummary()}</div>
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => updateNodeData('frequency', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Frequency-specific fields */}
        {renderFrequencyFields()}

        {/* Time Selection (common for all frequencies) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => updateNodeData('time', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Timezone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => updateNodeData('timezone', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => updateNodeData('description', e.target.value)}
            placeholder="Enter a description for this schedule trigger"
            className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
    </BaseNode>
  );
});

ScheduleTriggerNode.displayName = 'ScheduleTriggerNode';

export default ScheduleTriggerNode; 
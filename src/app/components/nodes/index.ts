// Base node and shared components
import FileReaderNode, { FileReaderNodeData } from './FileReaderNode';
import AskAINode, { AskAINodeData } from './AskAINode';
import SummarizerNode, { SummarizerNodeData } from './SummarizerNode';
import APIIntegrationNode, { APIIntegrationNodeData } from './APIIntegrationNode';
import BaseNode, { BaseNodeData } from './BaseNode';
import NodeToolbar from './NodeToolbar';
import CommunicationNode, { CommunicationNodeData } from './CommunicationNode';
import SQLDatabaseNode, { SQLDatabaseNodeData } from './SQLDatabaseNode';
import ScheduleTriggerNode, { ScheduleTriggerNodeData } from './ScheduleTriggerNode';
import HumanFeedbackNode, { HumanFeedbackNodeData } from './HumanFeedbackNode';
import EmailSendNode, { EmailSendNodeData } from './EmailSendNode';
import SpeechAgentNode, { SpeechAgentNodeData } from './SpeechAgentNode';

export {
  FileReaderNode,
  AskAINode,
  SummarizerNode,
  APIIntegrationNode,
  BaseNode,
  NodeToolbar,
  CommunicationNode,
  SQLDatabaseNode,
  ScheduleTriggerNode,
  HumanFeedbackNode,
  EmailSendNode,
  SpeechAgentNode
};

export type {
  FileReaderNodeData,
  AskAINodeData,
  SummarizerNodeData,
  APIIntegrationNodeData,
  BaseNodeData,
  CommunicationNodeData,
  SQLDatabaseNodeData,
  ScheduleTriggerNodeData,
  HumanFeedbackNodeData,
  EmailSendNodeData,
  SpeechAgentNodeData
};

// Node type mapping for React Flow
import { NodeTypes } from 'reactflow';

// Define and export node types mapping for React Flow
export const nodeTypes: NodeTypes = {
  askAINode: AskAINode,
  summarizerNode: SummarizerNode,
  fileReaderNode: FileReaderNode,
  apiIntegrationNode: APIIntegrationNode,
  communicationNode: CommunicationNode,
  sqlDatabaseNode: SQLDatabaseNode,
  scheduleTriggerNode: ScheduleTriggerNode,
  humanFeedbackNode: HumanFeedbackNode,
  emailSendNode: EmailSendNode,
  speechAgentNode: SpeechAgentNode
}; 
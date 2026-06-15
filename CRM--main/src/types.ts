/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeadStatus = 'New' | 'Interested' | 'Qualified' | 'Won' | 'Lost';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  category: 'Employee' | 'Partner' | 'Customer';
  status: LeadStatus;
  value: number;
  lastContact: string;
  notes: string[];
  assignedTo: string;
  location?: string;
  aiScore?: number;
  nextAction?: string;
  imageUrl?: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: string;
  expectedClose: string;
  probability: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  contactId?: string;
}

export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  content: string;
  timestamp: string;
  contactId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
}

export const DEAL_STAGES = [
  'New',
  'Proposal Sent',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

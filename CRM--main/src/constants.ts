/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Deal, Task, Activity } from './types';

export const DUMMY_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Akash Singh',
    email: 'akash@startupx.com',
    phone: '+1 (555) 123-4567',
    company: 'StartupX',
    role: 'Founder',
    category: 'Customer',
    status: 'Interested',
    value: 15000,
    lastContact: '2026-04-01',
    notes: ['Looking for scalable CRM solutions', 'Interested in AI features'],
    assignedTo: 'Alex Miller',
    aiScore: 78,
    nextAction: '2025-07-28',
    imageUrl: 'https://picsum.photos/seed/akash/200'
  },
  {
    id: '2',
    name: 'Sneha Rao',
    email: 'sneha@designhub.in',
    phone: '+1 (555) 987-6543',
    company: 'DesignHub',
    role: 'Creative Director',
    category: 'Customer',
    status: 'Qualified',
    value: 25000,
    lastContact: '2026-04-03',
    notes: ['Budget approved for Q2', 'Needs multi-user support'],
    assignedTo: 'Alex Miller',
    aiScore: 92,
    nextAction: '2025-07-29',
    imageUrl: 'https://picsum.photos/seed/sneha/200'
  },
  {
    id: '3',
    name: 'John Carter',
    email: 'john.c@techsolutions.com',
    phone: '+1 (555) 456-7890',
    company: 'Tech Solutions',
    role: 'CTO',
    category: 'Partner',
    status: 'New',
    value: 5000,
    lastContact: '2026-04-05',
    notes: ['Inbound lead from website'],
    assignedTo: 'Alex Miller',
    aiScore: 88,
    nextAction: '2025-08-01',
    imageUrl: 'https://picsum.photos/seed/john/200'
  },
  {
    id: '4',
    name: 'Priya Sen',
    email: 'priya.sen@market.io',
    phone: '+1 (555) 222-3333',
    company: 'Market.io',
    role: 'Marketing Head',
    category: 'Employee',
    status: 'Won',
    value: 12000,
    lastContact: '2026-03-20',
    notes: ['Chose competitor due to pricing'],
    assignedTo: 'Alex Miller',
    aiScore: 85,
    nextAction: '2025-07-20',
    imageUrl: 'https://picsum.photos/seed/priya/200'
  },
  {
    id: '5',
    name: 'Mike Ross',
    email: 'mike.r@legal.co',
    phone: '+1 (555) 333-4444',
    company: 'Legal Co',
    role: 'Partner',
    category: 'Partner',
    status: 'Lost',
    value: 8000,
    lastContact: '2026-03-25',
    notes: ['Legal review pending'],
    assignedTo: 'Alex Miller',
    aiScore: 45,
    nextAction: '2025-06-15',
    imageUrl: 'https://picsum.photos/seed/mike/200'
  }
];

export const DUMMY_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Enterprise CRM Rollout',
    contactId: '1',
    value: 15000,
    stage: 'Proposal Sent',
    expectedClose: '2026-05-15',
    probability: 60
  },
  {
    id: 'd2',
    title: 'Custom Integration Project',
    contactId: '2',
    value: 25000,
    stage: 'Negotiation',
    expectedClose: '2026-04-30',
    probability: 80
  },
  {
    id: 'd3',
    title: 'Small Team License',
    contactId: '3',
    value: 5000,
    stage: 'New',
    expectedClose: '2026-06-01',
    probability: 20
  }
];

export const DUMMY_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Follow up with Sarah',
    description: 'Send the updated proposal with AI integration details.',
    dueDate: '2026-04-07',
    status: 'Pending',
    priority: 'High',
    contactId: '1'
  },
  {
    id: 't2',
    title: 'Prepare demo for Innovate.io',
    description: 'Focus on lead scoring and pipeline management.',
    dueDate: '2026-04-08',
    status: 'Pending',
    priority: 'Medium',
    contactId: '2'
  },
  {
    id: 't3',
    title: 'Review Q1 performance',
    description: 'Analyze conversion rates and revenue targets.',
    dueDate: '2026-04-10',
    status: 'Pending',
    priority: 'Low'
  }
];

export const DUMMY_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'Call',
    content: 'Discussed pricing and timeline with Sarah.',
    timestamp: '2026-04-01T14:30:00Z',
    contactId: '1'
  },
  {
    id: 'a2',
    type: 'Email',
    content: 'Sent introductory deck to Emma.',
    timestamp: '2026-04-05T09:15:00Z',
    contactId: '3'
  }
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Deal, Task, CalendarEvent } from '../types';
import { supabase } from '../lib/supabase';

/**
 * API Service Layer
 * Uses Supabase for real-time data persistence.
 */
export const apiService = {
  // --- DEALS ---
  deals: {
    getAll: async (): Promise<Deal[]> => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    create: async (deal: Omit<Deal, 'id'>): Promise<Deal> => {
      const { data, error } = await supabase
        .from('deals')
        .insert([deal])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Deal>): Promise<Deal> => {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // --- LEADS / CONTACTS ---
  leads: {
    getAll: async (): Promise<Contact[]> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    getById: async (id: string): Promise<Contact | undefined> => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    create: async (lead: Omit<Contact, 'id'>): Promise<Contact> => {
      const { data, error } = await supabase
        .from('contacts')
        .insert([lead])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Contact>): Promise<Contact> => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // --- TASKS ---
  tasks: {
    getAll: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('dueDate');
      
      if (error) throw error;
      return data || [];
    },
    create: async (task: Omit<Task, 'id'>): Promise<Task> => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Task>): Promise<Task> => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // --- CALENDAR EVENTS ---
  events: {
    getAll: async (): Promise<CalendarEvent[]> => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date');
      
      if (error) throw error;
      return data || [];
    },
    create: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  },

  // --- AI SERVICES ---
  ai: {
    generateEmail: async (context: string): Promise<string> => {
      // In a real app, you'd call an Edge Function or your own backend
      // For now, we'll simulate the response
      return `Generated email content for: ${context}`;
    },
    chat: async (message: string): Promise<string> => {
      return `AI Response to: ${message}`;
    }
  }
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Zap,
  Loader2
} from 'lucide-react';
import { Contact } from '../types';
import { cn } from '../lib/utils';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

import Modal from './Modal';

export default function LeadList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    role: '',
    category: 'Customer' as Contact['category'],
    status: 'New',
    value: 0
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.leads.getAll();
      setLeads(data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': return 'text-green-600';
      case 'Qualified': return 'text-purple-600';
      case 'Interested': return 'text-yellow-600';
      case 'Lost': return 'text-red-600';
      case 'New': return 'text-blue-500';
      default: return 'text-gray-600';
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newLeadData: Omit<Contact, 'id'> = {
        ...formData,
        status: formData.status as any,
        notes: [],
        lastContact: new Date().toISOString(),
        assignedTo: 'Me',
        imageUrl: `https://picsum.photos/seed/${formData.name}/200`
      };
      const newLead = await apiService.leads.create(newLeadData);
      setLeads([newLead, ...leads]);
      setIsAddModalOpen(false);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        location: '', 
        company: '', 
        role: '', 
        category: 'Customer',
        status: 'New', 
        value: 0 
      });
      toast.success('Lead added successfully');
    } catch (error: any) {
      console.error('Error adding lead:', error);
      toast.error(`Failed to add lead: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && leads.length === 0) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Leads</h1>
          <p className="text-sm text-text-secondary mt-1">Track and manage your potential customers.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        </div>
      </div>

      <div className="card-base !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Score</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={lead.imageUrl || `https://picsum.photos/seed/${lead.name}/200`} 
                        alt={lead.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-sm font-bold text-text-primary">{lead.name}</p>
                        <p className="text-[11px] text-text-secondary font-medium">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-text-secondary">{lead.company}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs font-bold", getStatusColor(lead.status))}>
                      {lead.status === 'Interested' ? 'Follow-up' : lead.status === 'Qualified' ? 'Contacted' : lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-50 rounded flex items-center justify-center">
                        <Zap className="w-3 h-3 text-green-600 fill-green-600" />
                      </div>
                      <span className="text-sm font-bold text-green-600">{lead.aiScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">{lead.nextAction}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Lead"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="Robert Fox"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="robertfox@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="New York, USA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="CEO"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                >
                  <option value="Customer">Customer</option>
                  <option value="Partner">Partner</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deal Value ($)</label>
                <input 
                  type="number" 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

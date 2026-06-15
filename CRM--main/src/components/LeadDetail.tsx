/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Mail, 
  FileText, 
  Plus, 
  Zap,
  Calendar,
  Clock,
  MoreHorizontal,
  Linkedin,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { Contact } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState('');
  const [activities, setActivities] = useState([
    { id: 1, type: 'email', content: 'Initial cold email sent.', date: '7/20/2025', icon: Mail, color: 'text-blue-500 bg-blue-50' },
    { id: 2, type: 'note', content: 'Followed up on LinkedIn.', date: '7/22/2025', icon: FileText, color: 'text-yellow-600 bg-yellow-50' }
  ]);

  useEffect(() => {
    if (id) {
      fetchLead(id);
    }
  }, [id]);

  const fetchLead = async (leadId: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.leads.getById(leadId);
      if (data) {
        setLead(data);
      } else {
        toast.error('Lead not found');
        navigate('/leads');
      }
    } catch (error) {
      toast.error('Failed to fetch lead details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!lead) return <div>Lead not found</div>;

  const handleAddNote = () => {
    if (!note.trim()) return;
    const newActivity = {
      id: Date.now(),
      type: 'note',
      content: note,
      date: new Date().toLocaleDateString(),
      icon: FileText,
      color: 'text-gray-600 bg-gray-50'
    };
    setActivities([newActivity, ...activities]);
    setNote('');
    toast.success('Note added');
  };

  const handleDeleteLead = async () => {
    if (!lead || !window.confirm(`Are you sure you want to delete ${lead.name}?`)) return;
    
    setIsLoading(true);
    try {
      await apiService.leads.delete(lead.id);
      toast.success('Lead deleted successfully');
      navigate('/leads');
    } catch (error) {
      toast.error('Failed to delete lead');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Leads
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDeleteLead}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="card-base flex flex-col items-center text-center p-8">
            <img 
              src={lead.imageUrl || `https://picsum.photos/seed/${lead.name}/200`} 
              alt={lead.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 mb-4"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-xl font-bold text-text-primary">{lead.name}</h2>
            <p className="text-sm text-text-secondary font-medium">{lead.company}</p>
            
            <div className="w-full h-px bg-gray-100 my-6" />
            
            <div className="w-full space-y-4 text-left">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                <span className="text-sm font-medium text-text-primary">{lead.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                <span className="text-sm font-medium text-text-primary">
                  {lead.status === 'Interested' ? 'Follow-up' : lead.status}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Action</span>
                <span className="text-sm font-medium text-text-primary">{lead.nextAction}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Score</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 bg-green-50 rounded flex items-center justify-center">
                    <Zap className="w-3 h-3 text-green-600 fill-green-600" />
                  </div>
                  <span className="text-sm font-bold text-green-600">{lead.aiScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Suggestions & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Suggestions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">AI Suggestions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all">
                <Mail className="w-4 h-4" />
                Write follow-up email
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-text-primary rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                <FileText className="w-4 h-4" />
                Suggest next task
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="card-base space-y-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Timeline</h3>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 space-y-3">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note, email, or call log..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all min-h-[100px] resize-none"
                />
                <button 
                  onClick={handleAddNote}
                  className="px-6 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", activity.color)}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{activity.content}</p>
                    <p className="text-[11px] text-text-secondary font-medium mt-1">{activity.date} - {activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

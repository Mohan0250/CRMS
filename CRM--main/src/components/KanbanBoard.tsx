/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  MoreHorizontal, 
  Plus, 
  Calendar, 
  DollarSign, 
  GripVertical,
  Search,
  Filter,
  Trash2,
  Edit2,
  Loader2
} from 'lucide-react';
import { Contact, DEAL_STAGES, Deal } from '../types';
import { cn } from '../lib/utils';
import Modal from './Modal';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

import { apiService } from '../services/apiService';

// Workaround for Droppable in React 18 Strict Mode
function StrictDroppable({ children, ...props }: any) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
}

const STAGE_COLORS: Record<string, string> = {
  'New': '#3B82F6',
  'Proposal Sent': '#F59E0B',
  'Negotiation': '#8B5CF6',
  'Closed Won': '#10B981',
  'Closed Lost': '#EF4444'
};

interface DealCardProps {
  deal: Deal;
  index: number;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

function DealCard({ deal, index, onEdit, onDelete }: DealCardProps) {
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      const data = await apiService.leads.getById(deal.contactId);
      if (data) setContact(data);
    };
    fetchContact();
  }, [deal.contactId]);

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white p-5 rounded-xl border transition-all group cursor-grab active:cursor-grabbing mb-4",
            snapshot.isDragging ? "border-black shadow-2xl rotate-1 scale-105 z-50" : "border-gray-100 shadow-sm hover:shadow-md"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-sm font-bold text-black truncate">{deal.title}</h4>
              <p className="text-[11px] font-medium text-gray-400 truncate">{contact?.company}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-black"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-black">${deal.value.toLocaleString()}</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Updated: {deal.expectedClose}
              </p>
            </div>
            <img 
              src={contact?.imageUrl || `https://picsum.photos/seed/${contact?.name}/200`} 
              alt={contact?.name}
              className="w-8 h-8 rounded-full border border-gray-100 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function KanbanBoard() {
  const { groupedDeals, setGroupedDeals, totalRevenue, isLoading: isContextLoading } = useAppContext();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: 0,
    stage: DEAL_STAGES[0],
    expectedClose: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await apiService.leads.getAll();
        setContacts(data);
        if (data.length > 0 && !formData.contactId) {
          setFormData(prev => ({ ...prev, contactId: data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = Array.from(groupedDeals[source.droppableId] || []);
    const destCol = source.droppableId === destination.droppableId 
      ? sourceCol 
      : Array.from(groupedDeals[destination.droppableId] || []);

    const [movedItem] = sourceCol.splice(source.index, 1);
    
    // Update stage if moved to a different column
    const updatedItem = { ...movedItem, stage: destination.droppableId };
    
    destCol.splice(destination.index, 0, updatedItem);

    const newGroupedDeals = {
      ...groupedDeals,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    };

    // Optimistic update
    setGroupedDeals(newGroupedDeals);

    try {
      await apiService.deals.update(updatedItem.id, { stage: updatedItem.stage });
    } catch (error: any) {
      console.error('Error updating deal stage:', error);
      toast.error(`Failed to update deal stage: ${error.message || 'Unknown error'}`);
      // Revert if needed (omitted for brevity in this demo)
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newDeal = await apiService.deals.create({
        ...formData,
        probability: 50
      });

      const updatedCol = [newDeal, ...groupedDeals[formData.stage]];
      setGroupedDeals({
        ...groupedDeals,
        [formData.stage]: updatedCol
      });

      setIsAddModalOpen(false);
      setFormData({
        title: '',
        contactId: contacts[0]?.id || '',
        value: 0,
        stage: DEAL_STAGES[0],
        expectedClose: new Date().toISOString().split('T')[0]
      });
      toast.success('Deal added successfully');
    } catch (error: any) {
      console.error('Error adding deal:', error);
      toast.error(`Failed to add deal: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;
    setIsLoading(true);
    try {
      const updatedDeal = await apiService.deals.update(selectedDeal.id, formData);
      
      const oldStage = selectedDeal.stage;
      const newStage = formData.stage;

      const updatedOldCol = groupedDeals[oldStage].filter(d => d.id !== selectedDeal.id);

      if (oldStage === newStage) {
        const updatedCol = groupedDeals[oldStage].map(d => d.id === selectedDeal.id ? { ...selectedDeal, ...formData } : d);
        setGroupedDeals({ ...groupedDeals, [oldStage]: updatedCol });
      } else {
        const updatedNewCol = [{ ...selectedDeal, ...formData }, ...groupedDeals[newStage]];
        setGroupedDeals({
          ...groupedDeals,
          [oldStage]: updatedOldCol,
          [newStage]: updatedNewCol
        });
      }

      setIsEditModalOpen(false);
      toast.success('Deal updated successfully');
    } catch (error: any) {
      console.error('Error updating deal:', error);
      toast.error(`Failed to update deal: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeal = async () => {
    if (!selectedDeal) return;
    setIsLoading(true);
    try {
      await apiService.deals.delete(selectedDeal.id);
      const stage = selectedDeal.stage;
      const updatedCol = groupedDeals[stage].filter(d => d.id !== selectedDeal.id);
      setGroupedDeals({ ...groupedDeals, [stage]: updatedCol });
      setIsDeleteModalOpen(false);
      toast.success('Deal deleted successfully');
    } catch (error: any) {
      console.error('Error deleting deal:', error);
      toast.error(`Failed to delete deal: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormData({
      title: deal.title,
      contactId: deal.contactId,
      value: deal.value,
      stage: deal.stage,
      expectedClose: deal.expectedClose
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDeleteModalOpen(true);
  };

  if (isContextLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-screen flex flex-col overflow-hidden max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight">Deals Pipeline</h1>
            <div className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
              Total: ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Track and manage your sales opportunities.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={() => {
              setFormData({ ...formData, stage: 'New' });
              setIsAddModalOpen(true);
            }}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 md:gap-6 h-full min-w-max px-1">
            {DEAL_STAGES.map((stage) => {
              const stageDeals = groupedDeals[stage] || [];

              return (
                <div key={stage} className="w-72 md:w-80 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: STAGE_COLORS[stage] }} 
                      />
                      <h3 className="text-xs font-bold text-black">{stage}</h3>
                      <span className="text-xs font-medium text-gray-400">
                        {stageDeals.length}
                      </span>
                    </div>
                    {stage === 'New' && (
                      <button 
                        onClick={() => {
                          setFormData({ ...formData, stage: 'New' });
                          setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded-lg text-[10px] font-bold hover:bg-neutral-800 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        New Deal
                      </button>
                    )}
                  </div>

                  <StrictDroppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "flex-1 bg-gray-50 rounded-2xl p-3 space-y-3 overflow-y-auto border transition-colors",
                          snapshot.isDraggingOver ? "bg-gray-100 border-black/10" : "border-gray-200"
                        )}
                      >
                        {stageDeals.map((deal, index) => (
                          <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            index={index}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </StrictDroppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Add Deal Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Create New Deal"
      >
        <form onSubmit={handleAddDeal} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deal Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              placeholder="Enterprise License"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact</label>
              <select 
                value={formData.contactId}
                onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                <option value="">Select a contact</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Value ($)</label>
              <input 
                required
                type="number" 
                value={isNaN(formData.value) ? '' : formData.value}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFormData({...formData, value: isNaN(val) ? 0 : val});
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stage</label>
              <select 
                value={formData.stage}
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                {DEAL_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected Close</label>
              <input 
                required
                type="date" 
                value={formData.expectedClose}
                onChange={(e) => setFormData({...formData, expectedClose: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Deal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Deal Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Deal"
      >
        <form onSubmit={handleEditDeal} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deal Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact</label>
              <select 
                value={formData.contactId}
                onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                <option value="">Select a contact</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Value ($)</label>
              <input 
                required
                type="number" 
                value={isNaN(formData.value) ? '' : formData.value}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFormData({...formData, value: isNaN(val) ? 0 : val});
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stage</label>
              <select 
                value={formData.stage}
                onChange={(e) => setFormData({...formData, stage: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                {DEAL_STAGES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected Close</label>
              <input 
                required
                type="date" 
                value={formData.expectedClose}
                onChange={(e) => setFormData({...formData, expectedClose: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Deal"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-bold text-black">{selectedDeal?.title}</span>? This action cannot be undone.
          </p>
          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              onClick={handleDeleteDeal}
              className="flex-1 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Deal'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

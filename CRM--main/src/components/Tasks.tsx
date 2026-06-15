/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Edit2,
  Loader2
} from 'lucide-react';
import { Task, Contact } from '../types';
import { cn } from '../lib/utils';
import Modal from './Modal';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    contactId: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, contactsData] = await Promise.all([
        apiService.tasks.getAll(),
        apiService.leads.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      if (contactsData.length > 0) {
        setFormData(prev => ({ ...prev, contactId: contactsData[0].id }));
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch data: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'All' ? true : t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updatedTask = await apiService.tasks.update(id, { status: newStatus as any });
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      toast.info('Task status updated');
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast.error(`Failed to update task status: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newTask = await apiService.tasks.create({
        ...formData,
        priority: formData.priority as any,
        status: formData.status as any
      });
      setTasks([newTask, ...tasks]);
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        contactId: contacts[0]?.id || '',
        status: 'Pending'
      });
      toast.success('Task added successfully');
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error(`Failed to add task: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      const updatedTask = await apiService.tasks.update(selectedTask.id, {
        ...formData,
        priority: formData.priority as any,
        status: formData.status as any
      });
      setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t));
      setIsEditModalOpen(false);
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error(`Failed to update task: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    setIsLoading(true);
    try {
      await apiService.tasks.delete(selectedTask.id);
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setIsDeleteModalOpen(false);
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error(`Failed to delete task: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      contactId: task.contactId,
      status: task.status
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Tasks & Follow-ups</h1>
          <p className="text-sm text-text-secondary mt-1">Stay organized and never miss a follow-up.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-gray rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-all w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <div className="card-base !p-0 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border-gray flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-border-gray w-full md:w-auto overflow-x-auto">
            {['All', 'Pending', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  filter === f 
                    ? "bg-white text-black shadow-sm" 
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border-gray rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black transition-all"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filteredTasks.map((task) => {
            const contact = contacts.find(c => c.id === task.contactId);
            return (
              <div key={task.id} className="p-4 md:p-6 flex items-start gap-4 md:gap-6 hover:bg-gray-50 transition-colors group">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 shrink-0"
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-200 hover:text-black transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className={cn(
                      "text-sm md:text-base font-bold text-text-primary transition-all",
                      task.status === 'Completed' && "line-through text-gray-300"
                    )}>
                      {task.title}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      task.priority === 'High' ? "bg-black text-white" :
                      task.priority === 'Medium' ? "bg-gray-800 text-white" :
                      "bg-gray-200 text-black"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs md:text-sm text-text-secondary mb-4",
                    task.status === 'Completed' && "text-gray-300"
                  )}>{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      Due: {task.dueDate}
                    </div>
                    {contact && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-black bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-widest">
                        <div className="w-4 h-4 bg-gray-200 rounded-lg flex items-center justify-center text-[8px] font-bold text-black">
                          {contact.name.charAt(0)}
                        </div>
                        {contact.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(task)}
                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-black">No tasks found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">You're all caught up! Enjoy your free time or add a new task.</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Create New Task"
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Task Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              placeholder="Follow up with client"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all min-h-[100px]"
              placeholder="Details about the task..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Due Date</label>
              <input 
                required
                type="date" 
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Related Contact</label>
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Task"
      >
        <form onSubmit={handleEditTask} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Task Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Due Date</label>
              <input 
                required
                type="date" 
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Related Contact</label>
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
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              >
                <option>Pending</option>
                <option>Completed</option>
              </select>
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
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-bold text-black">{selectedTask?.title}</span>? This action cannot be undone.
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
              onClick={handleDeleteTask}
              className="flex-1 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

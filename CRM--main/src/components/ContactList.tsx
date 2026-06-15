/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2, 
  Star,
  Download,
  Trash2,
  Edit2,
  Loader2,
  ChevronLeft,
  MessageSquare,
  FileText,
  Calendar,
  Zap
} from 'lucide-react';
import { Contact } from '../types';
import { cn } from '../lib/utils';
import Modal from './Modal';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Contacts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.leads.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  // Form State
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

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'All Contacts') return matchesSearch;
    if (activeTab === 'Employee') return matchesSearch && c.category === 'Employee';
    if (activeTab === 'Partners') return matchesSearch && c.category === 'Partner';
    if (activeTab === 'Customers') return matchesSearch && c.category === 'Customer';
    return matchesSearch;
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newContactData: Omit<Contact, 'id'> = {
        ...formData,
        status: formData.status as any,
        notes: [],
        lastContact: new Date().toISOString(),
        assignedTo: 'Me',
        imageUrl: `https://picsum.photos/seed/${formData.name}/200`
      };
      const newContact = await apiService.leads.create(newContactData);
      setContacts([newContact, ...contacts]);
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
      toast.success('Contact added successfully');
    } catch (error: any) {
      console.error('Error adding contact:', error);
      toast.error(`Failed to add contact: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    setIsLoading(true);
    try {
      const updatedContact = await apiService.leads.update(selectedContact.id, {
        ...formData,
        status: formData.status as any
      });
      setContacts(contacts.map(c => c.id === selectedContact.id ? updatedContact : c));
      setIsEditModalOpen(false);
      toast.success('Contact updated successfully');
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast.error(`Failed to update contact: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    setIsLoading(true);
    try {
      await apiService.leads.delete(selectedContact.id);
      setContacts(contacts.filter(c => c.id !== selectedContact.id));
      setIsDeleteModalOpen(false);
      toast.success('Contact deleted successfully');
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast.error(`Failed to delete contact: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      location: (contact as any).location || '',
      company: contact.company,
      role: contact.role,
      category: contact.category,
      status: contact.status,
      value: contact.value
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Welcome Back, Mohann</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your customer relationships and track progress.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-gray rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-all w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-8 border-b border-border-gray">
          {['All Contacts', 'Employee', 'Partners', 'Customers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
                activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{filteredContacts.length} Total</span>
          </div>
        </div>
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-2xl border border-border-gray p-6 hover:shadow-xl transition-all group relative">
              <div className="flex items-start justify-between mb-4">
                <img 
                  src={contact.imageUrl || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} 
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                    className="p-1 text-gray-400 hover:text-black transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === contact.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-border-gray rounded-xl shadow-xl z-20 overflow-hidden">
                        <button 
                          onClick={() => {
                            openEditModal(contact);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            openDeleteModal(contact);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <h3 className="text-base font-bold text-text-primary mb-0.5">{contact.name}</h3>
                <p className="text-xs text-text-secondary mb-4 truncate w-full">{contact.email}</p>
                
                <div className="mb-6">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    contact.category === 'Employee' ? "bg-purple-50 text-purple-600" :
                    contact.category === 'Customer' ? "bg-blue-50 text-blue-600" :
                    "bg-yellow-50 text-yellow-600"
                  )}>
                    {contact.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full border-t border-gray-50 pt-4">
                  <button className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-all">
                    <Mail className="w-4 h-4" />
                    Mail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-border-gray">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-200" />
          </div>
          <h3 className="text-lg font-bold text-black">No contacts found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">We couldn't find any contacts matching your search criteria.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 text-xs font-bold text-black hover:underline uppercase tracking-widest"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
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

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="(671) 555-0110"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="Austin"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                <option value="Employee">Employee</option>
                <option value="Partner">Partner</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-3 justify-end">
            <button 
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Contact'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Contact Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Contact"
      >
        <form onSubmit={handleEditContact} className="space-y-4">
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

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="(671) 555-0110"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="Austin"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                <option value="Employee">Employee</option>
                <option value="Partner">Partner</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-3 justify-end">
            <button 
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Contact'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete Contact"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-bold text-black">{selectedContact?.name}</span>? This action cannot be undone.
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
              onClick={handleDeleteContact}
              className="flex-1 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Contact'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

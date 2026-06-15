import React, { useState } from 'react';
import { Users, Plus, Mail, Shield, MoreVertical, Search, Filter, Trash2, Edit2, Loader2, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/Modal';
import { toast } from 'sonner';

const DUMMY_TEAM = [
  { id: '1', name: 'Alex Rivera', email: 'alex@nexus.com', role: 'Admin', status: 'Active', avatar: 'AR' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@nexus.com', role: 'Manager', status: 'Active', avatar: 'SC' },
  { id: '3', name: 'Michael Ross', email: 'michael@nexus.com', role: 'Sales Rep', status: 'Away', avatar: 'MR' },
  { id: '4', name: 'Emily Blunt', email: 'emily@nexus.com', role: 'Sales Rep', status: 'Active', avatar: 'EB' },
];

const ROLES = ['Admin', 'Manager', 'Sales Rep'];

export default function TeamPage() {
  const [team, setTeam] = useState(DUMMY_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Sales Rep'
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const newMember = {
        ...formData,
        id: Date.now().toString(),
        status: 'Active',
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setTeam([...team, newMember]);
      setIsInviteOpen(false);
      setFormData({ name: '', email: '', role: 'Sales Rep' });
      toast.success('Member invited successfully');
      setIsLoading(false);
    }, 800);
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setIsLoading(true);
    setTimeout(() => {
      setTeam(team.map(m => m.id === selectedMember.id ? { ...m, ...formData, avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() } : m));
      setIsEditOpen(false);
      toast.success('Member updated successfully');
      setIsLoading(false);
    }, 800);
  };

  const handleDelete = (id: string) => {
    setTeam(team.filter((m) => m.id !== id));
    setIsDeleteOpen(false);
    toast.success('Member removed successfully');
  };

  const toggleStatus = (id: string) => {
    setTeam(team.map((m) =>
      m.id === id
        ? { ...m, status: m.status === "Active" ? "Away" : "Active" }
        : m
    ));
    toast.info('Status updated');
  };

  const updateRole = (id: string, newRole: string) => {
    setTeam(team.map((m) =>
      m.id === id ? { ...m, role: newRole } : m
    ));
    toast.info(`Role updated to ${newRole}`);
  };

  const openEditModal = (member: any) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role
    });
    setIsEditOpen(true);
    setOpenMenuId(null);
  };

  const openDeleteModal = (member: any) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
    setOpenMenuId(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Team Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members and their roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member.id} className="card-base group hover:border-black transition-all relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center text-black font-bold text-lg shadow-sm border border-gray-100">
                {member.avatar}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {openMenuId === member.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl border border-border-gray shadow-xl z-20 overflow-hidden">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={() => openDeleteModal(member)}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-black">{member.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{member.email}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="relative group/role">
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
                  onClick={() => {
                    const nextRole = ROLES[(ROLES.indexOf(member.role) + 1) % ROLES.length];
                    updateRole(member.id, nextRole);
                  }}
                >
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.role}</span>
                </button>
              </div>
              <button 
                onClick={() => toggleStatus(member.id)}
                className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  member.status === 'Active' ? "bg-black" : "bg-gray-400"
                )} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{member.status}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card-base !p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">Permissions & Roles</h3>
          <button 
            onClick={() => setIsRolesOpen(true)}
            className="text-xs font-bold text-black hover:underline"
          >
            Manage Roles
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shadow-sm shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">Role-Based Access Control</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Define what each team member can see and do within Nexus CRM. 
                Admins have full access, while Sales Reps are limited to their own leads and tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              placeholder="john@nexus.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={isLoading}
              type="submit"
              className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Team Member"
      >
        <form onSubmit={handleEditMember} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsEditOpen(false)}
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

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Remove Member"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-black">{selectedMember?.name}</span> from the team? 
            They will lose all access to the workspace.
          </p>
          <div className="pt-4 flex gap-3">
            <button 
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleDelete(selectedMember?.id)}
              className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
            >
              Remove Member
            </button>
          </div>
        </div>
      </Modal>

      {/* Manage Roles Modal */}
      <Modal
        isOpen={isRolesOpen}
        onClose={() => setIsRolesOpen(false)}
        title="Manage Roles & Permissions"
      >
        <div className="space-y-4">
          {ROLES.map(role => (
            <div key={role} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{role}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {role === 'Admin' ? 'Full Access' : role === 'Manager' ? 'Team Access' : 'Personal Access'}
                  </p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-black hover:underline uppercase tracking-widest">Edit Permissions</button>
            </div>
          ))}
          <div className="pt-4">
            <button 
              onClick={() => setIsRolesOpen(false)}
              className="w-full btn-primary py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

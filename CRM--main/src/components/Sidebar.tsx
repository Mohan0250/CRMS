/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  MessageSquare, 
  Mail, 
  Settings, 
  LogOut,
  Zap,
  Calendar,
  FileText,
  UserPlus,
  Target
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const navItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', path: '/leads', label: 'Leads', icon: Target },
  { id: 'contacts', path: '/contacts', label: 'Contacts', icon: Users },
  { id: 'pipeline', path: '/deals', label: 'Deals', icon: Kanban },
  { id: 'tasks', path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', path: '/calendar', label: 'Calendar', icon: Calendar },
  { id: 'ai-email', path: '/email-templates', label: 'Email Templates', icon: Mail },
  { id: 'proposals', path: '/proposals', label: 'Proposals', icon: FileText },
  { id: 'contact', path: '/contact', label: 'Contact', icon: Mail },
  { id: 'ai-chat', path: '/ai', label: 'AI Assistant', icon: MessageSquare, isAI: true },
  { id: 'team', path: '/team', label: 'Team', icon: UserPlus },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "w-64 h-screen bg-sidebar-bg text-sidebar-text flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-800">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Nexus CRM</span>
          </div>
          <button onClick={onClose} className="md:hidden text-sidebar-text hover:text-white">
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => onClose()}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive(item.path)
                  ? "bg-sidebar-hover text-white"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-gray-300"
              )} />
              {item.label}
              {item.isAI && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-hover space-y-1">
          <Link 
            to="/settings"
            onClick={() => onClose()}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive('/settings') ? "bg-sidebar-hover text-white" : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
            )}
          >
            <Settings className={cn(
              "w-5 h-5 transition-colors",
              isActive('/settings') ? "text-white" : "text-gray-500"
            )} />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

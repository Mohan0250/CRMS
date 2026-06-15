/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Calendar,
  MoreHorizontal,
  Plus,
  Mail,
  FileText,
  Zap,
  Loader2
} from 'lucide-react';
import { DUMMY_CONTACTS, DUMMY_TASKS } from '../constants';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'];

const revenueData = [
  { name: 'Jan', value: 32000 },
  { name: 'Feb', value: 28000 },
  { name: 'Mar', value: 45000 },
  { name: 'Apr', value: 38000 },
  { name: 'May', value: 52000 },
  { name: 'Jun', value: 48000 },
];

const statusData = [
  { name: 'New', value: 40 },
  { name: 'Qualified', value: 30 },
  { name: 'Interested', value: 20 },
  { name: 'Won', value: 10 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  isDark?: boolean;
}

function StatCard({ title, value, change, isPositive, icon: Icon, isDark }: StatCardProps) {
  return (
    <div className={cn(
      "card-base flex flex-col justify-between h-full transition-all",
      isDark ? "bg-black border-black text-white" : "bg-white"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-xl",
          isDark ? "bg-white/10 text-white" : "bg-gray-100 text-black"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
          isDark ? "bg-white/20 text-white" : "bg-gray-100 text-black"
        )}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className={cn("text-xs font-medium mb-1", isDark ? "text-gray-400" : "text-text-secondary")}>{title}</p>
        <p className="text-xl md:text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { totalRevenue, monthlyRevenue, isLoading, connectionStatus, diagnosticInfo, runDiagnostic } = useAppContext();

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
      {connectionStatus === 'error' && (
        <div className="bg-white border border-red-200 rounded-3xl overflow-hidden shadow-xl shadow-red-500/5">
          <div className="bg-red-50 p-6 border-b border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">Database Connection Diagnostic</h2>
                <p className="text-sm text-red-700 opacity-80">We found some issues connecting to your backend.</p>
              </div>
            </div>
            <button 
              onClick={() => runDiagnostic()}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
              Run Test Again
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-2xl border ${diagnosticInfo.isUrlReachable ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${diagnosticInfo.isUrlReachable ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Network Status</span>
              </div>
              <p className="font-bold text-gray-900">{diagnosticInfo.isUrlReachable ? 'URL Reachable' : 'URL Blocked'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {diagnosticInfo.isUrlReachable 
                  ? 'Your browser can talk to Supabase servers.' 
                  : 'Your browser is blocked. Try disabling Ad-blockers or using Incognito mode.'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${diagnosticInfo.isApiKeyValid ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${diagnosticInfo.isApiKeyValid ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">API Authentication</span>
              </div>
              <p className="font-bold text-gray-900">{diagnosticInfo.isApiKeyValid ? 'Key Valid' : 'Key Invalid'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {diagnosticInfo.isApiKeyValid 
                  ? 'Your API key is accepted by Supabase.' 
                  : 'The API key is rejected. Check your Secrets in AI Studio.'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${diagnosticInfo.areTablesReady ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${diagnosticInfo.areTablesReady ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">Database Schema</span>
              </div>
              <p className="font-bold text-gray-900">{diagnosticInfo.areTablesReady ? 'Tables Ready' : 'Tables Missing'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {diagnosticInfo.areTablesReady 
                  ? 'All required database tables exist.' 
                  : 'Tables not found. You must run the SQL script in Supabase.'}
              </p>
            </div>
          </div>

          {diagnosticInfo.errorMessage && (
            <div className="px-6 pb-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Technical Error Message</p>
                <code className="text-xs text-red-600 break-all">{diagnosticInfo.errorMessage}</code>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Welcome Back, Mohann</h1>
          <p className="text-sm text-text-secondary mt-1">Real-time performance and lead insights.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border-gray rounded-xl text-sm font-semibold text-text-secondary hover:bg-gray-50 transition-all w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          change="+14.2%" 
          isPositive={true} 
          icon={DollarSign}
          isDark={true}
        />
        <StatCard 
          title="Active Leads" 
          value="1,240" 
          change="+8.2%" 
          isPositive={true} 
          icon={Users} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="24.5%" 
          change="-2.4%" 
          isPositive={false} 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Avg Deal Value" 
          value={`$${(totalRevenue / 15).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          change="+5.1%" 
          isPositive={true} 
          icon={Target} 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/leads')}
          className="flex items-center gap-3 p-4 bg-white border border-border-gray rounded-2xl hover:border-black hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">New Lead</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Add Contact</p>
          </div>
        </button>
        <button 
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-3 p-4 bg-white border border-border-gray rounded-2xl hover:border-black hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">New Task</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Stay on track</p>
          </div>
        </button>
        <button 
          onClick={() => navigate('/email-templates')}
          className="flex items-center gap-3 p-4 bg-white border border-border-gray rounded-2xl hover:border-black hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Send Email</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">AI Templates</p>
          </div>
        </button>
        <button 
          onClick={() => navigate('/proposals')}
          className="flex items-center gap-3 p-4 bg-white border border-border-gray rounded-2xl hover:border-black hover:bg-gray-50 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Proposal</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Create Doc</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-base">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-text-primary">Revenue Growth</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                <span className="text-xs font-medium text-text-secondary">Current Year</span>
              </div>
            </div>
          </div>
          <div className="h-64 md:h-80 min-h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: 'none',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#000000" 
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-base">
          <h3 className="text-lg font-bold text-text-primary mb-8">Lead Distribution</h3>
          <div className="h-64 flex items-center justify-center relative min-h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb', 
                    boxShadow: 'none',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-text-primary">1,240</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Leads</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-medium text-text-secondary">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-base !p-0 overflow-hidden">
          <div className="p-6 border-b border-border-gray flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Recent Leads</h3>
            <button 
              onClick={() => navigate('/leads')}
              className="text-xs font-bold text-black hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Company</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DUMMY_CONTACTS.slice(0, 4).map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-black font-bold text-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{contact.name}</p>
                          <p className="text-[10px] text-text-secondary font-medium">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary font-medium">{contact.company}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        contact.status === 'Won' ? "bg-black text-white" :
                        contact.status === 'Qualified' ? "bg-gray-800 text-white" :
                        contact.status === 'Interested' ? "bg-gray-400 text-white" :
                        "bg-gray-100 text-text-secondary"
                      )}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-text-primary">${contact.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-base !p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-gray flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Upcoming Tasks</h3>
            <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {DUMMY_TASKS.slice(0, 3).map((task) => (
              <div key={task.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  task.priority === 'High' ? "bg-black text-white" :
                  task.priority === 'Medium' ? "bg-gray-700 text-white" :
                  "bg-gray-400 text-white"
                )}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{task.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-text-secondary font-bold flex items-center gap-1 uppercase tracking-wider">
                      <Calendar className="w-3 h-3" />
                      {task.dueDate}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                      {task.priority}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 pt-0">
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full py-2.5 bg-gray-50 text-text-secondary rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-border-gray"
            >
              View All Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

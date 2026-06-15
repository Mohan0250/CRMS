import React from 'react';
import { FileText, Plus, Search, Filter, MoreVertical, Download, Eye, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const DUMMY_PROPOSALS = [
  { id: '1', title: 'Enterprise CRM Solution', client: 'Acme Corp', status: 'Sent', value: 12000, date: '2026-04-01' },
  { id: '2', title: 'Consulting Services', client: 'Globex', status: 'Draft', value: 5000, date: '2026-04-05' },
  { id: '3', title: 'Marketing Automation', client: 'Cyberdyne', status: 'Accepted', value: 8500, date: '2026-03-28' },
  { id: '4', title: 'Data Migration Plan', client: 'Initech', status: 'Declined', value: 3200, date: '2026-03-25' },
];

export default function ProposalsPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Proposals</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage your business proposals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Proposal
          </button>
        </div>
      </div>

      <div className="card-base !p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
            {['All', 'Draft', 'Sent', 'Accepted'].map((f) => (
              <button
                key={f}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  f === 'All' 
                    ? "bg-white text-black shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search proposals..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black transition-all w-64"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proposal Title</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DUMMY_PROPOSALS.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black shadow-sm border border-gray-200">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{p.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Created: {p.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{p.client}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      p.status === 'Accepted' ? "bg-black text-white" :
                      p.status === 'Sent' ? "bg-gray-800 text-white" :
                      p.status === 'Draft' ? "bg-gray-200 text-black" :
                      "bg-gray-400 text-black"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-black">${p.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

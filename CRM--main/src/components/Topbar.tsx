/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="min-h-[60px] bg-white border-b border-border-gray flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-3 md:py-0 sticky top-0 z-40 gap-3">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white" />
          </button>
          <div className="h-8 w-px bg-gray-200 hidden md:block" />
        </div>

        <button className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-full transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-none">Mohann</p>
            <p className="text-[10px] font-medium text-text-secondary mt-1 uppercase tracking-wider">Sales Manager</p>
          </div>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </header>
  );
}

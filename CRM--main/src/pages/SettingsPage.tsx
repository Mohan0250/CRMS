import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  CreditCard, 
  Database, 
  Sparkles,
  ChevronRight,
  Save,
  Loader2,
  Download,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Password', icon: Lock },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  { id: 'ai', label: 'AI Configuration', icon: Sparkles },
  { id: 'data', label: 'Data & Export', icon: Database },
];

// --- Sub-components for each section ---

function ProfileSettings() {
  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">Profile Information</h3>
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center text-black font-bold text-2xl shadow-sm border-2 border-white ring-1 ring-gray-100">
            JD
          </div>
          <div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">
              Change Avatar
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">JPG, PNG or GIF. Max 1MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              defaultValue="John Doe"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              defaultValue="john@nexus.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bio</label>
          <textarea 
            defaultValue="Sales Manager at Nexus CRM. Passionate about helping small teams grow."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-sm font-bold text-black">Email Notifications</p>
            <p className="text-xs text-gray-500">Receive daily summaries and alerts via email.</p>
          </div>
          <button 
            onClick={() => setEmailNotif(!emailNotif)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-all duration-200",
              emailNotif ? "bg-black" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
              emailNotif ? "right-1" : "left-1"
            )} />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-sm font-bold text-black">Push Notifications</p>
            <p className="text-xs text-gray-500">Get real-time browser notifications for updates.</p>
          </div>
          <button 
            onClick={() => setPushNotif(!pushNotif)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-all duration-200",
              pushNotif ? "bg-black" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
              pushNotif ? "right-1" : "left-1"
            )} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">Security & Password</h3>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
            <input 
              type="password" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationSettings() {
  const [integrations, setIntegrations] = useState([
    { id: 'google', name: 'Google Calendar', connected: true },
    { id: 'slack', name: 'Slack', connected: false },
    { id: 'github', name: 'GitHub', connected: true },
    { id: 'stripe', name: 'Stripe', connected: false },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, connected: !item.connected } : item
    ));
    const item = integrations.find(i => i.id === id);
    toast.success(`${item?.name} ${!item?.connected ? 'connected' : 'disconnected'}`);
  };

  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">Connected Integrations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black font-bold text-xs">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-black">{item.name}</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  item.connected ? "text-gray-500" : "text-gray-400"
                )}>
                  {item.connected ? 'Connected' : 'Not Connected'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => toggleIntegration(item.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                item.connected 
                  ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                  : "bg-black text-white hover:bg-neutral-800"
              )}
            >
              {item.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div className="card-base">
        <h3 className="text-lg font-bold text-black mb-6">Current Plan</h3>
        <div className="p-6 bg-black rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 fill-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Pro Plan</span>
            </div>
            <h4 className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal opacity-60">/month</span></h4>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Unlimited Contacts & Deals</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Advanced AI Assistant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Custom Integrations</span>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
              Manage Subscription
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="card-base">
        <h3 className="text-lg font-bold text-black mb-6">Payment Method</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/26</p>
            </div>
          </div>
          <button className="text-xs font-bold text-black hover:underline">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function AISettings() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiTone, setAiTone] = useState('Professional');

  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">AI Configuration</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <p className="text-sm font-bold text-black">Enable AI Assistant</p>
            <p className="text-xs text-gray-500">Use AI to help with chats and email generation.</p>
          </div>
          <button 
            onClick={() => setAiEnabled(!aiEnabled)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-all duration-200",
              aiEnabled ? "bg-black" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
              aiEnabled ? "right-1" : "left-1"
            )} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Communication Tone</label>
          <div className="grid grid-cols-3 gap-3">
            {['Professional', 'Friendly', 'Concise'].map((tone) => (
              <button
                key={tone}
                onClick={() => setAiTone(tone)}
                className={cn(
                  "py-3 rounded-xl text-xs font-bold border transition-all",
                  aiTone === tone 
                    ? "bg-black text-white border-black" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                )}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-black" />
            <p className="text-sm font-bold text-black">AI Context</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">Provide additional context for the AI to better understand your business.</p>
          <textarea 
            placeholder="e.g. Nexus is a B2B SaaS company focusing on small business CRM solutions..."
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-black/5 focus:border-black transition-all min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}

function DataExport() {
  const handleExport = () => {
    const userData = {
      profile: { name: 'John Doe', email: 'john@nexus.com' },
      preferences: { notifications: true, theme: 'light' },
      timestamp: new Date().toISOString()
    };
    const data = JSON.stringify(userData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexus-settings-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully');
  };

  return (
    <div className="card-base">
      <h3 className="text-lg font-bold text-black mb-6">Data & Export</h3>
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Export Account Data</p>
              <p className="text-xs text-gray-500">Download a copy of your settings and preferences in JSON format.</p>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="w-full py-3 bg-white border border-gray-200 text-black rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>

        <div className="p-6 border border-gray-100 rounded-2xl">
          <p className="text-sm font-bold text-black mb-2">Delete Account</p>
          <p className="text-xs text-gray-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="text-xs font-bold text-gray-400 hover:text-black transition-all">
            Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'security': return <SecuritySettings />;
      case 'integrations': return <IntegrationSettings />;
      case 'billing': return <BillingSettings />;
      case 'ai': return <AISettings />;
      case 'data': return <DataExport />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and app preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2 overflow-x-auto flex lg:flex-col pb-2 lg:pb-0 gap-2 lg:gap-2 no-scrollbar">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all text-left group shrink-0 lg:w-full",
                activeSection === section.id 
                  ? "bg-white border-black shadow-sm text-black border" 
                  : "bg-transparent border-transparent text-gray-500 hover:bg-white hover:border-gray-200 border"
              )}
            >
              <div className="flex items-center gap-3">
                <section.icon className={cn(
                  "w-5 h-5 transition-colors",
                  activeSection === section.id ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="text-sm font-bold whitespace-nowrap">{section.label}</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-all hidden lg:block",
                activeSection === section.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

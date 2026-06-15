/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Send, 
  Copy, 
  RefreshCw, 
  Loader2,
  Users,
  Briefcase,
  Target,
  CheckCircle2,
  User,
  FileText,
  Check
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DUMMY_CONTACTS } from '../constants';
import { cn } from '../lib/utils';

const EMAIL_TEMPLATES = [
  { id: 'follow-up', label: 'Follow Up', icon: RefreshCw, prompt: 'Write a professional follow-up email after a demo.' },
  { id: 'outreach', label: 'Cold Outreach', icon: Target, prompt: 'Write a personalized cold outreach email for a potential lead.' },
  { id: 'nurture', label: 'Nurture', icon: Users, prompt: 'Write a helpful email providing value to a lead in the pipeline.' },
  { id: 'closing', label: 'Closing', icon: Briefcase, prompt: 'Write a persuasive closing email to finalize a deal.' },
];

export default function AIEmailGenerator() {
  const [selectedContact, setSelectedContact] = useState(DUMMY_CONTACTS[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const prompt = `
        ${selectedTemplate.prompt}
        Contact Details:
        Name: ${selectedContact.name}
        Company: ${selectedContact.company}
        Role: ${selectedContact.role}
        Notes: ${(selectedContact.notes || []).join(', ')}

        Instructions:
        - Keep it professional and personalized.
        - Use a clear subject line.
        - Include placeholders like [My Name] and [My Company].
        - Do not include any preamble, just the email content.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setGeneratedEmail(response.text || "Failed to generate email.");
    } catch (error) {
      console.error("AI Error:", error);
      setGeneratedEmail("Error generating email. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black shadow-sm border border-gray-200">
            <Mail className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">AI Email Generator</h1>
            <p className="text-sm text-text-secondary mt-1">Draft personalized emails in seconds using Nexus AI.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card-base space-y-6">
            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Configuration</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Select Contact
                </label>
                <div className="space-y-2 max-h-[200px] md:max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
                  {DUMMY_CONTACTS.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all border",
                        selectedContact.id === contact.id
                          ? "bg-gray-100 border-black text-black font-bold shadow-sm"
                          : "bg-white border-border-gray text-text-secondary hover:bg-gray-50"
                      )}
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-black font-bold text-xs shrink-0">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="truncate text-xs">{contact.name}</p>
                        <p className="text-[10px] opacity-70 truncate uppercase tracking-wider font-bold">{contact.company}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Email Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EMAIL_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                        selectedTemplate.id === template.id
                          ? "bg-black border-black text-white shadow-sm"
                          : "bg-white border-border-gray text-text-secondary hover:bg-gray-50"
                      )}
                    >
                      <template.icon className="w-4 h-4" />
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Draft
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card-base h-full flex flex-col min-h-[400px] md:min-h-[600px] !p-0 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border-gray flex flex-col sm:flex-row items-center justify-between bg-gray-50/30 gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border-gray">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Email Draft</h3>
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Preview and edit your draft</p>
                </div>
              </div>
              {generatedEmail && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-text-secondary hover:bg-white rounded-lg transition-all border border-border-gray uppercase tracking-widest shadow-sm"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                  <button className="btn-primary flex items-center gap-2 px-4 py-1.5 text-[10px]">
                    <Send className="w-3.5 h-3.5" />
                    Send Now
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar relative">
              {generatedEmail ? (
                <textarea
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  className="w-full h-full min-h-[300px] md:min-h-[400px] border-none focus:ring-0 p-0 text-text-primary leading-relaxed resize-none font-sans text-sm"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Mail className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-text-primary">No email generated yet</h3>
                  <p className="text-xs md:text-sm text-text-secondary mt-2 max-w-xs">Select a contact and template, then click generate to create your first email draft.</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">Nexus is writing...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ARCHITECTURE_DOCS_DATA } from '../constants';
import { Server, Database, Layers, Shield, FileText, Activity } from 'lucide-react';

const ArchitectureView: React.FC = () => {
  const [activeSection, setActiveSection] = useState(ARCHITECTURE_DOCS_DATA[0].id);

  const activeContent = ARCHITECTURE_DOCS_DATA.find(d => d.id === activeSection);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-500" />
            System Design
          </h2>
          <p className="text-xs mt-2 text-slate-500">Principal Architect View</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {ARCHITECTURE_DOCS_DATA.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveSection(doc.id)}
              className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                activeSection === doc.id
                  ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <Activity className="w-3 h-3" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 border-b border-slate-200 pb-4">
            <h1 className="text-3xl font-bold text-slate-900">{activeContent?.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Server className="w-4 h-4" /> v2.4.0</span>
              <span className="flex items-center gap-1"><Database className="w-4 h-4" /> PostgreSQL 15</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> JWT Auth</span>
            </div>
          </header>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-1 bg-slate-100 border-b border-slate-200 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs font-mono text-slate-500">architecture_spec.md</span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm font-mono text-slate-700 bg-slate-50 leading-relaxed">
              {activeContent?.content}
            </pre>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Indian Compliance
                </h3>
                <p className="text-sm text-blue-800">
                    System adheres to DPDP Act 2023 guidelines. All student data is encrypted at rest using AES-256. 
                    Servers hosted within Mumbai AWS region (ap-south-1).
                </p>
             </div>
             <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Deployment
                </h3>
                <p className="text-sm text-indigo-800">
                    Docker Compose orchestration ensures seamless deployment on Linux (Ubuntu 22.04 LTS), macOS, or Windows Server.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureView;

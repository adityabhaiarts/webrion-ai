import React from "react";
import { ExternalLink, Sparkles, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { webrionConfig } from "../../config/webrion";

export default function DashboardTemplates() {
  const navigate = useNavigate();

  const handleUseTemplate = (prompt: string) => {
    // Navigate to generator with the prompt as state
    navigate("/dashboard/generator", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Templates</h1>
        <p className="text-gray-600 text-sm">
          Start your project quickly by choosing one of our premium AI templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webrionConfig.templates.map((template, idx) => (
          <div key={idx} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden flex flex-col group hover:border-brand-300 hover:shadow-md transition-all">
            <div className="h-48 bg-brand-50 p-4 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-brand-500 to-emerald-500" />
               <Sparkles className="w-12 h-12 text-brand-500 drop-shadow-md opacity-40 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-6 flex flex-col flex-1 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                {template.description}
              </p>
              
              <div className="flex items-center gap-3 mt-auto">
                <button 
                  onClick={() => handleUseTemplate(template.prompt)}
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Code className="w-4 h-4" />
                  Use Template
                </button>
                {template.demoUrl && (
                  <a 
                    href={template.demoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

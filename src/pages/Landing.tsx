import { Link } from "react-router-dom";
import { Copy, CheckCircle2, ChevronRight, Calculator, Link as LinkIcon, Download, Zap, Sparkles, Code, LayoutPanelLeft } from "lucide-react";

export default function Landing() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-50 text-gray-900">
      {/* 1. Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center relative">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-sm font-medium mb-8 shadow-sm">
            <Zap className="w-4 h-4" />
            <span>Webrion AI is Live</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Generate powerful websites <br className="hidden md:block"/> 
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-600">Webrion AI</span>
         </h1>
         <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10 border-none">
            Create website ideas, HTML, CSS, JavaScript, PHP code, business landing pages, and deployment suggestions using AI.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/signup" className="px-8 py-4 rounded-full bg-brand-500 text-white font-medium text-lg hover:bg-brand-600 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] flex items-center gap-2">
               Get Started <ChevronRight className="w-5 h-5" />
            </Link>
             <Link to="/login" className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-800 font-medium text-lg hover:bg-gray-50 transition-colors shadow-sm">
               Login
            </Link>
         </div>
      </section>

      {/* Hero Visual: ChatGPT-like Preview */}
      <section className="w-full max-w-5xl mx-auto px-4 py-8">
         <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-400"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
               <div className="w-3 h-3 rounded-full bg-green-400"></div>
               <div className="ml-4 text-xs font-mono text-gray-400">Webrion AI Generator</div>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-6">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-900 shrink-0" />
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-800 font-medium text-[15px]">
                     "Create a premium hospital website with appointment form, services, doctors, gallery, WhatsApp button and Google Map section."
                  </div>
               </div>
               
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-500 shrink-0 flex items-center justify-center">
                     <span className="text-white font-bold text-sm">W</span>
                  </div>
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none p-4 w-full">
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-brand-600 text-[15px] font-medium">
                           <CheckCircle2 className="w-5 h-5" /> 
                           Generating files...
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                           {['index.html', 'style.css', 'script.js', 'contact.php'].map(file => (
                              <div key={file} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-lg text-xs font-mono text-gray-600">
                                 <FileIcon file={file} /> {file}
                              </div>
                           ))}
                        </div>
                        <div className="mt-4 flex gap-3">
                           <button className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-brand-100 hover:bg-brand-100 transition-colors">
                              <Download className="w-4 h-4" /> Download ZIP
                           </button>
                           <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-colors">
                              Preview
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 1. What is Webrion AI? */}
      <section className="w-full max-w-5xl mx-auto px-4 py-24 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">What is Webrion AI?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Webrion AI is your intelligent web development assistant. We provide an advanced platform that translates natural language prompts into fully functional, deployment-ready website code. Whether you're a beginner or an experienced developer, our tools save you hundreds of hours of coding.
          </p>
        </div>
      </section>

      {/* 2. What you can generate */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24 bg-white rounded-3xl border border-gray-200 shadow-sm my-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What you can generate</h2>
          <p className="text-gray-600">Our AI model specializes in a broad range of web technologies and formats.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-12">
          {["HTML/CSS Layouts", "JavaScript Logic", "PHP Backends", "React Components", "Tailwind Styling", "Business Landing Pages", "API Integrations", "Database Schemas"].map((item, i) => (
             <div key={i} className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                 <CheckCircle2 className="w-4 h-4 text-brand-600" />
               </div>
               <span className="text-gray-800 font-medium">{item}</span>
             </div>
          ))}
        </div>
      </section>

      {/* 3. Website examples */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Website examples</h2>
            <p className="text-gray-600">Instantly generate tailored websites for any industry.</p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
               "Hospital Website", "Clinic Website", "Coaching Website", "School Website", 
               "Hotel Website", "Restaurant Website", "Gym Website", "Salon Website"
            ].map(type => (
               <div key={type} className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                     <LayoutIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type}</h3>
               </div>
            ))}
         </div>
      </section>

      {/* 4. Why choose Webrion AI? */}
      <section className="w-full max-w-5xl mx-auto px-4 py-24 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose Webrion AI?</h2>
          <p className="text-gray-600">Built for speed, efficiency, and professional output.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">Go from an idea to a fully functioning website in seconds. Stop writing boilerplate code manually.</p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
              <Code className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Production Ready</h3>
            <p className="text-gray-600 leading-relaxed">The generated code is clean, responsive, and ready to be deployed to your favorite hosting provider.</p>
          </div>
          <div className="p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Constantly Learning</h3>
            <p className="text-gray-600 leading-relaxed">Powered by advanced LLMs that are always improving, delivering modern UI/UX patterns automatically.</p>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="w-full max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="bg-gradient-to-br from-brand-600 to-emerald-700 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 text-left md:text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Ready to build your <br className="hidden md:block" />next website?</h2>
            <p className="text-xl text-brand-50 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses and developers generating code with Webrion AI today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex px-10 py-5 rounded-full bg-white text-brand-600 font-bold text-lg hover:bg-gray-50 transition-all shadow-xl items-center justify-center gap-2">
                Get Started Now <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FileIcon({ file }: { file: string }) {
  if (file.endsWith('.html')) return <Code className="w-3 h-3 text-orange-400" />;
  if (file.endsWith('.css')) return <Code className="w-3 h-3 text-blue-400" />;
  if (file.endsWith('.js')) return <Code className="w-3 h-3 text-yellow-400" />;
  if (file.endsWith('.php')) return <Code className="w-3 h-3 text-purple-400" />;
  return <Code className="w-3 h-3" />;
}

function LayoutIcon() {
   return <LayoutPanelLeft className="w-5 h-5 text-gray-400" />;
}

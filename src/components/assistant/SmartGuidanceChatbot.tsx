import React, { useState, useEffect, useRef } from 'react';
import {
  NavSection,
  BusinessLevelId,
  BusinessProfile,
  UnifiedBusinessDataLayer,
  UnifiedBusinessAnalysisReport,
} from '../../types/bi';
import { useI18n } from '../../context/I18nContext';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronDown,
  ShieldCheck,
  Building2,
  Compass,
  Lightbulb,
  ArrowRight,
  Bot,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  fallback?: boolean;
}

interface SmartGuidanceChatbotProps {
  activeSection: NavSection;
  selectedLevel: BusinessLevelId;
  profile?: BusinessProfile | null;
  unifiedDataLayer?: UnifiedBusinessDataLayer;
  unifiedAnalysis?: UnifiedBusinessAnalysisReport;
  onNavigate: (section: NavSection) => void;
  onStartAshaDemo?: () => void;
  initialQuery?: string | null;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export const SmartGuidanceChatbot: React.FC<SmartGuidanceChatbotProps> = ({
  activeSection,
  selectedLevel,
  profile,
  unifiedDataLayer,
  unifiedAnalysis,
  onNavigate,
  onStartAshaDemo,
  initialQuery,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const { locale, t } = useI18n();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: `Welcome to **THE GREAT SHIFT 2.0**. I am your guidance assistant.\n\nOur governing principle: **AI analyzes. Humans decide.**\n\nI can help you understand your business records, explain data quality scores, clarify charts, or explain AI/ML methods (like K-Means Clustering or Time-Series Forecasting). How can I assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Handle external query (e.g. from Global Search Bar)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setIsOpen(true);
      sendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Context name
  const pageDisplayName = (() => {
    switch (activeSection) {
      case 'dashboard':
        return 'Dashboard';
      case 'my_business':
        return 'My Business Profile';
      case 'manage_affairs':
        return 'Manage Affairs (Ledgers)';
      case 'analyze':
        return 'Analyze Business (Data Upload)';
      case 'data':
        return 'Data & Quality Inspection';
      case 'insights':
        return 'AI Commercial Insights';
      case 'charts':
        return 'Analytics Charts & Trends';
      case 'recommendations':
        return 'AI Recommendations (ML Archetypes)';
      case 'impact':
        return 'Business Impact Assessment';
      case 'decision':
        return 'Human Decision Hub';
      case 'methodology':
        return 'How It Works / Methodology';
      case 'settings':
        return 'Settings & Currencies';
      default:
        return 'Dashboard';
    }
  })();

  // Contextual suggested prompts
  const suggestedPrompts = [
    'How do I start?',
    'What can I analyze?',
    'How do I upload data?',
    'What does this chart mean?',
    'What should I do with this recommendation?',
    "Try Asha's demo",
  ];

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Prepare contextual metrics
    const metricsPayload = {
      revenue: unifiedAnalysis?.keyMetrics?.revenue?.formatted || null,
      expenses: unifiedAnalysis?.keyMetrics?.totalExpenses?.formatted || null,
      netDifference: unifiedAnalysis?.keyMetrics?.revenueExpenseDifference?.formatted || null,
      productCount: unifiedDataLayer?.products?.length || 0,
      lowStockCount: unifiedAnalysis?.inventoryAnalysis?.lowStockItems?.length || 0,
      sufficiencyStatus: unifiedAnalysis?.sufficiency?.state || 'Unknown',
      topProducts: unifiedAnalysis?.productAnalysis?.topByRevenue?.slice(0, 3).map((p: any) => p.product) || [],
    };

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          pageContext: pageDisplayName,
          businessContext: {
            name: profile?.businessName || 'My Business',
            level: selectedLevel,
            type: profile?.businessType || 'Retail/Commerce',
          },
          metrics: metricsPayload,
          locale,
          history: messages.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text: data.text || 'I could not generate an answer right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fallback: data.fallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Chat assistant fetch failed, falling back:', err);
      // Fallback
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        text:
          "I am operating in offline guidance mode. Remember: **AI analyzes, humans decide.** To explore your business data, verify your ledgers in 'Manage Affairs', review verified calculations in 'Analyze Business', and approve or reject archetypes in the 'Human Decision Hub'.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fallback: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        text: `Conversation cleared.\n\nCurrent page: **${pageDisplayName}**.\nHow can I help you analyze your business?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#091124] hover:bg-slate-900 text-white rounded-full shadow-lg border border-slate-700/80 hover:border-teal-500/80 transition-all duration-200 cursor-pointer hover:shadow-teal-900/20"
            title="Need help? Click to open The Great Shift Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold tracking-wide">Need help?</span>
          </button>
        </div>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans antialiased animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#091124] text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  THE GREAT SHIFT ASSISTANT
                </h3>
                <p className="text-[11px] text-slate-300">
                  Guidance for your business analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Badge Strip */}
          <div className="bg-slate-50 px-3.5 py-1.5 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <Compass className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                Viewing: <strong className="text-slate-700 font-semibold">{pageDisplayName}</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 font-semibold shrink-0">
              AI ANALYZES · HUMANS DECIDE
            </span>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white font-medium rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line break-words">{m.text}</div>
                  {m.fallback && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                      Domain guidance mode
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-fit shadow-xs">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span className="font-medium text-[11px]">Assistant is analyzing context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Bar */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 shrink-0 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            className="p-3 bg-white border-t border-slate-200/90 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your business or the system..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all font-sans text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

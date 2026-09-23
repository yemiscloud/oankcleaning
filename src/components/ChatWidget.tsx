import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  ChevronRight,
  Bot,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { PageRoute } from '../types';
import { queryReceptionist } from '../lib/receptionistEngine';
import { logChatInteraction } from '../lib/api';

interface ChatWidgetProps {
  onNavigate: (route: PageRoute) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    action: () => void;
  }[];
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState<string>(() => {
    return 'SES-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Good day! Welcome to OANK Cleaning CIC. I am Clara, your virtual front-desk receptionist.\n\nI am here to assist you with any questions regarding our commercial & domestic cleaning services, price estimates, our 100% deposit back guarantee, or our community Home Reset and Employment Pathway programmes.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        { label: 'Calculate Instant Quote', action: () => { onNavigate('quote'); setIsOpen(false); } },
        { label: 'What is Home Reset?', action: () => handleSendPrompt('What is the OANK Home Reset?') },
        { label: 'Employment Pathway', action: () => handleSendPrompt('How does the Employment Pathway work?') }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawQuery = textToSend || inputValue;
    const query = rawQuery.trim();
    if (!query) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: userTimestamp,
      }
    ];

    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Process through receptionist knowledge engine grounded in operation.md
    const engineResult = queryReceptionist(query);
    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Map suggested actions to actionable buttons
    const actionButtons: { label: string; action: () => void }[] = [];

    if (engineResult.suggestedActions) {
      for (const act of engineResult.suggestedActions) {
        if (act.route) {
          const targetRoute = act.route;
          actionButtons.push({
            label: act.label,
            action: () => {
              onNavigate(targetRoute);
              setIsOpen(false);
            }
          });
        } else if (act.phone) {
          const phoneNumber = act.phone;
          actionButtons.push({
            label: act.label,
            action: () => {
              window.location.href = `tel:${phoneNumber}`;
            }
          });
        }
      }
    }

    // Realistic slight receptionist typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botMsgId = `bot-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: engineResult.text,
          timestamp: botTimestamp,
          actionButtons: actionButtons.length > 0 ? actionButtons : undefined,
        }
      ]);

      // Asynchronously log the conversation interaction to backend/chat_history.php
      logChatInteraction({
        sessionId,
        userMessage: query,
        botResponse: engineResult.text,
        timestamp: `${new Date().toLocaleDateString()} ${botTimestamp}`,
      }).catch((err) => {
        console.warn('Chat log async record error:', err);
      });
    }, 450);
  };

  return (
    <>
      {/* Floating Receptionist Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
       
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#0F382C] hover:bg-[#1B4332] text-amber-300 p-3.5 sm:p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center border-2 border-[#D4AF37] cursor-pointer group"
          title="Instant Virtual Receptionist Chat"
          aria-label="Open Instant Receptionist Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Headphones className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F382C] rounded-full animate-pulse" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border-2 border-[#D4AF37] flex flex-col overflow-hidden animate-fadeIn">
          {/* Reception Header */}
          <div className="bg-[#0F382C] text-white p-4 flex items-center justify-between border-b-2 border-[#D4AF37]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#1B4332] text-amber-300 flex items-center justify-center border border-amber-300/40 flex-shrink-0 shadow-inner">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F382C] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-white">
                    OANK Reception Desk
                  </h3>
                  <span className="bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Virtual Host
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span>Clara</span>
                  <span>•</span>
                  <span>Paisley HQ (PA3 2PJ)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'bot',
                      text: `Conversation cleared. How else may I assist your cleaning or community enquiries today?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    }
                  ]);
                }}
                title="Clear Conversation"
                className="text-slate-300 hover:text-white text-[10px] px-2 py-1 rounded hover:bg-emerald-900/50"
              >
                Reset
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900/50 cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F5] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#0F382C] text-amber-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-xs">
                      C
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#0F382C] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/80 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[12.5px]">{msg.text}</p>

                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                        {msg.actionButtons.map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={btn.action}
                            className="w-full text-left bg-emerald-50 hover:bg-emerald-100 text-[#0F382C] font-semibold text-[11px] px-3 py-2 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <span>{btn.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-8">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#0F382C] text-amber-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  C
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400 ml-1">Clara is checking operation records...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* User Input & Fast Reception Footer */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about Home Reset, quotes, deposits, CIC..."
                className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none bg-slate-50 focus:bg-white text-slate-800"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-[#0F382C] hover:bg-[#1B4332] disabled:opacity-50 text-amber-300 p-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0 shadow-sm"
                aria-label="Send message to receptionist"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-3 h-3 text-[#0F382C]" />
                <span>Grounded in operation.md</span>
              </span>

              <a 
                href="tel:+447510911940" 
                className="text-[#0F382C] hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span>Call Paisley: +44 75 1091 1940</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

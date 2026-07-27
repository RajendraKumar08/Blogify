import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import BlogContext from "../../context/BlogContext";

const ChatBot = ({
  className = "",
  welcomeText = "Ask me anything! I'm here to help with your blog journey."
}) => {
  const [open, setOpen] = useState(true);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: welcomeText }
  ]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chatRef = useRef(null);
  const {blog} = useContext(BlogContext);

  const API = import.meta.env.VITE_BACKEND_URL || '';

  // Check for mobile screen size
  useEffect(() => {
    const getIsMobile = () => window.innerWidth < 768;
    
    // Set initial states once on mount
    const initialMobile = getIsMobile();
    setIsMobile(initialMobile);
    setOpen(!initialMobile);

    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(prev => {
        // Toggle open/closed ONLY if we are crossing the breakpoint (e.g., from Desktop to Mobile)
        // This prevents the chat from closing when the mobile keyboard changes the viewport height
        if (prev !== mobile) {
          setOpen(!mobile);
        }
        return mobile;
      });
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const sendQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/chat/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText, blogId: blog._id })
      });

      const text = await response.text();
      const botReply = text || "I'm processing that. One moment...";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: botReply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I'm having trouble connecting. Check your internet?" }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 font-sans ${className}`}>
      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.33); opacity: 0; }
          40% { opacity: 0.6; }
          100% { transform: scale(1); opacity: 0; }
        }
        .chat-window {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .message-bubble {
          animation: slideIn 0.2s ease-out;
        }
        .pulse-ring::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #3b82f6;
          animation: pulseRing 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
      `}</style>

      {/* Floating Action Button (Mobile Only Toggle) */}
      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className={`relative flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-50 ${!open ? 'pulse-ring' : ''}`}
        >
          {open ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
        </button>
      )}

      {/* Chat Window */}
      {(open || !isMobile) && (
        <div className={`chat-window ${isMobile ? 'absolute bottom-16 right-0' : 'relative'} w-[calc(100vw-3rem)] sm:w-96 h-[500px] md:h-[600px] bg-white/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl flex flex-col overflow-hidden transition-all duration-500`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                  <span className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Online & Responsive</span>
                </div>
              </div>
            </div>
            {isMobile && (
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            style={{ scrollbarWidth: 'none' }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-bubble flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`px-4 py-3 text-sm rounded-2xl max-w-[85%] shadow-sm transition-all hover:shadow-md ${
                    msg.role === "assistant"
                      ? "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      : "bg-blue-600 text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            className="p-4 bg-slate-50/50 border-t border-slate-200 flex gap-3 items-center sticky bottom-0 backdrop-blur-lg"
            onSubmit={sendQuestion}
          >
            <div className="flex-1 relative group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your assistant anything..."
                className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-2xl px-5 py-3 text-sm transition-all outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center justify-center shrink-0 group"
              disabled={loading}
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ChatBot;
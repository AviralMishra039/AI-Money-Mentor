'use client'

import { useState } from 'react'
import { Send, User, Bot, Loader2 } from 'lucide-react'

// Simple helper to safely stringify and embed objects
export function ContextChat({ contextData }: { contextData: any }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your ET Money Mentor. Ask me any follow-up questions about the financial plan you just crafted above." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const newMsg = { role: 'user' as const, content: input }
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          contextData
        })
      })
      const data = await res.json()
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had trouble thinking of a response. Please try again." }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error occurred. Try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border flex flex-col mt-8 print:hidden" style={{ minHeight: '400px' }}>
      <div className="bg-black text-white p-4 rounded-t-xl shrink-0">
         <h3 className="font-serif font-black uppercase tracking-wider text-xl flex items-center gap-2">
           <Bot className="w-5 h-5 text-primary" /> ET Money Mentor Chat
         </h3>
         <p className="text-xs text-white/70 mt-1">Chat natively grounded in your financial math.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[400px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div 
              className={`max-w-[75%] p-4 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-surface border border-border text-text-primary rounded-tl-sm whitespace-pre-wrap'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-text-primary text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
             </div>
             <div className="max-w-[75%] p-4 rounded-xl text-sm bg-surface border border-border text-text-primary flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> Thinking...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-surface rounded-b-xl shrink-0">
        <div className="flex relative">
          <input 
            type="text" 
            placeholder="E.g., What if I prepay ₹50,000 of my home loan?" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="w-full bg-white border border-border rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-text-primary hover:bg-black text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

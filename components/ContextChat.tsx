'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react'

export function ContextChat({ contextData }: { contextData: any }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm your ET Money Mentor. Ask me any follow-up questions about the financial plan you just crafted above." }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
    <div className="et-panel flex flex-col mt-8 print:hidden overflow-hidden" style={{ minHeight: '420px' }}>
      {/* Chat Header */}
      <div className="bg-navy p-5 shrink-0 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg tracking-tight">
                ET Money Mentor
              </h3>
              <p className="text-[11px] text-white/40 font-medium">Grounded in your financial data</p>
            </div>
          </div>
          <span className="et-badge bg-success/20 text-success border border-success/30">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1 animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[400px] bg-surface/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} et-fade-in`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div 
              className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-navy text-white rounded-[2px] rounded-tr-[12px] rounded-tl-[12px] rounded-bl-[12px] shadow-sm'
                  : 'bg-white border border-border text-text-primary rounded-[2px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] whitespace-pre-wrap shadow-sm'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded bg-navy text-white flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 et-fade-in">
            <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-border rounded-[2px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] px-4 py-3 text-sm flex items-center gap-2 text-text-secondary shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-text-tertiary">Analysing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-white shrink-0">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="E.g., What if I prepay ₹50,000 of my home loan?" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="et-input flex-1 !rounded-[2px]"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="et-btn-primary !px-4 !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

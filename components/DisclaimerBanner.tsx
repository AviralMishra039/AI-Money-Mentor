export function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded text-xs text-white/50 leading-relaxed max-w-4xl mx-auto w-full">
      <span className="et-badge bg-primary/20 text-primary shrink-0 mt-0.5">SEBI</span>
      <p>
        <strong className="text-white/60">Regulatory notice:</strong> ET Money Mentor provides AI-generated 
        financial guidance only. This is not SEBI-registered investment advice. 
        All calculations use FY2025-26 tax slabs and are illustrative. 
        Consult a SEBI-registered financial advisor before making investment decisions.
      </p>
    </div>
  )
}

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <div 
      className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 shadow-lg"
      style={{ width: size, height: size }}
    >
      {/* Calendar Grid Icon */}
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none"
        className="relative z-10"
      >
        {/* Calendar Outline */}
        <rect 
          x="3" 
          y="5" 
          width="18" 
          height="17" 
          rx="2" 
          stroke="white" 
          strokeWidth="2"
          fill="none"
        />
        
        {/* Top bar separator */}
        <line 
          x1="3" 
          y1="9" 
          x2="21" 
          y2="9" 
          stroke="white" 
          strokeWidth="2"
        />
        
        {/* Calendar hooks/hangers */}
        <line 
          x1="8" 
          y1="3" 
          x2="8" 
          y2="6" 
          stroke="white" 
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line 
          x1="16" 
          y1="3" 
          x2="16" 
          y2="6" 
          stroke="white" 
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Calendar dots/dates */}
        <circle cx="8" cy="13" r="1" fill="white" />
        <circle cx="12" cy="13" r="1" fill="white" />
        <circle cx="16" cy="13" r="1" fill="white" />
        <circle cx="8" cy="17" r="1" fill="white" />
        <circle cx="12" cy="17" r="1" fill="white" />
        <circle cx="16" cy="17" r="1" fill="white" />
      </svg>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 opacity-20 blur-md" />
    </div>
  );
}

export function LogoWithText({ size = 48, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Logo size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Hangout
          </span>
          <span className="text-xs text-gray-500 font-medium -mt-1">
            Plan Together
          </span>
        </div>
      )}
    </div>
  );
}
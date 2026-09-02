export function ParticleField({ className = "" }: { className?: string }) {
  return (
    <div className={`relative text-zinc-300 ${className}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-zinc-400/10 blur-3xl" />
      <svg viewBox="0 0 480 480" className="relative h-full w-full">
        {/* orbit A */}
        <g
          className="animate-spin-slow"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <ellipse
            cx="240"
            cy="240"
            rx="200"
            ry="78"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.18"
          />
          <circle cx="440" cy="240" r="3" fill="currentColor" fillOpacity="0.9" />
          <circle cx="40" cy="240" r="2" fill="currentColor" fillOpacity="0.5" />
        </g>

        {/* orbit B */}
        <g
          className="animate-spin-slower"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <ellipse
            cx="240"
            cy="240"
            rx="150"
            ry="168"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.14"
          />
          <circle cx="240" cy="408" r="2.5" fill="currentColor" fillOpacity="0.8" />
          <circle cx="240" cy="72" r="2" fill="currentColor" fillOpacity="0.4" />
        </g>

        {/* orbit C */}
        <g
          className="animate-spin-slow"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <ellipse
            cx="240"
            cy="240"
            rx="176"
            ry="60"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.16"
          />
          <circle cx="416" cy="240" r="2" fill="currentColor" fillOpacity="0.7" />
          <circle cx="64" cy="240" r="2" fill="currentColor" fillOpacity="0.4" />
        </g>

        {/* nucleus: three quarks */}
        <g className="animate-pulse-soft">
          <circle cx="240" cy="222" r="5" fill="currentColor" />
          <circle cx="225" cy="256" r="5" fill="currentColor" fillOpacity="0.65" />
          <circle cx="255" cy="256" r="5" fill="currentColor" fillOpacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

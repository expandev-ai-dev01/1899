import { cn } from '@/core/lib/utils';

interface MoonIconProps {
  phaseValue: number;
  className?: string;
}

export function MoonIcon({ phaseValue, className }: MoonIconProps) {
  // phaseValue: 0 (New) -> 0.5 (Full) -> 1 (New)
  // We need to simulate the shadow.
  // This is a simplified visual representation using SVG.

  // Determine if waxing (0-0.5) or waning (0.5-1)
  const isWaxing = phaseValue <= 0.5;
  // Normalize illumination to 0-1 (0=New, 1=Full)
  const illumination = isWaxing ? phaseValue * 2 : (1 - phaseValue) * 2;

  // Calculate path for the shadow/light
  // We draw a circle for the moon base (dark)
  // Then we draw the lit part.

  // Simplified approach: Use a mask or path based on illumination
  // For a robust icon without complex math, we can use a simple approximation
  // or just render a circle with a gradient/mask.

  // Let's use a visual trick:
  // Base circle: Dark
  // Lit circle: Light, masked by an ellipse to create the crescent/gibbous shape.

  return (
    <div className={cn('size-full relative rounded-full bg-slate-950', className)}>
      <svg viewBox="0 0 100 100" className="size-full">
        <defs>
          <mask id={`moon-mask-${phaseValue}`}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {/* The shadow part */}
            <ellipse
              cx={isWaxing ? 50 - 100 * (1 - illumination) : 50 + 100 * (1 - illumination)}
              cy="50"
              rx={50 * Math.abs(1 - 2 * illumination)}
              ry="50"
              fill="black"
            />
            {/* For crescent phases, we need to mask differently than gibbous */}
            {/* Actually, a simpler SVG path approach is better for icons */}
          </mask>
        </defs>

        {/* Base Moon (Dark) */}
        <circle cx="50" cy="50" r="48" fill="#0f172a" stroke="#334155" strokeWidth="2" />

        {/* Lit Part (White/Yellowish) */}
        {/* We construct a path representing the lit portion */}
        <path d={getMoonPath(phaseValue)} fill="#e2e8f0" className="transition-all duration-300" />
      </svg>
    </div>
  );
}

function getMoonPath(phase: number): string {
  // phase is 0..1
  // 0 = New, 0.25 = First Q, 0.5 = Full, 0.75 = Last Q, 1 = New

  const r = 48;
  const cx = 50;
  const cy = 50;

  if (phase <= 0.02 || phase >= 0.98) return ''; // New Moon (invisible)
  if (phase >= 0.48 && phase <= 0.52)
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`; // Full Moon

  // Calculate the curve of the terminator
  // The terminator is an semi-ellipse.
  // x radius varies from r to -r.

  // Waxing (0 -> 0.5)
  if (phase < 0.5) {
    // Path for Waxing
    // Outer arc is always right side for waxing? No.
    // Waxing Crescent (0-0.25): Lit on right, terminator concave.
    // First Quarter (0.25): Half lit (right).
    // Waxing Gibbous (0.25-0.5): Lit on right, terminator convex.

    // Let's use a simpler logic:
    // Draw right semicircle (always lit for waxing? No, depends on hemisphere, assuming Northern for standard API or generic)
    // Actually, let's assume standard representation: New -> Waxing (Right lit) -> Full -> Waning (Left lit).

    // Right semicircle path: M 50 2 A 48 48 0 0 1 50 98
    // Terminator path: A rx 48 0 0 [sweep] 50 2

    const isCrescent = phase < 0.25;
    const terminatorDir = isCrescent ? 1 : 0;
    const terminatorRx = Math.abs(r * Math.cos(phase * 2 * Math.PI));

    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${
      cy + r
    } A ${terminatorRx} ${r} 0 0 ${terminatorDir} ${cx} ${cy - r}`;
  }

  // Waning (0.5 -> 1)
  else {
    // Left semicircle path: M 50 98 A 48 48 0 0 1 50 2
    const isGibbous = phase < 0.75;
    const terminatorDir = isGibbous ? 1 : 0;
    const terminatorRx = Math.abs(r * Math.cos(phase * 2 * Math.PI));

    return `M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${
      cy - r
    } A ${terminatorRx} ${r} 0 0 ${terminatorDir} ${cx} ${cy + r}`;
  }
}

import { useState } from "react";

type City = {
  name: string;
  country: "US" | "CA";
  x: number;
  y: number;
};

// SVG viewBox: 0 0 960 540
// Approximate Mercator projection: lng 170W→50W = x 0→960 (8px/deg), lat 75N→15N = y 0→540 (9px/deg)
// x = (170 - lng) * 8,  y = (75 - lat) * 9
const cities: City[] = [
  // USA
  { name: "New York", country: "US", x: 768, y: 306 },
  { name: "Los Angeles", country: "US", x: 416, y: 369 },
  { name: "Chicago", country: "US", x: 664, y: 297 },
  { name: "Las Vegas", country: "US", x: 440, y: 351 },
  { name: "Miami", country: "US", x: 720, y: 441 },
  { name: "Orlando", country: "US", x: 712, y: 423 },
  { name: "San Francisco", country: "US", x: 384, y: 333 },
  { name: "Washington DC", country: "US", x: 752, y: 324 },
  { name: "Boston", country: "US", x: 792, y: 297 },
  { name: "Seattle", country: "US", x: 384, y: 243 },
  { name: "Dallas", country: "US", x: 584, y: 378 },
  { name: "Houston", country: "US", x: 600, y: 405 },
  { name: "Phoenix", country: "US", x: 464, y: 378 },
  { name: "Denver", country: "US", x: 520, y: 315 },
  { name: "Atlanta", country: "US", x: 688, y: 369 },
  // Canada
  { name: "Toronto", country: "CA", x: 728, y: 279 },
  { name: "Vancouver", country: "CA", x: 376, y: 234 },
  { name: "Montreal", country: "CA", x: 784, y: 270 },
  { name: "Calgary", country: "CA", x: 448, y: 216 },
  { name: "Ottawa", country: "CA", x: 760, y: 261 },
  { name: "Quebec City", country: "CA", x: 800, y: 252 },
];

// Simplified North America polygon paths
const USA_POINTS =
  "368,243 368,270 368,297 392,333 408,360 424,387 464,396 520,400 568,405 584,441 616,441 640,424 672,432 696,441 720,450 744,441 770,405 786,387 802,361 818,333 824,306 824,288 818,270 810,261 824,252 820,234 800,234 760,234 720,234 688,234 660,228 636,234 600,234 568,234 536,234 504,234 472,234 440,234 416,234 392,234 376,234 368,234";

const CANADA_POINTS =
  "368,234 368,216 352,198 336,180 316,162 296,144 272,126 248,117 232,108 216,99 208,90 240,108 264,117 296,117 336,108 368,99 416,90 464,81 512,81 560,81 608,90 648,108 672,126 688,144 704,162 720,180 728,198 740,225 762,234 800,234 820,234 844,243 856,261 840,270 824,252 810,261 800,234 762,234 740,225 728,198 720,180 704,162 688,144 672,126 648,108 608,90 560,81 512,81 464,81 416,90 368,99 336,108 296,117 264,117 240,108 216,99 208,90 192,81 176,72 160,63 152,54 152,72 168,90 192,108 216,117 240,117 264,126 288,135 320,135 352,135 384,126 416,108 448,90 480,81 512,72 544,72 576,81 608,90";

export default function NetworkMap() {
  const [hovered, setHovered] = useState<City | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (city: City, e: React.MouseEvent<SVGCircleElement>) => {
    setHovered(city);
    const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: city.x, y: city.y });
    }
  };

  return (
    <div className="relative w-full" style={{ maxWidth: "960px", margin: "0 auto" }}>
      <svg
        viewBox="0 0 960 540"
        width="100%"
        style={{
          backgroundColor: "#0D1B3E",
          borderRadius: "20px",
          overflow: "visible",
        }}
      >
        {/* Ocean background */}
        <rect width="960" height="540" fill="#0D1B3E" rx="20" />

        {/* Grid lines */}
        {[100, 200, 300, 400, 500].map((y) => (
          <line
            key={`h${y}`}
            x1="0"
            y1={y}
            x2="960"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="540"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Canada */}
        <polygon
          points={CANADA_POINTS}
          fill="#243460"
          stroke="#1A2744"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* USA */}
        <polygon
          points={USA_POINTS}
          fill="#1E3A6E"
          stroke="#1A2744"
          strokeWidth="1.5"
        />

        {/* Mexico hint */}
        <polygon
          points="424,387 464,396 520,400 568,405 584,441 576,460 560,470 520,475 480,465 448,450 424,435 408,410"
          fill="#162240"
          stroke="#1A2744"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Coastline accent */}
        <polyline
          points="368,297 392,333 408,360 424,387"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* Connection lines between major hubs */}
        {[
          [768, 306, 664, 297],
          [664, 297, 792, 297],
          [664, 297, 752, 324],
          [752, 324, 768, 306],
          [768, 306, 728, 279],
          [728, 279, 784, 270],
          [784, 270, 800, 252],
          [416, 369, 440, 351],
          [440, 351, 384, 333],
          [384, 333, 384, 243],
          [376, 234, 384, 243],
          [688, 369, 720, 441],
          [712, 423, 720, 441],
          [584, 378, 600, 405],
          [664, 297, 688, 369],
          [520, 315, 584, 378],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,208,0,0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* City dots */}
        {cities.map((city) => (
          <g key={city.name}>
            {/* Pulse ring */}
            <circle
              cx={city.x}
              cy={city.y}
              r="10"
              fill="none"
              stroke="#FDEA01"
              strokeWidth="1.5"
              opacity="0.4"
              style={{
                animation: `pulseDot ${1.5 + Math.random() * 1}s ease-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
            {/* Second pulse */}
            <circle
              cx={city.x}
              cy={city.y}
              r="6"
              fill="none"
              stroke="#FDEA01"
              strokeWidth="1"
              opacity="0.3"
              style={{
                animation: `pulseDot ${2 + Math.random() * 1}s ease-out infinite`,
                animationDelay: `${0.5 + Math.random() * 1.5}s`,
              }}
            />
            {/* Core dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r={hovered?.name === city.name ? 6 : 4}
              fill={hovered?.name === city.name ? "#FDEA01" : city.country === "CA" ? "#FDEA01" : "#FDEA01"}
              stroke={hovered?.name === city.name ? "white" : "rgba(255,208,0,0.5)"}
              strokeWidth={hovered?.name === city.name ? 2.5 : 1.5}
              style={{ cursor: "pointer", transition: "r 0.15s ease" }}
              onMouseEnter={(e) => handleMouseEnter(city, e)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        ))}

        {/* Tooltip */}
        {hovered && (
          <g>
            <rect
              x={tooltipPos.x - 55}
              y={tooltipPos.y - 42}
              width="110"
              height="32"
              rx="6"
              fill="white"
              filter="url(#shadow)"
            />
            <text
              x={tooltipPos.x}
              y={tooltipPos.y - 22}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#1A2744"
              style={{ pointerEvents: "none" }}
            >
              {hovered.name}
            </text>
            <text
              x={tooltipPos.x}
              y={tooltipPos.y - 11}
              textAnchor="middle"
              fontSize="9"
              fill="#6B7280"
              style={{ pointerEvents: "none" }}
            >
              {hovered.country === "US" ? "United States" : "Canada"}
            </text>
            <polygon
              points={`${tooltipPos.x - 5},${tooltipPos.y - 10} ${tooltipPos.x + 5},${tooltipPos.y - 10} ${tooltipPos.x},${tooltipPos.y - 4}`}
              fill="white"
            />
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>
          </g>
        )}

        {/* Legend */}
        <g transform="translate(20, 480)">
          <circle cx="8" cy="8" r="4" fill="#FDEA01" />
          <text x="18" y="12" fontSize="11" fill="rgba(255,255,255,0.6)">
            Hub City
          </text>
          <line x1="70" y1="8" x2="90" y2="8" stroke="rgba(255,208,0,0.35)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="96" y="12" fontSize="11" fill="rgba(255,255,255,0.6)">
            Network Route
          </text>
        </g>

        {/* Title overlay */}
        <text x="30" y="35" fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.5)" style={{ letterSpacing: "0.1em" }}>
          WAYGGO COVERAGE NETWORK
        </text>
        <text x="30" y="52" fontSize="10" fill="rgba(255,208,0,0.7)">
          21 Hub Cities · 500+ Operators · USA & Canada
        </text>

        <style>{`
          @keyframes pulseDot {
            0% { transform: scale(1); opacity: 0.6; }
            70% { transform: scale(2.8); opacity: 0; }
            100% { transform: scale(2.8); opacity: 0; }
          }
        `}</style>
      </svg>

      {/* Hover instruction */}
      <p className="text-center text-sm mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>
        Hover over any dot to see city details
      </p>
    </div>
  );
}

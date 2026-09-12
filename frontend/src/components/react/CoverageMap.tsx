/// <reference types="google.maps" />
import { useState } from "react";
import { APIProvider, Map, Marker, InfoWindow, useApiIsLoaded } from "@vis.gl/react-google-maps";
import darkMapStyle from "../../../google-maps-dark-style.json";

interface City {
  name: string;
  country: "US" | "CA";
  lat: number;
  lng: number;
  major?: boolean;
}

const cities: City[] = [
  // United States
  { name: "New York",        country: "US", lat: 40.71, lng: -74.01, major: true  },
  { name: "Los Angeles",     country: "US", lat: 34.05, lng: -118.24, major: true },
  { name: "Chicago",         country: "US", lat: 41.85, lng: -87.65,  major: true },
  { name: "Las Vegas",       country: "US", lat: 36.17, lng: -115.14 },
  { name: "Miami",           country: "US", lat: 25.77, lng: -80.19,  major: true },
  { name: "Orlando",         country: "US", lat: 28.54, lng: -81.38  },
  { name: "San Francisco",   country: "US", lat: 37.77, lng: -122.42 },
  { name: "Washington D.C.", country: "US", lat: 38.91, lng: -77.04  },
  { name: "Boston",          country: "US", lat: 42.36, lng: -71.06,  major: true },
  { name: "Seattle",         country: "US", lat: 47.61, lng: -122.33, major: true },
  { name: "Dallas",          country: "US", lat: 32.78, lng: -96.80,  major: true },
  { name: "Denver",          country: "US", lat: 39.74, lng: -104.98 },
  { name: "Atlanta",         country: "US", lat: 33.75, lng: -84.39  },
  { name: "Phoenix",         country: "US", lat: 33.45, lng: -112.07 },
  { name: "Houston",         country: "US", lat: 29.76, lng: -95.37  },
  // Canada
  { name: "Toronto",         country: "CA", lat: 43.65, lng: -79.38,  major: true },
  { name: "Vancouver",       country: "CA", lat: 49.25, lng: -123.12, major: true },
  { name: "Montreal",        country: "CA", lat: 45.50, lng: -73.57,  major: true },
  { name: "Calgary",         country: "CA", lat: 51.05, lng: -114.07 },
  { name: "Ottawa",          country: "CA", lat: 45.42, lng: -75.69  },
  { name: "Quebec City",     country: "CA", lat: 46.81, lng: -71.21  },
];

// Requires a free key from console.cloud.google.com (Maps JavaScript API
// enabled + billing on the project) — see frontend/.env.example.
const GOOGLE_MAPS_API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined;

const US_CANADA_BOUNDS = { north: 80, south: -15, west: -175, east: -35 };

// Plain classic markers (no Map ID) so the dark `styles` JSON below applies
// directly — Google only allows inline styling when no Map ID is set.
// The icon's pixel size also sets Google's marker hit-box, so the pulsing
// rings animate *within* the existing glow radius rather than growing past
// it (unlike the old CSS version) to avoid overlapping nearby markers' hit
// areas.
function pulseRing(cx: number, cy: number, fromR: number, toR: number, delay: number, duration: number): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${fromR}" fill="none" stroke="#FDEA01" stroke-width="1.5" opacity="0.75">` +
    `<animate attributeName="r" values="${fromR};${toR}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>` +
    `<animate attributeName="opacity" values="0.75;0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>` +
    `</circle>`
  );
}

function hubIconUrl(major: boolean): string {
  const dotRadius = major ? 7 : 5;
  const glowRadius = major ? 18 : 14;
  const ringMaxR = glowRadius - 2;
  const size = glowRadius * 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<defs><radialGradient id="g" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="#FDEA01" stop-opacity="0.9"/>` +
    `<stop offset="40%" stop-color="#FDEA01" stop-opacity="0.3"/>` +
    `<stop offset="100%" stop-color="#FDEA01" stop-opacity="0"/>` +
    `</radialGradient></defs>` +
    `<circle cx="${glowRadius}" cy="${glowRadius}" r="${glowRadius}" fill="url(#g)"/>` +
    pulseRing(glowRadius, glowRadius, dotRadius, ringMaxR, 0, 2) +
    pulseRing(glowRadius, glowRadius, dotRadius, ringMaxR, 0.55, 2.7) +
    `<circle cx="${glowRadius}" cy="${glowRadius}" r="${dotRadius}" fill="#FDEA01"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function HubMarker({ city }: { city: City }) {
  const [hovered, setHovered] = useState(false);
  const apiLoaded = useApiIsLoaded();
  const size = (city.major ? 18 : 14) * 2;

  return (
    <>
      <Marker
        position={{ lat: city.lat, lng: city.lng }}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        icon={apiLoaded ? {
          url: hubIconUrl(!!city.major),
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size / 2, size / 2),
        } : undefined}
      />
      {hovered && (
        <InfoWindow
          position={{ lat: city.lat, lng: city.lng }}
          pixelOffset={[0, -(city.major ? 22 : 18)]}
          disableAutoPan
        >
          <div className="wayggo-tooltip-name">{city.name}</div>
          <div className="wayggo-tooltip-sub">
            {city.country === "US" ? "United States" : "Canada"} &middot; WAYGGO Hub
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function CoverageMap() {
  return (
    <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", height: "520px" }}>

      {/* Brand overlay — top-left */}
      <div style={{
        position: "absolute", top: 20, left: 20,
        zIndex: 1000, pointerEvents: "none",
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: "11px", letterSpacing: "2.5px",
          color: "rgba(255,255,255,0.45)", marginBottom: "4px",
        }}>
          WAYGGO COVERAGE NETWORK
        </div>
        <div style={{
          fontSize: "10px",
          color: "rgba(255,208,0,0.7)",
        }}>
          21 Hub Cities · 500+ Vetted Operators · USA &amp; Canada
        </div>
      </div>

      {/* Legend — bottom-left */}
      <div style={{
        position: "absolute", bottom: 28, left: 20,
        zIndex: 1000, pointerEvents: "none",
        display: "flex", alignItems: "center", gap: "12px",
        background: "rgba(8,14,28,0.72)",
        padding: "6px 12px", borderRadius: "20px",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            display: "inline-block", width: "10px", height: "10px",
            borderRadius: "50%", background: "#FDEA01",
            boxShadow: "0 0 6px rgba(255,208,0,0.7)",
          }} />
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>
            Hub City
          </span>
        </span>
        <span style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
          Hover any dot for details
        </span>
      </div>

      {!GOOGLE_MAPS_API_KEY ? (
        <div style={{
          height: "100%", width: "100%", background: "#080E1C",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "center", padding: "0 32px",
        }}>
          Set PUBLIC_GOOGLE_MAPS_API_KEY in frontend/.env to load the map.
        </div>
      ) : (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={{ lat: 44, lng: -97 }}
            defaultZoom={3}
            minZoom={2}
            scrollwheel={false}
            gestureHandling="greedy"
            disableDefaultUI={true}
            zoomControl={true}
            restriction={{ latLngBounds: US_CANADA_BOUNDS, strictBounds: false }}
            styles={darkMapStyle}
            style={{ height: "100%", width: "100%" }}
          >
            {cities.map((city) => (
              <HubMarker key={city.name} city={city} />
            ))}
          </Map>
        </APIProvider>
      )}
    </div>
  );
}

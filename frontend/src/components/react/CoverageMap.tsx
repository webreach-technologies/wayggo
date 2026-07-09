import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function makeIcon(major: boolean): L.DivIcon {
  const cls = major ? "hub-dot is-major" : "hub-dot";
  return L.divIcon({
    className: "hub-icon",
    html: `<span class="${cls}"><span class="hub-ring"></span><span class="hub-ring is-outer"></span></span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
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

      <MapContainer
        center={[44, -97]}
        zoom={3}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#080E1C" }}
        maxBounds={[[-15, -175], [80, -35]]}
        maxBoundsViscosity={0.85}
        minZoom={2}
      >
        {/* Zoom control — top-right to avoid our brand overlay */}
        <ZoomControl position="topright" />

        {/* CARTO Dark Matter tiles — free, no API key */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {cities.map((city) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={makeIcon(!!city.major)}
          >
            <Tooltip
              direction="top"
              offset={[0, -18]}
              opacity={1}
              className="wayggo-tooltip"
            >
              <div className="wayggo-tooltip-name">{city.name}</div>
              <div className="wayggo-tooltip-sub">
                {city.country === "US" ? "United States" : "Canada"} &middot; WAYGGO Hub
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";

const countries = [
  "Australia", "Bahrain", "Bangladesh", "Brazil", "China", "Colombia", "Egypt",
  "France", "Germany", "Hong Kong", "India", "Indonesia", "Ireland", "Israel",
  "Italy", "Japan", "Jordan", "Kenya", "Kuwait", "Malaysia", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman",
  "Pakistan", "Philippines", "Poland", "Portugal", "Qatar", "Russia",
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey",
  "UAE", "UK", "Ukraine", "Vietnam", "Other",
];

const vehicles = [
  "Luxury Van (6–14 pax)",
  "Minibus (15–28 pax)",
  "Full-Size Bus (29–40 pax)",
  "Motorcoach (41–56 pax)",
  "Charter Shuttle (8–16 pax)",
  "Mixed Fleet — Let us recommend",
];

const tourTypes = [
  "Sightseeing & City Tours",
  "Educational & Student Tours",
  "Religious & Pilgrimage",
  "Corporate & Convention",
  "Sports Teams & Fan Groups",
  "Wedding & Special Events",
  "Airport Transfers",
  "Custom Itinerary",
];

type FormData = {
  agencyName: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  startCity: string;
  endCity: string;
  cities: string;
  dateFrom: string;
  dateTo: string;
  groupSize: string;
  vehiclePreference: string;
  tourType: string;
  specialRequirements: string;
};

const blank: FormData = {
  agencyName: "", country: "", contactName: "", email: "", phone: "",
  startCity: "", endCity: "", cities: "", dateFrom: "", dateTo: "",
  groupSize: "", vehiclePreference: "", tourType: "", specialRequirements: "",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.8rem 1rem",
  border: "2px solid #E5E7EB",
  borderRadius: 10,

  fontSize: "0.9375rem",
  color: "#0D0D0D",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",

  fontWeight: 600,
  fontSize: "0.8125rem",
  color: "#1A2744",
  marginBottom: "0.35rem",
  letterSpacing: "0.02em",
};

const errorStyle: React.CSSProperties = {
  color: "#EF4444",
  fontSize: "0.75rem",
  marginTop: "0.25rem",

};

function Field({
  label, error, children,
}: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

function Input({
  value, onChange, type = "text", placeholder, min, max,
}: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; min?: string; max?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        borderColor: focused ? "#1A2744" : "#E5E7EB",
        boxShadow: focused ? "0 0 0 3px rgba(26,39,68,0.08)" : "none",
      }}
    />
  );
}

function Select({
  value, onChange, children,
}: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        cursor: "pointer",
        borderColor: focused ? "#1A2744" : "#E5E7EB",
        boxShadow: focused ? "0 0 0 3px rgba(26,39,68,0.08)" : "none",
      }}
    >
      {children}
    </select>
  );
}

function Textarea({
  value, onChange, placeholder, rows = 4,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        resize: "vertical",
        borderColor: focused ? "#1A2744" : "#E5E7EB",
        boxShadow: focused ? "0 0 0 3px rgba(26,39,68,0.08)" : "none",
      }}
    />
  );
}

export default function QuoteForm({ packageName }: { packageName?: string } = {}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(blank);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;
  const stepLabels = ["Your Agency", "Trip Details", "Services", "Review"];

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (s: number): boolean => {
    const e: Partial<FormData> = {};
    if (s === 1) {
      if (!data.agencyName.trim()) e.agencyName = "Agency name is required";
      if (!data.country) e.country = "Country is required";
      if (!data.contactName.trim()) e.contactName = "Your name is required";
      if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email))
        e.email = "Valid email is required";
      if (!data.phone.trim()) e.phone = "Phone number is required";
    }
    if (s === 2) {
      if (!data.startCity.trim()) e.startCity = "Start city is required";
      if (!data.dateFrom) e.dateFrom = "Departure date is required";
      if (!data.dateTo) e.dateTo = "Return date is required";
      if (!data.groupSize.trim() || isNaN(Number(data.groupSize)))
        e.groupSize = "Valid group size is required";
    }
    if (s === 3) {
      if (!data.tourType) e.tourType = "Please select a tour type";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, totalSteps)); };
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const submit = () => { if (validate(step)) setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(253,234,1,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            position: "relative",
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#FDEA01", opacity: 0.2, position: "absolute" }} />
          <Check size={40} color="#FDEA01" strokeWidth={3} style={{ position: "relative" }} />
        </div>
        <h3 style={{ color: "#1A2744", fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.75rem" }}>
          Quote Request Received!
        </h3>
        <p style={{ color: "#6B7280", marginBottom: "0.5rem" }}>
          Thank you, <strong>{data.contactName}</strong>. We've received your request for <strong>{data.agencyName}</strong>.
        </p>
        <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
          Our operations team will respond within <strong>24 hours</strong> to <strong>{data.email}</strong>.
        </p>
        <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: 12, background: "#F9F7F2", color: "#6B7280", fontSize: "0.875rem" }}>
          Reference ID: <strong style={{ color: "#1A2744" }}>WG-{Date.now().toString(36).toUpperCase()}</strong>
        </div>
      </div>
    );
  }

  const progressPct = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{}}>
      {packageName && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "0.75rem 1rem", marginBottom: "1.5rem",
          borderRadius: 10, background: "#F9F7F2",
          fontSize: "0.8125rem", color: "#1A2744",
        }}>
          <strong>Requesting:</strong> {packageName}
        </div>
      )}
      {/* Progress */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700,
                  
                    background: done ? "#FDEA01" : active ? "#1A2744" : "#E5E7EB",
                    color: done ? "#1A2744" : active ? "white" : "#9CA3AF",
                    transition: "all 0.3s",
                  }}
                >
                  {done ? (
                    <Check size={14} color="#1A2744" strokeWidth={2.5} />
                  ) : s}
                </div>
                <span style={{
                  fontSize: "0.75rem",
                
                  color: active ? "#1A2744" : "#9CA3AF",
                  fontWeight: active ? 600 : 400,
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "#E5E7EB" }}>
          <div style={{ height: "100%", borderRadius: 99, background: "#FDEA01", width: `${progressPct}%`, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Your Agency Details
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Tell us about your travel agency so we can tailor our response.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <Field label="Agency / Company Name *" error={errors.agencyName}>
              <Input value={data.agencyName} onChange={(v) => update("agencyName", v)} placeholder="e.g. Sunrise Tours Ltd." />
            </Field>
            <Field label="Country of Operation *" error={errors.country}>
              <Select value={data.country} onChange={(v) => update("country", v)}>
                <option value="">Select your country</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Your Full Name *" error={errors.contactName}>
                <Input value={data.contactName} onChange={(v) => update("contactName", v)} placeholder="Jane Smith" />
              </Field>
              <Field label="Business Email *" error={errors.email}>
                <Input value={data.email} onChange={(v) => update("email", v)} type="email" placeholder="you@agency.com" />
              </Field>
            </div>
            <Field label="Phone / WhatsApp *" error={errors.phone}>
              <Input value={data.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+44 20 7946 0123" />
            </Field>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Trip Details
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Share your itinerary so we can match you with the right operators.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="First City / Entry Point *" error={errors.startCity}>
                <Input value={data.startCity} onChange={(v) => update("startCity", v)} placeholder="e.g. New York" />
              </Field>
              <Field label="Last City / Departure Point">
                <Input value={data.endCity} onChange={(v) => update("endCity", v)} placeholder="e.g. Los Angeles" />
              </Field>
            </div>
            <Field label="All Cities to Visit">
              <Input value={data.cities} onChange={(v) => update("cities", v)} placeholder="e.g. NYC → Chicago → Las Vegas → LA" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Tour Start Date *" error={errors.dateFrom}>
                <Input value={data.dateFrom} onChange={(v) => update("dateFrom", v)} type="date" />
              </Field>
              <Field label="Tour End Date *" error={errors.dateTo}>
                <Input value={data.dateTo} onChange={(v) => update("dateTo", v)} type="date" />
              </Field>
            </div>
            <Field label="Total Group Size (Passengers) *" error={errors.groupSize}>
              <Input value={data.groupSize} onChange={(v) => update("groupSize", v)} type="number" min="1" max="500" placeholder="e.g. 32" />
            </Field>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Vehicle &amp; Services
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Help us understand your transportation preferences.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <Field label="Vehicle Preference">
              <Select value={data.vehiclePreference} onChange={(v) => update("vehiclePreference", v)}>
                <option value="">Select a vehicle type</option>
                {vehicles.map((v) => <option key={v} value={v}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Tour Type / Purpose *" error={errors.tourType}>
              <Select value={data.tourType} onChange={(v) => update("tourType", v)}>
                <option value="">Select tour type</option>
                {tourTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Special Requirements / Notes">
              <Textarea
                value={data.specialRequirements}
                onChange={(v) => update("specialRequirements", v)}
                placeholder="Wheelchair accessibility, multilingual guide needed, early morning starts, luggage storage requirements..."
                rows={4}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 4 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Review Your Request
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Please confirm the details before submitting.
          </p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {[
              {
                title: "Agency",
                rows: [
                  ["Agency", data.agencyName],
                  ["Country", data.country],
                  ["Contact", data.contactName],
                  ["Email", data.email],
                  ["Phone", data.phone],
                ],
              },
              {
                title: "Trip",
                rows: [
                  ["From", data.startCity],
                  ["To", data.endCity || data.startCity],
                  ["Cities", data.cities || "Not specified"],
                  ["Dates", `${data.dateFrom} → ${data.dateTo}`],
                  ["Group Size", `${data.groupSize} passengers`],
                ],
              },
              {
                title: "Services",
                rows: [
                  ["Vehicle", data.vehiclePreference || "To be recommended"],
                  ["Tour Type", data.tourType],
                  ["Notes", data.specialRequirements || "None"],
                ],
              },
            ].map((section) => (
              <div key={section.title} style={{ border: "1px solid #F3F4F6", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "0.6rem 1rem", background: "#F9F7F2", fontSize: "0.7rem", fontWeight: 700, color: "#1A2744", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {section.title}
                </div>
                <div style={{ padding: "0.75rem 1rem", display: "grid", gap: "0.5rem" }}>
                  {section.rows.map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.875rem" }}>
                      <span style={{ color: "#9CA3AF", flexShrink: 0 }}>{label}</span>
                      <span style={{ color: "#0D0D0D", fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F3F4F6" }}>
        <button
          onClick={back}
          disabled={step === 1}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0.625rem 1.25rem", borderRadius: 99,
            border: "2px solid #1A2744", background: "transparent",
            color: "#1A2744",            fontSize: "0.875rem", fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer",
            opacity: step === 1 ? 0.3 : 1, transition: "opacity 0.2s",
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={next}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.625rem 1.75rem", borderRadius: 99,
              border: "none", background: "#FDEA01",
              color: "#1A2744",              fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            Continue
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={submit}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0.625rem 1.75rem", borderRadius: 99,
              border: "none", background: "#1A2744",
              color: "white",              fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(-2px)";
              btn.style.boxShadow = "0 8px 20px rgba(26,39,68,0.25)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = "translateY(0)";
              btn.style.boxShadow = "none";
            }}
          >
            Submit Request
            <Send size={16} strokeWidth={2} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}

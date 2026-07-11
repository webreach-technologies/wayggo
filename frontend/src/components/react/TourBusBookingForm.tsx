import { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Upload, FileText, X, Lock, Calendar, Check, ChevronLeft, ChevronRight, Send } from "lucide-react";
import type { ImageMetadata } from "astro";
import chartershuttleImg from "../../assets/fleet/chartershuttle.png";
import minibusImg from "../../assets/fleet/minibus.png";
import fullsizebusImg from "../../assets/fleet/fullsizebus.png";
import motorcoachImg from "../../assets/fleet/motorcoach.png";

type BookingType = "Instant Booking" | "Request a Quote" | "";

type FormData = {
  groupTourBus: string;
  tripType: "One-way" | "Round Trip" | "";
  pickupAddress: string;
  pickupDateTime: Date | null;
  groupName: string;
  fullName: string;
  email: string;
  phone: string;
  passengerCount: string;
  busCapacity: number | "";
  additionalInfo: string;
  attachments: File[];
  bookingType: BookingType;
};

const blank: Omit<FormData, "groupTourBus"> = {
  tripType: "",
  pickupAddress: "",
  pickupDateTime: null,
  groupName: "",
  fullName: "",
  email: "",
  phone: "",
  passengerCount: "",
  busCapacity: "",
  additionalInfo: "",
  attachments: [],
  bookingType: "",
};

const MAX_ATTACHMENT_MB = 10;

const busOptions: { capacity: number; pricePerDay: number; vehicleType: string; amenities: string[]; image: ImageMetadata }[] = [
  { capacity: 15, pricePerDay: 950,  vehicleType: "Sprinter Van",  amenities: ["AC", "Reclining Seats", "USB"], image: chartershuttleImg },
  { capacity: 24, pricePerDay: 1250, vehicleType: "Minibus",       amenities: ["AC", "Reclining Seats", "USB", "PA System"], image: minibusImg },
  { capacity: 28, pricePerDay: 1450, vehicleType: "Minibus",       amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD"], image: minibusImg },
  { capacity: 33, pricePerDay: 1650, vehicleType: "Mini Coach",    amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD", "Wi-Fi"], image: fullsizebusImg },
  { capacity: 44, pricePerDay: 1950, vehicleType: "Mini Coach",    amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD", "Wi-Fi", "Electrical Outlets"], image: fullsizebusImg },
  { capacity: 50, pricePerDay: 2150, vehicleType: "Motor Coach",   amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD", "Wi-Fi", "Electrical Outlets", "Restroom"], image: motorcoachImg },
  { capacity: 55, pricePerDay: 2350, vehicleType: "Motor Coach",   amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD", "Wi-Fi", "Electrical Outlets", "Restroom", "Overhead Storage"], image: motorcoachImg },
  { capacity: 56, pricePerDay: 2450, vehicleType: "Motor Coach",   amenities: ["AC", "Reclining Seats", "USB", "PA System", "DVD", "Wi-Fi", "Electrical Outlets", "Restroom", "Overhead Storage", "Luggage Bay"], image: motorcoachImg },
];

const DEPOSIT_RATE = 0.2;

// Tour bus pages pass tourBusLabel directly. When the form is used on its own
// (e.g. the /tour-bus/request page), it resolves the label itself from the
// ?tourBus=<id> / ?name=<label> query string so every page shares one component.
const tourBusLabelsById: Record<string, string> = {
  "nyc-icons": "New York City Icons",
  "niagara-toronto": "Niagara Falls & Toronto Explorer",
};

function resolveTourBusLabel(tourBusLabel?: string): string {
  if (tourBusLabel) return tourBusLabel;
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const id = params.get("tourBus");
  const name = params.get("name");
  return (id && tourBusLabelsById[id]) || name || "Custom Tour Bus";
}

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
  label, error, hint, children,
}: {
  label: string; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {hint && !error && <p style={{ color: "#6B7280", fontSize: "0.75rem", marginTop: "0.25rem" }}>{hint}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

function Input({
  value, onChange, type = "text", placeholder, min,
}: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; min?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
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

function FileUpload({
  files, onChange,
}: {
  files: File[]; onChange: (files: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = "wayggo-attachments";

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted = Array.from(incoming).filter((f) => f.size <= MAX_ATTACHMENT_MB * 1024 * 1024);
    onChange([...files, ...accepted]);
  };

  const removeFile = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "1.5rem 1rem",
          borderRadius: 10,
          border: `2px dashed ${dragOver ? "#1A2744" : "#E5E7EB"}`,
          background: dragOver ? "#F9F7F2" : "white",
          cursor: "pointer",
          textAlign: "center",
          transition: "all 0.15s",
        }}
      >
        <Upload size={22} color="#1A2744" strokeWidth={1.8} />
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1A2744" }}>
          Click to upload or drag &amp; drop
        </span>
        <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
          PDF, DOC, or image — up to {MAX_ATTACHMENT_MB}MB per file
        </span>
        <input
          id={inputId}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
          style={{ display: "none" }}
        />
      </label>

      {files.length > 0 && (
        <div style={{ display: "grid", gap: 8, marginTop: "0.75rem" }}>
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                padding: "0.6rem 0.85rem", borderRadius: 10, background: "#F9F7F2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <FileText size={16} color="#1A2744" strokeWidth={1.3} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: "0.8125rem", color: "#1A2744", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {file.name}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF", flexShrink: 0 }}>
                  {(file.size / (1024 * 1024)).toFixed(1)}MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                aria-label={`Remove ${file.name}`}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: "50%", border: "none",
                  background: "transparent", color: "#9CA3AF", cursor: "pointer", flexShrink: 0,
                }}
              >
                <X size={14} strokeWidth={1.6} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DateTimeInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, onClick, placeholder }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        readOnly
        value={value as string}
        onClick={onClick}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          paddingRight: "2.75rem",
          cursor: "pointer",
          borderColor: focused ? "#1A2744" : "#E5E7EB",
          boxShadow: focused ? "0 0 0 3px rgba(26,39,68,0.08)" : "none",
        }}
      />
      <Calendar
        size={18}
        color="#1A2744"
        strokeWidth={1.4}
        style={{ position: "absolute", top: "50%", right: "1rem", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
});
DateTimeInput.displayName = "DateTimeInput";

function LockedField({ value }: { value: string }) {
  return (
    <div
      style={{
        ...inputStyle,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#F9F7F2",
        color: "#1A2744",
        fontWeight: 700,
        cursor: "not-allowed",
      }}
    >
      <Lock size={16} color="#1A2744" strokeWidth={1.4} style={{ flexShrink: 0 }} />
      {value}
    </div>
  );
}

function TripTypeToggle({
  value, onChange,
}: {
  value: FormData["tripType"]; onChange: (v: FormData["tripType"]) => void;
}) {
  const options: { value: FormData["tripType"]; label: string; sub: string }[] = [
    { value: "One-way", label: "One-way", sub: "Drop off only" },
    { value: "Round Trip", label: "Round Trip", sub: "Pickup & return" },
  ];
  return (
    <div className="wg-toggle-grid">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: active ? "2px solid #1A2744" : "2px solid #E5E7EB",
              background: active ? "#1A2744" : "white",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: active ? "#FDEA01" : "#1A2744" }}>
              {opt.label}
            </span>
            <span style={{ fontSize: "0.75rem", color: active ? "rgba(255,255,255,0.65)" : "#9CA3AF" }}>
              {opt.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BusSizeSelector({
  value, onChange, minRequired,
}: {
  value: number | ""; onChange: (v: number) => void; minRequired: number;
}) {
  const selected = typeof value === "number" ? busOptions.find((o) => o.capacity === value) : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div className="wg-bus-grid">
        {busOptions.map((opt) => {
          const active = value === opt.capacity;
          const disabled = minRequired > 0 && opt.capacity < minRequired;
          return (
            <button
              key={opt.capacity}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.capacity)}
              title={disabled ? `Too small for ${minRequired} passengers` : undefined}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "0.65rem 0.5rem",
                borderRadius: 10,
                border: active ? "2px solid #1A2744" : "2px solid #E5E7EB",
                background: disabled ? "#F3F4F6" : active ? "#1A2744" : "white",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.15s",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: disabled ? "#9CA3AF" : active ? "#FDEA01" : "#1A2744" }}>
                {opt.capacity}
              </span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: disabled ? "#9CA3AF" : active ? "#FDEA01" : "#1A2744" }}>
                Passenger
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="wg-bus-summary"
          style={{
            padding: "1rem 1.1rem",
            borderRadius: 12,
            border: "2px solid #1A2744",
            background: "#1A2744",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#FDEA01" }}>
                {selected.capacity} Passenger {selected.vehicleType}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "3px 0" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 6 }}>
                Amenities:
              </span>
              {selected.amenities.map((a, i) => (
                <span key={a} style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                  {a}{i < selected.amenities.length - 1 && (
                    <span style={{ color: "#FDEA01", margin: "0 4px" }}>/</span>
                  )}
                </span>
              ))}
            </div>
            <div style={{ paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#FDEA01" }}>
                Starting ${selected.pricePerDay.toLocaleString()}<span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}> / day</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", marginTop: 2, maxWidth: 360 }}>
                Estimate for the {selected.capacity}-Passenger bus. Final total depends on trip length, route, and seasonal demand — confirmed in your proposal.
              </p>
            </div>
          </div>
          <img
            src={selected.image.src}
            alt={selected.vehicleType}
            className="wg-bus-summary-img"
          />
        </div>
      )}
    </div>
  );
}

function BookingTypeToggle({
  value, onChange,
}: {
  value: BookingType; onChange: (v: BookingType) => void;
}) {
  const options: { value: BookingType; label: string; sub: string }[] = [
    { value: "Instant Booking", label: "Instant Booking", sub: "With wayggo guaranteed" },
    { value: "Request a Quote", label: "Request a Quote", sub: "Get a custom proposal first" },
  ];
  return (
    <div className="wg-toggle-grid">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: active ? "2px solid #1A2744" : "2px solid #E5E7EB",
              background: active ? "#1A2744" : "white",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: active ? "#FDEA01" : "#1A2744" }}>
              {opt.label}
            </span>
            <span style={{ fontSize: "0.75rem", color: active ? "rgba(255,255,255,0.65)" : "#9CA3AF" }}>
              {opt.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BookingTypeNotice({ bookingType, capacity }: { bookingType: BookingType; capacity: number | "" }) {
  if (!bookingType) return null;

  if (bookingType === "Instant Booking") {
    const opt = typeof capacity === "number" ? busOptions.find((b) => b.capacity === capacity) : undefined;
    const deposit = opt ? Math.round(opt.pricePerDay * DEPOSIT_RATE) : null;
    return (
      <div style={{ padding: "0.9rem 1.1rem", borderRadius: 12, background: "rgba(253,234,1,0.15)", border: "1px solid rgba(253,234,1,0.5)" }}>
        <p style={{ fontSize: "0.8125rem", color: "#1A2744", fontWeight: 700, marginBottom: 4 }}>
          ⚡ Instant Booking — confirmed immediately
        </p>
        <p style={{ fontSize: "0.8125rem", color: "rgba(26,39,68,0.8)", lineHeight: 1.5 }}>
          {deposit
            ? <>A 20% bus fee deposit (~<strong>${deposit.toLocaleString()}</strong> based on the daily rate) is charged today to lock in your bus and driver.</>
            : <>A 20% bus fee deposit is charged today to lock in your bus and driver.</>}
          {" "}Exact totals are finalized once your full trip length is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0.9rem 1.1rem", borderRadius: 12, background: "#F9F7F2", border: "1px solid #EFEAE0" }}>
      <p style={{ fontSize: "0.8125rem", color: "#1A2744", fontWeight: 700, marginBottom: 4 }}>
        📋 Request a Quote — no payment today
      </p>
      <p style={{ fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.5 }}>
        Our operations team will confirm exact pricing based on your trip length and itinerary, then send a detailed proposal to your email within 24 hours. No card or payment is required to submit this request.
      </p>
    </div>
  );
}

export default function TourBusBookingForm({
  tourBusLabel,
}: {
  tourBusLabel?: string;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>({ groupTourBus: resolveTourBusLabel(tourBusLabel), ...blank });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;
  const stepLabels = ["Trip Basics", "Customer Details", "Bus Details"];

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
    const required = Number(data.passengerCount);
    if (typeof data.busCapacity === "number" && required > 0 && data.busCapacity < required) {
      setData((prev) => ({ ...prev, busCapacity: "" }));
    }
  }, [data.passengerCount]);

  const validate = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!data.tripType) e.tripType = "Please select a trip type";
      if (!data.pickupAddress.trim()) e.pickupAddress = "Pickup address is required";
      if (!data.pickupDateTime) e.pickupDateTime = "Pickup date & time is required";
    }
    if (s === 2) {
      if (!data.groupName.trim()) e.groupName = "Group name is required";
      if (!data.fullName.trim()) e.fullName = "Full name is required";
      if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email))
        e.email = "Valid email is required";
      if (!data.phone.trim()) e.phone = "Phone number is required";
    }
    if (s === 3) {
      if (!data.passengerCount.trim() || isNaN(Number(data.passengerCount)) || Number(data.passengerCount) < 1)
        e.passengerCount = "Valid passenger count is required";
      if (!data.busCapacity) e.busCapacity = "Please select a bus";
      if (!data.bookingType) e.bookingType = "Please choose how you'd like to proceed";
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
          Request Received!
        </h3>
        <p style={{ color: "#6B7280", marginBottom: "0.5rem" }}>
          Thanks, <strong>{data.fullName}</strong> — we've received your <strong>{data.tripType}</strong> request for the <strong>{data.groupTourBus}</strong> tour bus.
        </p>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "0.35rem" }}>
          Pickup at <strong>{data.pickupAddress}</strong> on <strong>{data.pickupDateTime?.toLocaleString()}</strong>.
        </p>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "0.35rem" }}>
          Bus: <strong>{data.busCapacity}-passenger</strong> for <strong>{data.passengerCount}</strong> travelers · <strong>{data.bookingType}</strong>.
        </p>
        <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "0.35rem" }}>
          We'll reach <strong>{data.groupName}</strong> at <strong>{data.email}</strong> within 24 hours.
        </p>
        {data.attachments.length > 0 && (
          <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
            {data.attachments.length} document{data.attachments.length > 1 ? "s" : ""} attached.
          </p>
        )}
        <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: 12, background: "#F9F7F2", color: "#6B7280", fontSize: "0.875rem" }}>
          Reference ID: <strong style={{ color: "#1A2744" }}>WG-{Date.now().toString(36).toUpperCase()}</strong>
        </div>
      </div>
    );
  }

  const progressPct = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 100;

  return (
    <div>
      <style>{`
        .wg-toggle-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .wg-bus-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.6rem;
        }
        .wg-bus-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .wg-bus-summary-img {
          width: 190px;
          height: 95px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .wg-nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .wg-nav-btn {
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .wg-bus-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 480px) {
          .wg-toggle-grid {
            grid-template-columns: 1fr;
          }
          .wg-bus-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .wg-bus-summary {
            flex-direction: column;
            align-items: flex-start;
          }
          .wg-bus-summary-img {
            width: 100%;
            max-width: 220px;
            height: auto;
            align-self: center;
          }
          .wg-nav-row {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .wg-nav-btn {
            width: 100%;
          }
        }
      `}</style>

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
                <span style={{ fontSize: "0.75rem", textAlign: "center", color: active ? "#1A2744" : "#9CA3AF", fontWeight: active ? 600 : 400 }}>
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
            Trip Basics
          </h3>
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Let's start with the essentials for your {data.groupTourBus} tour bus.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <Field label="Group Tour Bus" hint="Auto-filled based on the tour bus you're chooseing.">
              <LockedField value={data.groupTourBus} />
            </Field>
            <Field label="Trip Type *" error={errors.tripType}>
              <TripTypeToggle value={data.tripType} onChange={(v) => update("tripType", v)} />
            </Field>
            <Field label="Pickup Address *" error={errors.pickupAddress}>
              <Input
                value={data.pickupAddress}
                onChange={(v) => update("pickupAddress", v)}
                placeholder="e.g. Toronto Pearson Airport (YYZ) or your hotel name & address"
              />
            </Field>
            <Field label="Pickup Date & Time *" error={errors.pickupDateTime}>
              <DatePicker
                selected={data.pickupDateTime}
                onChange={(d: Date | null) => update("pickupDateTime", d)}
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Select pickup date & time"
                minDate={new Date()}
                customInput={<DateTimeInput />}
                popperClassName="wayggo-datepicker-popper"
                calendarClassName="wayggo-datepicker"
                wrapperClassName="w-full"
              />
            </Field>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Customer Details
          </h3>
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Tell us who to send the proposal to.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <Field label="Group Name *" error={errors.groupName}>
              <Input value={data.groupName} onChange={(v) => update("groupName", v)} placeholder="e.g. Smith Family Reunion, Sunrise Tours Group" />
            </Field>
            <Field label="Full Name *" error={errors.fullName}>
              <Input value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="Jane Smith" />
            </Field>
            <Field label="Email Address *" error={errors.email}>
              <Input value={data.email} onChange={(v) => update("email", v)} type="email" placeholder="you@example.com" />
            </Field>
            <Field label="Phone Number *" error={errors.phone}>
              <Input value={data.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+1 416 555 0123" />
            </Field>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
            Bus Details
          </h3>
          <p style={{ color: "#6B7280", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            Pick the bus that fits your group, then choose how you'd like to proceed.
          </p>
          <div style={{ display: "grid", gap: "1rem" }}>
            <Field label="No. of Passengers *" error={errors.passengerCount}>
              <Input
                value={data.passengerCount}
                onChange={(v) => update("passengerCount", v)}
                type="number"
                min="1"
                placeholder="e.g. 32"
              />
            </Field>

            <Field
              label="Select Bus Type *"
              error={errors.busCapacity}
            >
              <BusSizeSelector
                value={data.busCapacity}
                onChange={(v) => update("busCapacity", v)}
                minRequired={Number(data.passengerCount) || 0}
              />
            </Field>

            <Field label="Additional Info - Brief Itinerary, etc.">
              <Textarea
                value={data.additionalInfo}
                onChange={(v) => update("additionalInfo", v)}
                placeholder="Anything else we should know — accessibility needs, luggage, special stops..."
                rows={3}
              />
            </Field>

            <Field label="Attach Detailed Itinerary" hint="Optional — share an itinerary PDF, permit, or reference document">
              <FileUpload files={data.attachments} onChange={(files) => update("attachments", files)} />
            </Field>

            <Field label="How Would You Like to Proceed? *" error={errors.bookingType}>
              <BookingTypeToggle value={data.bookingType} onChange={(v) => update("bookingType", v)} />
            </Field>

            <BookingTypeNotice bookingType={data.bookingType} capacity={data.busCapacity} />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="wg-nav-row" style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F3F4F6" }}>
        <button
          className="wg-nav-btn"
          onClick={back}
          disabled={step === 1}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "0.625rem 1.25rem", borderRadius: 99,
            border: "2px solid #1A2744", background: "transparent",
            color: "#1A2744", fontSize: "0.875rem", fontWeight: 700, cursor: step === 1 ? "not-allowed" : "pointer",
            opacity: step === 1 ? 0.3 : 1, transition: "opacity 0.2s",
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        {step < totalSteps ? (
          <button
            className="wg-nav-btn"
            onClick={next}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "0.625rem 1.75rem", borderRadius: 99,
              border: "none", background: "#FDEA01",
              color: "#1A2744", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
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
            className="wg-nav-btn"
            onClick={submit}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "0.625rem 1.75rem", borderRadius: 99,
              border: "none", background: "#1A2744",
              color: "white", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
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

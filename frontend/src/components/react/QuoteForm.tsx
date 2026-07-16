import { useState } from "react";
import { Check, Send } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  message: string;
};

const blank: FormData = {
  name: "", email: "", phone: "", agencyName: "", message: "",
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
  value, onChange, type = "text", placeholder,
}: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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

export default function QuoteForm() {
  const [data, setData] = useState<FormData>(blank);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = "Your name is required";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email))
      e.email = "Valid email is required";
    if (!data.message.trim()) e.message = "Please tell us about your request";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

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
          Message Sent!
        </h3>
        <p style={{ color: "#6B7280", marginBottom: "0.5rem" }}>
          Thank you, <strong>{data.name}</strong>.
        </p>
        <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
          Our operations team will respond within <strong>24 hours</strong> to <strong>{data.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <h3 style={{ color: "#1A2744", fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.25rem" }}>
        Send Us a Message
      </h3>
      <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
        Tell us about your group and trip, and we'll get back to you within 24 hours.
      </p>
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Your Full Name *" error={errors.name}>
            <Input value={data.name} onChange={(v) => update("name", v)} placeholder="Jane Smith" />
          </Field>
          <Field label="Email *" error={errors.email}>
            <Input value={data.email} onChange={(v) => update("email", v)} type="email" placeholder="you@agency.com" />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Field label="Phone / WhatsApp">
            <Input value={data.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+44 20 7946 0123" />
          </Field>
          <Field label="Agency / Company Name">
            <Input value={data.agencyName} onChange={(v) => update("agencyName", v)} placeholder="e.g. Sunrise Tours Ltd." />
          </Field>
        </div>
        <Field label="Message *" error={errors.message}>
          <Textarea
            value={data.message}
            onChange={(v) => update("message", v)}
            placeholder="Tell us about your group size, cities, travel dates, and vehicle needs..."
            rows={5}
          />
        </Field>
      </div>

      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #F3F4F6" }}>
        <button
          type="submit"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%",
            padding: "0.8rem 1.75rem", borderRadius: 99,
            border: "none", background: "#1A2744",
            color: "white", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer",
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
          Send Message
          <Send size={16} strokeWidth={2} fill="currentColor" />
        </button>
      </div>
    </form>
  );
}

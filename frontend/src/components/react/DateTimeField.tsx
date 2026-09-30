import { forwardRef, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

// Standalone date + time picker for plain (non-React) forms. Same
// react-datepicker setup and brand theme as TourBusBookingForm; the value is
// mirrored into a hidden input so the surrounding <form> can read it.
// A field can follow another one's minimum (return after pickup) via `minFrom`.

const CHANGE_EVENT = "datetimefield:change";

type ChangeDetail = { name: string; value: Date | null };

type Props = {
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minFrom?: string;
};

const DateTimeInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ id, value, onClick, placeholder }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        id={id}
        readOnly
        value={value as string}
        onClick={onClick}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: "block",
          width: "100%",
          padding: "0.7rem 2.5rem 0.7rem 0.875rem",
          border: "2px solid",
          borderColor: focused ? "#1A2744" : "#E5E7EB",
          borderRadius: 10,
          fontSize: "0.9375rem",
          fontFamily: "inherit",
          color: "#0D0D0D",
          background: "white",
          outline: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          boxShadow: focused ? "0 0 0 3px rgba(26,39,68,0.08)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      <Calendar
        size={18}
        color="#1A2744"
        strokeWidth={1.4}
        style={{ position: "absolute", top: "50%", right: "0.875rem", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
});
DateTimeInput.displayName = "DateTimeInput";

export default function DateTimeField({ id, name, placeholder, required, minFrom }: Props) {
  const [selected, setSelected] = useState<Date | null>(null);
  const [minDate, setMinDate] = useState<Date>(() => new Date());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!minFrom) return;
    const onPartnerChange = (e: Event) => {
      const { name: from, value } = (e as CustomEvent<ChangeDetail>).detail;
      if (from !== minFrom) return;
      const min = value ?? new Date();
      setMinDate(min);
      setSelected((cur) => (cur && cur < min ? null : cur));
    };
    window.addEventListener(CHANGE_EVENT, onPartnerChange);
    return () => window.removeEventListener(CHANGE_EVENT, onPartnerChange);
  }, [minFrom]);

  const onChange = (d: Date | null) => {
    setSelected(d);
    wrapRef.current?.removeAttribute("data-invalid");
    window.dispatchEvent(new CustomEvent<ChangeDetail>(CHANGE_EVENT, { detail: { name, value: d } }));
  };

  return (
    <div ref={wrapRef} data-dtf data-required={required ? "" : undefined}>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeIntervals={15}
        dateFormat="MMM d, yyyy h:mm aa"
        placeholderText={placeholder}
        minDate={minDate}
        customInput={<DateTimeInput />}
        wrapperClassName="dtf-wrapper"
        popperClassName="wayggo-datepicker-popper"
        calendarClassName="wayggo-datepicker"
      />
      <input type="hidden" name={name} value={selected ? selected.toISOString() : ""} />
    </div>
  );
}

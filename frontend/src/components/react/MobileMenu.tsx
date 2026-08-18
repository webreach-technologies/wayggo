import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { withBase } from "../../lib/url";

const tourLinks = [
  { href: "/services/sightseeing", label: "Sightseeing & City Tours" },
  { href: "/services/educational", label: "Educational & Student Tours" },
  { href: "/services/religious", label: "Religious & Pilgrimage Groups" },
  { href: "/services/corporate", label: "Corporate & Convention Travel" },
  { href: "/services/sports", label: "Sports Teams & Fan Groups" },
  { href: "/services/weddings", label: "Wedding & Special Events" },
];

export default function MobileMenu() {
  const [currentPath, setCurrentPath] = useState("");
  const [open, setOpen] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);
    if (path.startsWith(withBase("/services"))) {
      setToursOpen(true);
    }
  }, []);

  const onToursPage = currentPath.startsWith(withBase("/services"));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span className="block w-6 h-0.5 bg-white rounded-full" />
        <span className="block w-6 h-0.5 bg-white rounded-full" />
        <span className="block w-4 h-0.5 bg-white rounded-full" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#0D1B3E" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-end px-6 py-4 border-b border-white/10">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/fleet", label: "Fleet & Capabilities" },
              { href: "/tour-bus", label: "Tour Bus" },
              { href: "/network", label: "Our Network" },
            ].map((link) => {
              const isActive = currentPath === withBase(link.href);
              return (
                <a
                  key={link.href}
                  href={withBase(link.href)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? "bg-white/10 font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
        
                    color: isActive ? "#FDEA01" : undefined,
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Tours dropdown */}
            <div>
              <button
                onClick={() => setToursOpen(!toursOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  onToursPage
                    ? "bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                style={{
      
                  color: onToursPage ? "#FDEA01" : undefined,
                }}
              >
                <span>Services</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${toursOpen ? "rotate-180" : ""}`}
                />
              </button>
              {toursOpen && (
                <div className="mt-1 ml-4 space-y-1">
                  {tourLinks.map((link) => {
                    const isTourActive = currentPath === withBase(link.href);
                    return (
                      <a
                        key={link.href}
                        href={withBase(link.href)}
                        className={`flex items-center px-4 py-2.5 rounded-xl transition-all text-sm ${
                          isTourActive
                            ? "bg-white/10 font-semibold"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                        style={{
              
                          color: isTourActive ? "#FDEA01" : undefined,
                        }}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: isTourActive ? "#FDEA01" : "rgba(255,255,255,0.4)" }}
                        />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {[
              { href: "/about", label: "About Wayggo" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => {
              const isActive = currentPath === withBase(link.href);
              return (
                <a
                  key={link.href}
                  href={withBase(link.href)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? "bg-white/10 font-semibold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    color: isActive ? "#FDEA01" : undefined,
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Bottom CTAs */}
          <div className="px-4 pb-6 space-y-3 border-t border-white/10 pt-5">
            <a
              href={withBase("/portal")}
              className="flex items-center justify-center px-4 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              style={{}}
              onClick={() => setOpen(false)}
            >
              Partner Login
            </a>
            <a
              href={withBase("/contact")}
              className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "#FDEA01", color: "#1A2744",}}
              onClick={() => setOpen(false)}
            >
              Request a Quote
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

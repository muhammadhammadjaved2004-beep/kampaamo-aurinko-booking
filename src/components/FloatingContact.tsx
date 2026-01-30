import { Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FloatingContact() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded buttons */}
      <div className={cn(
        "flex flex-col gap-3 transition-all duration-300",
        isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        <a
          href="tel:+358975721117"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-gold hover:scale-105 transition-transform"
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">Soita</span>
        </a>
        <a
          href="https://wa.me/358975721117"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-elevated hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">WhatsApp</span>
        </a>
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-gold transition-all duration-300 hover:scale-110",
          isExpanded ? "bg-foreground text-background rotate-45" : "bg-gradient-gold text-primary-foreground"
        )}
        aria-label="Toggle contact options"
      >
        <Phone className="w-6 h-6" />
      </button>
    </div>
  );
}

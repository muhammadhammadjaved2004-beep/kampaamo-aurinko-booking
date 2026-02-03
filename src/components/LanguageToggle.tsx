import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fi" ? "en" : "fi");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium uppercase">{language === "fi" ? "EN" : "FI"}</span>
    </Button>
  );
}

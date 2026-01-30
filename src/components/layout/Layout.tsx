import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingContact } from "@/components/FloatingContact";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}

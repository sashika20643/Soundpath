import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageWrapperProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function PageWrapper({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  className = "" 
}: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavbar && <Navbar />}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
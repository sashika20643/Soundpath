import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Music, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { APP_CONFIG } from "@shared/config";
import { useAuth } from "@/contexts/auth-context";
import logo from "@/assets/symbolLogo.svg";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu:', !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu');
    setIsMobileMenuOpen(false);
  };

  const handleBackdropClick = () => {
    console.log('Closing mobile menu via backdrop click');
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--color-warm-white)",
        color: "var(--color-charcoal)",
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="relative z-50 border-b"
        style={{
          backgroundColor: "var(--color-warm-white)",
          borderColor: "var(--color-light-gray)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity duration-300">
                <img src={logo} alt="Soundpath Logo" className="h-10 w-auto" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg" style={{ color: "var(--color-charcoal)" }}>Sonic Paths</span>
                  <span className="text-xs hidden sm:block" style={{ color: "var(--color-mid-gray)" }}>
                    {APP_CONFIG.tagline}
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Navigation Content */}
            <div className="md:hidden flex items-center gap-3">
              {/* Quick Stats or Info */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1" style={{ color: "var(--color-mid-gray)" }}>
                  <Music className="w-4 h-4" />
                  <span className="hidden xs:inline">Events</span>
                </div>
                <div className="flex items-center gap-1" style={{ color: "var(--color-mid-gray)" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden xs:inline">Map</span>
                </div>
              </div>
              
              {/* Mobile Menu Button - Aligned Right */}
              <button
                onClick={toggleMobileMenu}
                className="flex items-center justify-center w-12 h-12 rounded-xl border shadow-sm transition-all duration-300"
                style={{
                  borderColor: "var(--color-light-gray)",
                  color: "var(--color-charcoal)",
                  backgroundColor: "var(--color-soft-beige)",
                }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8 text-sm">
                <Link href="/">
                  <span
                    className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${location === "/" ? "font-medium" : ""}`}
                    style={{
                      color:
                        location === "/"
                          ? "var(--color-charcoal)"
                          : "var(--color-dark-gray)",
                    }}
                  >
                    Home
                  </span>
                </Link>
                <Link href="/events">
                  <span
                    className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${location === "/events" ? "font-medium" : ""}`}
                    style={{
                      color:
                        location === "/events"
                          ? "var(--color-charcoal)"
                          : "var(--color-dark-gray)",
                    }}
                  >
                    Events
                  </span>
                </Link>
                <Link href="/map">
                  <span
                    className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${location === "/map" ? "font-medium" : ""}`}
                    style={{
                      color:
                        location === "/map"
                          ? "var(--color-charcoal)"
                          : "var(--color-dark-gray)",
                    }}
                  >
                    Map
                  </span>
                </Link>
                {isAdmin && (
                  <Link href="/dashboards/events">
                    <span
                      className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${location === "/dashboards/events" ? "font-medium" : ""}`}
                      style={{
                        color:
                          location === "/dashboards"
                            ? "var(--color-charcoal)"
                            : "var(--color-dark-gray)",
                      }}
                    >
                      Dashboard
                    </span>
                  </Link>
                )}
                <Link href="/contact">
                  <span
                    className={`hover:opacity-70 transition-opacity duration-300 cursor-pointer ${location === "/contact" ? "font-medium" : ""}`}
                    style={{
                      color:
                        location === "/contact"
                          ? "var(--color-charcoal)"
                          : "var(--color-dark-gray)",
                    }}
                  >
                    Contact
                  </span>
                </Link>
              </div>

              {/* User Section */}
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{
                        borderColor: "var(--color-light-gray)",
                        backgroundColor: "transparent",
                      }}
                    >
                      <User
                        className="w-4 h-4"
                        style={{ color: "var(--color-mid-gray)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-dark-gray)" }}
                      >
                        Admin
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:shadow-sm"
                      style={{
                        borderColor: "var(--color-light-gray)",
                        color: "var(--color-charcoal)",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-soft-beige)";
                        e.currentTarget.style.borderColor =
                          "var(--color-mid-gray)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor =
                          "var(--color-light-gray)";
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Invisible backdrop for click-outside */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-20" 
            onClick={handleBackdropClick}
          />
          
          {/* Menu content */}
          <div 
            className={`relative z-10 h-full transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            style={{
              backgroundColor: "var(--color-warm-white)",
            }}
          >
            <div className="flex flex-col h-full">
          {/* Full Screen Menu Header */}
          <div className="p-6 pb-8" style={{ backgroundColor: "var(--color-soft-beige)" }}>
            <div className="flex items-center justify-between mb-6">
              <Link href="/" onClick={closeMobileMenu}>
                <div className="flex items-center gap-4">
                  <img src={logo} alt="Sonic Paths Logo" className="h-12 w-auto" />
                  <div>
                    <span className="text-2xl font-bold" style={{ color: "var(--color-charcoal)" }}>
                      {APP_CONFIG.name}
                    </span>
                    <p className="text-sm mt-1" style={{ color: "var(--color-mid-gray)" }}>
                      {APP_CONFIG.tagline}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ 
                  color: "var(--color-mid-gray)",
                  backgroundColor: "var(--color-warm-white)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Full Screen Menu Navigation */}
          <nav className="flex-1 px-6 py-4">
            <div className="grid gap-4 max-w-md mx-auto">
              <Link href="/" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-5 px-6 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    location === "/" ? "font-semibold shadow-lg" : "font-medium"
                  }`}
                  style={{
                    backgroundColor: location === "/" ? "var(--color-soft-beige)" : "var(--color-warm-white)",
                    color: location === "/" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                    border: "2px solid",
                    borderColor: location === "/" ? "var(--color-mid-gray)" : "var(--color-light-gray)"
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: location === "/" ? "var(--color-warm-white)" : "var(--color-soft-beige)"
                  }}>
                    <Home className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold">Home</span>
                    <p className="text-sm mt-1 opacity-80">Discover music experiences worldwide</p>
                  </div>
                </div>
              </Link>

              <Link href="/events" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-5 px-6 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    location === "/events" ? "font-semibold shadow-lg" : "font-medium"
                  }`}
                  style={{
                    backgroundColor: location === "/events" ? "var(--color-soft-beige)" : "var(--color-warm-white)",
                    color: location === "/events" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                    border: "2px solid",
                    borderColor: location === "/events" ? "var(--color-mid-gray)" : "var(--color-light-gray)"
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: location === "/events" ? "var(--color-warm-white)" : "var(--color-soft-beige)"
                  }}>
                    <Music className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold">Events</span>
                    <p className="text-sm mt-1 opacity-80">Browse all amazing music events</p>
                  </div>
                </div>
              </Link>

              <Link href="/map" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-5 px-6 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    location === "/map" ? "font-semibold shadow-lg" : "font-medium"
                  }`}
                  style={{
                    backgroundColor: location === "/map" ? "var(--color-soft-beige)" : "var(--color-warm-white)",
                    color: location === "/map" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                    border: "2px solid",
                    borderColor: location === "/map" ? "var(--color-mid-gray)" : "var(--color-light-gray)"
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: location === "/map" ? "var(--color-warm-white)" : "var(--color-soft-beige)"
                  }}>
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold">Map</span>
                    <p className="text-sm mt-1 opacity-80">Explore global music locations</p>
                  </div>
                </div>
              </Link>

              {isAdmin && (
                <Link href="/dashboards/events" onClick={closeMobileMenu}>
                  <div
                    className={`flex items-center gap-5 px-6 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      location.startsWith("/dashboards") ? "font-semibold shadow-lg" : "font-medium"
                    }`}
                    style={{
                      backgroundColor: location.startsWith("/dashboards") ? "var(--color-soft-beige)" : "var(--color-warm-white)",
                      color: location.startsWith("/dashboards") ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                      border: "2px solid",
                      borderColor: location.startsWith("/dashboards") ? "var(--color-mid-gray)" : "var(--color-light-gray)"
                    }}
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                      backgroundColor: location.startsWith("/dashboards") ? "var(--color-warm-white)" : "var(--color-soft-beige)"
                    }}>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-semibold">Dashboard</span>
                      <p className="text-sm mt-1 opacity-80">Manage events & content</p>
                    </div>
                  </div>
                </Link>
              )}

              <Link href="/contact" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-5 px-6 py-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    location === "/contact" ? "font-semibold shadow-lg" : "font-medium"
                  }`}
                  style={{
                    backgroundColor: location === "/contact" ? "var(--color-soft-beige)" : "var(--color-warm-white)",
                    color: location === "/contact" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                    border: "2px solid",
                    borderColor: location === "/contact" ? "var(--color-mid-gray)" : "var(--color-light-gray)"
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: location === "/contact" ? "var(--color-warm-white)" : "var(--color-soft-beige)"
                  }}>
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold">Contact</span>
                    <p className="text-sm mt-1 opacity-80">Get in touch with our team</p>
                  </div>
                </div>
              </Link>
            </div>
          </nav>

          {/* Full Screen Menu Footer */}
          <div className="px-6 py-8 mt-auto" style={{ backgroundColor: "var(--color-soft-beige)" }}>
            {isAdmin ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div
                  className="flex items-center gap-5 px-6 py-5 rounded-2xl border-2 shadow-lg"
                  style={{
                    borderColor: "var(--color-mid-gray)",
                    backgroundColor: "var(--color-warm-white)",
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: "var(--color-soft-beige)"
                  }}>
                    <User className="w-7 h-7" style={{ color: "var(--color-mid-gray)" }} />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg" style={{ color: "var(--color-charcoal)" }}>
                      Admin Access
                    </span>
                    <p className="text-sm mt-1 opacity-80">Administrative privileges</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    color: "var(--color-charcoal)",
                    backgroundColor: "var(--color-warm-white)",
                  }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl" style={{
                    backgroundColor: "var(--color-soft-beige)"
                  }}>
                    <LogOut className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-lg">Logout</span>
                    <p className="text-sm mt-1 opacity-80">Sign out of your account</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 max-w-sm mx-auto">
                <div className="mb-4">
                  <span className="text-4xl">🎵</span>
                </div>
                <p className="text-lg font-medium mb-2" style={{ color: "var(--color-charcoal)" }}>
                  Thanks for exploring {APP_CONFIG.name}!
                </p>
                <p className="text-base opacity-80" style={{ color: "var(--color-dark-gray)" }}>
                  Discover amazing music experiences worldwide
                </p>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="section-padding"
        style={{
          backgroundColor: "var(--color-charcoal)",
          color: "var(--color-warm-white)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <img src={logo} alt="Soundpath Logo" className="h-20 w-auto" />
            </div>
            <p
              className="text-editorial max-w-lg mx-auto mb-12"
              style={{ color: "var(--color-mid-gray)" }}
            >
              Discovering breathtaking musical destinations worldwide. Where
              music and place create something extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center md:text-left">
            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Explore
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    All Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Map
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Discover
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#featured"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Featured Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#discoveries"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Latest Discoveries
                  </a>
                </li>
                <li>
                  <a
                    href="#hidden-gems"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Hidden Gems
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Get Involved
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#submit"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Submit Discovery
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#hero"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Back to Top
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t pt-8 text-center"
            style={{ borderColor: "var(--color-dark-gray)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-mid-gray)" }}>
              © 2025 {APP_CONFIG.name}. Crafted for music lovers and wanderers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

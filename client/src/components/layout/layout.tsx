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
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}

            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity duration-300">
                <img src={logo} alt="Soundpath Logo" className="h-10 w-auto" />
                Sonicpaths
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300"
              style={{
                borderColor: "var(--color-light-gray)",
                color: "var(--color-charcoal)",
                backgroundColor: "transparent",
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-8 text-sm">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--color-warm-white)",
          borderRight: "1px solid var(--color-light-gray)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--color-light-gray)" }}>
            <Link href="/" onClick={closeMobileMenu}>
              <div className="flex items-center gap-2">
                <img src={logo} alt="Sonic Paths Logo" className="h-8 w-auto" />
                <span className="text-lg font-medium" style={{ color: "var(--color-charcoal)" }}>
                  {APP_CONFIG.name}
                </span>
              </div>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ color: "var(--color-mid-gray)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex-1 px-6 py-8">
            <div className="space-y-6">
              <Link href="/" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location === "/" ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: location === "/" ? "var(--color-soft-beige)" : "transparent",
                    color: location === "/" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                  }}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </div>
              </Link>

              <Link href="/events" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location === "/events" ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: location === "/events" ? "var(--color-soft-beige)" : "transparent",
                    color: location === "/events" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                  }}
                >
                  <Music className="w-5 h-5" />
                  <span>Events</span>
                </div>
              </Link>

              <Link href="/map" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location === "/map" ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: location === "/map" ? "var(--color-soft-beige)" : "transparent",
                    color: location === "/map" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Map</span>
                </div>
              </Link>

              {isAdmin && (
                <Link href="/dashboards/events" onClick={closeMobileMenu}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      location.startsWith("/dashboards") ? "font-medium" : ""
                    }`}
                    style={{
                      backgroundColor: location.startsWith("/dashboards") ? "var(--color-soft-beige)" : "transparent",
                      color: location.startsWith("/dashboards") ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                </Link>
              )}

              <Link href="/contact" onClick={closeMobileMenu}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    location === "/contact" ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: location === "/contact" ? "var(--color-soft-beige)" : "transparent",
                    color: location === "/contact" ? "var(--color-charcoal)" : "var(--color-dark-gray)",
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Contact</span>
                </div>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Footer */}
          <div className="px-6 py-6 border-t" style={{ borderColor: "var(--color-light-gray)" }}>
            {isAdmin ? (
              <div className="space-y-4">
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    backgroundColor: "var(--color-soft-beige)",
                  }}
                >
                  <User className="w-5 h-5" style={{ color: "var(--color-mid-gray)" }} />
                  <span className="font-medium" style={{ color: "var(--color-charcoal)" }}>
                    Admin
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    color: "var(--color-charcoal)",
                    backgroundColor: "transparent",
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/admin-login" onClick={closeMobileMenu}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300"
                  style={{
                    borderColor: "var(--color-light-gray)",
                    color: "var(--color-charcoal)",
                    backgroundColor: "transparent",
                  }}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Admin Login</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

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

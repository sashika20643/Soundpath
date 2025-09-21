import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Music, User, LogIn, LogOut } from "lucide-react";
import { APP_CONFIG } from "@shared/config";
import { useAuth } from "@/contexts/auth-context";
import logo from "@/assets/symbolLogo.svg";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { isAdmin, logout } = useAuth();

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
                  <p>Guest</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
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
                Connect
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/contact"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    Contact Us
                  </Link>
                </li>
                {!isAdmin && (
                  <li>
                    <Link
                      href="/admin-login"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Admin Login
                    </Link>
                  </li>
                )}
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
                <li>
                  <a
                    href="#map"
                    className="text-sm hover:opacity-70 transition-opacity duration-300"
                    style={{ color: "var(--color-mid-gray)" }}
                  >
                    World Map
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-sans text-sm font-medium uppercase tracking-wide mb-4"
                style={{ color: "var(--color-warm-white)" }}
              >
                Contribute
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
                {isAdmin && (
                  <li>
                    <Link
                      href="/dashboards/events"
                      className="text-sm hover:opacity-70 transition-opacity duration-300"
                      style={{ color: "var(--color-mid-gray)" }}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
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

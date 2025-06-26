import { Link, useLocation } from "wouter";
import { FaCubes, FaTags, FaUsers, FaCalendarAlt, FaChartBar, FaCog } from "react-icons/fa";

export function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "Management",
      items: [
        { icon: FaTags, label: "Categories", href: "/", active: location === "/" },
        { icon: FaUsers, label: "Users", href: "/users", active: location === "/users" },
        { icon: FaCalendarAlt, label: "Events", href: "/events", active: location === "/events" },
        { icon: FaChartBar, label: "Analytics", href: "/analytics", active: location === "/analytics" },
      ],
    },
    {
      title: "Settings",
      items: [
        { icon: FaCog, label: "Configuration", href: "/settings", active: location === "/settings" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          <FaCubes className="text-primary mr-2" />
          Admin Dashboard
        </h1>
      </div>
      
      <nav className="mt-6">
        {navigationItems.map((section) => (
          <div key={section.title} className="px-3 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </p>
            {section.items.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                      item.active
                        ? "text-white bg-primary"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="mr-3 w-4 h-4" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

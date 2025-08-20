import { Link, useLocation } from "wouter";
import {
  FaCubes,
  FaTags,
  FaUsers,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaCheckCircle,
} from "react-icons/fa";

export function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "Management",
      items: [
        {
          icon: FaChartBar,
          label: "Overview",
          href: "/dashboards",
          active: location === "/dashboards",
        },
        {
          icon: FaCalendarAlt,
          label: "Events",
          href: "/dashboards/events",
          active: location === "/dashboards/events",
        },
        {
          icon: FaCheckCircle,
          label: "Event Approvals",
          href: "/dashboards/approvals",
          active: location === "/admin/approvals",
        },
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
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors cursor-pointer ${
                      item.active
                        ? "text-white bg-primary"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="mr-3 w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Visit Website Link */}
      <div className="mt-auto p-6 border-t border-gray-200">
        <Link href="/">
          <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <svg className="mr-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Website
          </div>
        </Link>
      </div>
    </aside>
  );
}

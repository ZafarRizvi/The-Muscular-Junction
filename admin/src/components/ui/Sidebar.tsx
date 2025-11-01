"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Stethoscope,
  UserCog,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

// Navigation item structure
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

// All sidebar navigation links
const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Receptionists",
    href: "/dashboard/receptionists",
    icon: UserCog,
    section: "Staff",
  },
  {
    label: "Doctors",
    href: "/dashboard/doctors",
    icon: Stethoscope,
    section: "Staff",
  },
  {
    label: "Patients",
    href: "/dashboard/patients",
    icon: Users,
    section: "Staff",
  },
  {
    label: "Sessions",
    href: "/dashboard/sessions",
    icon: Calendar,
    section: "Records",
  },
  {
    label: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: FileText,
    section: "Records",
  },
  {
    label: "Salary",
    href: "/dashboard/salary",
    icon: DollarSign,
    section: "Records",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    section: "System",
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Check if current route is active
  const isActivePath = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Group items by their section
  const sections = navigationItems.reduce((acc, item) => {
    const section = item.section || "General";
    (acc[section] = acc[section] || []).push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-(--navbar-height,4rem) h-[calc(100vh-var(--navbar-height,4rem))]`}
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {!isCollapsed && (
          <span className="text-lg font-semibold text-purple-700 tracking-tight">
            TMJ Clinic
          </span>
        )}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            {!isCollapsed && section !== "General" && (
              <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider px-3 mb-2">
                {section}
              </div>
            )}
            <ul className="space-y-1">
              {items.map(({ href, label, icon: Icon }) => {
                const isActive = isActivePath(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 text-purple-500 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive
                            ? "text-purple-500"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      {!isCollapsed && <span className="text-sm">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4 mt-auto text-center text-xs text-gray-500">
          © 2025 The Muscular Junction
        </div>
      )}
    </aside>
  );
}

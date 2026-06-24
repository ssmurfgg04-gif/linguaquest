import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Mic, Gamepad2, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/ujuzispeak", label: "Speak", icon: Mic },
  { to: "/games/match", label: "Play", icon: Gamepad2 },
  { to: "/dashboard", label: "Me", icon: User },
];

export function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav-bar md:hidden">
      <div className="flex items-center justify-around px-2 pt-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="nav-icon h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
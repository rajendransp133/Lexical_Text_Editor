import { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import DigiAxLogo from "../../assets/DigiAxLogo.svg";

import DashboardIcon from "../../assets/DashboardIcon.svg";
import QuestionPaperIcon from "../../assets/QuestionPaperIcon.svg";
import HelpIcon from "../../assets/HelpIcon.svg";
import DashboardIconwhite from "../../assets/DashboardIcon2.svg";
import QuestionPaperIconwhite from "../../assets/QuestionPaperIcon2.svg";
import HelpIconwhite from "../../assets/HelpIcon2.svg";

const navItems: NavbarItem[] = [
  {
    path: "/",
    label: "Dashboard",
    whiteIcon: (
      <img src={DashboardIconwhite} alt="Dashboard" className="w-6 h-6" />
    ),
    blackIcon: <img src={DashboardIcon} alt="Dashboard" className="w-6 h-6" />,
  },
  {
    path: "/questionpaper",
    label: "QuestionPaper",
    whiteIcon: (
      <img
        src={QuestionPaperIconwhite}
        alt="Question Paper"
        className="w-6 h-6"
      />
    ),
    blackIcon: (
      <img src={QuestionPaperIcon} alt="Question Paper" className="w-6 h-6" />
    ),
  },
  {
    path: "/helpdesk",
    label: "Helpdesk",
    whiteIcon: <img src={HelpIconwhite} alt="Help" className="w-6 h-6" />,
    blackIcon: <img src={HelpIcon} alt="Help" className="w-6 h-6" />,
  },
];

type NavbarItem = {
  path: string;
  label: string;
  whiteIcon: React.ReactNode;
  blackIcon: React.ReactNode;
};

import UserDropdown from "./NavbarDropdown";

const colorMap = {
  sme: "#052C54",
};

const Navbar = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdown, setDropdown] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdown && !target.closest(".dropdown-container")) {
        setDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdown]);

  return (
    <>
      <header
        className={
          "top-0 z-40 flex justify-between bg-primary-gray-light p-7.5 transition-all duration-300"
        }
      >
        <div
          className="relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-md"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <img src={DigiAxLogo} alt="DigiAx Logo" className="h-8" />
        </div>

        {/* Navigation container with flex layout */}
        <nav className="flex gap-2">
          {/* Render each navigation item with dynamic styling based on state */}
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => {
                console.log(item.path);
              }}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
              className={`animate-slideInFromTop relative flex transform cursor-pointer items-center justify-center overflow-hidden rounded-custom-30 transition-all duration-300 ease-in-out hover:scale-105 ${
                location.pathname === item.path
                  ? "bg-secondary-blue shadow-lg shadow-secondary-blue/25" // Active state: blue background
                  : "hover:shadow-gray bg-white hover:shadow-lg" // Inactive state: white background with hover effects
              }`}
            >
              <div className="relative z-10">
                {/* Active state: Show white icon and label with blue background */}
                {location.pathname === item.path &&
                  location.pathname === item.path && (
                    <div className="flex items-center justify-center gap-2 px-6">
                      <div>{item.whiteIcon}</div>
                      <p className="text-2xl font-light text-white">
                        {item.label}
                      </p>
                    </div>
                  )}
                {/* Hovered state: Show black icon and label (not active) */}
                {hovered === item.path && location.pathname !== item.path && (
                  <div className="flex items-center justify-center gap-2 px-6 hover:cursor-pointer">
                    <div>{item.blackIcon}</div>
                    <p className="text-2xl font-light text-black">
                      {item.label}
                    </p>
                  </div>
                )}
                {/* Default state: Show only black icon */}
                {hovered !== item.path && location.pathname !== item.path && (
                  <div className="p-4">
                    <div>{item.blackIcon}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        <section className="dropdown-container relative flex flex-col items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="hover:shadow-secondary/30 flex h-15 w-15 items-center justify-center rounded-custom-30 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg bg-secondary-blue">
              <p className="text-3xl font-medium text-primary-gray-light">
                {/* {user?.name?.charAt(0)} */}R
              </p>
            </div>
            <MdKeyboardArrowDown
              className={`transition-transform duration-300 hover:scale-110 hover:cursor-pointer ${
                dropdown ? "rotate-180" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setDropdown(!dropdown);
              }}
            />
          </div>
          <UserDropdown
            isOpen={dropdown}
            onClose={() => setDropdown(false)}
            userDataColor={colorMap["sme"] || "sme"}
            userData={{
              name: "Rajesh",
              role: "sme",
            }}
          />
        </section>
      </header>
    </>
  );
};

export default Navbar;

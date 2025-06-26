import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, HardDrive, Users, LogOut } from "lucide-react";
import Logo from "../assets/logo.png";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const id_teknisi = localStorage.getItem("id");

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const checkExpiration = () => {
      const now = new Date().getTime();
      const expired = localStorage.getItem("id_expired");

      if (expired && now > parseInt(expired)) {
        localStorage.removeItem("id");
        localStorage.removeItem("id_expired");
        navigate("/"); 
      }
    };

    checkExpiration();

    const interval = setInterval(() => {
      checkExpiration(); 
    }, 5000);

    AOS.init({ duration: 700, once: true });

    return () => clearInterval(interval); 
  }, []);

  return (
    <>
      <header className="md:hidden flex justify-between items-center bg-white p-4 shadow fixed top-0 w-full z-50">
        <h1 className="text-lg font-semibold">PLN ICON PLUS</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      <aside
        className={`
          fixed top-12 left-0 z-40 w-full md:relative md:top-0
          md:w-64 bg-white p-4 shadow-md md:shadow-none
          transform transition-transform duration-500 ease-in-out
          ${sidebarOpen ? "translate-y-0 opacity-100" : "hidden"}
          md:block
        `}
      >
        <div className="mb-6 border-b border-black">
          <img src={Logo} alt="" width={120} />
        </div>
        <ul className="space-y-5">
            <li
                onClick={() => {
                    navigate(`/dashboard`);
                    setSidebarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer
                    ${
                    isActive("/dashboard")
                        ? "bg-gray-100 border-l-4 border-blue-600 text-blue-700 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                data-aos="fade-right"
                data-aos-delay={150}
                >
                <LayoutDashboard size={18} />
                <span>Beranda</span>
            </li>

            {/* <li
                onClick={() => {
                    navigate("/devices");
                    setSidebarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer
                    ${
                    isActive("/devices")
                        ? "bg-gray-100 border-l-4 border-blue-600 text-blue-700 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                data-aos="fade-right"
                data-aos-delay={200}
                >
                <HardDrive size={18} />
                <span>Perangkat</span>
            </li> */}
            
            <li
                onClick={() => {
                    navigate("/teams");
                    setSidebarOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer
                    ${
                    isActive("/teams")
                        ? "bg-gray-100 border-l-4 border-blue-600 text-blue-700 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                data-aos="fade-right"
                data-aos-delay={250}
                >
                <Users size={18} />
                <span>Tim</span>
            </li>

            <li className="text-gray-600 hover:text-black cursor-pointer">
                <a
                href="#"
                className="group sm:hidden relative flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-all duration-200"
                >
                <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-y-100 scale-y-80"></div>
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                    <LogOut size={18} className="text-red-500 group-hover:text-red-600" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-red-600">Logout</span>
                <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="h-3 w-3 text-gray-400 ml-auto group-hover:text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    />
                </svg>
                </a>
            </li>
            </ul>
      </aside>
    </>
  );
}

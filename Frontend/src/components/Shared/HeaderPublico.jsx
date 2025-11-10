import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showMenu]);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <style>{`
        @keyframes subtleShine {
          0% { background-position: -100%; }
          100% { background-position: 200%; }
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

       

        .institutional-shadow {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .institutional-shadow-lg {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .nav-underline {
          position: relative;
        }
        .nav-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          width: 0;
          height: 2px;
          background: #1B396A;
          transition: width .3s ease;
        }
        .nav-underline:hover::after {
          width: 100%;
        }

        .mobile-menu-enter {
          animation: fadeInLeft .35s cubic-bezier(0.4,0,0.2,1);
        }

        .overlay-enter {
          animation: fadeIn .3s ease-out;
        }

        .cta-premium {
          background: #1B396A;
          color: white;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 22px;
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(0.4,0,0.2,1);
        }
        .cta-premium::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,.25) 0%, transparent 70%);
          opacity: 0;
          transform: scale(0);
          transition: all .6s cubic-bezier(0.4,0,0.2,1);
        }
        .cta-premium:hover::after {
          opacity: 1;
          transform: scale(2);
        }
        .cta-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(27,57,106,.35);
        }

        .menu-item {
          border-left: 3px solid transparent;
          transition: all .3s ease;
        }
        .menu-item:hover {
          border-left-color: #1B396A;
          background: rgba(27,57,106,.05);
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "institutional-shadow-lg" : "institutional-shadow"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex justify-between items-center h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/Opt//TecNMBig.png"
                alt="Logo CLE"
                className="w-10 h-10 object-contain premium-shine"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-[#1B396A] text-base md:text-lg">
                  TecNM | Campus San Marcos
                </span>
                <span className="text-gray-600 text-xs md:text-sm">
                  Centro de Lenguas Extranjeras
                </span>
              </div>
            </Link>

            {/* DESKTOP MENU */}
            <ul className="hidden md:flex items-center gap-8 text-[#1B396A] text-sm font-medium">
              <li>
                <Link to="/LoginDocentes" className="nav-underline">
                  Docente
                </Link>
              </li>
              <li>
                <Link to="/LoginCoordinador" className="nav-underline">
                  Coordinador
                </Link>
              </li>
              <li>
                <Link to="/Documentacion" className="nav-underline">
                  Documentación
                </Link>
              </li>
            </ul>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-[#1B396A] hover:bg-gray-200 transition"
            >
              <svg
                className={`w-7 h-7 transition-transform ${
                  showMenu ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {showMenu && (
        <div
          className="overlay-enter fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE MENU */}
      <nav
        className={`mobile-menu-enter fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white z-50 md:hidden transform transition-transform ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/Opt//TecNMBig.png" className="w-10" />
            <div className="flex flex-col">
              <span className="font-bold text-[#1B396A] text-sm">TecNM</span>
              <span className="text-xs text-gray-600">Campus San Marcos</span>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col py-4">
          <li>
            <Link to="/login" className="menu-item px-6 py-4 text-[#1B396A] font-medium" onClick={closeMenu}>
              Login
            </Link>
          </li>

          <li>
            <Link to="/Registro" className="menu-item px-6 py-4 text-[#1B396A] font-medium" onClick={closeMenu}>
              Registro
            </Link>
          </li>

          <li>
            <Link
              to="/Documentacion"
              className="menu-item px-6 py-4 text-[#1B396A] font-medium"
              onClick={closeMenu}
            >
              Documentación y centro de ayuda
            </Link>
          </li>
        </ul>
      </nav>

      <div className="h-20" />
    </>
  );
}

export default Header;

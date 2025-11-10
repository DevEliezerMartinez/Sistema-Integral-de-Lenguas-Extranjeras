import React, { useState, useEffect } from "react";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevenir que el evento se propague
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  // Cerrar menú al presionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    if (showMenu) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showMenu]);

  return (
    <>
      <style>{`
        @keyframes subtleShine {
          0% { background-position: -100%; }
          100% { background-position: 200%; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .premium-shine {
          background: linear-gradient(
            110deg,
            transparent 40%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          background-position: -100%;
        }

        .premium-shine:hover {
          animation: subtleShine 1.2s ease-in-out;
        }

        .institutional-shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .institutional-shadow-lg {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-underline {
          position: relative;
        }

        .nav-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #0F5DD2;
          transition: width 0.3s ease;
        }

        .nav-underline:hover::after {
          width: 100%;
        }

        .mobile-menu-enter {
          animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .mobile-menu-exit {
          animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .overlay-enter {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .overlay-exit {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .cta-premium {
          background: #1B396A;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-premium::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
          opacity: 0;
          transform: scale(0);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-premium:hover::after {
          opacity: 1;
          transform: scale(2);
        }

        .cta-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(27, 57, 106, 0.35);
        }

        .cta-premium:active {
          transform: translateY(0);
        }

        .menu-item {
          border-left: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .menu-item:hover {
          border-left-color: #1B396A;
          background: rgba(27, 57, 106, 0.05);
        }

        /* Prevenir scroll bounce en iOS */
        .mobile-menu-content {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
      `}</style>

      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "institutional-shadow-lg" : "institutional-shadow"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Section */}
            <a
              href="/"
              className="flex items-center gap-3 sm:gap-4 group transition-opacity duration-200 hover:opacity-90"
            >
              <div className="flex-shrink-0">
                <img
                  alt="Logo TecNM"
                  src="/Opt//TecNMBig.png"
                  className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm sm:text-lg text-[#1B396A] leading-tight tracking-tight truncate">
                  TecNM | Campus San Marcos
                </span>
                <span className="hidden xs:block font-normal text-xs sm:text-sm text-gray-600 leading-tight truncate">
                  Centro de Lenguas Extranjeras
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#acerca-del-cle"
                className="nav-underline text-[#1B396A] font-medium text-sm tracking-wide hover:text-[#0F5DD2] transition-colors duration-200"
              >
                Acerca del CLE
              </a>
              <a
                href="#requisitos"
                className="nav-underline text-[#1B396A] font-medium text-sm tracking-wide hover:text-[#0F5DD2] transition-colors duration-200"
              >
                Requisitos
              </a>
              <a
                href="/Documentacion"
                className="nav-underline text-[#1B396A] font-medium text-sm tracking-wide hover:text-[#0F5DD2] transition-colors duration-200"
              >
                Documentación
              </a>
              <a
                href="/LoginCoordinador"
                className="cta-premium px-6 py-2.5 text-white font-semibold text-sm tracking-wide rounded-md transition-all duration-300 hover:scale-105"
              >
                Coordinador
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-[#1B396A] hover:bg-gray-100 rounded-md transition-colors duration-200 relative z-[60]"
              aria-label="Menú"
              aria-expanded={showMenu}
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  showMenu ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <div className={`h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}></div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div
          className={`fixed inset-0 bg-black/40 z-40 lg:hidden ${
            showMenu ? 'overlay-enter' : 'overlay-exit'
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden transition-transform duration-300 ease-out ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header del menú */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              alt="Logo TecNM"
              src="/Opt//TecNMBig.png"
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[#1B396A]">TecNM</span>
              <span className="text-xs text-gray-600">Campus San Marcos</span>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del menú */}
        <div className="flex flex-col h-[calc(100vh-89px)]">
          <div className="flex-1 overflow-y-auto py-4 mobile-menu-content">
            <nav>
              <ul className="flex flex-col">
                <li>
                  <a
                    href="#acerca-del-cle"
                    onClick={closeMenu}
                    className="menu-item flex items-center px-6 py-4 text-[#1B396A] font-medium text-base"
                  >
                    Acerca del CLE
                  </a>
                </li>
                <li>
                  <a
                    href="#requisitos"
                    onClick={closeMenu}
                    className="menu-item flex items-center px-6 py-4 text-[#1B396A] font-medium text-base"
                  >
                    Requisitos
                  </a>
                </li>
                <li>
                  <a
                    href="/Documentacion"
                    onClick={closeMenu}
                    className="menu-item flex items-center px-6 py-4 text-[#1B396A] font-medium text-base"
                  >
                    Documentación
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Footer del menú con CTA */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <a
              href="/LoginCoordinador"
              onClick={closeMenu}
              className="cta-premium block w-full px-6 py-4 text-white font-semibold text-base text-center rounded-lg"
            >
              Coordinador
            </a>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}

export default Header;
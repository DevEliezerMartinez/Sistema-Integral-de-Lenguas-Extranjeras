import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1B396A] to-[#152d54] text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Columna 1: Logo y Info Principal */}
          <div className="flex flex-col items-start space-y-4">
            <img 
              alt="Logo CLE" 
              src="/Opt/TecNM_blanco.png" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <p className="font-bold text-xl Poppins leading-tight">
                TecNM | Campus San Marcos
              </p>
              <p className="text-gray-300 text-sm mt-1 Montserrat">
                Centro de Lenguas Extranjeras
              </p>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-2 Poppins">
              Enlaces Rápidos
            </h3>
            <a 
              href="/Docentes" 
              className="text-gray-200 hover:text-white transition-colors duration-200 text-sm Montserrat hover:translate-x-1 transform inline-block"
            >
              → Docentes
            </a>
            <a 
              href="/Coordinador" 
              className="text-gray-200 hover:text-white transition-colors duration-200 text-sm Montserrat hover:translate-x-1 transform inline-block"
            >
              → Coordinador
            </a>
            <a 
              href="#" 
              className="text-gray-200 hover:text-white transition-colors duration-200 text-sm Montserrat hover:translate-x-1 transform inline-block"
            >
              → Aviso de Privacidad
            </a>
          </div>

          {/* Columna 3: Contacto y Redes */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-2 Poppins">
              Contacto
            </h3>
            <a 
              href="mailto: vin_smarcos@tecnm.mx"
              className="text-gray-200 hover:text-white transition-colors duration-200 text-sm Montserrat flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              vin_smarcos@tecnm.mx
            </a>
            <a 
              href="https://www.facebook.com/TecNMSanMarcosGro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-white transition-colors duration-200 text-sm Montserrat flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              @TecNMSanMarcosGro
            </a>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-400/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300 Montserrat">
            <p>
              © {new Date().getFullYear()} TecNM - Todos los Derechos Reservados
            </p>
            <p className="text-gray-400">
              Desarrollado por Ing. Eliezer S.M.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
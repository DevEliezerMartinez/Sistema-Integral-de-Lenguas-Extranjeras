import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#1B396A] text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:items-start items-center mb-4 md:mb-0">
          <img alt="Logo CLE" src="/Opt/TecNMBig.png" className="w-16 h-16 mb-4 md:mb-0" />
          <div className="text-center md:text-left">
            <p className="font-bold text-lg Poppins">TecNM | Campus San Marcos</p>
            <p className="font-bold text-lg">Centro de Lenguas Extranjeras</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end Montserrat">
          <a href="#" className="text-sm mb-2">© Copyright 2023 TecNM - Todos los Derechos Reservados</a>
          <a href="#" className="text-sm mb-2">Aviso de Privacidad</a>
          <a href="#" className="text-sm mb-2">Última actualización: 2023</a>
          <a href="#" className="text-sm">Autor: Eliezer Martinez</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

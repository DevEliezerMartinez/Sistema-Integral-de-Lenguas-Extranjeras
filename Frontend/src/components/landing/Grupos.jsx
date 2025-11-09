import React from 'react';

/**
 * Componente "Nuestros Grupos" con layout de dos columnas
 * y dos imágenes superpuestas en la izquierda.
 */
function GruposIngles() {
  return (
    <section className="my-16 md:mb-24">
      {/* Contenedor principal centrado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cuadrícula principal: 1 columna en móvil, 2 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-12 items-center">

          {/* --- COLUMNA IZQUIERDA: IMÁGENES --- */}
          <div className="relative">

            {/* Elemento decorativo (hexágonos del diseño) */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute -top-10 -left-12 w-40 h-40 -z-10"
            >
              <svg
                width="161"
                height="161"
                viewBox="0 0 161 161"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-200/60"
              >
                <path
                  d="M80.5 1.37573L1.91381 41.1257L1.91381 120.626L80.5 160.376L159.086 120.626L159.086 41.1257L80.5 1.37573Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M80.5 41.1257L41.2069 61.0007L41.2069 100.751L80.5 120.626L119.793 100.751L119.793 61.0007L80.5 41.1257Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            {/* Imagen 1 (Grande, al fondo) */}
            <img
              className="w-full h-auto max-h-96 object-cover rounded-2xl shadow-lg"
              src="/Opt/English.png"
              alt="English Grammar book"
            />

            {/* Imagen 2 (Pequeña, superpuesta) */}
            <img
              className="
                w-2/3 md:w-1/2 lg:w-2/5
                h-auto 
                rounded-2xl 
                shadow-xl 
                border-4 md:border-8 border-white
                absolute 
                -bottom-12 md:-bottom-16
                left-0 md:left-4
              "
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80"
              alt="Estudiante en videollamada"
            />
          </div>

          {/* --- COLUMNA DERECHA: TEXTO --- */}
          <div className="pt-20 md:pt-0">
            {/* Título */}
            <h2 className="Poppins text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
              <span className="text-[#1B396A]">NUESTROS</span> GRUPOS
            </h2>

            {/* Párrafo introductorio */}
            <p className="Montserrat text-gray-700 leading-relaxed mb-8">
              En el CLE de San Marcos, te ofrecemos la oportunidad de aprender
              inglés en grupos reducidos con compañeros que comparten tu nivel de
              conocimiento del idioma.
            </p>

            {/* Lista de beneficios */}
            <ul className="space-y-6">
              <li>
                <h3 className="Montserrat text-lg font-bold text-gray-800 mb-1">
                  Interactuar y practicar el inglés de forma natural:
                </h3>
                <p className="Montserrat text-gray-600">
                  Al estar rodeado de personas con habilidades similares, te sentirás
                  más cómodo para participar en las actividades grupales y practicar
                  el idioma sin miedo a cometer errores.
                </p>
              </li>
              <li>
                <h3 className="Montserrat text-lg font-bold text-gray-800 mb-1">
                  Formar parte de una comunidad de aprendizaje:
                </h3>
                <p className="Montserrat text-gray-600">
                  En el CLE, encontrarás un ambiente cálido y acogedor donde podrás
                  conocer a personas con intereses similares y compartir experiencias
                  de aprendizaje.
                </p>
              </li>
              <li>
                <h3 className="Montserrat text-lg font-bold text-gray-800 mb-1">
                  Disfrutar de un acompañamiento académico integral:
                </h3>
                <p className="Montserrat text-gray-600">
                  Además de las clases, te ofrecemos recursos adicionales como
                  tutorías, talleres y eventos culturales que te ayudarán a reforzar
                  tu aprendizaje y complementar tu formación en inglés.
                </p>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default GruposIngles;
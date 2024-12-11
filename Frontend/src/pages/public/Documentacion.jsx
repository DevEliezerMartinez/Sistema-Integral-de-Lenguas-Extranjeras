import React from 'react';
import Header from '../../components/Shared/HeaderPublico';

function Documentacion() {
  return (
    <div className="bg-slate-100 ">
      <Header />

      <main className="container mx-auto py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Documentación</h1>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">¿Qué es un CLE (Centro de Lenguas Extranjeras) del Tecnológico Nacional de México (TecNM)?</h2>

          <p className="text-gray-600">Los CLEs son unidades académicas dentro de cada campus del TecNM dedicadas a la enseñanza y aprendizaje de lenguas extranjeras. Su objetivo principal es brindar a la comunidad tecnológica la oportunidad de desarrollar habilidades lingüísticas que les permitan mejorar su desempeño académico, profesional y personal en un mundo globalizado.</p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Funciones de un CLE</h2>

          <ul className="list-disc list-inside text-gray-600">
            <li>Impartir cursos de lenguas extranjeras: Inglés, francés, alemán, italiano, japonés, chino, etc. Según su capacidad y la cantidad estudiantil.</li>
            <li>Diseñar y desarrollar materiales didácticos.</li>
            <li>Aplicar exámenes de colocación y certificación.</li>
            <li>Organizar eventos culturales y lingüísticos.</li>
            <li>Ofrecer cursos de verano y talleres especializados.</li>
            <li>Promover el intercambio académico y la movilidad estudiantil.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Acreditación de los CLEs</h2>

          <p className="text-gray-600">Los CLEs del TecNM están sujetos a un proceso de acreditación interna y externa para garantizar la calidad de sus servicios educativos. La acreditación interna la realiza la Coordinación Nacional de Lenguas Extranjeras del TecNM, mientras que la acreditación externa la realizan organismos externos de prestigio, como el Centro de Evaluación del Aprendizaje del Idioma Inglés .</p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">¿Quién autoriza la creación de un CLE?</h2>

          <p className="text-gray-600">La creación de un CLE en un campus del TecNM es autorizada por la Dirección General del TecNM a propuesta del Director del campus correspondiente. La propuesta incluye un plan de trabajo que detalla los objetivos, estrategias, recursos y personal necesarios para el funcionamiento del CLE.</p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Manuales y lineamientos para los CLEs</h2>

          <p className="text-gray-600">El TecNM ha desarrollado diversos manuales y lineamientos para guiar el funcionamiento de los CLEs. Entre estos documentos se encuentran:</p>

          <ul className="list-disc list-inside text-gray-600">
            <li>Manual de Organización y Funciones de los CLEs</li>
            <li>Lineamientos para el Diseño y Desarrollo de Materiales Didácticos</li>
            <li>Guía para la Aplicación de Exámenes de Colocación y Certificación</li>
            <li>Criterios para la Acreditación de los CLEs</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Documentacion;
import React from "react";
import { Collapse } from "antd";

const items = [
  {
    key: "1",
    label: "Inscripción",
    children: (
      <div className="space-y-4">
        <p className="Montserrat text-gray-700 leading-relaxed">
          Para formalizar tu inscripción al curso de inglés verano , deberás
          completar el siguiente procedimiento institucional:
        </p>

        <ol className="space-y-4 pl-6">
          <li className="list-decimal Montserrat text-gray-700">
            <span className="font-semibold">Entrega del formato de solicitud:</span>{" "}
            Acude al Departamento de Gestión Tecnológica y Vinculación para entregar
            el formato oficial de solicitud del curso.  
            <br />
            <a
              href="https://www.smarcos.tecnm.mx/pdf/vinculacion/ingles/formato-solicitd_ingles_2023.docx"
              className="text-[#1B39f6A] hover:underline font-medium"
            >
              DESCARGAR FORMATO
            </a>
          </li>

          <li className="list-decimal Montserrat text-gray-700">
            <span className="font-semibold">Realiza el pago correspondiente:</span>{" "}
            Deposita el monto del curso a la cuenta bancaria asignada:
            <br />
            <span className="font-semibold">BANAMEX · Cuenta 621605666</span>
          </li>

          <li className="list-decimal Montserrat text-gray-700">
            <span className="font-semibold">Completa tu inscripción:</span>{" "}
            Una vez realizado el pago, regresa al Departamento de Gestión Tecnológica
            y Vinculación en la fecha correspondiente a tu curso.  
            La atención se brinda de <span className="font-semibold">08:00 a 13:00 horas.</span>
          </li>
        </ol>

        <p className="Montserrat text-gray-700 leading-relaxed">
          Para dudas o aclaraciones, comunícate al correo{" "}
          <a
            href="mailto:vin_smarcos@tecnm.mx"
            className="text-[#1B396A] hover:underline font-medium"
          >
            vin_smarcos@tecnm.mx
          </a>{" "}
          o al número <span className="font-semibold">745 103 2304</span>.
        </p>
      </div>
    ),
  },

  {
    key: "2",
    label: "Durante el Curso",
    children: (
      <div className="space-y-3">
        <p className="Montserrat text-gray-700 leading-relaxed">
          Durante el desarrollo del curso, deberás participar activamente en todas
          las sesiones programadas y cumplir con los lineamientos académicos
          establecidos por la institución.
        </p>

        <p className="Montserrat text-gray-700 leading-relaxed">
          La asistencia, participación y entrega de actividades forman parte de la
          evaluación continua del curso.
        </p>
      </div>
    ),
  },

  {
    key: "3",
    label: "Culminación y Certificación",
    children: (
      <div className="space-y-4">
        <p className="Montserrat text-gray-700 leading-relaxed">
          Para concluir y aprobar el curso, es necesario cumplir con los siguientes
          criterios institucionales:
        </p>

        <ul className="space-y-3 pl-6">
          <li className="Montserrat text-gray-700">
            <span className="font-semibold">✓ Asistir</span> al porcentaje mínimo requerido.
          </li>

          <li className="Montserrat text-gray-700">
            <span className="font-semibold">✓ Cumplir</span> con las actividades y evaluaciones
            correspondientes al programa.
          </li>

          <li className="Montserrat text-gray-700">
            <span className="font-semibold">✓ Presentar</span> los exámenes establecidos por la
            coordinación del curso.
          </li>
        </ul>

        <p className="Montserrat text-sm text-gray-600 mt-4 italic">
          * El proceso de certificación se realiza conforme a la normativa vigente
          del Tecnológico Nacional de México: Campus San Marcos.
        </p>
      </div>
    ),
  },
];

function Requisitos() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="requisitos"
          className="Poppins text-center font-bold text-3xl md:text-4xl mb-8 md:mb-12 text-gray-900"
        >
          <span className="text-[#1B396A]">REQUISITOS</span> Y PROCESO
        </h2>

        <Collapse
          className="bg-white shadow-sm"
          items={items}
          bordered={false}
          expandIconPosition="end"
        />
      </div>
    </section>
  );
}

export default Requisitos;

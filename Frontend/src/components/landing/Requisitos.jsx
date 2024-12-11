import React from "react";
import { Collapse } from "antd";

const items = [
  {
    key: "1",
    label: "Inscripcion",
    children: (
      <>
        <p>Durante la inscripción, los aspirantes deben seguir estos pasos:</p>
        <ol className="p-8">
          <li className=" list-decimal">
            Inicia sesion o crea tu cuenta para acceder al sitio web del CLE. Hacer clic
            en el botón de cursos Diponible y proporcionar la informacion solicitda. En caso de dificultades con la inscripción, pueden comunicarse
          en las oficinas correspondientes.
          </li>
          <br/>
          <li className=" list-decimal">
            Después de completar la inscripción, deben dirigirse al curso disponoble al cual se desea inscribirse y enviar el comprobante de pago (voucher)
            en las fechas indicadas en el calendario académico.
          </li>
        </ol>
      </>
    ),
  },
  {
    key: "2",
    label: "Durante el proceso",
    children: (
      <p>
        Durante el proceso de aprendizaje, los estudiantes asisten a clases y
        participan activamente en las actividades del curso. Los estudiantes deben cumplir con los
        requisitos de asistencia y evaluación establecidos por la institución. Y el docente correspondiente asignara la calificación en base a su desempeño ácademico
      </p>
    ),
  },
  {
    key: "3",
    label: "Para la entrega",
    children: (
      <p>
      Para la culminación de los cursos, los estudiantes deben: Cumplir con los
        requisitos de asistencia y evaluación de cada nivel. Realizar los pagos
        correspondientes según el calendario académico. En algunos casos,
        presentar exámenes diferidos parciales o exámenes de clasificación
        (específicamente para inglés conversacional). Y si la calificación es mayor a la minima aprobatoria podra generar su constancia
      </p>
    ),
  },
];

function Requisitos() {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div>
      <div className="my-8 md:max-w-7xl md:m-auto">
        <h2 id="requisitos" className="Poppins text-center font-bold text-3xl px-6 md:my-10">
          Requisitos
        </h2>
        <Collapse
          className="w-2/3 m-auto my-4"
          items={items}
          defaultActiveKey={["1"]}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Requisitos;

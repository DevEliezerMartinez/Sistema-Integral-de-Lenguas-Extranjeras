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
            Descargar la guía paso a paso desde el sitio web del CLE. Hacer clic
            en el botón de inscripciones y seguir los pasos descritos en la
            guía. En caso de dificultades con la inscripción, pueden comunicarse
            al correo admisionescle@mail.uniatlantico.edu.co o enviar un mensaje
            interno en Facebook @cleuatlantico.
          </li>
          <br/>
          <li className=" list-decimal">
            Después de completar la inscripción, deben dirigirse a la opción de
            matrículas para descargar su volante de pago (matrícula financiera)
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
        participan activamente en las actividades del curso. En el caso
        específico de la Universidad del Atlántico, ofrecen cursos de inglés
        para niños, adolescentes, jóvenes adultos y también clases de inglés
        conversacional y otros idiomas. Los estudiantes deben cumplir con los
        requisitos de asistencia y evaluación establecidos por la institución.
      </p>
    ),
  },
  {
    key: "3",
    label: "Para la entrega",
    children: (
      <p>
        ara la culminación de los cursos, los estudiantes deben: Cumplir con los
        requisitos de asistencia y evaluación de cada nivel. Realizar los pagos
        correspondientes según el calendario académico. En algunos casos,
        presentar exámenes diferidos parciales o exámenes de clasificación
        (específicamente para inglés conversacional). Los precios varían según
        si son estudiantes nuevos o antiguos y si se requiere un examen de
        clasificación
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

import React from "react";
import { Breadcrumb, Button, Collapse } from "antd";

function Solicitudes() {
  
const items = [
  {
    key: "1",
    label: (
      <div className="flex w-full justify-between pr-6">
        <p className="font-semibold">
          Alumno: <span className="font-normal">Eliezer Solano Martinez</span>
        </p>
        <div className="flex gap-4 font-medium">
          <p>Modulo I</p>
          <img alt="icon" className="w-6" src="/Opt/SVG/info.svg" />
        </div>
      </div>
    ),
    children: (
      <div className="flex px-8">
        <ul className="list-none w-1/3">
          <li className="mb-4">
            <span className="font-bold">Periodo:</span> Enero - Junio
          </li>
          <li className="mb-4">
            <span className="font-bold">Docente:</span> Laura Garza
          </li>
          <li className="mb-4">
            <span className="font-bold">Requisitos:</span> Ninguno
          </li>
          <li className="mb-4">
            <span className="font-bold">Modalidad:</span> Regular
          </li>
        </ul>
        <div id="Visualizer" className="w-2/3 flex flex-col justify-center items-center">
          <img className="w-24" src="/Opt/SVG/pdf.svg" alt="icon" />
          <Button type="link">Descargar archivo</Button>
          <div id="Actions" className="m-8 gap-5 flex self-end">
            <Button type="primary">Aprobar</Button>
            <Button danger>Rechazar</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div className="flex w-full justify-between pr-6">
        <p className="font-semibold">
          Alumno: <span className="font-normal">Carlos Pérez Rivera</span>
        </p>
        <div className="flex gap-4 font-medium">
          <p>Modulo II</p>
          <img alt="icon" className="w-6" src="/Opt/SVG/info.svg" />
        </div>
      </div>
    ),
    children: (
      <div className="flex px-8">
        <ul className="list-none w-1/3">
          <li className="mb-4">
            <span className="font-bold">Periodo:</span> Julio - Diciembre
          </li>
          <li className="mb-4">
            <span className="font-bold">Docente:</span> Ana López
          </li>
          <li className="mb-4">
            <span className="font-bold">Requisitos:</span> Ninguno
          </li>
          <li className="mb-4">
            <span className="font-bold">Modalidad:</span> Virtual
          </li>
        </ul>
        <div id="Visualizer" className="w-2/3 flex flex-col justify-center items-center">
          <img className="w-24" src="/Opt/SVG/pdf.svg" alt="icon" />
          <Button type="link">Descargar archivo</Button>
          <div id="Actions" className="m-8 gap-5 flex self-end">
            <Button type="primary">Aprobar</Button>
            <Button danger>Rechazar</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <div className="flex w-full justify-between pr-6">
        <p className="font-semibold">
          Alumno: <span className="font-normal">María González Sánchez</span>
        </p>
        <div className="flex gap-4 font-medium">
          <p>Modulo III</p>
          <img alt="icon" className="w-6" src="/Opt/SVG/info.svg" />
        </div>
      </div>
    ),
    children: (
      <div className="flex px-8">
        <ul className="list-none w-1/3">
          <li className="mb-4">
            <span className="font-bold">Periodo:</span> Enero - Junio
          </li>
          <li className="mb-4">
            <span className="font-bold">Docente:</span> Pedro Hernández
          </li>
          <li className="mb-4">
            <span className="font-bold">Requisitos:</span> Ninguno
          </li>
          <li className="mb-4">
            <span className="font-bold">Modalidad:</span> Presencial
          </li>
        </ul>
        <div id="Visualizer" className="w-2/3 flex flex-col justify-center items-center">
          <img className="w-24" src="/Opt/SVG/pdf.svg" alt="icon" />
          <Button type="link">Descargar archivo</Button>
          <div id="Actions" className="m-8 gap-5 flex self-end">
            <Button type="primary">Aprobar</Button>
            <Button danger>Rechazar</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "4",
    label: (
      <div className="flex w-full justify-between pr-6">
        <p className="font-semibold">
          Alumno: <span className="font-normal">Laura Martínez Vega</span>
        </p>
        <div className="flex gap-4 font-medium">
          <p>Modulo IV</p>
          <img alt="icon" className="w-6" src="/Opt/SVG/info.svg" />
        </div>
      </div>
    ),
    children: (
      <div className="flex px-8">
        <ul className="list-none w-1/3">
          <li className="mb-4">
            <span className="font-bold">Periodo:</span> Julio - Diciembre
          </li>
          <li className="mb-4">
            <span className="font-bold">Docente:</span> Miguel Santos
          </li>
          <li className="mb-4">
            <span className="font-bold">Requisitos:</span> Ninguno
          </li>
          <li className="mb-4">
            <span className="font-bold">Modalidad:</span> Híbrida
          </li>
        </ul>
        <div id="Visualizer" className="w-2/3 flex flex-col justify-center items-center">
          <img className="w-24" src="/Opt/SVG/pdf.svg" alt="icon" />
          <Button type="link">Descargar archivo</Button>
          <div id="Actions" className="m-8 gap-5 flex self-end">
            <Button type="primary">Aprobar</Button>
            <Button danger>Rechazar</Button>
          </div>
        </div>
      </div>
    ),
  },
];

  return (
    <div className="px-4">
    <Breadcrumb
        items={[
          {
            title: <p className="font-medium text-black">Coordinador</p>,
          },
          {
            title: <a href="">Cursos Solicitudes</a>,
          },
        ]}
      />
      <h2 className="Montserrat text-center text-2xl font-medium my-9">Solicitudes de inscripción</h2>

      <Collapse accordion items={items} />
    </div>
  );
}

export default Solicitudes;

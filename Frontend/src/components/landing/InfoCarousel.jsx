import React from "react";
import "../../styles/Landing/main.css";
import { Carousel } from "antd";
import { Image } from "antd"; // Import Image component

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const images = [
  { src: "/Opt//Carousel/1.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/2.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/3.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/4.webp", alt: "Alumnos del CLE" },
  // Add more image objects as needed
];

function InfoCarousel() {
  return (
    <div className="  mt-8">
      <h2 id="acerca-del-cle" className="Poppins text-center font-bold text-3xl px-6 ">
        Centro de Lenguas Extranjeras (CLE)
      </h2>

      <section id="Carousel" className=" p-8">
        <Carousel arrows dotPosition="top" autoplay className=" m-auto md:w-1/2 ">
          {images.map((image) => (
            <div key={image.src}>
              {/* Replace h3 with Image component */}
              <Image
                width="100%" // Adjust width as needed
                src={image.src}
                alt={image.alt}
              />
            </div>
          ))}
        </Carousel>

        <p className="Montserrat text-center p-4 md:text-left md:px-16">
          El CLE ofrece cursos estructurados que abarcan desde los niveles
          básicos hasta los avanzados. Además, el CLE puede proporcionar
          certificaciones reconocidas por el Marco Común Europeo de Referencia
          para las lenguas (MCER). <br></br>Es un lugar donde los alumnos pueden
          sumergirse en el aprendizaje de idiomas y expandir sus horizontes
          culturales. 🌎🗣️📚
        </p>
      </section>


      <section id="Contenedor Minicards" className="flex  justify-around  p-4">
        <div id="DataCard" className="flex flex-col items-center  w-1/5">
          <img className="w-12" alt="Logo escolar" src="/Opt//SVG/academic.svg"></img>
          <p className="Montserrat font-normal text-center">Con el objetivo de fomentar el perfil academico</p>
        </div>
        <div id="DataCard" className="flex flex-col items-center  w-1/5">
          <img className="w-12" alt="Logo escolar" src="/Opt//SVG/group.svg"></img>
          <p className="Montserrat font-normal text-center">Seguimiento por grupo para practicar sus habilidades</p>
        </div>
        <div id="DataCard" className="flex flex-col items-center  w-1/5">
          <img className="w-12" alt="Logo escolar" src="/Opt//SVG/teacher.svg"></img>
          <p className="Montserrat font-normal text-center">Con docentes preparados y experiencia</p>
        </div>
        
      </section>
    </div>
  );
}

export default InfoCarousel;

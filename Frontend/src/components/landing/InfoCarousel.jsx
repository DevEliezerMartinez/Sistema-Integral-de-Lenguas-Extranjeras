import React from "react";
import { Carousel, Image } from "antd";

const images = [
  { src: "/Opt//Carousel/1.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/2.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/3.webp", alt: "Alumnos del CLE" },
  { src: "/Opt//Carousel/4.webp", alt: "Alumnos del CLE" },
];

// Flechas personalizadas con filtrado para evitar warnings
const PrevArrow = (props) => {
  const { currentSlide, slideCount, ...rest } = props;
  return <button {...rest} />;
};

const NextArrow = (props) => {
  const { currentSlide, slideCount, ...rest } = props;
  return <button {...rest} />;
};

function InfoCarousel() {
  return (
    <div className="mt-8 bg-white">
      {/* CLE Section with Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2
            id="acerca-del-cle"
            className="text-3xl font-bold text-gray-900 mb-8"
          >
            Centro de Lenguas Extranjeras (CLE)
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Carousel */}
            <div className="md:w-1/2">
              <Carousel
                autoplay
                arrows
                dotPosition="top"
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                {images.map((image) => (
                  <div key={image.src}>
                    <Image
                      width="100%"
                      src={image.src}
                      alt={image.alt}
                      preview={false}
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Text Content */}
            <div className="md:w-1/2">
              <p className="text-gray-600 text-lg leading-relaxed">
                El CLE ofrece cursos estructurados que abarcan desde los niveles
                básicos hasta los avanzados. Además, el CLE puede proporcionar
                certificaciones reconocidas por el Marco Común Europeo de
                Referencia para las lenguas (MCER).
                <br />
                <br />
                Es un espacio ideal para fortalecer tus habilidades lingüísticas
                y ampliar tu perspectiva cultural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center p-6">
            <img
              className="w-16 h-16 mb-4"
              alt="Logo escolar"
              src="/Opt//SVG/academic.svg"
            />
            <p className="text-gray-700">
              Con el objetivo de fomentar el perfil académico
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center p-6">
            <img
              className="w-16 h-16 mb-4"
              alt="Logo grupo"
              src="/Opt//SVG/group.svg"
            />
            <p className="text-gray-700">
              Seguimiento por grupo para practicar sus habilidades
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center p-6">
            <img
              className="w-16 h-16 mb-4"
              alt="Logo maestro"
              src="/Opt//SVG/teacher.svg"
            />
            <p className="text-gray-700">
              Con docentes preparados y con experiencia
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InfoCarousel;

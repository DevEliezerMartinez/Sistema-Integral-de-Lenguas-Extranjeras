function Grupos() {
  return (
    <div className="my-8 md:max-w-7xl md:m-auto m">
      <h2 id="nuestros-grupos" className="Poppins text-center font-bold text-3xl px-6 md:my-10 ">
        Nuestros grupos
      </h2>

      <section className="my-4  w-10/12 m-auto px-4 md:m-0 md:w-full md:flex md:flex-row ">
        <img className="w-full m-auto md:w-1/2  " src="/Opt//GrupoStand.webp" />

        <div id="InfoGrupos" className="flex flex-col  p-4 md:px-12 ">
          <p className="Montserrat text-center px-2 my-4 md:text-left">
            En el CLE de San Marcos, te ofrecemos la oportunidad de aprender
            inglés en grupos reducidos con compañeros que comparten tu nivel de
            conocimiento del idioma
          </p>

          <div className="md:flex md:gap-8 md:flex-col ">

          <li className="Montserrat ">
            <span className="font-bold ">
              Interactuar y practicar el inglés de forma natural: <br />{" "}
            </span>
            Al estar rodeado de personas con habilidades similares, te sentirás
            más cómodo para participar en las actividades grupales y practicar
            el idioma sin miedo a cometer errores.
          </li>
          <li className="Montserrat ">
            <span className="font-bold ">
              Formar parte de una comunidad de aprendizaje: <br />{" "}
            </span>
            En el CLE, encontrarás un ambiente cálido y acogedor donde podrás
            conocer a personas con intereses similares y compartir experiencias
            de aprendizaje.
          </li>
          <li className="Montserrat ">
            <span className="font-bold ">
              Disfrutar de un acompañamiento académico integral <br />{" "}
            </span>
            demás de las clases, te ofrecemos recursos adicionales como
            tutorías, talleres y eventos culturales que te ayudarán a reforzar
            tu aprendizaje y complementar tu formación en inglés.
          </li>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Grupos;

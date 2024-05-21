import React from "react";

import MainHero from "../../components/landing/MainHero";
import InfoCarousel from "../../components/landing/InfoCarousel";
import Header from "../../components/landing/PrincipalHeader";
import "../../styles/Landing/main.css"
import Grupos from "../../components/landing/Grupos";
import Requisitos from "../../components/landing/Requisitos";
import PrincipalFooter from "../../components/landing/PrincipalFooter";
function Home() {
  return (
    <div>
      <Header />

      <MainHero />

      <InfoCarousel />

      <Grupos/>

      <Requisitos/>

      <PrincipalFooter/>
    </div>
  );
}

export default Home;

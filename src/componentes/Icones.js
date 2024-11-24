// Icone.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Icone = ({ isPaid, cs_tipo }) => {
  const location = useLocation();
  let iconClass;

  if (location.pathname.includes('entradas') || cs_tipo === "R") {
    iconClass = 'icone-entrada';
  } else if (location.pathname.includes('saidas') || cs_tipo === "S") {
    iconClass = 'icone-saidas';
  } else {
    iconClass = 'icone-pagos';
  }

  return iconClass;
};

export default Icone;

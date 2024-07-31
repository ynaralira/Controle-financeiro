import React from 'react';
import { useLocation } from 'react-router-dom';

const Icones = ({ isPaid }) => {
  const location = useLocation();
  let iconClass;
  if (location.pathname.includes('entradas')) {
    iconClass = 'icone-entrada';
  } else if (location.pathname.includes('saidas')) {
    iconClass = 'icone-saidas';
  } else {
    iconClass = 'icone-pagos';
  }

  return iconClass;
};

export default Icones;

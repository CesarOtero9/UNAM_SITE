import React from 'react';
import escudo from '../assets/escudo-unam.png';


const HeaderUNAM = () => {
  return (
    <div className="bg-gray-900 text-white py-4 text-center">
      <img src={escudo} alt="Escudo UNAM" className="mx-auto w-20 mb-2" />
      <h1 className="text-lg font-bold uppercase">Universidad Nacional Autónoma de México</h1>
      <h2 className="text-sm uppercase">Facultad de Estudios Superiores Aragón</h2>
    </div>
  );
};

export default HeaderUNAM;

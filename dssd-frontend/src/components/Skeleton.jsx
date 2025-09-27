import React from 'react';

/**
 * Un componente de esqueleto para indicar estados de carga.
 * Utiliza animate-pulse de Tailwind CSS.
 * @param {object} props - Las props del componente.
 * @param {string} props.className - Clases de Tailwind para definir tamaño, forma, etc.
 * @returns {React.ReactElement}
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-800 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
import React, { useEffect, useState } from 'react';
import Skeleton from "@/components/Skeleton";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { truncateText } from '@/utils/functions';

const ImageLoader = ({ src, alt="imagen", skeletonClass, className, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [hasImage, setHasImage] = useState(false);
  console.log("src", src);
  // Cargar la imagen y manejar el estado de carga
  const handleImageLoad = () => {
    setLoading(false);
    /* setTimeout(() => {
    }, 1000); */
  };

  const handleImageError = () => {
    // Puedes manejar el error de carga aquí, como mostrar una imagen de fallback
    setLoading(false);
    setHasImage(false);
  };

  useEffect(() => {
    if (src) {
      setHasImage(true);
    } else {
      setLoading(false);
    }
  }, [src]);  // Añadimos src como dependencia para que se actualice al cambiar

  return (
    <>
      {loading && <Skeleton className={`w-full h-full ${skeletonClass ?? ""} `} />}

      {hasImage ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={` ${loading ? 'hidden' : 'block'} ${className}`}
          {...props}
        />
      ) : (
        <>
          {!loading && !hasImage ? (
            <div className={`w-full border-2 rounded-lg border-gray-400 text-gray-400 flex flex-col items-center justify-center ${className}`}>
              <PhotoIcon className='h-10 w-10' />
              <p>{truncateText(alt, 20)}</p>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ImageLoader;
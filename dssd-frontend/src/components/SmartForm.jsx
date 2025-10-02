import React, { useState, useEffect, useCallback } from "react";
import {notify} from '@/services/notificationService';
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const SmartForm = ({
  url,
  validations = {},
  data,
  style = "",
  submitText,
  onFailure = () => {},
  onSuccess = () => {},
  children
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const {token} = useAuth();
  const navigate = useNavigate();

  // Guarda el valor de un campo en el estado
  const saveFormData = useCallback(({ name, value }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Maneja el cambio de un input
  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      const newValue = type === "number" ? +value : value;
      setFormData(prev => ({ ...prev, [name]: newValue }));

      // Si existe un error para ese campo y ahora la validación es correcta, lo elimina.
      if (errors[name] && validations[name]?.function(formData[name], formData)) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }
    },
    [errors, formData, validations]
  );

  // Función para validar todos los campos
  const validateForm = () => {
    const validationErrors = {};
    Object.entries(validations).forEach(([field, { function: validateFn, message }]) => {
      if (!validateFn(formData[field], formData)) {
        validationErrors[field] = message;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      notify({
        type: "warning",
        message: "Completa bien los campos",
        seconds: 2
      });
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const responseData = await response.json();

      switch (response.status) {
        case 200:
          let data = responseData && responseData.data ? responseData.data : formData;
          onSuccess(data);
          break;

        case 401:
          notify({
            type: responseData.type || "error",
            message: responseData.message
          });
          navigate("/login");
          break;

        case 409:
            notify({
              type: responseData.type || "error",
              message: responseData.message
            });
            let errors = {};
            responseData.fields.forEach(field => {
              errors[field] = "Ya existe un registro con este valor";
            })
            setErrors(errors);
            break;
      
        default:
          notify({
            type: responseData.type || "error",
            message: responseData.message
          });
          onFailure();
          break;
      }

    } catch (error) {
      console.error("Error en la solicitud:", error);
      notify({
        type: "warning",
        message: "Hubo un problema en la solicitud, vuelve a intentarlo"
      });
    }
  };

  // Actualiza el estado si cambian los datos externos
  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 md:space-y-6 flex flex-col ${style} w-full`}>
      {children ? (
        children({ formData, handleChange, errors, saveFormData, handleSubmit })
      ) : (
        <div>Formulario vacio</div>
      )}
      {submitText ?
        <button
          type="submit"
          className="w-full focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm p-3 text-center bg-background dark:bg-background hover:brightness-90 dark:hover:brightness-90 transition-colors"
        >
        {submitText}
      </button>
      : null}
    </form>
  );
};

export default SmartForm;

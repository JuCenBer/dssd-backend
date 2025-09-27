
import React, { useState, useCallback, useEffect } from 'react';
import SmartForm from './SmartForm';
import { notify } from '@/services/notificationService';
import { TextInput, TextAreaInput } from './Inputs';

// --- Componentes Internos para Inputs Faltantes ---

// Componente para Fechas
const DateInput = ({ label, name, value, onChange, error }) => (
    <TextInput
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        type="date"
    />
);

// Componente para Checkbox
const CheckboxInput = ({ label, name, checked, onChange, error }) => (
    <div className="flex items-center gap-2">
        <input
            type="checkbox"
            name={name}
            id={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
);


const Form2 = () => {
    const [formVisible, setFormVisible] = useState(false);
    const [apiToken, setApiToken] = useState(null);

    const handleStartForm = async () => {
        try {
            login();
            notify({ type: 'success', message: 'Autenticación exitosa. Ya puedes crear tu proyecto.' });
            setFormVisible(true);
        
        } catch (error) {
            console.error('Error en handleStartForm:', error);
            notify({ type: 'error', message: error.message });
        }
    };

    const validations = {
        nombre: {
            function: (value) => value && value.trim() !== '',
            message: 'El nombre es obligatorio.'
        },
        descripcion: {
            function: (value) => value && value.trim() !== '',
            message: 'La descripción es obligatoria.'
        },
        ubicacion: {
            function: (value) => value && value.trim() !== '',
            message: 'La ubicación es obligatoria.'
        },
        actividades: {
            function: (value) => Array.isArray(value) && value.length > 0,
            message: 'Debes añadir al menos una actividad.'
        }
    };

    const handleSuccess = (responseData) => {
        notify({ type: 'success', message: '¡Proyecto creado con éxito!' });
        setFormVisible(false); // Opcional: Ocultar el form y volver al botón de inicio
    };

        
    const login = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
            method: 'POST',
            body: JSON.stringify({ username: 'user', password: 'pass' }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        console.log(response)

        if(response.ok) {
            console.log(response.headers)
        }
    }



    if (!formVisible) {
        return (
            <div className="flex justify-center items-center h-screen">
                <button
                    onClick={handleStartForm}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Iniciar Formulario de Proyecto
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Crear Nuevo Proyecto</h2>
            <SmartForm
                url={`${import.meta.env.VITE_API_URL}/api/v1/crear-proyecto`}
                submitText="Crear Proyecto"
                validations={validations}
                onSuccess={handleSuccess}
                // Pasamos el token al SmartForm si es necesario, aunque parece que lo toma del hook useAuth.
                // Si la autenticación es solo para este form, tendríamos que ajustar SmartForm.
            >
                {({ formData, handleChange, errors, saveFormData }) => {
                    const handleActivityChange = (index, field, value) => {
                        const newActivities = [...(formData.actividades || [])];
                        newActivities[index] = { ...newActivities[index], [field]: value };
                        saveFormData({ name: 'actividades', value: newActivities });
                    };

                    const addActivity = () => {
                        const newActivity = {
                            nombre: '',
                            fechaInicio: '',
                            fechaFin: '',
                            recurso: '',
                            requiereColaboracion: false
                        };
                        const newActivities = [...(formData.actividades || []), newActivity];
                        saveFormData({ name: 'actividades', value: newActivities });
                    };

                    const removeActivity = (index) => {
                        const newActivities = [...(formData.actividades || [])];
                        newActivities.splice(index, 1);
                        saveFormData({ name: 'actividades', value: newActivities });
                    };

                    return (
                        <>
                            <TextInput
                                name="nombre"
                                label="Nombre del Proyecto"
                                value={formData.nombre || ''}
                                onChange={handleChange}
                                error={errors.nombre}
                                placeholder="Ej: Desarrollo de nuevo módulo"
                            />
                            <TextAreaInput
                                name="descripcion"
                                label="Descripción"
                                value={formData.descripcion || ''}
                                onChange={handleChange}
                                error={errors.descripcion}
                                placeholder="Ej: Un módulo para gestionar inventario"
                                rows={4}
                            />
                            <TextInput
                                name="ubicacion"
                                label="Ubicación"
                                value={formData.ubicacion || ''}
                                onChange={handleChange}
                                error={errors.ubicacion}
                                placeholder="Ej: Oficina central"
                            />

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Actividades</h3>
                                {errors.actividades && <p className="text-red-500 text-sm mb-2">{errors.actividades}</p>}
                                
                                <div className="space-y-4">
                                    {(formData.actividades || []).map((activity, index) => (
                                        <div key={index} className="p-4 border border-gray-300 rounded-lg relative">
                                            <button
                                                type="button"
                                                onClick={() => removeActivity(index)}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <TextInput
                                                    name={`actividad_nombre_${index}`}
                                                    label="Nombre Actividad"
                                                    value={activity.nombre}
                                                    onChange={(e) => handleActivityChange(index, 'nombre', e.target.value)}
                                                    placeholder="Ej: Diseño de UI"
                                                />
                                                <TextInput
                                                    name={`actividad_recurso_${index}`}
                                                    label="Recurso"
                                                    value={activity.recurso}
                                                    onChange={(e) => handleActivityChange(index, 'recurso', e.target.value)}
                                                    placeholder="Ej: Equipo de diseño"
                                                />
                                                <DateInput
                                                    name={`actividad_fechaInicio_${index}`}
                                                    label="Fecha de Inicio"
                                                    value={activity.fechaInicio}
                                                    onChange={(e) => handleActivityChange(index, 'fechaInicio', e.target.value)}
                                                />
                                                <DateInput
                                                    name={`actividad_fechaFin_${index}`}
                                                    label="Fecha de Fin"
                                                    value={activity.fechaFin}
                                                    onChange={(e) => handleActivityChange(index, 'fechaFin', e.target.value)}
                                                />
                                                <div className="md:col-span-2 flex items-center">
                                                    <CheckboxInput
                                                        name={`actividad_requiereColaboracion_${index}`}
                                                        label="Requiere Colaboración"
                                                        checked={activity.requiereColaboracion}
                                                        onChange={(e) => handleActivityChange(index, 'requiereColaboracion', e.target.checked)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={addActivity}
                                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    + Añadir Actividad
                                </button>
                            </div>
                        </>
                    );
                }}
            </SmartForm>
        </div>
    );
};

export default Form2;

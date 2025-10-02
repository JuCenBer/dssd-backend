import React, { useState } from 'react';
import SmartForm from './SmartForm';
import { notify } from '@/services/notificationService';
import { TextInput, TextAreaInput, SelectInput } from './Inputs';

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

const ProjectSummary = ({ projectData, onClose }) => {
    const recursoLabels = {
        'DINERO': 'Dinero',
        'MANO_DE_OBRA': 'Mano de obra',
        'MATERIAL': 'Material',
        'OTRO': 'Otro'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-600">✓ Proyecto Creado Exitosamente</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-blue-900 mb-2">{projectData.nombre}</h3>
                            <p className="text-gray-700 mb-2">{projectData.descripcion}</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Ubicación:</span> {projectData.ubicacion}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg text-gray-800 mb-3">
                                Actividades ({projectData.actividades?.length || 0})
                            </h4>
                            <div className="space-y-3">
                                {projectData.actividades?.map((activity, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-medium text-gray-900">{activity.nombre}</h5>
                                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                {recursoLabels[activity.recurso] || activity.recurso}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                            <div>
                                                <span className="font-medium">Inicio:</span> {activity.fechaInicio}
                                            </div>
                                            <div>
                                                <span className="font-medium">Fin:</span> {activity.fechaFin}
                                            </div>
                                        </div>
                                        {activity.requiereColaboracion && (
                                            <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                Requiere colaboración
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Form2 = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginData, setLoginData] = useState({ username: 'walter.bates', password: 'bpm' });
    const [createdProject, setCreatedProject] = useState(null);
    const [showSummary, setShowSummary] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                notify({ type: 'success', message: 'Autenticación exitosa. Ya puedes crear tu proyecto.' });
                setIsAuthenticated(true);
            } else {
                const errorText = await response.text();
                notify({ type: 'error', message: errorText || 'Error en la autenticación' });
            }
        } catch (error) {
            console.error('Error en login:', error);
            notify({ type: 'error', message: 'Error de conexión con el servidor' });
        } finally {
            setIsLoggingIn(false);
        }
    };

    const VALID_RECURSOS = ['DINERO', 'MANO_DE_OBRA', 'MATERIAL', 'OTRO'];

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
            function: (activities) => {
                if (!Array.isArray(activities) || activities.length === 0) return false;

                return activities.every(act => {
                    if (!act.nombre?.trim() || !act.fechaInicio?.trim() || !act.fechaFin?.trim()) return false;
                    if (!VALID_RECURSOS.includes(act.recurso)) return false;
                    if (typeof act.requiereColaboracion !== 'boolean') return false;

                    const fechaInicio = new Date(act.fechaInicio);
                    const fechaFin = new Date(act.fechaFin);
                    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) return false;
                    if (fechaFin < fechaInicio) return false;

                    return true;
                });
            },
            message: 'Todas las actividades deben tener todos los campos completos, con fechas válidas y recurso permitido.'
        }
    };

    const handleSuccess = (data) => {
        console.log(data)
        notify({ type: 'success', message: '¡Proyecto creado con éxito!' });
        setCreatedProject(data);
        setShowSummary(true);
    };

    const handleCloseSummary = () => {
        setShowSummary(false);
        setCreatedProject(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="walter.bates"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="bpm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Nuevo Proyecto</h2>
                <SmartForm
                    url={`/api/v1/crear-proyecto`}
                    submitText="Crear Proyecto"
                    validations={validations}
                    onSuccess={handleSuccess}
                    expectEmptyResponse={true}
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
                                    placeholder="Ej: Reparaciones de viviendas"
                                />
                                <TextAreaInput
                                    name="descripcion"
                                    label="Descripción"
                                    value={formData.descripcion || ''}
                                    onChange={handleChange}
                                    error={errors.descripcion}
                                    placeholder="Ej: Proyecto para reparar viviendas afectadas por un reciente desastre natural."
                                    rows={4}
                                />
                                <TextInput
                                    name="ubicacion"
                                    label="Ubicación"
                                    value={formData.ubicacion || ''}
                                    onChange={handleChange}
                                    error={errors.ubicacion}
                                    placeholder="Ej: Bahía Blanca, Argentina"
                                />

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Actividades</h3>
                                    {errors.actividades && <p className="text-red-500 text-sm mb-2">{errors.actividades}</p>}
                                    
                                    <div className="space-y-4">
                                        {(formData.actividades || []).map((activity, index) => (
                                            <div key={index} className="p-4 border border-gray-300 bg-white rounded-lg relative">
                                                <button
                                                    type="button"
                                                    onClick={() => removeActivity(index)}
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl leading-none"
                                                >
                                                    &times;
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <TextInput
                                                        name={`actividad_nombre_${index}`}
                                                        label="Nombre Actividad"
                                                        value={activity.nombre}
                                                        onChange={(e) => handleActivityChange(index, 'nombre', e.target.value)}
                                                        placeholder="Ej: Relevamiento de daños"
                                                        error={errors.actividades?.nombre}
                                                    />
                                                    
                                                    <SelectInput
                                                        name={`actividad_recurso_${index}`}
                                                        label="Recurso"
                                                        value={activity.recurso}
                                                        onChange={(e) => handleActivityChange(index, 'recurso', e.target.value)}
                                                        hasNull={false}
                                                        error={errors.actividades?.recurso}
                                                    >
                                                        <option value="">Seleccionar recurso</option>
                                                        <option value="DINERO">Dinero</option>
                                                        <option value="MANO_DE_OBRA">Mano de obra</option>
                                                        <option value="MATERIAL">Material</option>
                                                        <option value="OTRO">Otro</option>
                                                    </SelectInput>

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
                                        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                                    >
                                        + Añadir Actividad
                                    </button>
                                </div>
                            </>
                        );
                    }}
                </SmartForm>
            </div>
            
            {showSummary && createdProject && (
                <ProjectSummary projectData={createdProject} onClose={handleCloseSummary} />
            )}
        </div>
    );
};

export default Form2;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {apiClient} from '@/services/apiClient';
import { notify } from '@/services/notificationService';
import { TextInput, SelectInput, PasswordInput } from '@/components/Inputs';

// Este componente ahora es solo el formulario, reutilizable para 'create' y 'edit'
const UsuarioForm = ({ initialData = {}, mode = 'create' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', roleId: '', state: 'active', password: '' });
  const [errors, setErrors] = useState({});
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        state: initialData.state || 'active',
        roleId: initialData.Role?.id || '',
        password: '', // La contraseña siempre empieza vacía en el form
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({...prev, [name]: null}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = { ...formData };
      if (isEditMode && !payload.password) delete payload.password;

      const response = isEditMode
        ? await apiClient.post(`/api/user/${initialData.id}`, payload)
        : await apiClient.post('/api/user', payload);
      
      notify({ type: 'success', message: `Usuario ${isEditMode ? 'actualizado' : 'creado'} con éxito.` });
      navigate('/admin/usuarios');
    } catch (err) {
      notify({ type: 'error', message: err.response?.data?.message || 'Ocurrió un error.' });
    }
  };

  return (
    <div className="bg-surface-primary p-6 rounded-lg border border-border-primary">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {isEditMode ? `Editando Usuario` : 'Crear Nuevo Usuario'}
      </h1>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
          <TextInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
          <SelectInput label="Rol" name="roleId" url="/api/role/input-names" value={formData.roleId} onChange={handleChange} error={errors.roleId} required />
          <SelectInput label="Estado" name="state" options={[{ value: 'active', label: 'Activo' }, { value: 'blocked', label: 'Bloqueado' }]} value={formData.state} onChange={handleChange} error={errors.state} hasNull={false} required />
          <PasswordInput label="Contraseña" name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : ''} required={!isEditMode} />
        </div>
        <div className="mt-8 pt-6 border-t border-border-primary flex justify-end gap-3">
          <button type="button" onClick={() => navigate(isEditMode ? `/admin/usuarios/${initialData.id}/detalles` : '/admin/usuarios')} className="px-4 py-2 text-sm font-medium rounded-md bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-interactive-primary text-white hover:bg-interactive-primary-hover">{isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}</button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
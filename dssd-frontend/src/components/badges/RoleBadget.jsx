import React from 'react';

const RoleBadget = ({ role }) => {
    let className = '';
    let roleText;

    switch (role) {
        case 'superadmin':
            className = `bg-blue-500`;
            roleText = 'Super Admin';
            break;
        case 'client':
            className = `bg-blue-500`;
            roleText = 'Cliente';
            break;
        case 'admin':
            className = `bg-blue-500`;
            roleText = 'Admin';
            break;
        case 'employee':
            className = `bg-blue-500`;
            roleText = 'Empleado';
            break;
        default:
            className = `bg-blue-500`;
            roleText = 'Unknown';
    }

    return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${className}`} >
            {roleText}
        </span>
    );
};

export default RoleBadget;
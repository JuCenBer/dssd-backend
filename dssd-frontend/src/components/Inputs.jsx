import useFetchData from "@/hooks/useFetchData";
import { capitalize } from "@/utils/functions";
import { EyeIcon, EyeSlashIcon, CalendarIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


export const TextInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  type = "text",
  required = false,
  readOnly = false,
  remove = false,
  className = "",
  clearInput = () => { }
}) => {
  const baseClasses = "block w-full rounded-md py-2 px-3 shadow-sm transition-colors duration-200 bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none";
  const borderClasses = error
    ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-primary/50"
    : "border-border-secondary focus:border-border-focus focus:ring-2 focus:ring-border-focus/50";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        <input
          type={type}
          name={name}
          id={name}
          className={`border ${baseClasses} ${borderClasses}`}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          value={value || ""}
        />
        {remove && value && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary transition-colors"
            onClick={clearInput}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


export const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder = "••••••••",
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses = "block w-full rounded-md py-2 px-3 shadow-sm transition-colors duration-200 bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none";
  const borderClasses = error
    ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-primary/50"
    : "border-border-secondary focus:border-border-focus focus:ring-2 focus:ring-border-focus/50";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={name}
          className={`border ${baseClasses} ${borderClasses}`}
          placeholder={placeholder}
          onChange={onChange}
          value={value || ""}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary transition-colors"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


export const SelectInput = ({
  label,
  name,
  error,
  value,
  onChange,
  options = [],
  url = null, // Para cargar opciones desde una URL
  loading: externalLoading = false, // Para mostrar spinner externamente
  children,
  hasNull = true,
  className = "",
  optionValueKey = "name", // Clave para el valor de la opción
  optionLabelKey = "label"  // Clave para la etiqueta de la opción
}) => {
  const [internalOptions, setInternalOptions] = useState(options);
  const [internalLoading, setInternalLoading] = useState(false);
  const { fetchData } = useFetchData();
  const {t} = useTranslation();

  useEffect(() => {
    if (url) {
      const getOptions = async () => {
        setInternalLoading(true);
        const { data } = await fetchData(url);
        if (data) {
          setInternalOptions(data.options || data || []);
        }
        setInternalLoading(false);
      };
      getOptions();
    } else {
      setInternalOptions(options);
    }
  }, [url]);

  const isLoading = externalLoading || internalLoading;

  const baseClasses = "block w-full rounded-md py-2 px-1 text-sm shadow-sm transition-colors duration-200 bg-surface-secondary text-text-primary focus:outline-none";
  const borderClasses = error
    ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-primary/50"
    : "border-border-secondary focus:border-border-focus focus:ring-2 focus:ring-border-focus/50";
  
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-text-primary">{label}</label>}
      <div className="relative mt-1">
        <select
          name={name}
          id={name}
          className={`border ${baseClasses} ${borderClasses}`}
          value={value || ""}
          onChange={onChange}
          disabled={isLoading}
        >
          {hasNull && <option value="">Seleccionar</option>}
          {internalOptions.map(opt => (
            <option key={opt[optionValueKey] || opt.id} value={opt[optionValueKey] || opt.id}>
              {t(opt[optionLabelKey], {defaultValue: opt[optionValueKey]})}
            </option>
          ))}
          {children}
        </select>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 animate-spin text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const SearchSelectInput = ({
  label,
  name,
  value,
  url,
  onChange,
  placeholder,
  error,
  className = '',
  valueType = 'id'
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useFetchData();
  const [inputValue, setInputValue] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cargar las opciones al montar o al cambiar la URL (esto siempre se hace una sola vez)
  useEffect(() => {
    setLoading(true);
    getOptions();
  }, [url]);

  const getOptions = async () => {
    try {
      const response = await fetchData(`${url}?name=${inputValue}`);
      const fetchedOptions = response?.data?.options || response || [];
      setOptions(fetchedOptions);
      setFilteredOptions(fetchedOptions);
    } catch (err) {
      console.error('Error fetching options:', err);
    } finally {
      setLoading(false);
    }
  };

  // Asignar el nombre del seleccionado al input
  useEffect(() => {
    if (!isUserTyping) {
      if (!value) {
        setInputValue('');
      } else {
        let selected;
        if (valueType === 'id') {
          selected = options.find(opt => opt.id === value);
        } else if (valueType === 'name') {
          selected = options.find(opt => opt.name?.toLowerCase() === value.toLowerCase());
        }
        if (selected) {
          setInputValue(selected.name || '');
        }
      }
    }
  }, [value, options, valueType]);

  // Filtrado o búsqueda en el servidor según la prop 'server'
  useEffect(() => {
    if (server) {
      // Si es búsqueda en el servidor, se llama a getOptions cada vez que cambia el input
      getOptions();
    } else {
      // Búsqueda local
      if (!inputValue) {
        setFilteredOptions(options);
      } else {
          if(options && options.length > 0) {
            const searchTerm = inputValue.toLowerCase();
            const filtered = options.filter(opt =>
              opt.name.toLowerCase().startsWith(searchTerm)
            );
            setFilteredOptions(filtered);
          }
      }
    }
  }, [inputValue]);


  // Abrir dropdown al enfocar
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Cerrar dropdown al perder foco (con pequeño delay para permitir click en opción)
  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  // Actualizar el input y abrir el dropdown
  const handleInputChange = (e) => {
    setIsUserTyping(true);
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  // Al presionar Enter, si hay algo en el input, seleccionar la opción (si coincide o tomar el primero filtrado)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        const exact = options.find(opt => opt.name.toLowerCase() === inputValue.toLowerCase());
        const selectedOption = exact || filteredOptions[0];
        if (selectedOption) {
          selectOption(selectedOption);
        }
      }
    }
  };

  // Cuando se selecciona una opción, se actualiza el input y se emite el id al onChange
  const selectOption = (option) => {
    setIsUserTyping(false);
    setInputValue(option.name);
    const emittedValue = valueType === 'name' ? option.name : option.id;
    onChange({ target: { name, value: emittedValue} });
    setIsOpen(false);
  };

  // Botón para limpiar la selección
  const handleClear = () => {
    setIsUserTyping(false);
    setInputValue('');
    onChange({ target: { name, value: '' } });
  };

  const inputBaseClasses = "w-full rounded-md p-2 pr-10 transition-colors duration-200 bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none";
  const inputBorderClasses = error
    ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-primary/50"
    : "border-border-secondary focus:border-border-focus focus:ring-2 focus:ring-border-focus/50";

  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1" >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={name}
          value={capitalize(inputValue)}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder={placeholder}
          className={`border ${inputBaseClasses} ${inputBorderClasses}`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value && !loading && (
            <button type="button" onClick={handleClear} className="text-text-tertiary hover:text-text-primary">
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
          {loading && (
             <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-5 w-5 animate-spin text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          )}
        </div>
  
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-surface-primary border border-border-primary rounded-md shadow-lg max-h-60">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <li
                key={option.id}
                className="p-2 cursor-pointer text-text-primary hover:bg-surface-secondary"
                onMouseDown={() => selectOption(option)}
              >
                {capitalize(option.name)}
              </li>
            ))
          ) : (
            <li className="p-2 text-center text-text-secondary">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};


export const TextAreaInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  required = false,
  readOnly = false,
  rows = 4 // Usar 'rows' en lugar de altura fija es más semántico
}) => {
  const baseClasses = "block w-full rounded-md py-2 px-3 shadow-sm transition-colors duration-200 bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none";
  const borderClasses = error
    ? "border-error-primary focus:border-error-primary focus:ring-2 focus:ring-error-primary/50"
    : "border-border-secondary focus:border-border-focus focus:ring-2 focus:ring-border-focus/50";
  
  return (
    <div>
      {label && <label htmlFor={name} className="block mb-1 text-sm font-medium text-text-primary">{label}</label>}
      <textarea
        name={name}
        id={name}
        className={`border ${baseClasses} ${borderClasses}`}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
        value={value || ""}
        rows={rows}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};


export const PdfInput = ({
  label,
  button, // El componente/texto para el botón de selección
  name,
  value,
  onChange,
  error,
  required = false,
  className = ""
}) => {
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      onChange({ target: { name, value: file } });
    } else if (file) {
      // Opcional: notificar error de tipo de archivo
      console.error("El archivo debe ser un PDF");
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange({ target: { name, value: null } });
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          // Estilo de botón secundario
          className="px-4 py-2 text-sm font-medium rounded-md border border-border-secondary bg-interactive-secondary text-interactive-secondary-text hover:bg-interactive-secondary-hover"
        >
          {button || "Seleccionar PDF"}
        </button>

        <input
          type="file"
          name={name}
          id={name}
          ref={fileInputRef}
          accept="application/pdf"
          onChange={handleFileChange}
          required={required}
          className="hidden"
        />

        {value && (
          // "Pill" para mostrar el archivo seleccionado
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary-soft text-brand-primary">
            <span>{value.name}</span>
            <button onClick={handleClear} type="button" className="hover:text-error-primary">
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error-primary">{error}</p>}
    </div>
  );
};
import { useLocalStorage } from '@/hooks/useLocalStorage';
import React, { useState, useEffect } from 'react';

const Form = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bonitaCreds, setBonitaCreds] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState('');
  const [processSearchTerm, setProcessSearchTerm] = useState('');
  const [caseId, setCaseId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [clientId, setClientId] = useLocalStorage('clientId', null)

  const [processData, setProcessData] = useState({});

  const BONITA_URL = '/bonita'; 

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BONITA_URL}/loginservice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: 'walter.bates',
          password: 'bpm',
          redirect: 'false',
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.clientId) {
        throw new Error('X-Bonita-API-Token not found in response.');
      }

      setClientId(data.clientId)

      /* const xBonitaAPIToken = data.token;
      const session = data.session;
      if (!xBonitaAPIToken) {
        throw new Error('X-Bonita-API-Token not found in response.');
      }
      

      setBonitaCreds({ 'token': xBonitaAPIToken, 'session': session });  */
      setStep(2); // Move to process selection
    } catch (e) {
      setError(`Login failed: ${e.message}`);
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BONITA_URL}/API/bpm/process?s=${processSearchTerm}`, {
        credentials: 'include',
        headers: {
          "x-client-id": clientId
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProcesses(data);
    } catch (e) {
      setError(`Failed to fetch processes: ${e.message}`);
      console.error('Fetch processes error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantiateProcess = async () => {
    if (!selectedProcessId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BONITA_URL}/API/bpm/process/${selectedProcessId}/instantiation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId
        },
        credentials: 'include',
        body: JSON.stringify({}), 
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCaseId(data.caseId);
      setStep(3); // Move to task fetching
    } catch (e) {
      setError(`Failed to instantiate process: ${e.message}`);
      console.error('Instantiate process error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!clientId || !caseId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BONITA_URL}/API/bpm/humanTask?f=caseId=${caseId}`, {
        headers: {
          "x-client-id": clientId
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setCurrentTaskIndex(0); // Start with the first task
      setStep(4); // Move to task execution
    } catch (e) {
      setError(`Failed to fetch tasks: ${e.message}`);
      console.error('Fetch tasks error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setClientId(null)
  }, [])

  const handleTaskExecution = async () => {
    if (tasks.length === 0) return;

    const currentTask = tasks[currentTaskIndex];
    setLoading(true);
    setError(null);

    // 1. Preparar el "contrato" para Bonita con el sufijo `_input`
    // Bonita espera que las variables se llamen `nombre_input`, `descripcion_input`, etc.
    const contract = {};
    for (const key in formData) {
      // Si el dato es un array (como nuestros planes de trabajo), lo enviamos como un string JSON
      if (Array.isArray(formData[key])) {
        contract[`${key}_input`] = JSON.stringify(formData[key]);
      } else {
        contract[`${key}_input`] = formData[key];
      }
    } 

	const body = {
		creacionProyectoInput: formData
	}

    try {
      const response2 = await fetch(`${BONITA_URL}/API/bpm/userTask/${currentTask.id}/execution`, {
        method: 'POST',
        body: JSON.stringify(body), // Enviamos el contrato formateado
		headers: {
			"x-client-id": clientId,
			'Content-Type': 'application/json',
		}
      });

	  console.log(response2)

      // 2. ¡Guardamos los datos de la tarea completada en nuestro acumulador!
      setProcessData(prevData => ({
        ...prevData,
        [currentTask.name]: { ...formData } // Guardamos una copia
      }));
      setFormData({}); // Limpiamos el formulario para la siguiente tarea

      // 3. Buscamos la siguiente tarea
      const response = await fetch(`${BONITA_URL}/API/bpm/humanTask?f=caseId=${caseId}`, {
		"x-client-id": clientId,
		'Content-Type': 'application/json',
	  });
      const remainingTasks = await response.json();

      if (remainingTasks.length > 0) {
        setTasks(remainingTasks);
        setCurrentTaskIndex(0);
      } else {
        // Si no hay más tareas, vamos al paso de RESUMEN FINAL
        setTasks([]);
        setStep(5);
      }
    } catch (e) {
      setError(`Fallo al ejecutar la tarea: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(step)
    if (step == 2 && processSearchTerm) {
      fetchProcesses();
    }
  }, [step, processSearchTerm]);

  useEffect(() => {
    if (step === 3 && bonitaCreds && caseId) {
      fetchTasks();
    }
  }, [step, bonitaCreds, caseId]);

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...formData.planes];
    updatedPlans[index][field] = value;
    setFormData(prev => ({ ...prev, planes: updatedPlans }));
  };

  const addPlan = () => {
    const newPlan = { titulo: 'Nuevo plan', detalles: '' };
    setFormData(prev => ({ ...prev, planes: [...(prev.planes || []), newPlan] }));
  };

  const removePlan = (index) => {
    setFormData(prev => ({
      ...prev,
      planes: prev.planes.filter((_, i) => i !== index)
    }));
  };
  
  const resetAll = () => {
      setProcessData({});
      setFormData({});
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Bonita Stepped Form</h1>

        {loading && <p className="text-blue-500 text-center mb-4">Cargando...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {step === 1 && (
          <div className="text-center">
            <p className="mb-4 text-gray-700">Inicia sesión en Bonita con walterbates para comenzar.</p>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Paso 2: Seleccionar Proceso</h2>
            <input
              type="text"
              placeholder="Buscar proceso por nombre (ej: Crear Proyecto)"
              value={processSearchTerm}
              onChange={(e) => setProcessSearchTerm(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            {processes.length > 0 ? (
              <select
                value={selectedProcessId}
                onChange={(e) => setSelectedProcessId(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-4"
              >
                <option value="">Selecciona un proceso</option>
                {processes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-600 mb-4">No se encontraron procesos o no se ha buscado.</p>
            )}
            <button
              onClick={handleInstantiateProcess}
              disabled={loading || !selectedProcessId}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Instanciando...' : 'Instanciar Proceso'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Paso 3: Proceso Instanciado</h2>
            <p className="mb-4 text-gray-700">Proceso instanciado con éxito. ID de caso: <span className="font-mono bg-gray-200 p-1 rounded">{caseId}</span></p>
            <button
              onClick={fetchTasks}
              disabled={loading || !caseId}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Buscando tareas...' : 'Buscar Tareas'}
            </button>
          </div>
        )}

        {step === 4 && tasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Paso 4: Ejecutar Tareas</h2>
            <p className="mb-4 text-gray-600">Tarea actual: <span className="font-semibold">{tasks[currentTaskIndex].name}</span></p>

            <form onSubmit={(e) => { e.preventDefault(); handleTaskExecution(); }} className="space-y-4">
              
              {/* === FORMULARIO TAREA 1: Enviar formulario de creación de proyecto === */}
              {tasks[currentTaskIndex].name === "Enviar formulario de creación de proyecto" && (
                <>
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción del Proyecto</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion || ''}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </>
              )}

              {/* === FORMULARIO TAREA 2: Crear planes de trabajo === */}
              {tasks[currentTaskIndex].name === "Crear planes de trabajo" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planes de Trabajo</label>
                  {(formData.planes || []).map((plan, index) => (
                    <div key={index} className="p-3 border rounded-md mb-3 space-y-2 relative">
                       <button type="button" onClick={() => removePlan(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">X</button>
                       <input
                         type="text"
                         placeholder="Título del plan"
                         value={plan.titulo}
                         onChange={(e) => handlePlanChange(index, 'titulo', e.target.value)}
                         className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                       />
                       <textarea
                         placeholder="Detalles del plan"
                         value={plan.detalles}
                         onChange={(e) => handlePlanChange(index, 'detalles', e.target.value)}
                         rows="2"
                         className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                       />
                    </div>
                  ))}
                  <button type="button" onClick={addPlan} className="w-full text-sm text-blue-600 hover:text-blue-800 border-2 border-dashed rounded-md p-2">
                    + Añadir Plan de Trabajo
                  </button>
                </div>
              )}

              {/* === FORMULARIO TAREA 3: Crear plan económico de financiamiento === */}
              {tasks[currentTaskIndex].name === "Crear plan económico de financiamiento" && (
                 <>
                  <div>
                    <label htmlFor="fuente" className="block text-sm font-medium text-gray-700">Fuente de Financiamiento</label>
                    <input
                      type="text"
                      id="fuente"
                      name="fuente"
                      value={formData.fuente || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                   <div>
                    <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto Estimado (USD)</label>
                    <input
                      type="number"
                      id="monto"
                      name="monto"
                      value={formData.monto || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Completando...' : 'Completar Tarea y Continuar'}
              </button>
            </form>
          </div>
        )}
        
        {/* --- ¡NUEVO! PASO 5: RESUMEN FINAL --- */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-green-600">¡Proceso Casi Completo!</h2>
            <p className="text-center text-gray-600">Por favor, revisa la información recopilada antes de la ejecución final del proyecto.</p>

            {Object.entries(processData).map(([taskName, data]) => (
              <div key={taskName} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800">{taskName}</h3>
                <div className="mt-2 text-sm text-gray-700">
                  {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <strong className="capitalize">{key}: </strong>
                      {Array.isArray(value) 
                        ? ( <ul className="list-disc list-inside pl-4">{value.map((item, i) => <li key={i}>{item.titulo}</li>)}</ul> )
                        : ( <span>{value}</span> )
                      }
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <p className="text-xs text-center text-gray-500 pt-4">En este punto, se podría ejecutar la siguiente tarea del proceso ("Analizar propuesta de cobertura", etc.) o simplemente finalizar.</p>
            
            <button
              onClick={resetAll} // Llama a la función de reinicio
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Iniciar un Nuevo Proceso
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;

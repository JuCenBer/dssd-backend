import Form from './pages/Form';
import './i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'

import Login from './pages/Login';
import Error404 from './layout/Error404'
import ProtectedRoute from './components/ProtectedRoute'


import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import Form2 from './components/Form2';



function App() {
  return (

    		<ThemeProvider>
                    <AuthProvider>


    			<BrowserRouter>

    				<Routes>

    					{/* --- RUTAS DEL CLIENTE (Públicas) --- */}
                        {/* <Route path="/" element={<Index />}>
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                        </Route> */}
                        <Route path='/segundo' element={<Form />} />
                        <Route path='/' element={<Form2 />} />
                        {/* --- RUTAS DEL ADMINISTRADOR (Protegidas) --- */}
                        {/*<Route 
                            element={
                                <ProtectedRoute redirectPath="/login" permission={"isAdmin"} />
                            }
                        >
                            <Route path="/admin" element={<AdminLayout />}>
    						<Route index element={<Navigate to="usuarios/crear" replace />} />
                                <Route path="usuarios/crear" element={<UserForm />} />
                            </Route>
                        </Route> */}

    					{/* --- RUTA PARA PÁGINAS NO ENCONTRADAS --- */}
    					<Route path="*" element={<Error404 />} />
    				</Routes>

    			</BrowserRouter>


    			</AuthProvider>
    		</ThemeProvider>
    )
}

export default App;


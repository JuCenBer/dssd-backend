import { Link, Outlet } from "react-router";
import Header from "./Header";
import BottomNavBar from "@/layout/BottomNavBar";


const Index = () => {



    const actualYear = new Date().getFullYear();

    return ( 
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <Header />
            
            {/* Contenido de la página actual */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-4 border-t border-border bg-background">
                <p className="text-center text-sm text-muted-foreground">
                    © {actualYear} {import.meta.env.VITE_BRAND_NAME}. Todos los derechos reservados.
                </p>
            </footer>

            {/* Barra de Navegación Inferior para Móviles */}
            <BottomNavBar /> 
        </div>
    );
}
 
export default Index;
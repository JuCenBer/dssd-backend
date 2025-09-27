import ImageLoader from "@/components/ImageLoader";
import { useNavigate } from "react-router";

const Error404 = () => {
    const navigate = useNavigate();

    return ( 
        <div className="flex flex-grow flex-col items-center justify-center gap-4 p-4 text-center bg-background h-screen overflow-hidden">

            <div className="w-full max-w-md">
                <ImageLoader
                    src="/404image.jpg"
                    alt="Página no encontrada"
                    className="w-full h-auto rounded-lg"
                    skeletonClass={"w-full h-48 rounded-lg"}
                />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-8">
                ¡Ups! Parece que estás perdido
            </h1>

            <p className="max-w-md text-muted-foreground">
                La página a la que intentas acceder no existe o fue movida.
                <button 
                    className="ml-2 font-semibold text-primary hover:underline"
                    onClick={() => navigate("/")}
                >
                    Volver al inicio
                </button>
            </p> 
        
        </div>
    );
}
 
export default Error404;
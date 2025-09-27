import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router"; 

// Tus componentes y hooks
import { useAuth } from "@/hooks/useAuth";
import SmartForm from "@/components/SmartForm";
import { PasswordInput, TextInput } from "@/components/Inputs";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import useFetchData from "@/hooks/useFetchData";
import {notify} from "@/services/notificationService";

// Icono para dar un toque visual
const LockClosedIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);


const Login = () => {
    const { isAuth, setAuth } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const to = searchParams.get("to") || "/";

    useEffect(() => {
        if (isAuth) {
            navigate(to, { replace: true });
        }
    }, [isAuth, navigate, to]);

    const handleSuccess = (data) => {
        setAuth(data);
        navigate(to, { replace: true });
        notify({ type: "success", message: "¡Bienvenido/a de nuevo!" });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-background-primary px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                <div className="text-center">
                    <LockClosedIcon className="mx-auto h-12 w-auto text-brand-primary opacity-50" />
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
                        Inicia sesión en tu cuenta
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        O si aún no tienes una,{' '}
                        <Link to="/register" className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors duration-200">
                            regístrate aquí
                        </Link>
                    </p>
                </div>

                <div className="bg-surface-primary border border-border-primary rounded-xl shadow-lg p-6 sm:p-8">
                    <SmartForm
                        url="/api/auth"
                        onSuccess={handleSuccess}
                        onError={(error) => notify({ type: "error", message: error?.message || "Credenciales incorrectas." })}
                    >
                        {({ formData, handleChange, errors, handleSubmit }) => (
                            <>
                            
                                <TextInput
                                    type="email"
                                    name="email"
                                    label="Correo electrónico"
                                    placeholder="tu.correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors?.email}
                                />
                                <PasswordInput
                                    label="Contraseña"
                                    placeholder="••••••••"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors?.password}
                                />

                                <div className="text-right text-sm">
                                    <Link to="/forgot" className="font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-interactive-primary-text bg-interactive-primary hover:bg-interactive-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-focus"
                                >
                                    Iniciar Sesión
                                </button>
                            </>
                        )}
                    </SmartForm>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-border-primary" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-surface-primary px-2 text-text-tertiary">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    <div>
                        {/* Asumimos que GoogleLoginButton es un botón secundario */}
                        <GoogleLoginButton />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
const GoogleLoginButton = () => {
  return (
    <a
      href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
      className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 transition-colors"
    >
      <img src="/google-icon.svg" alt="Google icon" className="h-5 w-5" />
      <span className="text-sm font-medium text-gray-700">Iniciar sesión con Google</span>
    </a>
  );
};

export default GoogleLoginButton;
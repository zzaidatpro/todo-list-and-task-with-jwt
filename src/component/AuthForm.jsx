import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../redux/authSlice';


export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await dispatch(registerUser({ email, password })).unwrap();
      } else {
        await dispatch(loginUser({ email, password })).unwrap();
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
          {isRegister ? "Créer un compte" : "Connexion"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-rose-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete='current-email'
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all cursor-pointer shadow-sm mt-2"
          >
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none"
          >
            {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            username: username || email.split('@')[0],
            total_score: 0,
            current_level: 1,
          });
          if (profileError) throw profileError;
        }
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-6">
            <Target className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Desarrollo Pro</h1>
          <p className="text-blue-100 text-lg">
            Mejora tus habilidades profesionales con desafíos interactivos
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          Desarrolla habilidades de liderazgo, análisis, comunicación y más
        </p>
      </div>
    </div>
  );
}

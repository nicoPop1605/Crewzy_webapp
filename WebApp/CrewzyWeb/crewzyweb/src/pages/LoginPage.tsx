import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, Key, ArrowLeft } from 'lucide-react';
import { LogoWithText } from '../components/Logo';

export function LoginPage() {
    const navigate = useNavigate();

    // --- ADRESA BACKEND-ULUI ---
    const API_URL = 'http://127.0.0.1:4000';
    // State-uri pentru câmpurile de input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // State-uri pentru controlul interfeței
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState<'auth' | 'otp' | 'forgot' | 'reset'>('auth');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [role, setRole] = useState('USER'); // Default este USER

    // 1. MANIPULARE LOGIN / REGISTER (PASUL 1)
    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const endpoint = isSignUp ? 'register' : 'login';
            const backendUrl = `${API_URL}/api/auth/${endpoint}`;

            const bodyData = isSignUp ? { email, password, name, role } : { email, password };
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if (response.ok) {
                if (isSignUp) {
                    alert('Cont creat cu succes! Te rugăm să te loghezi.');
                    setIsSignUp(false);
                    setPassword('');
                } else if (data.requireOtp) {
                    // 3-WAY AUTH DECLANȘAT: Trecem la ecranul de introducere OTP
                    setMessage(data.message);
                    setStep('otp');
                }
            } else {
                setError(data.error || 'Autentificare eșuată');
            }
        } catch {
            setError('Eroare de conexiune la server.');
        }
    };

    // 2. VERIFICARE COD OTP (PASUL 2 DIN 3-WAY AUTH)
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const backendUrl = `${API_URL}/api/auth/verify-otp`;
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                // 1. Extragem rolul inteligent (poate fi obiect din Prisma sau string simplu)
                const extrageRol = data.user.role?.name || data.user.role || 'USER';
                const userRole = typeof extrageRol === 'string' ? extrageRol.toUpperCase() : 'USER';

                // 2. Salvăm user-ul curat, cu rolul ca text simplu, pentru restul aplicației
                const userDataToSave = {
                    ...data.user,
                    role: userRole
                };

                // Succes deplin: Salvăm token-ul și user-ul modificat
                localStorage.setItem('jwt_token', data.token);
                localStorage.setItem('user', JSON.stringify(userDataToSave));
                alert('Autentificare completă! Bine ai venit.');

                // 3. Facem redirecționarea corectă folosind variabila curățată
                if (userRole === 'ADMIN') {
                    alert("BUN! ACUM APLICAȚIA ÎNCEARCĂ SĂ TE DUCĂ PE /admin !");
                    navigate('/admin'); // Redirecționează către ruta de admin
                } else {
                    alert("NASOL! SERVERUL TE VEDE DOAR CA 'USER', TE TRIMIT PE / !");
                    navigate('/'); // Redirecționează către ruta standard de user
                }
            } else {
                setError(data.error || 'Cod OTP incorect.');
            }
        } catch {
            setError('Eroare la verificarea OTP.');
        }
    };

    // 3. CERERE COD RESETARE PAROLĂ
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const backendUrl = `${API_URL}/api/auth/forgot-password`;
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setStep('reset'); // Trecem la ecranul unde introduce codul primit și parola nouă
            } else {
                setError(data.error || 'Eroare la procesarea cererii.');
            }
        } catch {
            setError('Eroare server.');
        }
    };

    // 4. SALVARE PAROLĂ NOUĂ
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const backendUrl = `${API_URL}/api/auth/reset-password`;
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetToken, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Parola a fost resetată cu succes! Te poți loga acum.');
                setStep('auth');
                setPassword('');
                setResetToken('');
                setNewPassword('');
            } else {
                setError(data.error || 'Cod de resetare invalid.');
            }
        } catch {
            setError('Eroare la resetarea parolei.');
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">
            {/* Partea Stângă - Rămâne neschimbată, branding-ul tău */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1529156349890-84021ffa9107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Friends together"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-blue-600/80 to-purple-600/90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30">
                                <LogoWithText size={80} showText={false} />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Welcome to Hangout</h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Secured with Enterprise 3-Way Authentication and Advanced Role Schemes.
                        </p>
                    </div>
                </div>
            </div>

            {/* Partea Dreaptă - Formularul Dinamic (Aici se întâmplă magia de Silver) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8">

                        {/* Alerte de eroare sau succes */}
                        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center">{error}</div>}
                        {message && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg text-center">{message}</div>}

                        {/* STAREA 1: LOGIN / REGISTER (AUTH) */}
                        {step === 'auth' && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                                    <p className="text-gray-600">{isSignUp ? 'Sign up to get started' : 'Sign in to continue'}</p>
                                </div>

                                <form onSubmit={handleAuthSubmit} className="space-y-5">
                                    {isSignUp && (
                                        <>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900 mb-2 block">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UserPlus className="w-5 h-5 text-gray-400" /></div>
                                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                                </div>
                                            </div>

                                            {/* --- AM ADĂUGAT SELECTORUL DE ROL AICI --- */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900 mb-2 block">Account Type</label>
                                                <div className="flex gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="USER"
                                                            checked={role === 'USER'}
                                                            onChange={(e) => setRole(e.target.value)}
                                                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Normal User</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value="ADMIN"
                                                            checked={role === 'ADMIN'}
                                                            onChange={(e) => setRole(e.target.value)}
                                                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Administrator</span>
                                                    </label>
                                                </div>
                                            </div>
                                            {/* ----------------------------------------- */}
                                        </>
                                    )}

                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="w-5 h-5 text-gray-400" /></div>
                                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-gray-50 rounded-xl pl-12 pr-12 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {!isSignUp && (
                                        <div className="text-right">
                                            <button type="button" onClick={() => setStep('forgot')} className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                        <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-purple-600 hover:text-purple-700">
                                            {isSignUp ? 'Sign In' : 'Sign Up'}
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}

                        {/* STAREA 2: INTRODUCERE COD OTP (3-WAY AUTH) */}
                        {step === 'otp' && (
                            <>
                                <div className="text-center mb-8">
                                    <div className="flex justify-center mb-4"><div className="bg-purple-100 p-3 rounded-full text-purple-600"><Key className="w-8 h-8" /></div></div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Verification</h2>
                                    <p className="text-sm text-gray-600">Introdu codul de securitate din 6 cifre generat în consola backend-ului pentru adresa <b>{email}</b>.</p>
                                </div>

                                <form onSubmit={handleOtpSubmit} className="space-y-5">
                                    <div>
                                        <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full bg-gray-50 rounded-xl py-4 border text-center text-3xl font-bold tracking-widest border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                    </div>

                                    <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                                        Verify & Login
                                    </button>

                                    <button type="button" onClick={() => setStep('auth')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 mt-2">
                                        <ArrowLeft className="w-4 h-4" /> Back to Login
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STAREA 3: SOLICITARE RESETARE PAROLĂ (FORGOT) */}
                        {step === 'forgot' && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Recover Password</h2>
                                    <p className="text-gray-600">Introdu email-ul tău pentru a primi codul de resetare.</p>
                                </div>

                                <form onSubmit={handleForgotPassword} className="space-y-5">
                                    <div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-5 h-5 text-gray-400" /></div>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-gray-50 rounded-xl pl-12 pr-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                                        Send Reset Code
                                    </button>

                                    <button type="button" onClick={() => setStep('auth')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                        <ArrowLeft className="w-4 h-4" /> Back to Login
                                    </button>
                                </form>
                            </>
                        )}

                        {/* STAREA 4: SALVARE PAROLĂ NOUĂ BIFAȚI CODUL (RESET) */}
                        {step === 'reset' && (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
                                    <p className="text-gray-600">Introdu codul de resetare printat în consola serverului și noua parolă.</p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Reset Code (din consola backend)</label>
                                        <input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Introdu codul de 6 cifre" className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-2 block">New Password</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minim 6 caractere" className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none transition-colors" required />
                                    </div>

                                    <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg">
                                        Update Password
                                    </button>
                                </form>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
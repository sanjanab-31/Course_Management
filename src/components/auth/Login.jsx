import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import { Mail, Lock, AlertCircle, User, BookOpen, Shield } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Auto-dismiss error after 5 seconds or on any click within the page
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(''), 5000);
        const handleAnyClick = () => setError('');
        window.addEventListener('click', handleAnyClick, { once: true });
        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleAnyClick);
        };
    }, [error]);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Role is determined by the user's account, but for login UI we might want to show context
    // or just let them login and redirect based on role. 
    // However, the prompt asked for "Student login", "Teachers login", "admin".
    // Often this implies a visual separation or just a single login that handles all.
    // I will add a visual indicator or tab to make it feel like distinct portals, 
    // even if the underlying auth is the same.
    const [activeTab, setActiveTab] = useState('student');

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(false);
            const cred = await login(email, password);
            const emailAddr = cred?.user?.email || '';
            const inferredRole = emailAddr.includes('teacher')
                ? 'teacher'
                : 'student';

            if (inferredRole !== activeTab) {
                // Wrong portal selected for the user's role
                setError(`Please use the ${inferredRole} portal to login.`);
                // Sign out to prevent staying logged in under wrong tab
                try {
                    const { signOut } = await import('firebase/auth');
                    const { auth } = await import('../../config/firebase');
                    await signOut(auth);
                } catch { }
                return;
            }

            // Redirect by role to dedicated portals
            const redirectPath = inferredRole === 'student' ? '/student' : '/teacher';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            console.error(err);
            setError('Failed to log in: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    const tabs = [
        { id: 'student', label: 'Student', icon: User },
        { id: 'teacher', label: 'Teacher', icon: BookOpen },
    ];

    async function handleSetupDemo() {
        const demoUsers = [
            { email: 'student@gmail.com', password: 'Student123', name: 'Demo Student', role: 'student' },
            { email: 'teacher@gmail.com', password: 'Teacher123', name: 'Demo Teacher', role: 'teacher' },
            { email: 'admin@gmail.com', password: 'Admin123', name: 'Demo Admin', role: 'admin' }
        ];

        setLoading(false);
        try {
            for (const user of demoUsers) {
                try {
                    await signup(user.email, user.password, user.name, user.role);
                    console.log(`Created ${user.role}`);
                    // We need to logout immediately because signup logs us in
                    await login(user.email, user.password); // Re-verify login or just logout
                    // Actually signup returns userCredential, so we are logged in.
                    // We just need to logout to create the next one.
                    // But wait, useAuth().logout might not be available directly inside the loop if we rely on context state updates which might be async.
                    // However, firebase auth is synchronous-ish for the object state but the promise resolves.
                    // Let's just use the auth instance directly or the context function.
                    // Context logout calls signOut(auth).

                    // Small delay to ensure firestore write completes if needed, though await setDoc in signup should handle it.
                } catch (e) {
                    if (e.code === 'auth/email-already-in-use') {
                        console.log(`${user.email} already exists.`);
                    } else {
                        throw e;
                    }
                }
                // Force logout to clear session for next creation
                const { signOut } = await import('firebase/auth');
                const { auth } = await import('../../config/firebase');
                await signOut(auth);
            }
            setError('');
            alert('Demo accounts created! You can now login.');
        } catch (err) {
            console.error(err);
            setError('Setup failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle={`Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        >
            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  `}
                                >
                                    <Icon className={`
                    ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                    -ml-0.5 mr-2 h-5 w-5
                  `} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Don't have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <Link
                        to="/signup"
                        className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;

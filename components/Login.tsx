import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { UserRole, LoginProps } from '../types';
import { Shield, Lock, Smartphone, Mail, ArrowRight, ChevronLeft, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const { t, i18n } = useTranslation();
  const [loginMethod, setLoginMethod] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: OTP/Password

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && loginMethod === 'OTP') {
      setStep(2);
      return;
    }
    
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(selectedRole);
    }, 1500);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language === 'hi' ? 'HI' : 'EN';

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">EN</div>
              <span className="font-bold text-2xl tracking-tight">EduNexus ERP</span>
            </div>
            <h1 className="text-4xl font-serif font-bold leading-tight mb-4">
              {t('hero.title_prefix') + t('hero.title_highlight')}
            </h1>
            <p className="text-slate-300 text-lg max-w-md">
              {t('hero.description')}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Shield size={16} /> ISO 27001 Certified</span>
              <span className="flex items-center gap-2"><Lock size={16} /> 256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          
          <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium transition">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <button 
              onClick={() => changeLanguage(currentLang === 'EN' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-sm font-bold text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition"
            >
              <Globe size={14} /> {currentLang}
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{t('login.welcome')}</h2>
            <p className="text-slate-500">{t('login.subtitle')}</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-100 p-1 rounded-lg">
            {[UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-2 text-sm font-medium rounded-md transition-all ${
                  selectedRole === role 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role === UserRole.STUDENT ? t('login.role_student') : role === UserRole.FACULTY ? t('login.role_faculty') : t('login.role_admin')}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {loginMethod === 'EMAIL' ? t('login.email_label') : t('login.mobile_label')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {loginMethod === 'EMAIL' ? <Mail size={18} /> : <Smartphone size={18} />}
                  </div>
                  <input
                    type={loginMethod === 'EMAIL' ? 'email' : 'tel'}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder={loginMethod === 'EMAIL' ? 'student@edunexus.ac.in' : '+91 98765 43210'}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                   {loginMethod === 'EMAIL' ? 'Password' : 'OTP'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={loginMethod === 'EMAIL' ? 'password' : 'text'}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder={loginMethod === 'EMAIL' ? '••••••••' : '123456'}
                    autoFocus
                    required
                  />
                </div>
                {loginMethod === 'OTP' && (
                  <p className="text-xs text-blue-600 mt-2 text-right cursor-pointer hover:underline">Resend OTP</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  {step === 1 && loginMethod === 'OTP' ? 'Get OTP' : t('login.btn')} 
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button 
              onClick={() => { setLoginMethod(m => m === 'EMAIL' ? 'OTP' : 'EMAIL'); setStep(1); }}
              className="text-slate-600 font-medium hover:text-blue-600 transition"
            >
              {loginMethod === 'EMAIL' ? 'Use Mobile OTP' : 'Use Password'}
            </button>
            <a href="#" className="text-blue-600 font-medium hover:underline">Trouble logging in?</a>
          </div>

          <p className="mt-8 text-xs text-center text-slate-400 leading-relaxed">
            Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
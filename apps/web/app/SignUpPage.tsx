"use client"
import React, { useState } from 'react';
import { Mail, Lock, User, AtSign, ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  
  // Password strength criteria
  const passwordCriteria = [
    { id: 'length', label: 'At least 8 characters', met: formData.password.length >= 8 },
    { id: 'uppercase', label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { id: 'lowercase', label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { id: 'number', label: 'Contains a number', met: /\d/.test(formData.password) },
    { id: 'special', label: 'Contains special character', met: /[!@#$%^&*]/.test(formData.password) }
  ];
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    return strength;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setFormErrors({});
      
      try {
        // TODO: Replace with your actual API call
        // Example: const response = await fetch('/api/auth/signup', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success!
        setSignUpSuccess(true);
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (error) {
        console.error('Error during sign up:', error);
        setFormErrors({ submit: 'Failed to create account. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Welcome to BetPal! Your account has been created and you're ready to start your betting journey.</p>
            <Link 
              href="/login" 
              className="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Continue to Login
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-600 mr-2"></div>
            <span className="font-bold text-2xl text-gray-900">BetPal</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
          <p className="text-gray-600 mt-2">Join the fun and start betting with friends</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${formErrors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${formErrors.username ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
            
            {/* Password strength meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-600">Password strength</span>
                  <span className="text-xs font-semibold">
                    {passwordStrength === 0 && 'Very Weak'}
                    {passwordStrength === 1 && 'Weak'}
                    {passwordStrength === 2 && 'Fair'}
                    {passwordStrength === 3 && 'Good'}
                    {passwordStrength === 4 && 'Strong'}
                    {passwordStrength === 5 && 'Very Strong'}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      passwordStrength <= 1 ? 'bg-red-500' : 
                      passwordStrength <= 2 ? 'bg-orange-500' : 
                      passwordStrength <= 3 ? 'bg-yellow-500' : 
                      passwordStrength <= 4 ? 'bg-green-500' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordCriteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-center text-xs">
                      {criterion.met ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                      )}
                      <span className={criterion.met ? 'text-green-600' : 'text-gray-500'}>
                        {criterion.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
          </div>
          
          {formErrors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-colors flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
          
          <div className="text-center text-sm text-gray-600">
            <p>
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
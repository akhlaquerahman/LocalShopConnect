import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLoginMutation } from '../services/auth.mutation';
import { useNotificationStore } from '@/store/notificationStore';
import { authStorage } from '../services/auth.storage';
import { Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useNotificationStore();
  const { mutateAsync: loginMutate, isPending } = useLoginMutation();

  const savedEmail = authStorage.getRememberMe();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail || '',
      password: '',
    },
  });

  const { handleSubmit, register, formState: { errors } } = methods;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutate({
        email: values.email,
        password: values.password,
        rememberMe: true, // Auto remember based on new design
      });

      addToast({
        title: 'Welcome Back!',
        message: `Authenticated as ${response.user.name} (${response.user.role})`,
        type: 'success',
      });

      const role = response.user.role;
      if (response.user.status === 'PENDING_VERIFICATION' || response.user.status === 'PENDING_KYC') {
        navigate('/auth/under-review');
      } else if (role === 'customer') {
        navigate('/app');
      } else if (role === 'seller') {
        navigate('/seller');
      } else if (role === 'rider') {
        navigate('/rider');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      addToast({
        title: 'Login Error',
        message: err.message || 'Verification failed. Try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full space-y-8 bg-white text-gray-900">
      
      {/* Top Logo and Header */}
      <div className="space-y-6">
        <h1 className="text-[#F47560] font-bold text-xl tracking-tight">Logo Here</h1>
        
        <div className="space-y-1">
          <p className="text-gray-400 text-xs">Welcome back !!!</p>
          <h2 className="text-4xl font-bold tracking-tight">Sign in</h2>
        </div>
      </div>

      {searchParams.get('reason') === 'session_expired' && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500 font-medium text-left">
          Your session expired due to inactivity. Please sign in again.
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="test@gmail.com"
              {...register('email')}
              className={`w-full px-4 py-3 bg-[#FFF5F2] border-none rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#F47560]/20 transition-all ${errors.email ? 'ring-1 ring-red-500' : ''}`}
            />
            {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700">Password</label>
              <Link
                to="/auth/forgot-password"
                className="text-[10px] font-medium text-gray-400 hover:text-[#F47560] transition-colors"
              >
                Forgot Password ?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-4 py-3 bg-[#FFF5F2] border-none rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#F47560]/20 transition-all ${errors.password ? 'ring-1 ring-red-500' : ''}`}
            />
            {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-[#F47560] hover:bg-[#E06350] text-white text-xs font-bold tracking-widest rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
              SIGN IN <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </FormProvider>

      {/* Footer text */}
      <div className="text-center pt-6">
        <p className="text-xs text-gray-400">
          I don't have an account ?{' '}
          <Link to="/auth/register" className="font-medium text-[#F47560] hover:underline">
            Sign up
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;

import react, { useContext } from 'react';
import { useForm } from "react-hook-form"
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';


function Login() {
    const { Login, loading } = useContext(UserContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        // e.preventdefault();
        await Login(data);
        navigate("/");

    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-md'>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-6 text-center'>Welcome Back</h2>
                    <p className='text-center text-gray-600 mb-8'>Sign in to your account to continue</p>

                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder='Enter your email...'
                                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <span className='text-red-500 text-sm font-medium mt-1 block'>Email is required</span>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder='Enter your password...'
                                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                                {...register("password", { required: true, minLength: 6 })}
                            />
                            {errors.password && <span className='text-red-500 text-sm font-medium mt-1 block'>Password must be at least 6 characters</span>}
                        </div>

                        {/* Submit Button */}
                        <button
                            className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='flex items-center justify-center gap-2'>
                                    <svg className='animate-spin w-5 h-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : "Login"}
                        </button>
                    </form>

                    <p className='text-center text-gray-600 mt-6'>
                        Don't have an account?{' '}
                        <a href='/CreateAccount' className='text-blue-600 font-semibold hover:text-blue-700'>Sign up here</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;
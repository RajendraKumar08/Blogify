import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import UserContext from "../../../src/context/UserContext";


function CreateAccount() {

  const navigate = useNavigate();
  const { CreateAccount, loading } = useContext(UserContext);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const imageFile = watch("profileImg");
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    await CreateAccount(data);
    navigate("/");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2 text-center'>Create Account</h2>
          <p className='text-center text-gray-600 mb-8'>Join our community and start blogging</p>

          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            
            {/* Name Field */}
            <div>
              <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-2'>Full Name *</label>
              <input 
                name='name' 
                id='name' 
                type="text"
                placeholder='Enter your full name...'
                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                {...register("name", { required: "Name is required" })} 
              />
              {errors.name && <span className='text-red-500 text-sm font-medium mt-1 block'>Name is required</span>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>Email Address *</label>
              <input 
                name='email' 
                id='email' 
                type="email"
                placeholder='Enter your email...'
                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                {...register("email", { required: "Email is required" })} 
              />
              {errors.email && <span className='text-red-500 text-sm font-medium mt-1 block'>Email is required</span>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>Password *</label>
              <input 
                name='password' 
                id='password' 
                type="password"
                placeholder='Enter a password (min 6 characters)...'
                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                {...register("password", { required: "Password is required", minLength: 6 })} 
              />
              {errors.password && <span className='text-red-500 text-sm font-medium mt-1 block'>Password must be at least 6 characters</span>}
            </div>

            {/* Profile Image Field */}
            <div>
              <label htmlFor='profileImg' className='block text-sm font-semibold text-gray-700 mb-2'>Profile Picture *</label>
              <div className='space-y-3'>
                <input
                  id='profileImg'
                  type="file"
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 
                  file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer file:font-semibold
                  hover:border-blue-500 focus:border-blue-500 outline-none transition duration-200 cursor-pointer"
                  {...register("profileImg", {
                    required: "Profile image is required",
                    validate: {
                      maxSize: (files) =>
                        files?.[0]?.size <= 10 * 1024 * 1024 || "Max file size is 10MB",
                    },
                  })}
                />
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className='rounded-lg overflow-hidden shadow-md'>
                    <img src={imagePreview} alt="Profile Preview" className='w-full h-40 object-cover' />
                  </div>
                )}
              </div>
              {errors.profileImg && <span className='text-red-500 text-sm font-medium mt-1 block'>{errors.profileImg.message}</span>}
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
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className='text-center text-gray-600 mt-6'>
            Already have an account?{' '}
            <a href='/Login' className='text-blue-600 font-semibold hover:text-blue-700'>Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
import React, { useContext } from 'react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// axios not used here
import UserContext from "../../../src/context/UserContext";



function CreateAccount() {

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [salt, setSalt] = useState("");


  const navigate = useNavigate();
  const { CreateAccount } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    await CreateAccount(data);
    navigate("/");
  };


  return (
    <>
      <div className='h-full'>

        <form className='flex flex-col p-4 max-w-md mx-auto' onSubmit={handleSubmit(onSubmit)}>
          <h2 className='text-2xl font-bold mb-4'>Create Account</h2>
          <label className='mb-2 font-semibold'>Name</label>
          <input name='name' id='name' className='border p-2 mb-4' type="text" {...register("name", { required: true })} />
          {errors.name && <span className='text-red-500 mb-4'>This field is required</span>}
          <label className='mb-2 font-semibold'>Email</label>
          <input name='email' id='email' className='border p-2 mb-4' type="email" {...register("email", { required: true })} />
          {errors.email && <span className='text-red-500 mb-4'>This field is required</span>}
          <label className='mb-2 font-semibold'>Password</label>
          <input name='password' id='password' className='border p-2 mb-4' type="password" {...register("password", { required: true, minLength: 6 })} />
          {errors.password && <span className='text-red-500 mb-4'>This field is required with minimum 6 characters</span>}
          <label>Profile image</label>
          <input
            className='border mb-4 hover:cursor-pointer p-2'
            type="file"
            {...register("profileImg", {
              required: true,
              validate: {
                maxSize: (files) =>
                  files?.[0]?.size <= 10 * 1024 * 1024 || "Max file size is 2MB",
              },
            })}
          />

          {errors.profileImg && (
            <span className='text-red-500 mb-4'>{errors.profileImg.message}</span>
          )}
          <button className='bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900 transition-all' type="submit">Create Account</button>
        </form  >
      </div>
    </>
  );
}

export default CreateAccount;
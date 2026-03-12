import react, { useContext } from 'react';
import { useForm } from "react-hook-form"
import UserContext from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';


function Login() {
    const { Login } = useContext(UserContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async  (data) => {
        // e.preventdefault();
        await Login(data);
        navigate("/");
        
    }

    return (
        <>
            <div className='h-full'>

                <form className='flex flex-col p-4 max-w-md mx-auto' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className='text-2xl font-bold mb-4'>Login</h2>
                    <label className='mb-2 font-semibold'>Email</label>
                    <input className='border p-2 mb-4' type="email" {...register("email", { required: true })} />
                    {errors.email && <span className='text-red-500 mb-4'>This field is required</span>}
                    <label className='mb-2 font-semibold'>Password</label>
                    <input className='border p-2 mb-4' type="password" {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && <span className='text-red-500 mb-4'>This field is required with minimum 6 characters</span>}
                    <button className='bg-blue-500 text-white p-2 rounded' type="submit">Login</button>
                </form  >
            </div>
        </>
    )
}

export default Login;
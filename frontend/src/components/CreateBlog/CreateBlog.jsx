import React, { useContext } from 'react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogContext from "../../../src/context/BlogContext";
import BlogEditor from '../BlogEditor/BlogEditor';

const CreateBlog = () => {

    const navigate = useNavigate();
    const { create_blog } = useContext(BlogContext);
    const [content, setcontent] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const {loading} = useContext(BlogContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm()

    const imageFile = watch("image");
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
        data.content = content;
        console.log("data", data)
        await create_blog(data);
        navigate("/");
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-2xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-2'>Create New Blog</h1>
                    <p className='text-gray-600'>Share your thoughts and ideas with the world</p>
                </div>

                {/* Form Card */}
                <div className='bg-white rounded-lg shadow-lg p-6 sm:p-8'>
                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>

                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className='block text-sm font-semibold text-gray-700 mb-2'>Blog Title *</label>
                            <input 
                                id="title"
                                type="text" 
                                placeholder='Enter an engaging title...'
                                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200'
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && <span className='text-red-500 text-sm font-medium mt-1 block'>{errors.title.message}</span>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className='block text-sm font-semibold text-gray-700 mb-2'>Description (max 100 characters) </label>
                            <textarea 
                                id="description"
                                placeholder='Write a brief description of your blog...If you dont want to write description, you can leave it blank our AI will generate description for you.'
                                rows='3'
                                className='w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 resize-none'
                                {...register("Discription", {
                                    maxLength: { value: 100, message: "Description must be less than 100 characters" }
                                })}
                            />
                            {errors.Discription && <span className='text-red-500 text-sm font-medium mt-1 block'>{errors.Discription.message}</span>}
                        </div>

                        {/* Image Upload Field */}
                        <div>
                            <label htmlFor="image" className='block text-sm font-semibold text-gray-700 mb-2'>Cover Image *</label>
                            <div className='space-y-3'>
                                <input
                                    id="image"
                                    type="file"
                                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 
                                    file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer file:font-semibold
                                    hover:border-blue-500 focus:border-blue-500 outline-none transition duration-200 cursor-pointer"
                                    {...register("image", {
                                        required: "Please select an image",
                                        validate: {
                                            fileSize: (value) => {
                                                if (!value[0]) return true;
                                                return value[0].size <= 20000000 || "File size must be less than 2MB";
                                            },
                                            fileType: (value) => {
                                                if (!value[0]) return true;
                                                return (
                                                    ["image/jpeg", "image/png", "image/gif"].includes(value[0].type) ||
                                                    "Only JPEG, PNG, and GIF files are allowed"
                                                );
                                            },
                                        },
                                    })}
                                />
                                
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className='mt-4 rounded-lg overflow-hidden shadow-md'>
                                        <img src={imagePreview} alt="Preview" className='w-full h-48 sm:h-64 object-cover' />
                                    </div>
                                )}
                            </div>
                            {errors.image && <span className='text-red-500 text-sm font-medium mt-1 block'>{errors.image.message}</span>}
                        </div>

                        {/* Content Editor Field */}
                        <div>
                            <label htmlFor="content" className='block text-sm font-semibold text-gray-700 mb-2'>Content *</label>
                            <BlogEditor setContent={setcontent} />
                        </div>

                        {/* Submit Button */}
                        <div className='flex gap-3 pt-6'>
                            <button
                                className={`flex-1 font-semibold py-3 rounded-lg transition-all duration-200 shadow-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'}`}
                                type="submit"
                                disabled={loading}>
                                {loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg className='animate-spin w-5 h-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : "Publish Blog"}
                            </button>
                            <button
                                className='flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50'
                                type="button"
                                disabled={loading}
                                onClick={() => navigate("/")}>
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateBlog;
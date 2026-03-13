import React, { useContext } from 'react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// axios not used here
import BlogContext from "../../../src/context/BlogContext";
import BlogEditor from '../BlogEditor/BlogEditor';



const CreateBlog = () => {

    const navigate = useNavigate();
    const { create_blog } = useContext(BlogContext);
    const [content, setContent] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        console.log("data", data)
        await create_blog(data);
        navigate("/");
    }



    return (
        <>
            <div className='border h-full flex flex-col p-4 align-center justify-center'>
                <h1 className='text-2xl font-bold mb-4'>Create Blog</h1>

                <form className='flex flex-col justify-center align-center w-2xl' action="" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" className='border p-2 mb-4' {...register("title", { required: "Title is required" })} />
                    {errors.title && <span className='text-red-500 mb-4'>{errors.title.message}</span>}
                    <label htmlFor="content">Content</label>
                    <textarea id="content" name="content" className='border p-2 mb-4' {...register("content", { required: "Content is required" })}></textarea>
                    {errors.content && <span className='text-red-500 mb-4'>{errors.content.message}</span>}
                    <label htmlFor="Discription">Discription (maximum 60 characters)</label>
                    <input id="Discription" name="Discription" className='border p-2 mb-4' {...register("Discription", { maxLength: { value: 100, message: "Description must be less than 60 characters" } })}></input>
                    {errors.Discription && <span className='text-red-500 mb-4'>{errors.Discription.message}</span>}
                    <label htmlFor="imageUrl">Upload a Cover Image</label>
                    <input
                        type="file"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer
             file:bg-white file:text-blue-600 file:border-0
             file:px-4 file:py-2 file:rounded-md file:cursor-pointer
             hover:bg-blue-700 transition duration-200 mb-4"
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

                    {errors.image && <span className='text-red-500 mb-4'>{errors.image.message}</span>}
                    <BlogEditor setContent={setContent} />
                    <button className='bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900 transition-all' type="submit">Create Blog</button>
                </form>
            </div>



        </>
    )




}

export default CreateBlog;
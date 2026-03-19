import React, { useContext } from 'react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogContext from "../../../src/context/BlogContext";
import BlogEditor from '../BlogEditor/BlogEditor';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const EditBlog = () => {

    const navigate = useNavigate();
    const { create_blog, update_blog } = useContext(BlogContext);
    const [content, setcontent] = useState("");
    const { id } = useParams();
    const { fetch_blog, blog } = useContext(BlogContext);

    useEffect(() => {
        fetch_blog(id);
    }, [id, fetch_blog]);

    useEffect(() => {
        if (blog) {
            setValue("title", blog.title);
            setValue("Discription", blog.discription);

            setcontent(
                typeof blog.content === "string"
                    ? JSON.parse(blog.content)
                    : blog.content
            );
        }
    }, [blog]);


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {

        data.content = content;

        console.log("data", data)

        await update_blog(id, data);

        navigate(`/blog/${id}`);
    }

    return (
        <>
            <div className='border h-full flex flex-col p-4 align-center justify-center'>
                <h1 className='text-2xl font-bold mb-4'>Edit Your Blog</h1>

                <form className='flex flex-col justify-center align-center w-2xl' onSubmit={handleSubmit(onSubmit)}>

                    <label htmlFor="title">Title</label>
                    <input type="text" className='border p-2 mb-4'
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <span className='text-red-500 mb-4'>{errors.title.message}</span>}


                    <label>Description (maximum 60 characters)</label>
                    <input className='border p-2 mb-4'
                        {...register("Discription", {
                            maxLength: { value: 100, message: "Description must be less than 60 characters" }
                        })}
                    />
                    {errors.Discription && <span className='text-red-500 mb-4'>{errors.Discription.message}</span>}


                    <label>Current Cover Image</label>
                    {blog?.imageUrl && (
                        <div className="mb-4">
                            <img
                                src={`http://localhost:3000${blog.imageUrl}`}
                                alt="Current cover"
                                className="max-w-xs max-h-48 object-cover border rounded mb-2"
                            />
                            <p className="text-sm text-gray-600">Current image - upload a new one to replace it</p>
                        </div>
                    )}

                    <label>Upload New Cover Image (Optional)</label>
                    <input
                        type="file"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer
                        file:bg-white file:text-blue-600 file:border-0
                        file:px-4 file:py-2 file:rounded-md file:cursor-pointer
                        hover:bg-blue-700 transition duration-200 mb-4"

                        {...register("image", {
                            validate: {
                                fileSize: (value) => {
                                    if (!value || !value[0]) return true;
                                    return value[0].size <= 20000000 || "File size must be less than 2MB";
                                },
                                fileType: (value) => {
                                    if (!value || !value[0]) return true;
                                    return (
                                        ["image/jpeg", "image/png", "image/gif"].includes(value[0].type) ||
                                        "Only JPEG, PNG, and GIF files are allowed"
                                    );
                                },
                            },
                        })}
                    />

                    {errors.image && <span className='text-red-500 mb-4'>{errors.image.message}</span>}
                    <label>Content</label>

                    <BlogEditor setContent={setcontent} initialContent={content} />


                    <button
                        className='bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900 transition-all'
                        type="submit">
                        Update Blog
                    </button>

                </form>
            </div>
        </>
    )

}

export default EditBlog;
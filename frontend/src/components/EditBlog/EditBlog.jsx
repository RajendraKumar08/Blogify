import React, { useContext } from 'react';
import { useForm } from "react-hook-form"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogContext from "../../../src/context/BlogContext";
import BlogEditor from '../BlogEditor/BlogEditor';
import { getImageUrl } from '../../utils/image';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const EditBlog = () => {

    const navigate = useNavigate();
    const { create_blog, update_blog, loading } = useContext(BlogContext);
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
  <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
    
    <h1 className="text-3xl font-bold mb-2">Edit Blog</h1>
    <p className="text-gray-600 mb-6">Update your blog content</p>

    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-md flex flex-col gap-4"
    >

      {/* Title */}
      <div>
        <label className="font-medium">Blog Title *</label>
        <input
          type="text"
          className="w-full border p-2 rounded mt-1 focus:outline-blue-500"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="font-medium">Description</label>
        <input
          className="w-full border p-2 rounded mt-1 focus:outline-blue-500"
          {...register("Discription", {
            maxLength: {
              value: 100,
              message: "Max 100 characters allowed",
            },
          })}
        />
        {errors.Discription && (
          <span className="text-red-500 text-sm">
            {errors.Discription.message}
          </span>
        )}
      </div>

      {/* Current Image */}
      {blog?.imageUrl && (
        <div>
          <label className="font-medium">Current Cover Image</label>
          <img
            src={getImageUrl(blog.imageUrl)}
            alt="cover"
            className="mt-2 w-full max-h-52 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Upload New Image */}
      <div>
        <label className="font-medium">Upload New Cover Image</label>
        <input
          type="file"
          className="w-full mt-2 border p-2 rounded file:bg-blue-500 file:text-white file:px-3 file:py-1 file:rounded-md file:border-0 cursor-pointer"
          {...register("image")}
        />
        {errors.image && (
          <span className="text-red-500 text-sm">
            {errors.image.message}
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="font-medium">Content *</label>
        <div className="mt-2 border rounded p-2">
          <BlogEditor setContent={setcontent} initialContent={content} />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="submit"
          className={`w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : 'Update Blog'}`}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          disabled={loading}
        >
          Cancel
        </button>
      </div>

    </form>
  </div>
);

}

export default EditBlog;
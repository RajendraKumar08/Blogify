import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import BlogContext from "../../context/BlogContext";
import userContext from "../../context/UserContext";
import { useForm } from "react-hook-form";
import ChatBot from "../ChatBot/ChatBot";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {

  const { id } = useParams();
  const { fetch_blog, blog, create_comment, fetch_comments, comments, likeBlog, deleteBlog } = useContext(BlogContext);
  const { user, managelike, fetchUser } = useContext(userContext);

  const isBlogLikedByUser = Boolean(
    blog && user && blog.likes && blog.likes.some((id) => id.toString() === user._id.toString())
  );

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()


  useEffect(() => {
    if (id) {
      console.log("Fetching blog with id:", id);
      fetch_blog(id);
      fetch_comments();
    }
    
  }, [id, fetch_blog, comments.length]);
  

  const onSubmit = async (data) => {
    console.log("Comment data", data)
    data.blogId = blog._id;
    console.log("Comment data after appending blogId", data)
    await create_comment(data);
    reset();
  }
  

  const handlelike = () => {
    if(!user){
      alert("Please login to like the blog");
      return;
    }
    else{
      likeBlog(blog._id);
      managelike(blog);
    }
    fetch_blog(id);
    // fetchUser();

  }

  const handleDelete = async () => {
    try {
      await deleteBlog(blog._id);
      navigate('/');
    } catch (error) {
      console.error('Delete failed', error);
      alert('Unable to delete blog. Please try again.');
    }
  }

  return (
    <>
      {blog ? (
        <>
          <div className="flex flex-col justify-center items-center">
            {blog.imageUrl && <img className="border mt-3.5" width={623} src={`http://localhost:3000${blog.imageUrl}`} alt={blog.title} />}
            <h1 className="font-bold text-2xl text-center">{blog.title}</h1>
            <p className="w-1/2 text-center mt-1.5">{blog.content}</p>
            <button onClick={handlelike} className="border px-3 hover:cursor-pointer hover:bg-blue-400 transition-all hover:text-white">
              {blog.likes.length} {isBlogLikedByUser ? "Liked" : "Like"}
            </button>
            <div>
              <p>Created By : {blog.createdBy.name}</p>
              {blog.createdBy._id === user?._id && <button onClick={handleDelete} className="border px-3 hover:cursor-pointer hover:bg-red-400 transition-all hover:text-white">
                Delete Blog
              </button>}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-5">
            <h2 className="font-bold text-xl mt-5 mb-3.5">Comments</h2>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <input type="text" id="content" name="content" className='border p-2 mb-4 mr-2' {...register("content", { required: true })} />
              <button className='bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900 transition-all' type="submit">Add comment</button>
            </form>
            <div>
              {comments.filter(comment => comment.blog == blog._id).map(filteredComment => (
                <div key={filteredComment._id} className="border p-2 m-2">
                  <div className="flex items-center align-center justify-start gap-2 mt-1.5">
                  <img width="30" className="rounded-full object-cover h-12 w-12" src={`http://localhost:3000${filteredComment.createdBy.profileImg}`} alt="" />
                    <p className="text-sm opacity-60">{filteredComment.createdBy.name}</p>
                  </div>
                  <p className="font-bold">{filteredComment.content}</p>
                </div>
              ))}
            </div>
          </div>
          <ChatBot />
        </>

      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}


export default BlogPage;

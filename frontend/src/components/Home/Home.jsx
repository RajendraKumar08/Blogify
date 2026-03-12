import React, { useContext } from "react";
import BlogContext from "../../context/BlogContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import ChatBot from "../ChatBot/ChatBot";

import { useEffect } from "react";

function Home() {
  const { blogs, fetch_blogs, searchBlogs } = useContext(BlogContext);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm()


  useEffect(() => {
    fetch_blogs();
    console.log("Blogs fetched", blogs);
  }, []);

  const onSubmit = async (data) => {
    console.log("Search data", data);
    // Implement search functionality here
    await searchBlogs(data.q);
  }
  const handle_mouse_move = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const center_x = rect.width / 2;
    const center_y = rect.height / 2;

    const rotate_x = ((y - center_y) / center_y) * 10;
    const rotate_y = ((x - center_x) / center_x) * -10;

    card.style.transform = `perspective(1000px) rotateX(${rotate_x}deg) rotateY(${rotate_y}deg) scale(1)`;
  };

  const handle_mouse_leave = (e) => {
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };


  return (
    <>
      <div className="h-full border p-4">
        <div className="flex p-4  w-full  justify-between items-center mb-4">
          <div className="flex ">
            <form action="" onSubmit={handleSubmit(onSubmit)} className="flex mr-4">
              <input className="mr-2 border" type="text" name="q" {...register("q")} placeholder="Search blogs..." />
              <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer transition-all px-4 py-2 rounded">Search</button>
            </form>
          </div>
          <div>
            Filter
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {blogs && blogs.filter(blog => blog).map((blog) => (
            <div onMouseMove={handle_mouse_move} onMouseLeave={handle_mouse_leave} key={blog._id} className="hover:scale-105 transition-scale duration-100 border p-4 m-4 flex flex-col justify-center items-center align-center text-center hover: cursor-pointer ">
              <img className="w-80" src={`http://localhost:3000${blog.imageUrl}`} alt="" />
              <h2 className="text-xl font-bold mb-2">{blog.title.substr(0, 2)}</h2>
              <p>{blog.discription ? blog.discription : "No description available"}</p>
              <Link className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mx-2 w-full hover:bg-blue-800 transition-all" to={`/Blog/${blog._id}`}>Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;

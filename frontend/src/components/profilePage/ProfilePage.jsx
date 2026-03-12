import react, { useContext, useEffect } from 'react';
import BlogContext from '../../context/BlogContext';
import UserContext from '../../context/UserContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {

    const { user } = useContext(UserContext);
    const { blogs, fetch_blogs } = useContext(BlogContext);

    useEffect(() => {
        fetch_blogs();
        console.log("Blogs fetched in profile page", blogs);
    }, []);
    console.log("User in profile page", user);
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='border flex items-center p-4 m-4'>
                <img
                    src={`http://localhost:3000${user.profileImg}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 m-2 border-gray-300 shadow-md"
                />

                <div>
                    <h1 className='ml-4 font-extrabold'>{user.name}</h1>
                    <p className='ml-4 text-sm opacity-60'>Total Blogs created: {blogs.filter(blog => blog.createdBy._id == user._id).length}</p>
                </div>
            </div>
            <div>
                <h1>Blogs created by {user.name}</h1>
                <div>
                    {/* Render user's blogs here */}
                    {blogs.filter(blog => blog.createdBy._id == user._id).map(filteredBlog => (
                        <div key={filteredBlog._id} className="border p-4 m-4 flex items-center">
                            <img className="w-80" src={`http://localhost:3000${filteredBlog.imageUrl}`} alt="" />
                            <div className=' flex flex-col'>
                                <h1 className='text-center font-bold'>{filteredBlog.title}</h1>
                                <p className='text-center'>{filteredBlog.content.substr(0, 10)}</p>
                                <Link className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mx-2 w-full hover:cursor-pointer hover:bg-blue-800 transition" to={`/blog/${filteredBlog._id}`}>Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="likedblogs">
                <h1>Liked Blogs</h1>
                {blogs.filter(blog => user.likedBlogs.includes(blog._id)).map(likedBlog => (
                    <div key={likedBlog._id} className="border p-4 m-4 flex items-center">
                        <img className="w-80" src={`http://localhost:3000${likedBlog.imageUrl}`} alt="" />
                        <div className=' flex flex-col'>
                            <h1 className='text-center font-bold'>{likedBlog.title}</h1>
                            <p className='text-center'>{likedBlog.content.substr(0, 10)}</p>
                            <Link className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mx-2 w-full hover:cursor-pointer hover:bg-blue-800 transition" to={`/blog/${likedBlog._id}`}>Read More</Link>
                        </div>
                    </div>
                ))}
            </div> */}
        </>
    )
}

export default ProfilePage;
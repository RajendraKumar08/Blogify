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
            <h1 className='px-4 my-4 text-center text-3xl font-bold'>Profile</h1>
            <div className='border flex items-center p-4 m-4'>
                <img
                    src={`http://localhost:3000${user.profileImg}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 m-2 border-gray-300 shadow-md"
                />

                <div>
                    <h1 className='ml-4 font-extrabold'>{user.name}</h1>
                    <p className='ml-4 text-sm opacity-60'>Total Blogs created: {blogs.filter(blog => blog.createdBy && blog.createdBy._id && blog.createdBy._id.toString() === user._id).length}</p>
                    <p className='ml-4 text-sm opacity-60'>Total Blogs liked: {user.likedBlogs ? user.likedBlogs.length : 0}</p>
                </div>
            </div>
            <div>
                <h1 className='px-4 font-bold'>Blogs created by you</h1>
                <div className='grid grid-cols-4'>
                    {/* Render user's blogs here */}
                    {blogs.filter(blog => blog.createdBy && blog.createdBy._id && blog.createdBy._id.toString() === user._id).map(filteredBlog => (
                        <div key={filteredBlog._id  } className="border p-4 m-4 flex flex-col items-center">
                            <img className="w-80" src={`http://localhost:3000${filteredBlog.imageUrl}`} alt="" />
                            <div className=' flex flex-col'>
                                <h1 className='text-center font-bold'>{filteredBlog.title}</h1>
                                <p className='text-center'>{filteredBlog.content.substr(0, 10)}</p>
                                <Link className="bg-blue-500 text-white text-center px-4 py-2 rounded ml-2 mx-2  hover:cursor-pointer hover:bg-blue-800 transition" to={`/blog/${filteredBlog._id}`}>Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className='px-4 font-bold'>Liked Blogs</h1>
                <div className='grid grid-cols-4'>
                    {/* Render liked blogs here */}
                    {blogs.filter(blog => {
                        if (!user.likedBlogs || !Array.isArray(user.likedBlogs)) return false;
                        return user.likedBlogs.some(id => id && typeof id === 'string' && id === blog._id);
                    }).map(filteredBlog => (
                        <div key={filteredBlog._id} className="border p-4 m-4 flex flex-col items-center">
                            <img className="w-80" src={`http://localhost:3000${filteredBlog.imageUrl}`} alt="" />
                            <div className=' flex flex-col'>
                                <h1 className='text-center font-bold'>{filteredBlog.title}</h1>
                                <p className='text-center'>{filteredBlog.content.substr(0, 10)}</p>
                                <Link className="bg-blue-500 text-white text-center px-4 py-2 rounded ml-2 mx-2  hover:cursor-pointer hover:bg-blue-800 transition" to={`/blog/${filteredBlog._id}`}>Read More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            
        </>
    )
}

export default ProfilePage;
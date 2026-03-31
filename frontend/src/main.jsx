import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home/Home.jsx'
import CreateBlog from './components/CreateBlog/CreateBlog.jsx'
import CreateAccount from './components/CreateAccount/CreateAccount.jsx'
import Login from './components/Login/Login.jsx'
import UserContextProvider from './context/UserContextProvider.jsx'
import BlogContextProvider from './context/BlogContextProvider.jsx'
import BlogPage from './components/BlogPage/BlogPage.jsx'
import ProfilePage from './components/profilePage/ProfilePage.jsx'
import EditBlog from './components/EditBlog/EditBlog.jsx'
import OtherProfile from './components/OtherProfile/OtherProfile.jsx'

const router = createBrowserRouter(
  [
    {
      path : '/',
      element : <Layout />,
      children : [
        {
          path : "",
          element : <Home />
        },
        {
          path : "CreateAccount",
          element : <CreateAccount />
        },
        {
          path : "Login",
          element : <Login />
        },
        {
          path : "CreateBlog",
          element : <CreateBlog />
        },
        {
          path : "Blog/:id",
          element : <BlogPage />
        },
        {
          path : "ProfilePage",
          element : <ProfilePage />
        },
        {
          path : "edit/:id",
          element : <EditBlog />
        },
        {
          path : "user/:id",
          element : <OtherProfile />
        }
      ]
    }
  ]
)


createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BlogContextProvider>
      <RouterProvider router = {router} />
    </BlogContextProvider>
  </UserContextProvider>
)

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/auth/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  }
]) 

function App() {

  return (
    <>
    <RouterProvider router = {appRouter}></RouterProvider>
    </>
  );
  
}

export default App;
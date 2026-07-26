import { USER_API } from "@/utils/constant";
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/Redux/authSlice";
import store from "@/Redux/store";
import { Loader2 } from "lucide-react";

const Login = () => {
   const [input, setInput] = useState({
    email:"",
    password:"",
    role:"",
  })
  const {loading} = useSelector(store=>store.auth)
  const changeEventHandler = (e)=>{
    setInput({...input, [e.target.name]:e.target.value})
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
   const submitHandler = async(e)=>{
    e.preventDefault()
    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${USER_API}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if(res.data.success){
        dispatch(setUser(res.data.user))
        navigate("/")
        toast.success(res.data.message)
      }
    } catch (error) {
        console.log(error)
        /toast.error(
  error.response?.data?.message || "Something went wrong"
)
    }finally{
      dispatch(setLoading(false))
    }
  }
  return (
    <div >
        <Navbar></Navbar>
        <div className="flex items-center justify-center min-h-screen">
          <form onSubmit={submitHandler}
          className="w-1/2 max-w-md border p-6 rounded-lg shadow-md">
            <h1 className="font-bold text-xl mb-5">Login</h1>
            <div className="my-2">
              <Label className="my-2">Email</Label>
              <Input
                  type = "email"
                  value = {input.email}
                  name= "email"
                  onChange = {changeEventHandler}
                  placeholder = "abc@gmail.com"
              ></Input>
            </div>
            <div className="my-2">
              <Label className="my-2">Password</Label>
              <Input
                  type = "password"
                   value = {input.password}
                  name= "password"
                  onChange = {changeEventHandler}
                  placeholder = "********"
              ></Input>
            </div>
            <div className="flex items-center justify-between gap-8">
            <RadioGroup
              aria-label="Density"
              defaultValue="comfortable"
              className="flex w-fit my-5"
            >
              <div className="flex items-center gap-3">
                <Input
                    type="radio"
                    name="role"
                    checked = {input.role === 'Student'}
                    onChange = {changeEventHandler}
                    value= "Student"
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Student</Label>
              </div>
              <div className="flex items-center gap-3">
                 <Input
                    type="radio"
                    name="role"
                    checked = {input.role === 'Recruiter'}
                    onChange = {changeEventHandler}
                    value= "Recruiter"
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Recruiter</Label>
              </div>
            </RadioGroup>
             </div>
             {
              loading ? <Button className="w-full my-4"><Loader2 className= "mr-2 h-4 w4 animate-spin"></Loader2></Button> :
              <Button type="submit" className='w-full my-4'>Login</Button>
             }
          
          <span className="text-sm">Don't' have an account? <Link to= '/signup' className='text-blue-600'>Signup</Link></span>

          </form>
        </div>
    </div>
  )
}

export default Login
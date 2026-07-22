import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

const Signup = () => {
   const [input, setInput] = useState({
    fullName: "",
    email:"",
    phoneNumber:"",
    password:"",
    role:"",
    file:""
  })
  const changeEventHandler = (e)=>{
    setInput({...input, [e.target.name]:e.target.value})
  }
  const changeFileHandler = (e)=>{
    setInput({...input, file:e.target.files?.[0]})
  }
  const navigate = useNavigate()
  const submitHandler = async(e)=>{
    e.preventDefault()
    const formData = new FormData()
    formData.append("fullName", input.fullName)
    formData.append("email", input.email)
    formData.append("phoneNumber", input.phoneNumber)
    formData.append("password", input.password)
    formData.append("role", input.role)
    if(input.file){
       formData.append("file", input.file)
    }
   
    try {
      const res = await axios.post(`${USER_API}/register`, formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      })
      if(res.data.success){
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
        toast.error(
    error.response?.data?.message || "Something went wrong"
  );
    }
  }
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={submitHandler}
          className="w-1/2 max-w-md border p-6 rounded-lg shadow-md"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label className="my-2">Full Name</Label>
            <Input type="text" 
            value={input.fullName}
            name= "fullName"
            onChange = {changeEventHandler}
            placeholder="Full Name"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Email</Label>
            <Input type="email" 
            value = {input.email}
            name = "email"
            onChange = {changeEventHandler}
            placeholder="abc@gmail.com"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Phone Number</Label>
            <Input type="text" 
            value = {input.phoneNumber}
            name = "phoneNumber"
            onChange={changeEventHandler}
            placeholder="+91 XXXXXXXXXX"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Password</Label>
            <Input type="password" 
            value = {input.password}
            name = "password"
            onChange = {changeEventHandler}
            placeholder="*******"></Input>
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
                    value= "Student"
                    checked = {input.role === 'Student'}
                    onChange = {changeEventHandler}
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Student</Label>
              </div>
              <div className="flex items-center gap-3">
                 <Input
                    type="radio"
                    name="role"
                    value= "Recruiter"
                    checked = {input.role === 'Recruiter'}
                    onChange = {changeEventHandler}
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
                <Label>Profile</Label>
                <Input accept= "image/*"
                    type="file"
                    onChange = {changeFileHandler}
                    className="cursor-pointer"
                ></Input>
            </div>
          </div>
          <Button type="submit" className='w-full my-4'>Signup</Button>
          <span className="text-sm">Already have an account? <Link to= '/login' className='text-blue-600'>Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;

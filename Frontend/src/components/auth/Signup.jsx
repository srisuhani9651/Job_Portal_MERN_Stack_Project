import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const Signup = () => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex items-center justify-center min-h-screen">
        <form
          action=""
          className="w-1/2 max-w-md border p-6 rounded-lg shadow-md"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label className="my-2">Full Name</Label>
            <Input type="text" placeholder="Full Name"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Email</Label>
            <Input type="email" placeholder="abc@gmail.com"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Phone Number</Label>
            <Input type="number" placeholder="+91 XXXXXXXXXX"></Input>
          </div>
          <div className="my-2">
            <Label className="my-2">Password</Label>
            <Input type="password" placeholder="*******"></Input>
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
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Student</Label>
              </div>
              <div className="flex items-center gap-3">
                 <Input
                    type="radio"
                    name="role"
                    value= "Recruiter"
                    className="cursor-pointer"
                ></Input>
                <Label htmlFor = "r1">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
                <Label>Profile</Label>
                <Input accept= "image/*"
                    type="file"
                    className="cursor-pointer"
                ></Input>
            </div>
          </div>
          <Button type="submit" className='w-full my-4'>Signup</Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

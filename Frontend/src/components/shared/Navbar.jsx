import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import { useSelector } from "react-redux";
//left side logo
//right side pages
const Navbar = () => {
  const {user} = useSelector(store=> store.auth)
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#9970de]">Sphere</span>
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            <li><Link to='/' className="hover:text-[#6A38C2] transition-colors duration-200">Home</Link></li>
            <li><Link to='/jobs' className="hover:text-[#6A38C2] transition-colors duration-200">Jobs</Link></li>
            <li><Link to='/browse' className="hover:text-[#6A38C2] transition-colors duration-200">Browse</Link></li>
          </ul>
          {!user ? (
            <div className="flex items-center gap-2" >
            <Link to='/login'><Button variant="outline" className="cursor-pointer">Login</Button></Link>
            <Link to='/signup'><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]  cursor-pointer">Signup</Button></Link>
             
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    // className="grayscale"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4 space-y-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                      // className="grayscale"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-bold ">Suhani Srivastava</h4>
                    <p className="text-small">
                      Hi My name is suhani srivastava, I am mern stack
                      developer.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col my-2 text-gray-600">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2></User2>
                    <Button variant="link"><Link to='./profile'>View Profile</Link></Button>
                  </div>
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut></LogOut>
                    <Button variant="link">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

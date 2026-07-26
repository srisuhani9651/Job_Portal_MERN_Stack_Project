import { Button } from "./ui/button"
import { Search } from "lucide-react"

const HeroSection = () => {
  return (
    <div className='text-center'>
        <span className='px-4 py-2 rounded-full bg-purple-100 text-[#6A38C2] font-medium'>No 1 Job Hunt Website</span>
        <h1 className='text-5xl font-bold my-9'>Search, Apply & <br/>Get Your <span className='text-[#6A38C2]'>Dream Job</span></h1>
        <p>Building a production-ready personal portfolio website is one of the most rewarding milestones in a software developer's journey.</p>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 m-auto my-5">
            <input 
                type="text"
                placeholder="Find Job"
                className="outine-none border-none w-full p-2"
            ></input>
            <Button className="rounded-r-full p-5 bg-[#6A38C2]">
                <Search className="h-5 w-5"></Search>
            </Button>
        </div>
    </div>
  )
}

export default HeroSection
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const JobCard = () => {
  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">2 days ago</p>

        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark></Bookmark>
        </Button>
      </div>
      <div className="flex items-center gap-2 my-2">
        <Button variant="outline" className="p-5" size="icon">
          <Avatar>
            <AvatarImage src="https://substackcdn.com/image/fetch/$s_!1XDp!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb162f2d8-7878-4f8c-9b3f-6184293024dc_1000x1000.jpeg"></AvatarImage>
          </Avatar>
        </Button>

        <div>
          <h1 className="text-lg font-semibold">Company Name</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg my-2">Title</h1>
        <p className="text-sm text-gray-600">
          We are looking for a proactive DevOps Engineer to help automate,
          streamline, and scale our software delivery processes.
        </p>
      </div>
      <div className="flex item-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          12 Positions
        </Badge>
        <Badge className="text-[#ae5050] font-bold" variant="ghost">
          Part Time
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          24 LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline">Details</Button>
        <Button variant="outline" className="bg-[#6037aa] text-white">
          Save for later
        </Button>
      </div>
    </div>
  );
};

export default JobCard;

import { Contact, Mail, Pen } from "lucide-react";
import AppliedJobTable from "./AppliedJobTable";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const skills = ["HTML", "CSS", "JavaScript", "React.js"];

const Profile = () => {
  const isResume = true;
  return (
    <div>
      <Navbar></Navbar>
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className=" h-20 w-20">
              <AvatarImage
                src="https://substackcdn.com/image/fetch/$s_!aFzv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa27a43b7-f1ec-4586-9898-5f43c9b7cdbf_1000x1000.jpeg"
                alt="Profile Img"
              ></AvatarImage>
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">Full Name</h1>
              <p>Add your bio here</p>
            </div>
          </div>
          <Button className="text-right" variant="outline">
            <Pen></Pen>
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3">
            <Mail></Mail>
            <span>suhani@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact></Contact>
            <span>9876543213</span>
          </div>
        </div>
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex items-center gap-1 my-2">
            {skills.length !== 0 ? (
              skills.map((item, index) => (
                <Badge key={index} variant="outline">
                  {item}
                </Badge>
              ))
            ) : (
              <Badge className="bg-gray-600">NA</Badge>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold"></Label>
          {isResume ? (
            <a
              target="blank"
              href="https://drive.google.com/file/d/1mXDX2qDC237hsgzustyWEQhK7USMemGg/view?usp=drivesdk"
             className="hover text-blue-500 hover:underline cursor-pointer">SuhaniSrivastava_Resume</a>
          ) : (
            <Badge className="bg-gray-600">NA</Badge>
          )}
        </div>
      </div>
        <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6">
            <h1 className="font-bold text-xl my-5">Applied Jobs</h1>
            {/* All applied job */}
            <AppliedJobTable></AppliedJobTable>
        </div>
    </div>
  );
};

export default Profile;

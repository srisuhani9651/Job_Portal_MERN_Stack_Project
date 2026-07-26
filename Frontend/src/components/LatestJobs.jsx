import LatestJobCards from "./LatestJobCards";

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LatestJobs = () => {
  return (
    <div className="max-w-7xl m-auto my-5">
      <h1 className="text-3xl font-bold">
        <span className="text-[#6A38C2]">Latest </span>Job Openings
      </h1>
      {/* //multiple job cards display here */}
      <div className="grid grid-cols-3 gap-4 my-5">
        {randomJobs.slice(0, 6).map((item, index) => (
          <LatestJobCards></LatestJobCards>
        ))}
      </div>
    </div>
  );
};

export default LatestJobs;

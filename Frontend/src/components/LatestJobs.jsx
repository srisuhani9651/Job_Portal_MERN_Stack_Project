import LatestJobCards from "./LatestJobCards";

const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const LatestJobs = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold">
        <span className="text-[#6A38C2]">Latest & </span>Top Job Openings
      </h1>
      {/* multiple job cards display here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {randomJobs.slice(0, 6).map((item, index) => (
          <LatestJobCards key={index} />
        ))}
      </div>
    </div>
  );
};

export default LatestJobs;


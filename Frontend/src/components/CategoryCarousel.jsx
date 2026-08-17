import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/Redux/jobSlice";
import {
  Code2,
  Server,
  BarChart3,
  Palette,
  Layers,
  Cloud,
  Compass,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

const categories = [
  {
    name: "Frontend Developer",
    icon: Code2,
    jobs: "2.4k+ Openings",
    trend: "+14% this month",
    color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/80",
    bgHover: "hover:border-blue-300 hover:bg-blue-50/30",
  },
  {
    name: "Backend Developer",
    icon: Server,
    jobs: "1.8k+ Openings",
    trend: "+22% this month",
    color: "from-purple-500/10 to-indigo-500/10 text-[#6A38C2] border-purple-200/80",
    bgHover: "hover:border-purple-300 hover:bg-purple-50/30",
  },
  {
    name: "FullStack Developer",
    icon: Layers,
    jobs: "3.1k+ Openings",
    trend: "+18% this month",
    color: "from-indigo-500/10 to-violet-500/10 text-indigo-600 border-indigo-200/80",
    bgHover: "hover:border-indigo-300 hover:bg-indigo-50/30",
  },
  {
    name: "Data Science & AI",
    icon: BarChart3,
    jobs: "950+ Openings",
    trend: "+35% this month",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/80",
    bgHover: "hover:border-emerald-300 hover:bg-emerald-50/30",
  },
  {
    name: "DevOps & Cloud",
    icon: Cloud,
    jobs: "820+ Openings",
    trend: "+12% this month",
    color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-200/80",
    bgHover: "hover:border-cyan-300 hover:bg-cyan-50/30",
  },
  {
    name: "UI/UX Product Design",
    icon: Compass,
    jobs: "1.1k+ Openings",
    trend: "+16% this month",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/80",
    bgHover: "hover:border-rose-300 hover:bg-rose-50/30",
  },
  {
    name: "Mobile App Engineer",
    icon: Smartphone,
    jobs: "750+ Openings",
    trend: "+9% this month",
    color: "from-sky-500/10 to-indigo-500/10 text-sky-600 border-sky-200/80",
    bgHover: "hover:border-sky-300 hover:bg-sky-50/30",
  },
  {
    name: "Cybersecurity",
    icon: ShieldCheck,
    jobs: "480+ Openings",
    trend: "+28% this month",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/80",
    bgHover: "hover:border-amber-300 hover:bg-amber-50/30",
  },
];

const CategoryCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCategoryClick = (categoryName) => {
    // Pass core keyword
    const cleaned = categoryName.split("&")[0].trim();
    dispatch(setSearchJobByText(cleaned));
    navigate(`/browse?query=${encodeURIComponent(cleaned)}`);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-purple-100/60">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Specializations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore by Industry & <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Specialization</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Targeted job tracks curated for engineers, designers, and tech leaders.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/browse")}
            className="self-start md:self-auto rounded-xl text-xs font-semibold text-gray-700 hover:text-[#6A38C2] hover:bg-purple-50 border-gray-200 cursor-pointer flex items-center gap-1.5"
          >
            <span>Browse All Domains</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {categories.map((cat, index) => {
                const IconComponent = cat.icon;
                return (
                  <CarouselItem
                    key={index}
                    className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`h-full p-5 rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between ${cat.bgHover} hover:-translate-y-1`}
                    >
                      <div>
                        {/* Icon & Trend */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            {cat.trend}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 group-hover:text-[#6A38C2] text-base transition-colors line-clamp-1 mb-1">
                          {cat.name}
                        </h3>

                        {/* Job count */}
                        <p className="text-xs text-gray-500 font-medium">
                          {cat.jobs}
                        </p>
                      </div>

                      {/* Bottom link indicator */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-[#6A38C2] transition-colors">
                        <span>Explore Roles</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-2 sm:-left-4 bg-white shadow-md border-gray-200 hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all cursor-pointer" />
            <CarouselNext className="-right-2 sm:-right-4 bg-white shadow-md border-gray-200 hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all cursor-pointer" />
          </Carousel>
        </div>

      </div>
    </section>
  );
};

export default CategoryCarousel;


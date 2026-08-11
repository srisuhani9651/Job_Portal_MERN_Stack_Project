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
import {
  Code,
  Server,
  BarChart3,
  Palette,
  Layers,
  Cloud,
  Compass,
  Smartphone,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Frontend Developer",
    icon: Code,
    jobs: "2.4k+ Jobs",
    color: "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200",
  },
  {
    name: "Backend Developer",
    icon: Server,
    jobs: "1.8k+ Jobs",
    color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200",
  },
  {
    name: "Data Science",
    icon: BarChart3,
    jobs: "950+ Jobs",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200",
  },
  {
    name: "Graphic Designer",
    icon: Palette,
    jobs: "600+ Jobs",
    color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200",
  },
  {
    name: "FullStack Developer",
    icon: Layers,
    jobs: "3.1k+ Jobs",
    color: "from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-200",
  },
  {
    name: "DevOps Engineer",
    icon: Cloud,
    jobs: "800+ Jobs",
    color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-200",
  },
  {
    name: "UI/UX Designer",
    icon: Compass,
    jobs: "1.1k+ Jobs",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200",
  },
  {
    name: "Mobile Developer",
    icon: Smartphone,
    jobs: "750+ Jobs",
    color: "from-sky-500/10 to-indigo-500/10 text-sky-600 border-sky-200",
  },
];

const CategoryCarousel = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/browse?query=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-[#6A38C2] text-xs sm:text-sm font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Opportunities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Browse Jobs by <span className="text-[#6A38C2]">Category</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Find the right domain that matches your expertise and career goals
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-6 sm:px-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {categories.map((cat, index) => {
                const IconComponent = cat.icon;
                return (
                  <CarouselItem
                    key={index}
                    className="pl-2 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1">
                      <Button
                        variant="outline"
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full h-auto py-4 px-4 flex flex-col items-center justify-center text-center gap-3 rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm hover:shadow-md hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                      >
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-[#6A38C2] text-sm transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs text-gray-500 font-medium">
                            {cat.jobs}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-2 sm:-left-6 bg-white shadow-md border-gray-200 hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all cursor-pointer" />
            <CarouselNext className="-right-2 sm:-right-6 bg-white shadow-md border-gray-200 hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 transition-all cursor-pointer" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;


import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CareerMetrics from "./CareerMetrics";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import CareerFeatures from "./CareerFeatures";
import HomeCTA from "./HomeCTA";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      (user?.role === "Recruiter" || user?.role?.toLowerCase() === "recruiter")
    ) {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <HeroSection />
        <CareerMetrics />
        <CategoryCarousel />
        <LatestJobs />
        <CareerFeatures />
        <HomeCTA />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
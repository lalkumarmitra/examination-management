import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from '@/assets/hero-image-illustration.webp'
import { Loader2 } from "lucide-react";
import LoginFormDialog from "../login-form-dialog";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100svh-7rem)] bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome to Examination Management System</h1>
              <p className="text-lg mb-8">Manage your examinations with ease and efficiency.</p>
              <LoginFormDialog />
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
            <div className="lg:w-1/2">
              <img src={heroImage} alt="Hero Image" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

export const LandingPageSkeleton: React.FC = () => {
  return (
    <div className="h-screen w-screen flex justify-center flex-col gap-8 items-center">
      <div className="grid gap-8">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Welcome to Examination Management System</h1>
        <p className="text-lg mb-4 text-center">Manage your examinations with ease and efficiency.</p>
        <div className="flex w-full justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
        </div>
        <Skeleton className="h-10 bg-background/50 w-full" />
        <Skeleton className="h-10 bg-background/50 w-full" />
        <Skeleton className="h-10 bg-background/50 w-full" />
      </div>
    </div>
  )
}

import { getProjects } from "@/lib/projects";
import OfficialProjects from "@/components/OfficialProjects";
import AboutMe from "@/components/AboutMe";
import Link from "next/link";
import Footer from "@/components/footer";

export default async function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
     
      <AboutMe/>
      <OfficialProjects />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Projects</h2>
        <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline">
          View all
        </Link>
      </div>
      <Footer/>
    </div>
  );
}


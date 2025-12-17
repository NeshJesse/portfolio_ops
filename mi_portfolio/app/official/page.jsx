import AboutMe from "@/components/AboutMe";
import OfficialProjects from "@/components/OfficialProjects";

export const metadata = {
  title: "Official Portfolio",
};

export default function OfficialPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Official Portfolio</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          Public view without editing controls
        </p>
      </header>
      <AboutMe readOnly />
      <OfficialProjects />
    </div>
  );
}



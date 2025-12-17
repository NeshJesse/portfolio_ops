"use client";
import { footerData } from "@/data/footerData";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 mt-16">
      <div className="container mx-auto px-6">
        {/* Top grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              <span className="text-green-400">{footerData.brand.name}</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {footerData.brand.tagline}
            </p>
          </div>

          {/* Dynamic sections */}
          {footerData.sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-white">Portfolio-OPs</h1>
            <p className="text-xs text-gray-500 dark:text-white/60">
              Automated Personal Portfolio
            </p>
          </div>

          <p className="text-sm mt-4 md:mt-0 text-gray-500">
            {footerData.copyright}
          </p>

          <div className="flex space-x-5 mt-4 md:mt-0 text-gray-400">
            <a
              href={footerData.social.github}
              className="hover:text-white transition"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={footerData.social.linkedin}
              className="hover:text-white transition"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href={footerData.social.twitter}
              className="hover:text-white transition"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

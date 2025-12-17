'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/home', label: 'Dashboard' },
    { href: '/home/curate', label: 'Curate Projects' },
    { href: '/home/about', label: 'Edit About' },
    { href: '/home/skills', label: 'Edit Skills' },
    { href: '/home/experience', label: 'Edit Experience' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0">
            <div className="p-6">
                <h2 className="text-2xl font-bold">Portfolio Ops</h2>
                <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            {/* Optional: Add logout or other footer links here */}
        </div>
    );
}

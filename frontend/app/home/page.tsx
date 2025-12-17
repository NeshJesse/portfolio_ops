export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Projects</h3>
                    <p className="text-gray-500 mb-4">Manage your portfolio projects and featured selection.</p>
                    <a href="/home/curate" className="text-blue-600 hover:text-blue-800 font-medium">Go to Curation &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Content</h3>
                    <p className="text-gray-500 mb-4">Update your About, Skills, and Experience sections.</p>
                    <a href="/home/about" className="text-blue-600 hover:text-blue-800 font-medium">Edit Content &rarr;</a>
                </div>
            </div>
        </div>
    );
}

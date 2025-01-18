import Sidebar from '@/components/Sidebar'

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#FFEBD0]">
      <Sidebar />
      <main className="flex-1 p-8 ml-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#FF8D58] mb-6">Welcome to ArgueMate</h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover a new perspective on dating through engaging debates and thoughtful discussions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#FF8D58] mb-4">Find Your Match</h2>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for intellectual discourse.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#FF8D58] mb-4">Engage in Debates</h2>
              <p className="text-gray-600">
                Participate in thought-provoking discussions on a wide range of topics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#FF8D58] mb-4">Expand Your Horizons</h2>
              <p className="text-gray-600">
                Challenge your perspectives and grow through meaningful conversations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-[#FF8D58] mb-4">Build Connections</h2>
              <p className="text-gray-600">
                Form deep, lasting relationships based on shared interests and values.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


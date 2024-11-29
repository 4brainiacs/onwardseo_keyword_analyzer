
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">Version 1.2.5 • Released: Nov 28, 2024</p>
          <p>© {new Date().getFullYear()} <a href="https://onwardseo.com/" title="onwardSEO" className="text-blue-600 hover:text-blue-800">onwardSEO</a>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
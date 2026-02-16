import AuthButton from "@/components/AuthButton";
import BookmarkList from "@/components/BookmarkList";
import AddBookmark from "@/components/AddBookmark";
import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  ></path>
                </svg>
                Smart Bookmark
              </span>
            </div>
            <div className="flex items-center">
              <AuthButton user={user} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="text-center py-20">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
              Your Bookmarks, <span className="text-blue-600">Reimagined</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Save, organize, and access your favorite links from anywhere. Simple, fast, and secure.
            </p>
            <div className="inline-block p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Get started instantly</p>
              <AuthButton user={null} />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
              <p className="text-gray-500">Manage and access your saved links.</p>
            </div>
            
            <AddBookmark user={user} />
            <BookmarkList user={user} />
          </div>
        )}
      </main>
    </div>
  );
}

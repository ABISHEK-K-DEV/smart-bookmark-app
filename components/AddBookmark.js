"use client";

import { createClient } from "@/utils/supabase/client";
import { Plus, Link as LinkIcon, Type } from "lucide-react";
import { useState } from "react";

export default function AddBookmark({ user }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("bookmarks").insert([
        {
          title: title || url, // Fallback title to URL if empty
          url,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setUrl("");
      setTitle("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      alert("Error adding bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        Add New Bookmark
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex-1 relative">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { createClient } from "@/utils/supabase/client";
import { Plus, Link as LinkIcon, Type } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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
          title: title || url,
          url,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast.success("Bookmark added successfully!");
      setUrl("");
      setTitle("");
    } catch (error) {
      toast.error("Error adding bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        Add New Bookmark
      </h2>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
        <div className="flex-1 relative">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full cursor-pointer"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

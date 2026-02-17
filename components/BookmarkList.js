"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";

export default function BookmarkList({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching bookmarks:", error);
      } else {
        setBookmarks(data || []);
      }
    };

    fetchBookmarks();

    const channel = supabase
      .channel("realtime bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`, // Only listen to current user's bookmarks
        },
        (payload) => {
          console.log("🔥 Realtime event received:", payload);
          if (payload.eventType === "INSERT") {
            console.log("✅ Adding new bookmark:", payload.new);
            setBookmarks((current) => [payload.new, ...current]);
          } else if (payload.eventType === "DELETE") {
            console.log("🗑️ Deleting bookmark:", payload.old.id);
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            console.log("✏️ Updating bookmark:", payload.new);
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? payload.new : bookmark
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting bookmark:", error);
      alert("Error deleting bookmark");
    }
  };

  return (
    <div className="space-y-4">
      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No bookmarks yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex-1 min-w-0 mr-4">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 hover:underline truncate block flex items-center gap-2"
              >
                {bookmark.title || bookmark.url}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <p className="text-sm text-gray-400 truncate mt-1">
                {bookmark.url}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete bookmark"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

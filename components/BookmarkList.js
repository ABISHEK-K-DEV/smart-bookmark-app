"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { Trash2, ExternalLink, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function BookmarkList({ user }) {
  const [bookmarks, setBookmarks] = useState([]);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let channel;
    let authListener;

    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setBookmarks(data || []);
      }
    };

    const subscribeToRealtime = () => {
      channel = supabase
        .channel(`realtime-bookmarks-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              if (payload.new?.user_id !== user.id) return;
              setBookmarks((current) => [payload.new, ...current]);
            } else if (payload.eventType === "DELETE") {
              setBookmarks((current) =>
                current.filter(
                  (bookmark) => String(bookmark.id) !== String(payload.old?.id)
                )
              );
            } else if (payload.eventType === "UPDATE") {
              if (payload.new?.user_id !== user.id) return;
              setBookmarks((current) =>
                current.map((bookmark) =>
                  String(bookmark.id) === String(payload.new?.id) ? payload.new : bookmark
                )
              );
            }
          }
        )
        .subscribe();
    };

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        await fetchBookmarks();
        subscribeToRealtime();
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_, newSession) => {
        if (newSession?.user?.id === user.id) {
          fetchBookmarks();
          subscribeToRealtime();
        }
      });

      authListener = subscription;
    };

    initialize();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [supabase, user.id]);

  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id");

    if (error) {
      toast.error("Error deleting bookmark");
      return;
    }

    if (!data || data.length === 0) {
      toast.error("Delete blocked (check RLS delete policy in Supabase)");
      return;
    } else {
      setBookmarks((current) =>
        current.filter((bookmark) => String(bookmark.id) !== String(id))
      );
      toast.success("Bookmark deleted successfully");
    }
  };

  return (
    <div className="space-y-3">
      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <Bookmark className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-1">No bookmarks yet</p>
          <p className="text-gray-400 text-sm">Add your first bookmark to get started</p>
        </div>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-start justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex-1 min-w-0 mr-4">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate block flex items-center gap-2 mb-1 transition-colors duration-200"
              >
                {bookmark.title || bookmark.url}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </a>
              <p className="text-sm text-gray-500 truncate mb-2">
                {bookmark.url}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(bookmark.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
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

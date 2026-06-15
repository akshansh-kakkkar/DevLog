"use client";
import { Post } from "@/app/Types";
import {
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Edit,
  Funnel,
  Globe,
  ListFilter,
  Trash2Icon,
} from "lucide-react";
import {
  JetBrains_Mono,
  Libertinus_Sans,
  Poppins,
  Geist,
} from "next/font/google";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});
const libretinusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const poppins2 = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
const geist = Geist({
  subsets: ["latin"],
});
export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const [page, setPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setPostsLoading(true);
        const res = await fetch(`/api/dashboard/posts?page=${page}&limit=1`);
        const data = await res.json();
        setPosts(data.posts);
        setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalPosts: 0 });
      } catch (error) {
        toast.error("Failed to fetch stats.");
      } finally {
        setPostsLoading(false);
      }
    };
    getPosts();
  }, [page]);
  return (
    <div className="mt-12 mx-5 md:mx-12 lg:mx-22 flex gap-7 flex-col">
      <div className="flex  sm:justify-start justify-center flex-col gap-4 border-[#C6C6CD] border-b-2 pb-2 ">
        <div
          className={`${geist.className} text-[#2D2D2D] text-4xl font-semibold`}
        >
          My Posts
        </div>
        <div className={`${geist.className} text-[#45464D]`}>
          Manage your technical articles from here.
        </div>
      </div>
      <div className="bg-white  border border-[#C6C6CD] rounded-md md:pb-0 py-4 md:pt-6">
        <div className="flex px-6 pb-6 justify-between items-center">
          <div
            className={`sm:text-3xl text-xl text-[#191C1E] ${geist.className} font-semibold`}
          >
            Recent Articles
          </div>
          <div className="flex gap-2">
            <button
              className={`${jetbrains.className} flex gap-2 border-2 text-[#191C1E] border-[#C6C6CD] rounded-sm px-4 py-1.5`}
            >
              <span>
                <ListFilter />
              </span>
              <span className="hidden md:block">Filter</span>
            </button>
            <button
              className={`flex px-4 py-1.5 gap-2 border-2 border-[#C6C6CD] text-[#191C1E] rounded-sm ${jetbrains.className}`}
            >
              <span>
                <Funnel />
              </span>
              <span className="hidden md:block">Sort</span>
            </button>
          </div>
        </div>
        <div className="hidden lg:block overflow-x-auto">
          <div
            className={`p-6 uppercase w-full flex items-center font-medium justify-between bg-[#F2F4F6] border-y border-[#C6C6CD] ${jetbrains.className} text-[#45464D]`}
          >
            <div>Post Title</div>
            <div className="flex gap-30">
              <div>Status</div>
              <div>Visibility</div>
              <div>Create At</div>
              <div>Actions</div>
            </div>
          </div>
          {posts.map((post) => (
            <div
              key={post.id}
              className={`flex justify-between items-center p-6 border border-[#C6C6CD]`}
            >
              <div>
                <div
                  className={`truncate w-[12vw] font-bold ${geist.className} text-xl`}
                >
                  {post.title}
                </div>
              </div>
              <div className="flex gap-32">
                <div
                  className={`px-2 font-medium py-1 w-[80px]  items-center text-center flex justify-center rounded-sm text-xs border-2  ${post.status === "DRAFT" ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]" : post.status === "PUBLISHED" ? "bg-[#DCFCE7]  border-[#BBF7D0] text-[#15803D] " : post.status === "SCHEDULED" ? "bg-[#dbeafe] border-[#93C5FD]  text-[#1D4ED8]" : "bg-gray-100 border-gray-300 text-gray-700"}`}
                >
                  {post.status}
                </div>
                <div className={`${geist.className} text-sm`}>
                  {post.visibility === "PUBLIC" && (
                    <div className="flex items-center gap-6">
                      <Globe size={18} />
                      <p>Public</p>
                    </div>
                  )}
                  {post.visibility === "PRIVATE" && (
                    <div className="flex items-center gap-6">
                      <Globe size={18} />
                      <p>Private</p>
                    </div>
                  )}
                  {post.visibility === "UNLISTED" && (
                    <div className="flex items-center gap-6">
                      <Globe size={18} />
                      <p>Unlisted</p>
                    </div>
                  )}
                </div>
                <div className={`text-[#45464D] ${geist.className} text-sm`}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>

                <div className="gap-6 flex">
                  <button>
                    <Edit size={20} />
                  </button>
                  <button>
                    <Trash2Icon size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-[#F2F4F6] items-center flex justify-between border-b-1 border-[#C6C6CD] rounded-b-lg py-6 px-4">
            <div className={`${jetbrains.className} uppercase text-sm`}>
              Showing {pagination.totalPosts > 0 ? (page - 1) * 10 + 1 : 0} to {Math.min(page * 10, pagination.totalPosts)} of {pagination.totalPosts} Posts{" "}
            </div>
            <div className="gap-2 flex">
              <button disabled={page === 1} onClick={()=>setPage(page - 1)} className="border-[#C6C6CD] hover:text-[#F2F4F6] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E] ">
                <ChevronLeft className="p-1" size={30} />
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button className={`w-8 h-8  border-2 rounded-[3px] transition-all duration-300 ${page === pageNumber ? "bg-[#191C1E] text-[#F2F4F6]  border-[#191C1E]" : "border-[#C6C6CD] text-[#191C1E] hover:bg-[#191C1E]  hover:text-[#F2F4F6] hover:border-[#191C1E]"}`} key={pageNumber} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </button>
              ))}
              <button disabled={page === pagination.totalPages || pagination.totalPages === 0} onClick={()=>setPage(page + 1)} className="border-[#C6C6CD] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#F2F4F6] hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E] ">
                <ChevronRight className="p-1" size={30} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

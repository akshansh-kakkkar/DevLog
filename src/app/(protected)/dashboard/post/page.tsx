"use client";
import { Post } from "@/app/Types";
import {
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleEllipsis,
  Edit,
  Funnel,
  Globe,
  ListFilter,
  Loader2,
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
import DeleteModal from "../analytics/components/Modals/DeleteModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

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
        const res = await fetch(`/api/dashboard/posts?page=${page}&limit=10`);
        const data = await res.json();
        setPosts(data.posts);
        setPagination(
          data.pagination || { currentPage: 1, totalPages: 1, totalPosts: 0 },
        );
      } catch (error) {
        toast.error("Failed to fetch stats.");
      } finally {
        setPostsLoading(false);
      }
    };
    getPosts();
  }, [page]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  return postsLoading ? (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 className="animate-spin text-[#00687A]" size={64} />
    </div>
  ) : (
    <>
      {posts.length === 0 ? (
        <div className={`w-full h-[90vh] flex  justify-center items-center  `}>
          <div className="w-fit p-12 mx-12  flex-col text-center mb-24 sm:mb-0 gap-2 flex justify-center items-center   bg-white border rounded-lg ">
            <div>
              <CircleAlert
                size={64}
                className={`rounded-full p-2 text-[#00687A] bg-[#00687a21]`}
              />
            </div>
            <p
              className={`${jetbrains.className} text-2xl text-center  font-semibold`}
            >
              You will see your Posts here
            </p>
          </div>
        </div>
      ) : (
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
          <div className="bg-white  border border-[#C6C6CD] rounded-md md:pb-0 pt-4 md:pt-6">
            <div className="flex px-6 pb-6 justify-between items-center">
              <div
                className={`sm:text-3xl text-xl text-[#191C1E] ${geist.className} font-semibold`}
              >
                Recent Articles
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
                  <div className="flex items-center justify-center   gap-32">
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
                    <div
                      className={`text-[#45464D] ${geist.className} text-sm`}
                    >
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <DropdownMenu>
                      <div className="gap-8 p-2 text-center flex justify-center items-center">
                        <DropdownMenuTrigger asChild>
                          <button className="hover:bg-[#00687a21]   transition-all duration-300 rounded-lg cursor-pointer">
                            <CircleEllipsis size={40} className="hover:bg-[#00687a21]   transition-all duration-300 p-2 rounded-lg cursor-pointer" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className={`min-w-[180px]  rounded-lg z-50 mt-4 border bg-white p-1 shadow-lg`}
                          sideOffset={5}
                        >
                          <DropdownMenuItem className="flex items-center gap-2  px-3 py-2 hover:bg-[#00687A21]">
                            <button className=" justify-center flex text-center gap-5 items-center transition-all duration-300 rounded-lg cursor-pointer">
                              <ChartColumn />
                              <span>Analytics</span>
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2  px-3 py-2 hover:bg-[#00687A21]">
                            <button className=" justify-center flex text-center gap-5 items-center transition-all duration-300 rounded-lg cursor-pointer">
                              <Edit />
                              <span>Edit</span>
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2  px-3 py-2 hover:bg-[#00687A21]">
                            <button
                              className=" justify-center flex text-center gap-5 items-center transition-all duration-300 rounded-lg cursor-pointer"
                              onClick={() => {
                                setSelectedPostId(post.slug);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2Icon size={20} />
                              <span>Delete</span>
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              <div className="bg-[#F2F4F6] items-center flex justify-between border-b-1 border-[#C6C6CD] rounded-b-lg lg:py-4 lg:px-4">
                <div
                  className={`${jetbrains.className} uppercase text-md font-semibold`}
                >
                  Page {page} of {pagination.totalPages}
                </div>
                <div className="gap-2 flex">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border-[#C6C6CD] hover:text-[#F2F4F6] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E] "
                  >
                    <ChevronLeft className="p-1" size={30} />
                  </button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <button
                      className={`w-8 h-8  border-2 rounded-[3px] transition-all duration-300 ${page === pageNumber ? "bg-[#191C1E] text-[#F2F4F6]  border-[#191C1E]" : "border-[#C6C6CD] text-[#191C1E] hover:bg-[#191C1E]  hover:text-[#F2F4F6] hover:border-[#191C1E]"}`}
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    disabled={
                      page === pagination.totalPages ||
                      pagination.totalPages === 0
                    }
                    onClick={() => setPage(page + 1)}
                    className="border-[#C6C6CD] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#F2F4F6] hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E] "
                  >
                    <ChevronRight className="p-1" size={30} />
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:hidden flex flex-col gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border mx-4 flex flex-col gap-4  border-[#C6C6Cd] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between ">
                    <div
                      className={`font-semibold ${jetbrains.className} text-[#191C1E] text-lg capitalize truncate w-[12vw]`}
                    >
                      {post.title}
                    </div>
                    <div
                      className={`px-2  font-medium py-1 my-2 w-[80px]  items-center text-center flex justify-center rounded-sm text-xs border-2  ${post.status === "DRAFT" ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]" : post.status === "PUBLISHED" ? "bg-[#DCFCE7]  border-[#BBF7D0] text-[#15803D] " : post.status === "SCHEDULED" ? "bg-[#dbeafe] border-[#93C5FD]  text-[#1D4ED8]" : "bg-gray-100 border-gray-300 text-gray-700"}`}
                    >
                      {post.status}
                    </div>
                    <div className="flex justify-center items-center text-center">
                      {post.visibility === "PUBLIC" && (
                        <div className="flex items-center gap-2">
                          <Globe size={18} />
                          <p>Public</p>
                        </div>
                      )}
                      {post.visibility === "PRIVATE" && (
                        <div className="flex items-center gap-2">
                          <Globe size={18} />
                          <p>Private</p>
                        </div>
                      )}
                      {post.visibility === "UNLISTED" && (
                        <div className="flex items-center gap-2">
                          <Globe size={18} />
                          <p>Unlisted</p>
                        </div>
                      )}{" "}
                    </div>
                  </div>
                  <div className="flex  justify-between">
                    <div
                      className={`flex  gap-4 items-center justify-start text-sm ${geist.className}`}
                    >
                      <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-4">
                                            <button>
                        <ChartColumn
                          className="hover:bg-[#00687a21] rounded-lg p-2 cursor-pointer transition-all duration-300"
                          size={32}
                        />
                      </button>
                      <button>
                        <Edit
                          className="hover:bg-[#00687a21] rounded-lg p-2 cursor-pointer transition-all duration-300"
                          size={32}
                        />
                      </button>
                      <button
                        className="hover:bg-[#00687a21] rounded-lg p-2 cursor-pointer transition-all duration-300"
                        onClick={() => {
                          setSelectedPostId(post.slug);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-[#F2F4F6] py-3 border-2 px-2 rounded-b-sm">
                <div className="flex w-full justify-end items-center text-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border-[#C6C6CD] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#F2F4F6] hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E]"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <span>
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={
                      page === pagination.totalPages ||
                      pagination.totalPages === 0
                    }
                    onClick={() => setPage(page + 1)}
                    className="border-[#C6C6CD] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#F2F4F6] hover:bg-[#191C1E] hover:border-[#191C1E] border-2 cursor-pointer transition-all duration-300 rounded-[3px] text-[#191C1E]"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={isDeleteOpen}
        slug={selectedPostId}
        onClose={() => {
          setSelectedPostId(null);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}

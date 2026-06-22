"use client";
import { ChevronRight, Loader2, Rss, Search } from "lucide-react";
import { JetBrains_Mono, Libertinus_Sans, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Post } from "@/app/Types";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
const libretinusSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});
const poppins2 = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const getPosts = useCallback(async (pageNumber = 1) => {
    try {
      const response = await fetch(`/api/posts?page=${pageNumber}&limit=2`);
      const data = await response.json();
      if (pageNumber === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      return toast.error("something went wrong.");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts(1).finally(() => {
      setLoading(false);
    });
  }, [getPosts]);
  const fetchRef = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || !hasMore || loadingMore || fetchRef.current) {
          return;
        }
        fetchRef.current = true;
        setLoadingMore(true);
        const nextPage = page + 1;
        await getPosts(nextPage);
        setPage(nextPage);
        setLoadingMore(false);
        fetchRef.current = false
      },
      {
        threshold: 0.1,
      },
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return ()=> observer.disconnect();
  }, [page, hasMore, loadingMore, loading, getPosts]);
  return (
    <>
      {loading ? (
        <div className="flex justify-center text-center items-center h-[85vh] ">
          <Loader2
            className="animate-spin flex items-center text-center justify-center  text-[#00687A]"
            size={48}
          />
        </div>
      ) : (
        <div className="mt-8 px-8 flex gap-8 flex-col overflow-x-hidden">
          <div
            className={` gap-2 lg:mx-12 text-4xl text-[#191C1E] mt-4 border-b-4 border-[#00687A] rounded font-bold pb-2 flex w-fit items-center ${libretinusSans.className}`}
          >
            <span className={``}>
              <Rss size={40} strokeWidth={3} />
            </span>
            <span>Feed</span>
          </div>
          <div className="w-full flex lg:mx-12 items-center">
            <div  className="flex text-lg flex-col justify-center w-full mr-32 mr-0 relative  lg:w-1/2  bg-[#F2F4F6] border  px-4 py-2 rounded-md border-[#c6c6CD] b">
              <input
                type="text"
                className={`outline-none pr-10 ${libretinusSans.className} text-[#191C1E] font-medium`}
                placeholder="Find Latest logs"
              />
              <button
                type="button"
                onClick={() =>
                  toast.error("This feature is currently unavailable")
                }
                className="cursor-pointer absolute right-2 top-2.5 text-[#5c5c5c] "
              >
                <Search  className="" strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className=" flex flex-col gap-12 lg:mx-12 max-w-[900px] w-full">
            <div>
              {posts?.map((post: any) => {
                return (
                  <Link key={post.id} href={`/dashboard/feed/${post.slug}`}>
                    <div className="px-4 py-4 hover:border-2 group relative hover:border-[#00687A] transition-all duration-500 bg-white border my-4 justify-center items-center  border-[#C6C6CD] rounded-lg ">
                      <div className="flex justify-between gap-2 items-center ">
                        <div className="flex gap-2 items-center">
                          {post.author.image ? (
                            <Link href={`dashboard/users/${post.author.id}`} className="w-[48px]  h-[48px] relative rounded-xl border-2  border-[#00687A]">
                              <Image
                                fill
                                sizes="48px"
                                className="absolute rounded-lg object-cover"
                                src={post.author.image}
                                alt={post.author.name}
                              />
                            </Link>
                          ) : (
                            <Link
                            href={`/dashboard/users/${post.author.id}`}
                              className={`bg-[#00687A] group w-[48px] h-[48px] rounded-lg text-white flex justify-center items-center text-4xl font-medium ${poppins.className}`}
                            >
                              {post.author.name.charAt(0).toUpperCase()}
                            </Link>
                          )}
                          <div className="flex flex-col ">
                            <Link
                            href={`/dashboard/users/${post.author.id}`}
                              className={`${libretinusSans.className} cursor-pointer hover:underline text-[#191C1E] font-semibold text-xl capitalize`}
                            >
                              {post.author.name}
                            </Link>
                            <div
                              className={`${jetbrains.className} text-gray-500 text-xs`}
                            >
                              {formatDistanceToNow(new Date(post.publishedAt), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${libretinusSans.className} mt-4 text-3xl font-bold`}
                      >
                        {post.title}
                      </div>
                      <div
                        className=" truncate line-clamp-4 md:line-clamp [&_ul]:list-disc [&_mark]:bg-[#00687A]/80  [&_mark]:text-white [&_mark]:px-2 [&_mark]:py-1 w-full ProseMirror [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:mt-2 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4  [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-4 [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />{" "}
                      {post.coverImage?.length > 0 && (
                        <div className="w-full my-5 flex justify-center overflow-hidden items-center  rounded-lg relative h-[300px]">
                          <Image
                            alt={post.title || "Cover image"}
                            fill
                            className="absolute border-2 scale-125 blur-3xl object-cover rounded-lg"
                            src={post.coverImage[0]}
                          />
                          <Image
                            alt={post.title || "Cover image"}
                            fill
                            loading="eager"
                            className="absolute border-2 border-[#00687A] object-contain rounded-lg"
                            src={post.coverImage[0]}
                          />
                        </div>
                      )}
                      <div className="text-white  bg-[#00687A] ease-out transition-all duration-400  w-fit p-2 right-4 -translate-y-4 group-hover:translate-y-0 top-4 rounded-full flex opacity-0 group-hover:opacity-100 absolute">
                        <ChevronRight />
                      </div>
                      <div className="gap-2   my-4 overflow-x-auto flex">
                        {post.postTags?.map((postTag: any) => (
                          <span
                          key={postTag.tag.id}
                            className={`text-sm my-2 flex gap-2 md:text-lg bg-[#00687A] text-white px-3 py-1 rounded-md ${poppins2.className}`}
                          >
                            <span>#</span> {postTag.tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
                            <div ref={loadMoreRef} className="h-20">
        {loadingMore && (
          <div className="flex flex-col w-full items-center justify-center py-2">
            <Loader2 size={40} className="animate-spin text-[#00687A]" />
            <span className={`${poppins.className} text-gray-400 text-xs animate-pulse duration-300 transition-all `}>Loading More Posts For You</span>
          </div>
        )}
      </div>
          </div>

        </div>
      )}

    </>
  );
}

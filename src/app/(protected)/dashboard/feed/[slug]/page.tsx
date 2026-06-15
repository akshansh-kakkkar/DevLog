"use client";
import { ChevronLeft, ChevronRight, Dot, Heart, Loader2 } from "lucide-react";
import { JetBrains_Mono, Libertinus_Sans, Poppins } from "next/font/google";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
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
  subsets: ['latin'],
  weight: ['400']
})
export default function () {
  const params = useParams();
  const slug = params.slug as string;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState<any>(null);
  useEffect(() => {
    const getSinglePost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) {
          toast.error(
            "something went wrong while fetching the post please refresh this is not my fault",
          );
        }
        const data = await res.json();
        setPost(data.post);
        setLikesCount(data.post.stats.likeCount);
        setLiked(data.post.hasLiked);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      getSinglePost();
    }
  }, [slug]);
  const getImage = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img"))
      .map((img) => img.src)
      .filter(Boolean);
  };
  let images: string[] = [];
  if (post?.coverImage) {
    images = Array.isArray(post.coverImage)
      ? post.coverImage
      : [post.coverImage];
  } else if (post) {
    images = getImage(post.content);
  }
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    try {
      setLikeLoading(true)
      const res = await fetch(`/api/posts/${slug}/like`, {
        method: "POST"
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error()
      }
    } catch (e) {
      setLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      toast.error("failed to like the post. Try not to spam")
    }
    finally {
      setLikeLoading(false)
    }
  }
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  return (
    <>
      {loading || !post ? (
        <div className="flex justify-center items-center text-center h-[85vh]">
          <Loader2 size={48} className="text-[#00687A] animate-spin " />
        </div>
      ) : (
        <div className="mt-12  mx-5 md:mx-12 lg:mx-22 flex gap-7 flex-col">
          <div className="flex justify-between items-center ">
            <div className="flex items-center  gap-2">
              <div
                className={`${jetbrains.className}  text-[#45464D] bg-[#E6E8EA] p-1 rounded-sm text-xs font-bold `}
              >
                {post.stats.readingTime}
              </div>
              <div>
                <Dot className="text-gray-400 " size={42} />
              </div>
              <div
                className={`${jetbrains.className} font-bold text-gray-500 text-xs`}
              >
                {formatDistanceToNow(new Date(post.publishedAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div className={`${poppins.className} flex items-center gap-4 border  px-4 py-1 text-center bg-white rounded-2xl justify-between `}>
              <button onClick={handleLike} disabled={likeLoading}>
                <Heart className={`cursor pointer  ${liked ? "fill-red-500 text-500 stroke-red-500" : "text-gray-400"}`} size={32} />
              </button>
              <span className="text-xl font-semibold">{likesCount}</span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {images.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-12 overflow-x-hidden">
                <div
                  className="cursor-pointer  z-35  rounded-full  bg-[#00687A] p-1 text-white"
                  onClick={() => {
                    setDirection(-1);
                    setCurrentImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1,
                    );
                  }}
                >
                  <ChevronLeft size={32} />
                </div>
                <div className=" w-full sm:w-[800px] h-[200px] sm:h-[300px] object-cover rounded-lg">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={images[currentImage]}
                      className="w-full  h-full border-4 border-[#00687A] object-center select-none rounded-lg"
                      src={images[currentImage]}
                      custom={direction}
                      alt={post.title || "Post image"}
                      transition={{ duration: 0.2 }}
                      variants={{
                        enter: (dir: number) => ({
                          x: dir > 0 ? 300 : -300,
                          opacity: 0,
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                        },
                        exit: (dir: number) => ({
                          x: dir > 0 ? -300 : 300,
                          opacity: 0,
                        }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    />
                  </AnimatePresence>
                </div>
                <div
                  className="cursor-pointer rounded-full  bg-[#00687A] p-1 text-white"
                  onClick={() => {
                    setDirection(1);
                    setCurrentImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1,
                    );
                  }}
                >
                  <ChevronRight size={32} />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-4">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? "bg-[#00687A]" : "bg-gray-300"}`}
              ></button>
            ))}
          </div>
          <div
            className={`md:text-4xl sm:text-3xl text-2xl lg:text-6xl md:px-5 font-bold ${libretinusSans.className} select-none border-b-2 py-2`}
          >
            {post.title}
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${poppins.className} [&_ul]:list-disc [&_mark]:bg-[#00687A]/80 [&_mark]:text-white [&_mark]:px-2 [&_mark]:py-1 w-full ProseMirror [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:mt-2 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-2 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4  [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-4 [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6`}
          />
          <div className="gap-2 my-4 overflow-x-auto flex">
            {post.postTags?.map((postTag: any) => (
              <span
              key={postTag.tag.name}
                className={`text-sm gap-2 flex md:text-lg bg-[#00687A] text-white px-3 py-1 rounded-md ${poppins2.className}`}
              >
                <span>#</span> {postTag.tag.name}
              </span>
            ))}
          </div>
        </div>

      )}

    </>
  );
}

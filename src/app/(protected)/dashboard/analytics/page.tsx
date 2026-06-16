"use client";
import {
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Eye,
  Globe,
  Link2,
  Loader2,
  LockKeyhole,
  Pencil,
  SquareChartGantt,
  ThumbsUp,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Geist, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import DeleteModal from "./components/Modals/DeleteModal";
import { Post } from "@/app/Types";
import PostPieChart from "./components/PieChart";
import PostBarGraph from "./components/BarGraph";
import { count } from "console";
import { number } from "zod";
import PostsActivityCalendar from "./components/ActivityCalendar";
import { start } from "repl";
const geist = Geist({
  subsets: ["latin"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
});

export default function Page() {
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsLoading2, setAnalyticsLoading2] = useState(false);
  const [analyticsLoading3, setAnalyticsLoading3] = useState(false);
  const [analyticsLoading4, setAnalyticsLoading4] = useState(false);
  const [stats, setstats] = useState({
    totalPosts: 0,
    totalReads: 0,
    avgReadTime: 0,
    draftPending: 0,
    totalLikes: 0,
  });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        setAnalyticsLoading(true);
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        console.log(data);
        setstats(data);
      } catch (error) {
        toast.error("Failed to fetch stats");
      } finally {
        setAnalyticsLoading(false);
      }
    };

    getStats();
  }, []);
  const cards = [
    {
      title: "Total Posts",
      value: stats.totalPosts || 0,
      icon: <TrendingUp />,
      text: "Post regularly",
      color: "text-[#00687A]",
    },
    {
      title: "Total Reads",
      value: stats.totalReads || 0,
      icon: <Eye />,
      color: "text-[#00687A]",
      text: "Consistent growth",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes || 0,
      icon: <SquareChartGantt />,
      color: "text-[#76777D]",
      text: "Content focus",
    },
    {
      title: "Drafts Pending",
      value: stats.draftPending || 0,
      icon: <Clock />,
      color: "text-[#93000A]",
      text: "Your review required",
    },
  ];
  const [currentCard, setCurrentCard] = useState(0);
  const [posts, setposts] = useState<Post[]>([]);
  const [allposts, setAllposts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pagenation, setPagenation] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  useEffect(() => {
    const getPosts = async () => {
      try {
        setAnalyticsLoading3(true);
        const res = await fetch(`/api/dashboard/posts?page=${page}&limit=5`);
        const data = await res.json();
        setposts(data.posts);
        setPagenation(data.pagination);
      } catch (error) {
        toast.error("Failed to fetch posts");
      } finally {
        setAnalyticsLoading3(false);
      }
    };

    getPosts();
  }, [page]);
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        setAnalyticsLoading4(true);
        const res = await fetch(`/api/dashboard/posts/`);
        const data = await res.json();
        setAllposts(data.allPosts);
      } catch (error) {
        toast.error("Failed to fetch all posts.");
      } finally {
        setAnalyticsLoading4(false);
      }
    };
    getAllPosts();
  }, []);
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };
  const publishCount = allposts.filter(
    (post) => post.status === "PUBLISHED",
  ).length;
  const draftCount = allposts.filter((post) => post.status === "DRAFT").length;
  const scheduleCount = allposts.filter(
    (post) => post.status === "SCHEDULED",
  ).length;

  const monthlyPosts = [
    { month: "Jan", posts: 0 },
    { month: "Feb", posts: 0 },
    { month: "Mar", posts: 0 },
    { month: "Apr", posts: 0 },
    { month: "May", posts: 0 },
    { month: "Jun", posts: 0 },
    { month: "Jul", posts: 0 },
    { month: "Aug", posts: 0 },
    { month: "Sep", posts: 0 },
    { month: "Oct", posts: 0 },
    { month: "Nov", posts: 0 },
    { month: "Dec", posts: 0 },
  ];
  allposts.forEach((post) => {
    const monthIndex = new Date(post.createdAt).getMonth();
    monthlyPosts[monthIndex].posts++;
  });
  const activityMap = new Map<string, number>();
  allposts.forEach((post) => {
    const date = new Date(post.createdAt).toISOString().split("T")[0];
    activityMap.set(date, (activityMap.get(date) ?? 0) + 1);
  });
  const generateActiveDate = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    const data = [];
    const current = new Date(startDate);
    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];
      const count = activityMap.get(dateStr) ?? 0;
      data.push({
        date: dateStr,
        count,
        level:
          count === 0
            ? 0
            : count <= 2
              ? 1
              : count <= 5
                ? 2
                : count <= 10
                  ? 3
                  : 4,
      });
      current.setDate(current.getDate() + 1);
    }
    return data;
  };
  const activityData = generateActiveDate().map((item) => ({
    day: item.date,
    value: item.count,
  }));
  return (
    <>
      {analyticsLoading ||
      analyticsLoading2 ||
      analyticsLoading3 ||
      analyticsLoading4 ? (
        <div className="flex flex-col justify-center h-full items-center text-center">
          <Loader2 className="animate-spin text-[#00687A]" size={48} />
        </div>
      ) : (
        <div className="lg:mt-12  mt-4 px-4 lg:px-22 flex-col flex gap-6 ">
          <div className="flex  sm:justify-start justify-center flex-col gap-4 border-[#C6C6CD] border-b-2 pb-2 ">
            <div
              className={`${geist.className} text-[#2D2D2D] text-4xl font-semibold`}
            >
              Posts Management
            </div>
            <div className={`${geist.className} text-[#45464D]`}>
              Review and Manage your posts and documentations{" "}
            </div>
          </div>
          <div
            className={`text-2xl font-semibold border-b-4  rounded-xs border-[#00687A] flex w-fit px-1 ${geist.className}`}
          >
            Quick Stats
          </div>
          <div className=" hidden sm:grid  grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            <div className="sm:col-span-1 border flex flex-col gap-2 border-[#C6C6CD] bg-white p-6 rounded-lg">
              <div
                className={`${jetbrains.className} font-medium text-xl text-[#76777D]`}
              >
                Total Posts
              </div>
              <div className={`${geist.className} text-4xl font-semibold`}>
                {stats.totalPosts || 0}
              </div>
              <div className="flex gap-2 text-[#00687A]">
                <span>
                  <TrendingUp />
                </span>
                <span className={`${geist.className}`}>Post regularly</span>
              </div>
            </div>
            <div className="sm:col-span-1 border flex flex-col gap-2 border-[#C6C6CD] bg-white p-6 rounded-lg">
              <div
                className={`${jetbrains.className} font-medium text-xl text-[#76777D]`}
              >
                Total Reads
              </div>
              <div className={`${geist.className} text-4xl font-semibold`}>
                {formatNumber(stats.totalReads || 0)}
              </div>
              <div className="flex gap-2 text-[#00687A]">
                <span>
                  <Eye />
                </span>
                <span className={`${geist.className}`}>Consistent growth</span>
              </div>
            </div>
            <div className="sm:col-span-1 border flex flex-col gap-2 border-[#C6C6CD] bg-white p-6 rounded-lg">
              <div
                className={`${jetbrains.className} font-medium text-xl text-[#76777D]`}
              >
                Total Likes
              </div>
              <div className={`${geist.className} text-4xl font-semibold`}>
                {formatNumber(stats.totalLikes || 0)}
              </div>
              <div className="flex gap-2 text-[#76777D]">
                <span>
                  <ThumbsUp />
                </span>
                <span className={`${geist.className}`}>Content focus</span>
              </div>
            </div>
            <div className="sm:col-span-1 border flex flex-col gap-2 border-[#C6C6CD] bg-white p-6 rounded-lg">
              <div
                className={`${jetbrains.className} font-medium text-xl text-[#76777D]`}
              >
                Drafts Pending
              </div>
              <div className={`${geist.className} text-4xl font-semibold`}>
                {stats.draftPending || 0}
              </div>
              <div className="flex gap-2 text-[#93000A]">
                <span>
                  <Clock />
                </span>
                <span className={`${geist.className}`}>
                  Your review required
                </span>
              </div>
            </div>
          </div>
          <div className={`sm:hidden `}>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) {
                  setCurrentCard((prev) =>
                    prev === cards.length - 1 ? 0 : prev + 1,
                  );
                }
                if (info.offset.x > 50) {
                  setCurrentCard((prev) =>
                    prev === 0 ? cards.length - 1 : prev - 1,
                  );
                }
              }}
              className="border bg-white border-[#C6C6CD] flex gap-4 flex-col p-3 rounded-lg"
            >
              <div
                className={`${jetbrains.className} font-medium text-xl text-[#76777D]`}
              >
                {cards[currentCard].title}
              </div>
              <div className={`${geist.className} text-4xl font-semibold`}>
                {cards[currentCard].value}
              </div>
              <div className={`${cards[currentCard].color} flex gap-2`}>
                <span>{cards[currentCard].icon}</span>
                <span className={`${geist.className}`}>
                  {cards[currentCard].text}
                </span>
              </div>
            </motion.div>
            <div className={`flex justify-center mt-4 items-center gap-2`}>
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`divansition-all rounded-full ${currentCard === index ? "w-6 h-2 bg-[#00687A] " : "w-6 h-2 bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
          <div
            className={`text-2xl font-semibold border-b-4  rounded-xs border-[#00687A] flex w-fit px-1 ${geist.className}`}
          >
            My Posts
          </div>
          {posts.length === 0 ? (
            <div
              className={`flex-col p-8 text-center mb-24 sm:mb-0 gap-2 flex justify-center items-center w-full  bg-white border rounded-lg `}
            >
              <div>
                <CircleAlert
                  size={64}
                  className={`rounded-full p-2 text-[#00687A] bg-[#00687a21]`}
                />
              </div>
              <p
                className={`${jetbrains.className} text-xl text-center  font-semibold`}
              >
                You will see your posts here
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <div className="w-full min-w-[900px] border rounded-lg">
                  <div>
                    <div
                      className={`${jetbrains.className} text-center border-b text-lg divide-x divide-[#C6C6CD] rounded-t-lg font-light grid grid-cols-5 bg-[#F2F4F6] text-[#76777D]`}
                    >
                      <div className="col-span-1 p-4">Post Title</div>
                      <div className="col-span-1 p-4">Status</div>
                      <div className="col-span-1 p-4">Visibility</div>
                      <div className="col-span-1 p-4">Created At</div>
                      <div className="col-span-1 p-4">Actions</div>
                    </div>
                  </div>
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`${geist.className}  divide-x divide-[#C6C6CD] text-center  grid grid-cols-5 border-b`}
                    >
                      <div className="col-span-1 font-bold p-4 truncate">
                        {post.title}
                      </div>
                      <div
                        className={`  col-span-1 p-4 text-center flex justify-center items-center`}
                      >
                        <span
                          className={`px-2 font-medium py-1 w-[100px] rounded-sm text-sm border-2  ${post.status === "DRAFT" ? "bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]" : post.status === "PUBLISHED" ? "bg-[#DCFCE7]  border-[#BBF7D0] text-[#15803D] " : post.status === "SCHEDULED" ? "bg-[#dbeafe] border-[#93C5FD]  text-[#1D4ED8]" : "bg-gray-100 border-gray-300 text-gray-700"}`}
                        >
                          {post.status}
                        </span>
                      </div>
                      <div className="col-span-1 font-medium p-4 flex justify-center px-4 items-center gap-2 text-[#45464D]">
                        <span>
                          {post.visibility === "PUBLIC" && (
                            <div className="flex items-center gap-4">
                              <Globe size={18} />
                              <p>Public</p>
                            </div>
                          )}
                          {post.visibility === "PRIVATE" && (
                            <div className="flex gap-2 items-center">
                              <LockKeyhole size={18} />
                              <p>Private</p>
                            </div>
                          )}
                          {post.visibility === "UNLISTED" && (
                            <div className="flex items-center gap-2">
                              <Link2 size={18} />
                              <p>Unlisted</p>
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="col-span-1   p-4 text-center flex justify-center items-center text-[#45464D]">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="col-span-1 gap-8 text-[#45464D] p-4 text-center flex justify-center items-center">
                        <span className="hover:bg-[#00687a21] transition-all duration-300 p-2 rounded-lg cursor-pointer">
                          <Link href={"/id"}>
                            <ChartColumn />
                          </Link>
                        </span>

                        <span className="hover:bg-[#00687a21] transition-all duration-300 p-2 rounded-lg cursor-pointer">
                          <Pencil />
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPostId(post.slug);
                            setShowDeleteModal(true);
                          }}
                          className="hover:bg-[#00687a21] rounded-lg p-2 cursor-pointer transition-all duration-300"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-4 justify-end gap-4">
                <button
                  className="cursor-pointer bg-white disabled:hover:text-[#00687A] disabled:hover:bg-white hover:bg-[#00687A] hover:text-white transition-all duration-300 border-[#00687A] disabled:cursor-not-allowed rounded-lg border text-[#00687A]"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="" size={32} />
                </button>
                <div>
                  Page {pagenation.currentPage} of {pagenation.totalPages}
                </div>
                <button
                  className="cursor-pointer disabled:hover:bg-white disabled:hover:text-[#00687A] bg-white border-[#00687A] disabled:cursor-not-allowed hover:bg-[#00687A] hover:text-white transition-all duration-300 rounded-lg border text-[#00687A]"
                  disabled={page >= pagenation.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <ChevronRight className="" size={32} />
                </button>
              </div>
            </div>
          )}
          <div
            className={`text-2xl font-semibold border-b-4  rounded-xs border-[#00687A] flex w-fit px-1 ${geist.className}`}
          >
            Graphs
          </div>
          {posts.length === 0 ? (
            <div
              className={`flex-col p-8 text-center mb-24 sm:mb-0 gap-2 flex justify-center items-center w-full  bg-white border rounded-lg `}
            >
              <div>
                <CircleAlert
                  size={64}
                  className={`rounded-full p-2 text-[#00687A] bg-[#00687a21]`}
                />
              </div>
              <p
                className={`${jetbrains.className} text-xl text-center  font-semibold`}
              >
                You will see your Graphs here
              </p>
            </div>
          ) : (
            <div>
              <div className="grid w-full juscne  items-center grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <PostPieChart
                  publishCount={publishCount}
                  scheduleCount={scheduleCount}
                  draftCount={draftCount}
                />
                <PostBarGraph data={monthlyPosts} />
              </div>
              <div className="mt-5">
                <PostsActivityCalendar data={activityData} />
              </div>
            </div>
          )}
        </div>
      )}
      <DeleteModal
        isOpen={showDeleteModal}
        slug={selectedPostId}
        onClose={() => {
          setSelectedPostId(null);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
}

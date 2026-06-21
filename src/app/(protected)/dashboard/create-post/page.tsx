"use client";
import {
  BookCheck,
  BookDashed,
  ChevronDownIcon,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { JetBrains_Mono, Libertinus_Sans, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DateTimePicker } from "@mantine/dates";
import TipTapEditor from "../components/Editor/TitapEditor";
import GalleryModal from "../components/modal/GalleryModal";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "800"],
});
const JetBrains = JetBrains_Mono({
  subsets: ["latin"],
});
const LiberSans = Libertinus_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export default function Page() {
  const router = useRouter();
  const [visibility, setVisibility] = useState("Public (default)");
  const [open, setOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedType, setPublishedType] = useState<"now" | "scheduled">(
    "now",
  );
  const [images, setImages] = useState<string[]>([]);
  const [gallery, setGallery] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverLoading, setCoverLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    { id: number; name: string }[]
  >([]);
  const plainText = content.replace(/<[^>]*>/g, "").trim();
  const charCount = plainText.length;
  useEffect(() => {
    const timeOut = setTimeout(async () => {
      if (!tagInput.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `/api/tags?search=${encodeURIComponent(tagInput)}`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timeOut);
  }, [tagInput]);
  const submitPost = async (isDraft: boolean) => {
    setSubmitError(null);
    if (!title.trim()) {
      setSubmitError("Title Too short");
      toast.error("Title Too short.");
      return;
    }
    if (content.length < 10) {
      setSubmitError("min 10 characters are required.");
      toast.error("min 10 characters are required.");
      return;
    }

    if (!isDraft && publishedType === "scheduled" && !scheduledAt) {
      toast.error("Scheduled date and time are required.");
      return;
    }

    try {
      setSubmitting(true);
      let status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
      if (isDraft) {
        status = "DRAFT";
      } else if (publishedType === "scheduled") {
        status = "SCHEDULED";
      } else {
        status = "PUBLISHED";
      }
      const response = await fetch(`/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          coverImage: images.length > 0 ? images : undefined,
          tags,
          visibility: visibility === "Private" ? "PRIVATE" : "PUBLIC",
          status,
          scheduledAt:
            status === "SCHEDULED" && scheduledAt
              ? new Date(scheduledAt).toISOString()
              : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message =
          data?.error?.formErrors?.[0] || data?.error?.fieldErrors
            ? Object.values(data.error.fieldErrors ?? {})
                .flat()
                .join(", ")
            : data?.error || "Something went wrong.";
        setSubmitError(
          typeof message === "string" ? message : "Submission failed.",
        );
        return;
      }
      router.push("/dashboard/feed");
    } catch (error) {
      console.error(error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const addTags = () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput) {
      toast.error("Tag cannot be empty");
      return;
    }

    if (tags.length >= 5) {
      toast.error("Maximus 5 tags are allowed.");
      setTagInput("");
      return;
    }
    if (tags.includes(trimmedInput.toLowerCase())) {
      toast.error("Tag already added");
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, trimmedInput.toLowerCase()]);
    toast.success("Tag added successfully.");
    setTagInput("");
  };
  console.log(scheduledAt);

  return (
    <div
      onClick={() => {
        setOpen(false);
      }}
      className="lg:grid inset-0 flex flex-col  lg:grid-cols-6 "
    >
      <div className="lg:col-span-4 py-8 px-6 ">
        <div>
          <textarea
            disabled={submitting}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
            placeholder="Title"
            style={{ fontSize: "32px" }}
            className={`${LiberSans.className} resize-none outline-none overflow-hidden border-2 lg:p-0 p-4 bg-white lg:bg-transparent rounded-lg lg:rounded-none lg:border-none font-bold w-full`}
          />
        </div>
        <div className="flex my-8  gap-3 items-center ">
          <div className="relative">
            <input
              className="w-full border-1 border-[#00687A] px-2 rounded-sm outline-none placeholder:text-[#00687ab6] py-1 flex"
              type="text"
              onChange={(e) => {
                setTagInput(e.target.value);
              }}
              placeholder="search..."
              value={tagInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTags();
                }
              }}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0  w-full bg-white border rounded-md shadow-md z-50">
                {suggestions.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={() => {
                      if (!tags.includes(tag.name)) {
                        setTags((prev) => [...prev, tag.name]);
                      }
                      setTagInput("");
                      setSuggestions([]);
                    }}
                  >
                    <div className="flex gap-2">
                      {" "}
                      <strong className="font-semibold text-xl">#</strong>{" "}
                      {tag.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addTags}
            className={`${poppins.className} cursor-pointer duration-300 border-[#00687A] border-1 hover:border-none font-medium cursor-pointer flex gap-1 items-center text-center  w-fit p-1 px-2 hover:text-[#ffffff] rounded-sm hover:bg-[#00687A] text-[#00687A] `}
          >
            <span>
              <Plus strokeWidth={2} />
            </span>
            <span>Tag</span>
          </button>
        </div>
        <div className="flex flex-row mx-8 my-8 gap-2 overflow-x-auto ">
          {tags.map((tag) => (
            <button
              key={tag}
              className="flex text-center justify-center text-white bg-[#00687A] px-2 py-1 rounded-lg items-center gap-2"
            >
              <div className="flex gap-2 text-center justify-center items-center">
                {" "}
                <strong className="font-semibold text-xl">#</strong> {tag}
              </div>
              <span className="cursor-pointer">
                <X
                  onClick={() =>
                    setTags((prev) => prev.filter((t) => t !== tag))
                  }
                  size={18}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-end lg:mr-14 text-[#00687A] font-medium">
          <p className={`${poppins.className}`}>{charCount} characters</p>
        </div>
        <div className="lg:mx-12">
          {images.length > 0 && (
            <div className="relative w-full">
              {coverLoading && (
                <div
                  className="flex absolute inset-0 z-20 items-center justify-center bg-black/10 rounded-2xl"
                >
                  <Loader2 className="text-[#00687A] w-8 h-8 animate-spin" />
                </div>
              )}

              <div className="flex cursor-pointer relative flex-row justify-center items-center transition-all duration-300 overflow-hidden my-2 mx-4">
                {images.length > 0 && (
                  <div 
                    className="relative w-full h-[300px] overflow-hidden rounded-2xl cursor-pointer"
                    onClick={() => setGallery(true)}
                  >
                    <img
                      src={images[0]}
                      className="absolute w-full inset-0 object-cover blur-3xl scale-125 opacity-80 h-full"
                      alt=""
                    />
                    <img
                      src={images[0]}
                      onLoad={() => setCoverLoading(false)}
                      className={`${coverLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300 relative z-10 w-full h-full object-contain rounded-lg`}
                      alt="Cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <TipTapEditor
            images={images}
            setImages={setImages}
            content={content}
            onChange={setContent}
          />
        </div>
      </div>
      <div className="lg:col-span-2 relative ">
        <div className="fixed lg:w-[300px] lg:w-[650px] hidden lg:flex flex-col justify-between overflow-y-auto  top-18 border-2 h-[calc(100vh-2rem)] py-8 px-6 ">
          <div>
            <label
              htmlFor=""
              className={`${JetBrains.className} text-[#76777D]`}
            >
              Publishing Workflow
            </label>

            <div
              className={`relative flex mt-4 gap-2 flex-col ${LiberSans.className}`}
            >
              <label
                htmlFor=""
                className={`${JetBrains.className} uppercase text-[#76777D]`}
              >
                Visibility
              </label>
              <button
                className={`${poppins.className} font-medium border cursor-pointer w-[200px] flex justify-around p-2 rounded-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                <span>{visibility}</span>
                <motion.div
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.001 }}
                  className="transition-all duration-300"
                >
                  <ChevronDownIcon />
                </motion.div>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-0 overflow-hidden z-100 bg-white top-full cursor-pointer w-[200px]  rounded-lg border  shadow-lg ${poppins.className}`}
                  >
                    {["Public (default)", "Private"].map((item) => (
                      <button
                        className="w-full  px-4 py-3 text-left hover:bg-gray-100"
                        onClick={() => {
                          setVisibility(item);
                          setOpen(false);
                        }}
                        key={item}
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-4 flex gap-2 flex-col">
              <div
                className={`text-[#76777D] uppercase ${JetBrains.className}`}
              >
                Schedule
              </div>
              <div className={`${poppins.className} font-medium  flex gap-2`}>
                <button
                  className={`${publishedType === "now" ? "bg-[#00687A] text-white" : "hover:bg-accent"} transition-all duration-300 border w-[114px] py-2 px-1 cursor-pointer rounded-lg text-md`}
                  onClick={() => setPublishedType("now")}
                >
                  Publish Now
                </button>
                <button
                  className={`border-1   w-[114px] py-2 px-1 rounded-lg cursor-pointer duration-300 transition-all text-md ${publishedType === "scheduled" ? "bg-[#00687A] text-white" : "hover:bg-accent"}`}
                  onClick={() => setPublishedType("scheduled")}
                >
                  Schedule
                </button>
              </div>
              <div>
                {publishedType === "scheduled" && (
                  <DateTimePicker
                    value={scheduledAt}
                    className={`text-lg ${poppins.className} w-[200px] py-2`}
                    label={"Pick Data and Time"}
                    placeholder="Pick Date and Time"
                    minDate={new Date()}
                    onChange={setScheduledAt}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4 py-8 flex-col justify-center items-center text-center w-[360px]">
            <button
              onClick={() => submitPost(true)}
              disabled={submitting}
              className={`text-xl gap-2 border-2 py-6 border-[#191C1E] w-[300px] h-[40px] flex justify-center text-center items-center rounded-lg ${JetBrains.className} font-medium hover:text-white hover:bg-[#191C1E] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  Save Draft{" "}
                  <span>
                    <BookDashed />
                  </span>
                </>
              )}
            </button>
            <button
              onClick={() => submitPost(false)}
              disabled={submitting}
              className={`text-xl gap-2 border-2  text-white py-7 bg-[#191C1E] w-[300px] h-[40px] flex justify-center text-center items-center rounded-lg ${JetBrains.className} font-medium  hover:bg-[#5d5d5d]  transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  {publishedType === "scheduled" ? (
                    <div>Schedule Now</div>
                  ) : (
                    <div>Publish Now</div>
                  )}{" "}
                  <span>
                    <BookCheck />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-6 lg:hidden mx-8">
          <div
            className={`${JetBrains.className} border-t-2 pt-6 text-xl text-[#76777D]`}
          >
            Publish Workflow
          </div>
          <div>
            <div
              className={`${JetBrains.className}  text-[#76777D] uppercase text-lg font-medium py-3`}
            >
              Visibility
            </div>
            <button
              className={`${poppins.className} relative font-medium border cursor-pointer w-[200px] flex justify-around p-2 rounded-md`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              <span>{visibility}</span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.001 }}
                className="transition-all duration-300"
              >
                <ChevronDownIcon />
              </motion.div>
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute left-8 overflow-hidden z-25 bg-white cursor-pointer w-[200px]  rounded-lg border  shadow-lg ${poppins.className}`}
                >
                  {["Public (default)", "Private"].map((item) => (
                    <button
                      className="w-full  px-4 py-3 text-left hover:bg-gray-100"
                      onClick={() => {
                        setVisibility(item);
                        setOpen(false);
                      }}
                      key={item}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-2 flex-col">
            <div
              className={`${JetBrains.className} text-[#76777D] uppercase text-lg font-medium py-3`}
            >
              Schedule
            </div>
            <div className={`${poppins.className} font-medium  flex gap-2`}>
              <button
                className={`${publishedType === "now" ? "bg-[#00687A] text-white" : "hover:bg-accent"} transition-all duration-300 border w-[114px] py-2 px-1 cursor-pointer rounded-lg text-md`}
                onClick={() => {
                  setPublishedType("now");
                  setScheduledAt(null);
                }}
              >
                Publish Now
              </button>
              <button
                className={`border-1   w-[114px] py-2 px-1 rounded-lg cursor-pointer duration-300 transition-all text-2xl ${publishedType === "scheduled" ? "bg-[#00687A] text-white" : "hover:bg-accent"}`}
                onClick={() => setPublishedType("scheduled")}
              >
                Schedule
              </button>
            </div>
            <div>
              {publishedType === "scheduled" && (
                <DateTimePicker
                  value={scheduledAt}
                  className={`text-lg ${poppins.className} w-[200px] py-2`}
                  label={"Pick Data and Time"}
                  placeholder="Pick Date and Time"
                  minDate={new Date()}
                  onChange={setScheduledAt}
                />
              )}
            </div>
            <div className="flex gap-4 py-8 flex-col justify-center items-center text-center">
              <button
                onClick={() => submitPost(true)}
                disabled={submitting}
                className={`text-xl gap-2 border-2 py-6 border-[#191C1E] w-full h-[40px] flex justify-center text-center items-center rounded-lg ${JetBrains.className} font-medium hover:text-white hover:bg-[#191C1E] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    Save Draft{" "}
                    <span>
                      <BookDashed />
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={() => submitPost(false)}
                disabled={submitting}
                className={`text-xl gap-2 border-2  text-white py-7 bg-[#191C1E] w-full h-[40px] flex justify-center text-center items-center rounded-lg ${JetBrains.className} font-medium  hover:bg-[#5d5d5d]  transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    {publishedType === "scheduled"
                      ? "Schedule Post"
                      : "Publish Now"}
                    <span>
                      <BookCheck />
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <GalleryModal
        onClose={() => setGallery(false)}
        images={images}
        isOpen={gallery}
        setImages={setImages}
      />
    </div>
  );
}

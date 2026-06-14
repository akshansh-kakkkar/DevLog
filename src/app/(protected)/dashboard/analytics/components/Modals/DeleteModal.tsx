import { Loader2, Trash2Icon } from "lucide-react";
import { Geist, JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteModalProps {
  isOpen: Boolean;
  onClose: () => void;
  slug: string | null;
}
const geist = Geist({
  subsets: ["latin"],
});

export default function DeleteModal({
  onClose,
  isOpen,
  slug,
}: DeleteModalProps) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    if (!slug) return;
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed");
      }
      toast.success("Post Deleted Successfully");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong while deleting the Post.");
    } finally {
      setDeleteLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="bg-black/50 flex justify-center items-center inset-0 fixed z-50 w-full h-full ">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex p-4 flex-col gap-2 bg-white rounded-lg  mx-2 justify-center items-center text-center`}
      >
        <div className="w-full h-full flex flex-col gap-4  p-4 justify-center">
          <div className="flex items-center w-full justify-center">
            <Trash2Icon
              size={64}
              className="p-4 text-[#93000A] bg-[#FFDAD6] rounded-full"
            />
          </div>
          <div className=" text-slate-900 text-base font-semibold dark:text-slate-50">
            Are you sure you want to delete this post?
          </div>
          <div className="text-slate-600 text-md leading-relaxed dark:text-slate-400">
            This action is permanent and cannot be undone. Once deleted, the
            item will be removed from your account.
          </div>
          <div className={`flex gap-4 font-bold ${geist.className}`}>
            <button
             disabled={deleteLoading}
              onClick={onClose}
              className="border font-bold hover:scale-[98%] transition-all duration-300 border-[#C6C6CD] cursor-pointer py-4 rounded-md w-full"
            >
              No, Cancel
            </button>
            <button
              onClick={handleDelete}
              className={` py-4 flex justify-center font-bold items-center text-center rounded-md cursor-pointer hover:scale-[98%] transition-all duration-300 bg-[#93000A] hover:bg-red-700 disabled:hover:bg-gray-400 disabled:hover:scale-[100%] disabled:cursor-not-allowed text-white w-full`}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="animate-spin text-white" size={26} />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

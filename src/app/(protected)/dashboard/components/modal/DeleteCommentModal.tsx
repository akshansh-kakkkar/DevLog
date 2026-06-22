import { Loader2, Trash2Icon, X } from "lucide-react";
import { Geist } from "next/font/google";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCommentModalProps {
  onClose: () => void;
  isOpen: Boolean;
  onDelete: () => void;
}
    const geist = Geist({
        subsets : ['latin']
    })
export default function DeleteCommentModal({
  onClose,
  isOpen,
  onDelete,
}: DeleteCommentModalProps) {

    const [isLoading, setIsLoading] = useState(false);
    const deleteComment = async()=>{
        try{
            setIsLoading(true);
            await onDelete();
            toast.success("Comment deleted successfully.")
            onClose();
        }
        catch(error){
            toast.error("Failed to delete the comment.")
        }
        finally{
            setIsLoading(false)
        }
    }
  if (!isOpen) return null;
  return (
    <div
      className="inset-0 bg-black/50 fixed flex items-center justify-center z-50"
      onClick={onClose}
    >
              <div
        className="bg-white relative px-4  mx-4 border-2 py-6 min-h-[300px] max-h-[600px] min-w-[250px] max-w-[600px] rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
                <div className="h-full w-full flex justify-center items-center flex-col gap-4">
                  <div className="text-[#45464D]  cursor-pointer flex absolute top-4 justify-end right-4">
            <X
              onClick={onClose}
              className="hover:scale-[120%]  transition-all duration-300"
            />
          </div>
          <div className="flex w-full justify-center items-center ">
            <Trash2Icon
              size={64}
              className="bg-[#FFDAD6] p-3 rounded-full text-[#93000A]"
            />
          </div> 
          <div
            className={`${geist.className} text-[#191C1E] text-xl font-bold flex justify-center items-center w-full`}
          >
            Delete
          </div>
          <div className={`${geist.className} text-lg text-[#45464D]`}>
            Are you sure you would like to delete this ? This action is
            irreversible.
          </div> 
           <div
            className={`flex w-full text-lg sm:text-xl font-semibold ${geist.className} gap-4 justify-center items-center `}
          >
            <button
              onClick={onClose}
              className="border cursor-pointer hover:scale-[98%] transition-all duration-300 border-[#C6C6CD] cursor-pointer py-4 rounded-xl w-full"
            >
              Cancel
            </button>
            <button
              onClick={()=>{deleteComment()}}
              className=" py-4 flex justify-center items-center text-center rounded-xl cursor-pointer hover:scale-[98%] transition-all duration-300 bg-[#93000A] hover:bg-red-700 disabled:50 disabled:cursor-not-allowed text-white w-full"
            >
              {isLoading ? (
                <Loader2 className="flex animate-spin text-white" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>

                </div>
      </div>
    </div>
  );
}

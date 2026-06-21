import { ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeleteImageModal from "./DeleteImageModal";

interface GalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}
export default function GalleryModal({
  images,
  isOpen,
  onClose,
}: GalleryModalProps) {
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setCurrentImage(0);
    }
  }, [isOpen]);
  useEffect(() => {
    setLoading(true);
  }, [currentImage]);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  useEffect(()=>{
      if (!isOpen) return;
    const handleKeyDown = (e : KeyboardEvent) =>{
      if(e.key === "ArrowLeft") prevImage();
      if(e.key === "ArrowRight") nextImage();
      if(e.key === "Escape") onClose();
    }
    window.addEventListener("keydown",handleKeyDown);
    return  ()=>{
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])
    const [deleteImageOpen, setDeleteImageOpen] = useState(false);
    if (!isOpen) return null;

  return (
    <>
    <div
      className="fixed inset-0  w-full h-full flex flex-col justify-center z-50 bg-black/70 p-4"
      onClick={onClose}
    >
      <div className=" flex items-center justify-around ">
        <div onClick={(e) => e.stopPropagation()}>
          <ChevronLeft
            onClick={prevImage}
            className="bg-black/20 md:w-12 md:h-12 w-8 h-8 p-2 md:p-0 rounded-full flex item-center justify-center cursor-pointer hover:scale-[108%] transition-all duration-300 text-white"
          />
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg- select-none rounded-xl overflow-y-auto"
        >
          <div>
            <div className="md:w-[900px] w-[200px] sm:w-[450px]  h-[60vh] relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-[#00687A] w-12 h-12" />
                </div>
              )}
              <div className="group w-full relative h-full">
                              <Image
                src={images[currentImage]}
                alt="images"
                className={`absolute  object-cover h-full w-full inset-0 opacity-30 rounded-xl blur-3xl transition-opacity duration-300  rounded-xl  ${loading ? "opacity-0" : "opacity-100"}`}
                fill
                onLoad={() => setLoading(false)}
              />
              <Image
                src={images[currentImage]}
                alt="images"
                className={` object-contain transition-opacity duration-300 h-full w-full  rounded-xl  ${loading ? "opacity-0" : "opacity-100"}`}
                fill
                onLoad={() => setLoading(false)}
              />
              <div onClick={(e)=>{e.stopPropagation(); setDeleteImageOpen(true)}} className="relative cursor-pointer group-hover:flex justify-end  z-20 items-start p-4 w-full h-full hidden ">
                <Trash2 size={48} className="text-[#ffffff] bg-[#00687abe]  p-2 rounded-full "  />
              </div>
              </div>
            </div>
            <div className="flex justify-center items-center ">
              <p className="absolute bottom-10 text-white ">
                {currentImage + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center  justify-center"
        >
          <ChevronRight
            onClick={nextImage}
            className="bg-black/20   md:w-12 md:h-12 w-8 h-8 p-2 md:p-0 rounded-full flex items-center justify-center cursor-pointer hover:scale-[108%] transition-all duration-300 text-white"
          />
        </div>
      </div>
    </div>
        <DeleteImageModal onClose={()=>setDeleteImageOpen(false)} isOpen={deleteImageOpen}/>
</>
  );
}

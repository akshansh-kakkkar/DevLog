import { ChevronLeft, ChevronRight, Loader2, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    if (!isOpen) return null;

  return (
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
          className="bg- select-none rounded-xl p-4 overflow-y-auto"
        >
          <div>
            <div className="md:w-[900px] w-[200px] sm:w-[450px]  h-[60vh] relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-[#00687A] w-12 h-12" />
                </div>
              )}
              <div className="group w-full relative h-full">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60  transition-all duration-300 rounded-xl z-10" />
              <Image
                src={images[currentImage]}
                alt="images"
                className={`absolute object-contain transition-opacity duration-300  rounded-xl bg-black ${loading ? "opacity-0" : "opacity-100"}`}
                fill
                onLoad={() => setLoading(false)}
              />
              <div className="relative cursor-pointer group-hover:flex justify-center  z-20 items-center w-full h-full hidden ">
                <Trash2Icon size={64} className="text-[#ffffff] bg-[#00687A]  p-4 rounded-full " />
              </div>
              </div>
            </div>
            <div className="p-2 flex justify-center items-center ">
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
  );
}

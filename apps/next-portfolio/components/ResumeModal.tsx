"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { memo } from "react";

interface ResumeModalProps {
  onClose: () => void;
}

const ResumeModal = memo(({ onClose }: ResumeModalProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#5865F2] to-[#4752c4]">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h2 className="text-sm sm:text-xl font-bold text-white">Resume - Piyush Raj</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
                onClick={() => window.open("/resume.pdf", "_blank")}
              >
                Download
              </button>
              <button
                className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-colors"
                onClick={onClose}
              >
                <X className="w-3 h-3 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer - Optimized */}
          <div className="h-[calc(100%-3.5rem)] sm:h-[calc(100%-5rem)] bg-gray-50">
            <iframe
              src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
              className="w-full h-full border-0"
              title="Resume PDF"
              loading="lazy"
              style={{
                background: 'white',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)'
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ResumeModal.displayName = "ResumeModal";

export default ResumeModal;
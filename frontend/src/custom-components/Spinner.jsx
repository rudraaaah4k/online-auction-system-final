import React from "react";
import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="w-full min-h-[600px] flex items-center">
      <div className="w-full page-content !pt-12">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="auction-card"
            >
              {/* Skeleton loader keeps perceived performance high during data fetches. */}
              <div className="skeleton shimmer-block" style={{ aspectRatio: "4/3" }} />
              <div style={{ padding: "16px" }}>
                <div className="skeleton shimmer-block" style={{ height: "14px", width: "75%", marginBottom: "12px", borderRadius: "6px" }} />
                <div className="skeleton shimmer-block" style={{ height: "12px", width: "55%", marginBottom: "14px", borderRadius: "6px" }} />
                <div className="skeleton shimmer-block" style={{ height: "36px", width: "100%", borderRadius: "8px" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spinner;

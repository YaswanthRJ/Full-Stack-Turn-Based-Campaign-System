import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { CampaignTemplate } from "../types/campaign.types";
import { getCampaigns } from "../service/campaign.service";

// ── Background ─────────────────────────────────────────────────────────────
function BgLayer() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#7c3aed22 1px, transparent 1px),
            linear-gradient(90deg, #7c3aed22 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7c3aed33 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </>
  );
}

// ── Campaign card ──────────────────────────────────────────────────────────
type CampaignCellProps = {
  data: CampaignTemplate;
  index: number;
};

function CampaignCell({ data, index }: CampaignCellProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: "easeOut" }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/creatures/${data.id}`)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
        border: hovered ? "1px solid #a855f7" : "1px solid #7c3aed44",
        boxShadow: hovered
          ? "0 0 28px #7c3aed55, inset 0 0 30px #3b007211"
          : "0 4px 20px #7c3aed18",
        transition: "border 0.25s, box-shadow 0.25s",
      }}
    >
      {/* Sliding highlight on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, #a855f711 50%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: hovered ? "100%" : "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{
          background: "linear-gradient(180deg, #a855f7, #7c3aed, #6d28d9)",
        }}
        animate={{ scaleY: hovered ? 1 : 0.4, opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.25 }}
      />

      <div className="flex items-center gap-4 p-4 pl-5">
        {/* Index badge */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
          style={{
            background: "linear-gradient(135deg, #3b0072, #7c3aed)",
            border: "1px solid #a855f766",
            color: "#e9d5ff",
            boxShadow: "0 0 12px #7c3aed44",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h2
            className="font-black text-base truncate"
            style={{ color: hovered ? "#f3e8ff" : "#d8b4fe" }}
          >
            {data.name}
          </h2>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#9333ea99" }}>
            {data.description}
          </p>
        </div>

        {/* Arrow */}
        <motion.span
          className="shrink-0 text-purple-500 text-lg font-black"
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.2 }}
        >
          →
        </motion.span>
      </div>
    </motion.div>
  );
}

// ── Main Campaigns ─────────────────────────────────────────────────────────
export function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignTemplate[] | null>(null);

  useEffect(() => {
    getCampaigns().then((data) => setCampaigns(data));
  }, []);

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <BgLayer />

      <div className="relative flex flex-col gap-5 p-5 pb-10">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-1 pt-4"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="font-black text-xl tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, #c084fc, #e879f9, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Campaigns
          </h1>
          <p className="text-purple-500 text-xs font-mono tracking-widest">
            Choose your battle
          </p>
          {/* Divider */}
          <motion.div
            className="w-24 h-px mt-2"
            style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.div>

        {/* List */}
        <AnimatePresence mode="wait">
          {!campaigns ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-3 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full border-4 border-purple-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-purple-400 font-mono text-xs tracking-widest">Loading...</span>
            </motion.div>
          ) : campaigns.length === 0 ? (
            <motion.p
              key="empty"
              className="text-center text-purple-500 font-mono py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No campaigns available
            </motion.p>
          ) : (
            <motion.div key="list" className="flex flex-col gap-3">
              {campaigns.map((c, i) => (
                <CampaignCell key={c.id} data={c} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
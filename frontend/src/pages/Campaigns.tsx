import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { CampaignTemplate } from "../types/campaign.types";
import { getCampaigns } from "../service/campaign.service";

function BgLayer() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(circle at center, #7c3aed11 0%, transparent 80%)",
      }}
    />
  );
}

type ArrowProps = {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
};

function NavArrow({ direction, onClick, visible }: ArrowProps) {
  if (!visible) return null;
  return (
    <motion.button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center px-4"
      style={{
        left: direction === "left" ? "4px" : "auto",
        right: direction === "right" ? "4px" : "auto",
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-purple-400/60 hover:text-purple-400 text-3xl font-black transition-colors">
        {direction === "left" ? "‹" : "›"}
      </span>
    </motion.button>
  );
}

type CampaignCardProps = {
  data: CampaignTemplate;
  isActive: boolean;
};

function CampaignCard({ data, isActive }: CampaignCardProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="w-full shrink-0 px-12"
      animate={{ scale: isActive ? 1 : 0.92, opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
          border: isActive ? "1px solid #a855f7" : "1px solid #7c3aed33",
          boxShadow: isActive ? "0 0 12px #7c3aed33" : "none",
        }}
        onClick={() => navigate(`/creatures/${data.id}`)}
      >
        <div className="relative h-32 w-full overflow-hidden">
          <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 40%, #0d001f 100%)" }}
          />
        </div>
        <div className="p-3">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[9px] font-mono text-purple-500 tracking-wider">CAMPAIGN</span>
            <div className="flex-1 h-px bg-purple-500/20" />
          </div>
          <h2 className="font-black text-base text-purple-100 mb-0.5">{data.name}</h2>
          <p className="text-[11px] text-purple-400/60 leading-relaxed">
            {data.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-purple-400/40 text-[9px] font-mono">
            <span>Tap to begin</span>
            <span className="text-purple-500 text-[10px]">→</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type DotProps = {
  total: number;
  current: number;
  onSelect: (index: number) => void;
};

function DotIndicators({ total, current, onSelect }: DotProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="transition-all duration-200"
            style={{
              width: i === current ? "16px" : "5px",
              height: "5px",
              borderRadius: "2.5px",
              background: i === current ? "#a855f7" : "#7c3aed44",
            }}
          />
        ))}
      </div>
      <p className="text-purple-400/50 text-[10px] font-mono tracking-wider">
        {current + 1}/{total}
      </p>
    </div>
  );
}

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignTemplate[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCampaigns().then((data) => setCampaigns(data));
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const index = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.clientWidth
    );
    if (index !== currentIndex && !isNaN(index)) setCurrentIndex(index);
  };

  if (!campaigns) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3"
        style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
        <span className="text-purple-400 font-mono text-xs">Loading campaigns...</span>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}
    >
      <BgLayer />

      <div className="relative flex flex-col items-center gap-1 pt-2 pb-2 shrink-0">
        <h1 className="font-black text-2xl tracking-widest uppercase text-purple-200">
          Campaigns
        </h1>
        <p className="text-purple-400 text-[10px] font-mono tracking-wider">SWIPE TO EXPLORE</p>
      </div>

      <div className="relative mt-10">
        <NavArrow direction="left" onClick={() => scrollToIndex(currentIndex - 1)} visible={currentIndex > 0} />
        <NavArrow direction="right" onClick={() => scrollToIndex(currentIndex + 1)} visible={currentIndex < campaigns.length - 1} />

        <div
          ref={scrollRef}
          className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          <div className="flex items-center">
            {campaigns.map((campaign, i) => (
              <div
                key={campaign.id}
                className="w-full shrink-0 snap-center"
                style={{ scrollSnapAlign: "center" }}
              >
                <CampaignCard data={campaign} isActive={i === currentIndex} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DotIndicators
        total={campaigns.length}
        current={currentIndex}
        onSelect={scrollToIndex}
      />

      <div className="h-2 shrink-0" />
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowDownRight, 
  ArrowUpRight, 
  ArrowDown, 
  ArrowUp,
  Download,
  Copy,
  Check,
  Palette,
  Maximize2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = 
  | "to right" 
  | "to left" 
  | "to bottom" 
  | "to top" 
  | "to bottom right" 
  | "to top right"
  | "to bottom left"
  | "to top left";

const DIRECTIONS: { id: Direction; icon: React.ReactNode; label: string }[] = [
  { id: "to right", icon: <ArrowRight size={18} />, label: "Right" },
  { id: "to left", icon: <ArrowLeft size={18} />, label: "Left" },
  { id: "to bottom", icon: <ArrowDown size={18} />, label: "Bottom" },
  { id: "to top", icon: <ArrowUp size={18} />, label: "Top" },
  { id: "to bottom right", icon: <ArrowDownRight size={18} />, label: "Bottom Right" },
  { id: "to top right", icon: <ArrowUpRight size={18} />, label: "Top Right" },
];

const PRESETS: { name: string; color1: string; color2: string; direction: Direction }[] = [
  { name: "Sunset", color1: "#FF6B6B", color2: "#FFE66D", direction: "to right" },
  { name: "Ocean", color1: "#2193b0", color2: "#6dd5ed", direction: "to bottom right" },
  { name: "Aurora", color1: "#a8ff78", color2: "#78ffd6", direction: "to right" },
  { name: "Lavender", color1: "#C471ED", color2: "#12c2e9", direction: "to bottom right" },
  { name: "Peach", color1: "#FFD1FF", color2: "#FAD0C4", direction: "to right" },
  { name: "Midnight", color1: "#232526", color2: "#414345", direction: "to bottom" },
  { name: "Rose", color1: "#f953c6", color2: "#b91d73", direction: "to right" },
  { name: "Forest", color1: "#134E5E", color2: "#71B280", direction: "to bottom right" },
  { name: "Candy", color1: "#D3959B", color2: "#BFE6BA", direction: "to right" },
  { name: "Space", color1: "#0f0c29", color2: "#302b63", direction: "to bottom" },
  { name: "Citrus", color1: "#f7971e", color2: "#ffd200", direction: "to right" },
  { name: "Cool Blue", color1: "#4facfe", color2: "#00f2fe", direction: "to bottom right" },
];

export default function Home() {
  const [color1, setColor1] = useState("#FFD1FF");
  const [color2, setColor2] = useState("#FAD0C4");
  const [direction, setDirection] = useState<Direction>("to right");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cssGradient = `linear-gradient(${direction}, ${color1}, ${color2})`;

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setColor1(preset.color1);
    setColor2(preset.color2);
    setDirection(preset.direction);
  };

  const handleCopy = async () => {
    const text = `background: ${cssGradient};`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D context");

        let x0 = 0, y0 = 0, x1 = canvas.width, y1 = canvas.height;
        switch(direction) {
          case "to right": x1 = canvas.width; y1 = 0; break;
          case "to left": x0 = canvas.width; x1 = 0; y1 = 0; break;
          case "to bottom": x1 = 0; y1 = canvas.height; break;
          case "to top": y0 = canvas.height; x1 = 0; y1 = 0; break;
          case "to bottom right": x1 = canvas.width; y1 = canvas.height; break;
          case "to top right": y0 = canvas.height; x1 = canvas.width; y1 = 0; break;
          case "to bottom left": x1 = 0; y1 = canvas.height; x0 = canvas.width; y0 = 0; break;
          case "to top left": x1 = 0; y1 = 0; x0 = canvas.width; y0 = canvas.height; break;
        }

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const link = document.createElement("a");
        link.download = "gradient-background.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Failed to generate image", err);
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  return (
    <div className="min-h-screen w-full relative bg-background overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 z-0 pointer-events-none bg-noise" />

      {/* Fullscreen Preview Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-50"
            style={{ background: cssGradient }}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/20 backdrop-blur-md text-white font-medium text-sm hover:bg-black/30 transition-all duration-200 border border-white/20"
            >
              <X size={16} />
              Exit Preview
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center gap-3 text-sm font-medium text-white/90">
              <div className="w-3 h-3 rounded-full shadow-inner ring-1 ring-white/30" style={{ backgroundColor: color1 }} />
              <ArrowRight size={14} className="text-white/60" />
              <div className="w-3 h-3 rounded-full shadow-inner ring-1 ring-white/30" style={{ backgroundColor: color2 }} />
              <span className="ml-1 opacity-60 text-xs font-mono">{direction}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-screen">

        {/* Controls Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-border/50 mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              Gradient<br/>Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Create beautiful, seamless gradients and export them instantly.
            </p>
          </div>

          {/* Controls Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/[0.02] flex flex-col gap-6">

            {/* Colors Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ColorInput label="Color 1" value={color1} onChange={setColor1} />
                <ColorInput label="Color 2" value={color2} onChange={setColor2} />
              </div>
            </div>

            <div className="h-[1px] w-full bg-border/50" />

            {/* Direction Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Direction</h3>
              <div className="grid grid-cols-3 gap-3">
                {DIRECTIONS.map((dir) => (
                  <button
                    key={dir.id}
                    onClick={() => setDirection(dir.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all duration-200 group",
                      direction === dir.id
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-white text-muted-foreground border-border/80 hover:border-border hover:bg-secondary/50 hover:text-foreground"
                    )}
                    aria-label={`Gradient direction: ${dir.label}`}
                  >
                    <span className={cn(
                      "transition-transform duration-300",
                      direction === dir.id ? "scale-110" : "group-hover:scale-110"
                    )}>
                      {dir.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[1px] w-full bg-border/50" />

            {/* Presets Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Presets</h3>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    title={preset.name}
                    className={cn(
                      "group relative flex flex-col items-center gap-1.5 rounded-2xl overflow-hidden border-2 transition-all duration-200",
                      color1 === preset.color1 && color2 === preset.color2
                        ? "border-primary shadow-md scale-[1.04]"
                        : "border-transparent hover:border-border hover:scale-[1.04]"
                    )}
                  >
                    <div
                      className="w-full aspect-square rounded-xl"
                      style={{
                        background: `linear-gradient(${preset.direction}, ${preset.color1}, ${preset.color2})`
                      }}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground pb-0.5 truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Download size={20} />
              )}
              {isDownloading ? "Generating..." : "Download PNG"}
            </button>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white border border-border text-foreground font-semibold text-lg hover:bg-secondary/50 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2 text-emerald-600"
                  >
                    <Check size={20} />
                    Copied CSS
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={20} />
                    Copy CSS
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        {/* Live Preview Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex-1 w-full min-h-[500px] lg:min-h-full rounded-[2.5rem] lg:rounded-[3rem] p-3 lg:p-4 bg-white/40 border border-white/60 shadow-2xl shadow-black/[0.03] backdrop-blur-md relative"
        >
          <div
            className="w-full h-full rounded-[2rem] lg:rounded-[2.5rem] transition-all duration-700 ease-out shadow-inner"
            style={{ background: cssGradient }}
          />

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-7 right-7 lg:top-8 lg:right-8 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/15 backdrop-blur-md text-white text-sm font-medium hover:bg-black/25 transition-all duration-200 border border-white/20"
          >
            <Maximize2 size={14} />
            Preview
          </button>

          {/* Color swatch pill */}
          <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-sm font-medium text-foreground/80 transition-opacity">
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: color1 }} />
            <ArrowRight size={14} className="text-muted-foreground" />
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: color2 }} />
          </div>
        </motion.div>

      </main>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/i.test(value)) {
      if (/^[0-9A-Fa-f]{6}$/i.test(value)) {
        onChange(`#${value}`);
      } else {
        onChange("#000000");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="group flex items-center justify-between p-2.5 bg-white border border-border rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-200 hover:border-border/80 shadow-sm">
        <div
          className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner shrink-0 cursor-pointer ring-1 ring-black/5"
          onClick={() => inputRef.current?.click()}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: value }} />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0 w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            aria-label={label}
          />
        </div>
        <div className="flex-1 px-3 flex items-center gap-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={handleTextChange}
            onBlur={handleBlur}
            maxLength={7}
            className="w-full bg-transparent border-none outline-none text-foreground font-mono font-medium text-[15px] p-0 tracking-wide focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
}

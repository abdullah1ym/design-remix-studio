import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Play, Star, Zap, Anchor, Fish, Shell, Waves, X } from "lucide-react";

interface ProgressMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SkillNode {
  id: number;
  title: string;
  status: "completed" | "current" | "available" | "locked";
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
  size: "small" | "medium" | "large";
  connections: number[];
}

const skillNodes: SkillNode[] = [
  // Starting node (bottom center)
  { id: 1, title: "Ocean Basics", status: "completed", x: 50, y: 85, icon: <Anchor className="w-5 h-5" />, color: "turquoise", size: "large", connections: [2, 3] },
  
  // Second tier
  { id: 2, title: "Marine Life", status: "completed", x: 30, y: 65, icon: <Fish className="w-4 h-4" />, color: "turquoise", size: "medium", connections: [4, 5] },
  { id: 3, title: "Ocean Currents", status: "completed", x: 70, y: 65, icon: <Waves className="w-4 h-4" />, color: "turquoise", size: "medium", connections: [5, 6] },
  
  // Third tier
  { id: 4, title: "Coral Reefs", status: "current", x: 15, y: 45, icon: <Shell className="w-4 h-4" />, color: "yellow", size: "medium", connections: [7] },
  { id: 5, title: "Ecosystems", status: "available", x: 50, y: 45, icon: <Zap className="w-4 h-4" />, color: "muted", size: "large", connections: [7, 8, 9] },
  { id: 6, title: "Deep Sea", status: "available", x: 85, y: 45, icon: <Fish className="w-4 h-4" />, color: "muted", size: "medium", connections: [9] },
  
  // Fourth tier
  { id: 7, title: "Conservation", status: "locked", x: 25, y: 25, icon: <Star className="w-4 h-4" />, color: "muted", size: "medium", connections: [10] },
  { id: 8, title: "Research", status: "locked", x: 50, y: 20, icon: <Zap className="w-4 h-4" />, color: "muted", size: "small", connections: [10] },
  { id: 9, title: "Exploration", status: "locked", x: 75, y: 25, icon: <Anchor className="w-4 h-4" />, color: "muted", size: "medium", connections: [10] },
  
  // Master node (top center)
  { id: 10, title: "Ocean Master", status: "locked", x: 50, y: 5, icon: <Star className="w-6 h-6" />, color: "jellyfish", size: "large", connections: [] },
];

const getNodeStyles = (node: SkillNode) => {
  const baseSize = node.size === "large" ? "w-14 h-14" : node.size === "medium" ? "w-11 h-11" : "w-8 h-8";
  
  switch (node.status) {
    case "completed":
      return { 
        bg: "bg-turquoise", 
        ring: "ring-2 ring-turquoise/50 ring-offset-2 ring-offset-background",
        glow: "shadow-[0_0_20px_hsl(var(--turquoise)/0.5)]",
        size: baseSize 
      };
    case "current":
      return { 
        bg: "bg-yellow", 
        ring: "ring-2 ring-yellow/50 ring-offset-2 ring-offset-background",
        glow: "shadow-[0_0_25px_hsl(var(--yellow)/0.6)]",
        size: baseSize 
      };
    case "available":
      return { 
        bg: "bg-muted/80", 
        ring: "ring-2 ring-foreground/20 ring-offset-1 ring-offset-background",
        glow: "",
        size: baseSize 
      };
    case "locked":
      return { 
        bg: "bg-muted/40", 
        ring: "ring-1 ring-muted",
        glow: "",
        size: baseSize 
      };
  }
};

const ProgressMap = ({ open, onOpenChange }: ProgressMapProps) => {
  const completedCount = skillNodes.filter(n => n.status === "completed").length;
  const totalCount = skillNodes.length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-50 bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 bg-gradient-to-b from-background via-background/80 to-transparent">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow" />
              <h1 className="text-2xl font-bold">Skill Tree</h1>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalCount} skills unlocked
              </span>
            </div>
            <motion.button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="absolute inset-0 pt-20 bg-gradient-to-b from-primary/30 via-background to-turquoise/10">
            {/* Grid pattern background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Ambient particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-turquoise/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--turquoise))" />
                  <stop offset="100%" stopColor="hsl(var(--turquoise))" />
                </linearGradient>
                <linearGradient id="lockedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--muted))" />
                  <stop offset="100%" stopColor="hsl(var(--muted))" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {skillNodes.map((node) =>
                node.connections.map((targetId) => {
                  const target = skillNodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  
                  const isCompleted = node.status === "completed" && 
                    (target.status === "completed" || target.status === "current");
                  
                  return (
                    <motion.line
                      key={`${node.id}-${targetId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isCompleted ? "url(#completedGradient)" : "url(#lockedGradient)"}
                      strokeWidth={isCompleted ? 3 : 2}
                      strokeOpacity={isCompleted ? 0.8 : 0.3}
                      filter={isCompleted ? "url(#glow)" : undefined}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: node.id * 0.05 }}
                    />
                  );
                })
              )}
            </svg>

            {/* Skill nodes */}
            {skillNodes.map((node, index) => {
              const styles = getNodeStyles(node);
              
              return (
                <motion.div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                >
                  {/* Node button */}
                  <motion.div
                    className={`relative ${styles.size} rounded-full ${styles.bg} ${styles.ring} ${styles.glow} flex items-center justify-center cursor-pointer transition-all duration-300`}
                    whileHover={{ scale: 1.15 }}
                    animate={node.status === "current" ? {
                      boxShadow: [
                        "0 0 20px hsl(var(--yellow) / 0.4)",
                        "0 0 35px hsl(var(--yellow) / 0.6)",
                        "0 0 20px hsl(var(--yellow) / 0.4)"
                      ]
                    } : {}}
                    transition={node.status === "current" ? { duration: 2, repeat: Infinity } : {}}
                  >
                    {node.status === "locked" ? (
                      <Lock className="w-4 h-4 text-muted-foreground/50" />
                    ) : node.status === "completed" ? (
                      <Check className="w-5 h-5 text-turquoise-foreground" />
                    ) : node.status === "current" ? (
                      <Play className="w-5 h-5 text-yellow-foreground" />
                    ) : (
                      <span className="text-foreground/70">{node.icon}</span>
                    )}
                  </motion.div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      node.status === "completed" 
                        ? "bg-turquoise text-turquoise-foreground" 
                        : node.status === "current"
                        ? "bg-yellow text-yellow-foreground"
                        : "bg-card text-foreground border border-border"
                    }`}>
                      {node.title}
                      {node.status === "current" && (
                        <span className="block text-[10px] opacity-80">In Progress</span>
                      )}
                      {node.status === "locked" && (
                        <span className="block text-[10px] opacity-60">Locked</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-turquoise" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted/80 ring-1 ring-foreground/20" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted/40" />
                <span>Locked</span>
              </div>
            </div>

            {/* XP Progress */}
            <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-bold text-yellow">450 / 1000 XP</p>
                </div>
                <motion.button 
                  className="px-4 py-2 bg-yellow text-yellow-foreground rounded-lg text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressMap;

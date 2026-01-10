import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, Play, Star, Zap, Anchor, Fish, Shell, Waves, X, Compass, Globe } from "lucide-react";
import { useSkills, SkillNode } from "@/contexts/SkillsContext";

interface ProgressMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Anchor: <Anchor className="w-4 h-4" />,
  Fish: <Fish className="w-4 h-4" />,
  Waves: <Waves className="w-4 h-4" />,
  Shell: <Shell className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Star: <Star className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
};

const getIcon = (iconName: string) => iconMap[iconName] || <Star className="w-4 h-4" />;

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
  const { skills: skillNodes } = useSkills();
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
                      <span className="text-foreground/70">{getIcon(node.iconName)}</span>
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

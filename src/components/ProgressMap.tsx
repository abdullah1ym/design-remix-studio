import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock, Play, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProgressMapProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const progressNodes = [
  { id: 1, title: "Ocean Life Overview", status: "completed", x: 10, y: 50 },
  { id: 2, title: "Coral Reef Patterns", status: "completed", x: 25, y: 30 },
  { id: 3, title: "Marine Ecosystems", status: "current", x: 40, y: 55 },
  { id: 4, title: "Deep Sea Creatures", status: "locked", x: 55, y: 35 },
  { id: 5, title: "Ocean Conservation", status: "locked", x: 70, y: 60 },
  { id: 6, title: "Final Assessment", status: "locked", x: 85, y: 40 },
];

const getNodeColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-turquoise";
    case "current":
      return "bg-yellow";
    case "locked":
      return "bg-muted";
    default:
      return "bg-muted";
  }
};

const getNodeIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <Check className="w-4 h-4 text-turquoise-foreground" />;
    case "current":
      return <Play className="w-4 h-4 text-yellow-foreground" />;
    case "locked":
      return <Lock className="w-3 h-3 text-muted-foreground" />;
    default:
      return null;
  }
};

const ProgressMap = ({ open, onOpenChange }: ProgressMapProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="w-5 h-5 text-yellow" />
            Your Learning Journey
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-turquoise/10 to-jellyfish/20">
          {/* Underwater background effects */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/20"
                style={{
                  left: `${10 + i * 12}%`,
                  bottom: 0,
                }}
                animate={{
                  y: [0, -200, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>

          {/* Connection paths */}
          <svg className="absolute inset-0 w-full h-full">
            {progressNodes.slice(0, -1).map((node, i) => {
              const nextNode = progressNodes[i + 1];
              const isCompleted = node.status === "completed";
              return (
                <motion.path
                  key={`path-${i}`}
                  d={`M ${node.x}% ${node.y}% Q ${(node.x + nextNode.x) / 2}% ${Math.min(node.y, nextNode.y) - 10}%, ${nextNode.x}% ${nextNode.y}%`}
                  stroke={isCompleted ? "hsl(var(--turquoise))" : "hsl(var(--muted))"}
                  strokeWidth="3"
                  strokeDasharray={isCompleted ? "0" : "8,8"}
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                />
              );
            })}
          </svg>

          {/* Progress nodes */}
          {progressNodes.map((node, index) => (
            <motion.div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className={`relative w-10 h-10 rounded-full ${getNodeColor(node.status)} flex items-center justify-center shadow-lg cursor-pointer`}
                whileHover={{ scale: 1.2 }}
                animate={node.status === "current" ? { 
                  boxShadow: ["0 0 0 0 hsl(var(--yellow) / 0.4)", "0 0 0 12px hsl(var(--yellow) / 0)", "0 0 0 0 hsl(var(--yellow) / 0.4)"]
                } : {}}
                transition={node.status === "current" ? { duration: 2, repeat: Infinity } : {}}
              >
                {getNodeIcon(node.status)}
              </motion.div>
              
              {/* Label */}
              <motion.div 
                className={`absolute ${index % 2 === 0 ? 'top-12' : 'bottom-12'} left-1/2 -translate-x-1/2 whitespace-nowrap`}
                initial={{ opacity: 0, y: index % 2 === 0 ? -5 : 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  node.status === "current" 
                    ? "bg-yellow/20 text-yellow" 
                    : node.status === "completed"
                    ? "bg-turquoise/20 text-turquoise"
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  {node.title}
                </span>
              </motion.div>
            </motion.div>
          ))}

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-xl p-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">Progress</span>
                <span className="text-muted-foreground">2 of 6 completed</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-turquoise to-yellow rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "33%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default ProgressMap;

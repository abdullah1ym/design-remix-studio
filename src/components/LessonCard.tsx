import { Lock, Play, Video } from "lucide-react";
import { motion } from "framer-motion";

interface LessonCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  videoCount?: number;
  lessonCount?: number;
  isLocked?: boolean;
  isPrimary?: boolean;
  gradient?: string;
  tag?: string;
  index?: number;
}

const LessonCard = ({
  title,
  subtitle,
  description,
  videoCount,
  lessonCount,
  isLocked = false,
  isPrimary = false,
  gradient = "gradient-card",
  tag,
  index = 0,
}: LessonCardProps) => {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
        isPrimary ? "col-span-1" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className={`h-full min-h-[240px] p-6 ${gradient} relative`}>
        {/* Lock Badge */}
        {isLocked && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-background/20 backdrop-blur-sm rounded-full text-xs font-semibold">
            <Lock className="w-3 h-3" />
            Locked
          </div>
        )}

        {/* Tag */}
        {tag && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-foreground/20 backdrop-blur-sm rounded-full text-xs font-semibold">
            {tag}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col h-full justify-end">
          {subtitle && (
            <p className="text-coral font-semibold text-sm mb-1">{subtitle}</p>
          )}
          
          <h3 className={`font-bold mb-2 ${isPrimary ? "text-lg" : "text-base"}`}>
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 mt-auto">
            {videoCount !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/20 px-2 py-1 rounded-full">
                <Video className="w-3 h-3" />
                {videoCount} videos
              </div>
            )}
            {lessonCount !== undefined && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/20 px-2 py-1 rounded-full">
                <Play className="w-3 h-3" />
                {lessonCount} lessons
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
          {isPrimary ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-foreground/30" />
              <div className="absolute -top-2 -right-2 w-4 h-4 text-yellow">✦</div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 text-yellow">✦</div>
            </div>
          ) : null}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

export default LessonCard;

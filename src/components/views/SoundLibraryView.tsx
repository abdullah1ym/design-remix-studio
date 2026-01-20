import { motion } from "framer-motion";
import { Volume2, Play, Pause, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import SoundExerciseModal from "@/components/SoundExerciseModal";

const soundCategories = [
  {
    id: "nature",
    name: "أصوات الطبيعة",
    sounds: [
      { id: 1, name: "مطر", duration: "٠:٣٠" },
      { id: 2, name: "رياح", duration: "٠:٤٥" },
      { id: 3, name: "طيور", duration: "٠:٢٠" },
      { id: 4, name: "أمواج البحر", duration: "١:٠٠" },
    ],
    color: "bg-mint",
  },
  {
    id: "home",
    name: "أصوات المنزل",
    sounds: [
      { id: 5, name: "جرس الباب", duration: "٠:٠٥" },
      { id: 6, name: "الهاتف", duration: "٠:١٠" },
      { id: 7, name: "المنبه", duration: "٠:٠٨" },
      { id: 8, name: "صوت الماء", duration: "٠:١٥" },
    ],
    color: "bg-coral",
  },
  {
    id: "city",
    name: "أصوات المدينة",
    sounds: [
      { id: 9, name: "سيارات", duration: "٠:٢٥" },
      { id: 10, name: "زحام", duration: "٠:٣٠" },
      { id: 11, name: "سيارة إسعاف", duration: "٠:١٢" },
      { id: 12, name: "إشارة مرور", duration: "٠:٠٨" },
    ],
    color: "bg-primary",
  },
  {
    id: "music",
    name: "نغمات موسيقية",
    sounds: [
      { id: 13, name: "نغمة عالية", duration: "٠:٠٥" },
      { id: 14, name: "نغمة منخفضة", duration: "٠:٠٥" },
      { id: 15, name: "سلم موسيقي", duration: "٠:١٥" },
      { id: 16, name: "إيقاع", duration: "٠:٢٠" },
    ],
    color: "bg-yellow",
  },
];

const SoundLibraryView = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [soundExerciseOpen, setSoundExerciseOpen] = useState(false);

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">مكتبة الأصوات</h1>
        <p className="text-muted-foreground">استمع وتدرب على أصوات مختلفة</p>
      </motion.div>

      {/* Arabic Sounds Training */}
      <motion.div
        className="bg-gradient-to-l from-primary/20 to-turquoise/20 rounded-2xl p-6 border border-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/30 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">تدريبات الأصوات العربية</h2>
              <p className="text-sm text-muted-foreground">12 مرحلة تدريبية لكل صوت</p>
            </div>
          </div>
          <motion.button
            onClick={() => setSoundExerciseOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ابدأ التدريب
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث عن صوت..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card rounded-xl py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </motion.div>

      {/* Sound Categories */}
      <div className="space-y-6">
        {soundCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            className="bg-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">{category.name}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {category.sounds.map((sound) => (
                <motion.button
                  key={sound.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    playingId === sound.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                  onClick={() => togglePlay(sound.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      playingId === sound.id ? "bg-white/20" : "bg-background"
                    }`}>
                      {playingId === sound.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </div>
                    <span className="font-medium">{sound.name}</span>
                  </div>
                  <span className={`text-sm ${
                    playingId === sound.id ? "text-white/70" : "text-muted-foreground"
                  }`}>
                    {sound.duration}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <motion.div
        className="bg-muted/50 rounded-xl p-4 flex items-start gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Volume2 className="w-5 h-5 text-primary mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">نصيحة:</span> استمع لكل صوت عدة مرات لتدريب أذنك على التعرف عليه في البيئات المختلفة
        </p>
      </motion.div>

      {/* Sound Exercise Modal */}
      <SoundExerciseModal
        isOpen={soundExerciseOpen}
        onClose={() => setSoundExerciseOpen(false)}
      />
    </div>
  );
};

export default SoundLibraryView;

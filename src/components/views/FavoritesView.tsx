import { motion } from "framer-motion";
import { Heart, Play, Clock, Trash2 } from "lucide-react";

const favorites = [
  {
    id: 1,
    title: "التمييز بين النغمات",
    category: "النغمات",
    duration: "٥ دقائق",
    difficulty: "مبتدئ",
    color: "bg-primary",
  },
  {
    id: 2,
    title: "أصوات الحروف المتشابهة",
    category: "الكلمات",
    duration: "١٠ دقائق",
    difficulty: "متوسط",
    color: "bg-turquoise",
  },
  {
    id: 3,
    title: "أصوات المنزل",
    category: "البيئة",
    duration: "٨ دقائق",
    difficulty: "مبتدئ",
    color: "bg-coral",
  },
];

const FavoritesView = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">المفضلة</h1>
        <p className="text-muted-foreground">التمارين التي حفظتها للوصول السريع</p>
      </motion.div>

      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-card rounded-2xl p-6 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center`}>
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.duration}</span>
                    </div>
                    <span>{item.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-card rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد مفضلات</h3>
          <p className="text-muted-foreground">
            احفظ التمارين المفضلة لديك للوصول السريع إليها
          </p>
        </motion.div>
      )}

      {/* Tip */}
      <motion.div
        className="bg-muted/50 rounded-xl p-4 flex items-start gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Heart className="w-5 h-5 text-coral mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">نصيحة:</span> اضغط على أيقونة القلب في أي تمرين لإضافته إلى المفضلة
        </p>
      </motion.div>
    </div>
  );
};

export default FavoritesView;

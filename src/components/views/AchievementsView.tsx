import { motion } from "framer-motion";
import { Award, Lock, Star, Zap, Target, Flame, Trophy, Medal } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "البداية",
    description: "أكمل أول تمرين",
    icon: Star,
    unlocked: true,
    date: "منذ ٣ أيام",
    color: "bg-yellow",
  },
  {
    id: 2,
    title: "مستمع نشط",
    description: "أكمل ٥ تمارين",
    icon: Zap,
    unlocked: true,
    date: "منذ يومين",
    color: "bg-turquoise",
  },
  {
    id: 3,
    title: "دقيق",
    description: "احصل على ١٠٠٪ في تمرين",
    icon: Target,
    unlocked: true,
    date: "أمس",
    color: "bg-mint",
  },
  {
    id: 4,
    title: "متحمس",
    description: "تدرب ٣ أيام متتالية",
    icon: Flame,
    unlocked: false,
    progress: 2,
    total: 3,
    color: "bg-coral",
  },
  {
    id: 5,
    title: "خبير النغمات",
    description: "أكمل جميع تمارين النغمات",
    icon: Trophy,
    unlocked: false,
    progress: 3,
    total: 5,
    color: "bg-primary",
  },
  {
    id: 6,
    title: "ماهر",
    description: "أكمل ٢٠ تمرين بنجاح",
    icon: Medal,
    unlocked: false,
    progress: 12,
    total: 20,
    color: "bg-jellyfish",
  },
];

const AchievementsView = () => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">الإنجازات</h1>
        <p className="text-muted-foreground">تتبع إنجازاتك ومكافآتك</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-yellow flex items-center justify-center">
            <Award className="w-8 h-8 text-yellow-foreground" />
          </div>
          <div>
            <p className="text-3xl font-bold">{unlockedCount} من {achievements.length}</p>
            <p className="text-muted-foreground">إنجاز مفتوح</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`bg-card rounded-2xl p-6 relative overflow-hidden ${
              !achievement.unlocked ? "opacity-75" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                achievement.unlocked ? achievement.color : "bg-muted"
              }`}>
                {achievement.unlocked ? (
                  <achievement.icon className={`w-7 h-7 ${
                    achievement.color === "bg-yellow" ? "text-yellow-foreground" :
                    achievement.color === "bg-turquoise" ? "text-turquoise-foreground" :
                    achievement.color === "bg-mint" ? "text-mint-foreground" :
                    achievement.color === "bg-coral" ? "text-coral-foreground" :
                    "text-primary-foreground"
                  }`} />
                ) : (
                  <Lock className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>

                {achievement.unlocked ? (
                  <span className="text-xs text-mint">{achievement.date}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/50 rounded-full"
                        style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {achievement.unlocked && (
              <div className="absolute top-2 left-2">
                <Star className="w-4 h-4 text-yellow fill-yellow" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsView;

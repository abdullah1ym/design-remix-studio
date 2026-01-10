import { motion } from "framer-motion";
import { Volume2, Bell, Moon, Globe, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const SettingsView = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص تجربة التدريب</p>
      </motion.div>

      {/* Audio Settings */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">إعدادات الصوت</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">مستوى الصوت</p>
              <p className="text-sm text-muted-foreground">التحكم في مستوى صوت التمارين</p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-32 accent-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">أصوات التنبيه</p>
              <p className="text-sm text-muted-foreground">صوت عند الإجابة الصحيحة والخاطئة</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">تكرار الصوت تلقائياً</p>
              <p className="text-sm text-muted-foreground">إعادة تشغيل الصوت مرتين</p>
            </div>
            <Switch />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-yellow" />
          <h2 className="text-xl font-bold">التنبيهات</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">تذكير التدريب اليومي</p>
              <p className="text-sm text-muted-foreground">تنبيه للتدريب كل يوم</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">إشعارات الإنجازات</p>
              <p className="text-sm text-muted-foreground">عند فتح إنجاز جديد</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-5 h-5 text-jellyfish" />
          <h2 className="text-xl font-bold">المظهر</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">الوضع الداكن</p>
              <p className="text-sm text-muted-foreground">تفعيل المظهر الداكن</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Reset */}
      <motion.div
        className="bg-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <RotateCcw className="w-5 h-5 text-coral" />
          <h2 className="text-xl font-bold">إعادة التعيين</h2>
        </div>

        <div className="space-y-4">
          <button className="w-full p-3 bg-muted hover:bg-muted/80 rounded-xl text-right transition-colors">
            <p className="font-medium">مسح التقدم</p>
            <p className="text-sm text-muted-foreground">إعادة تعيين جميع التمارين المكتملة</p>
          </button>

          <button className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-right transition-colors text-red-400">
            <p className="font-medium">إعادة تعيين كل شيء</p>
            <p className="text-sm text-red-400/70">حذف جميع البيانات والبدء من جديد</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsView;

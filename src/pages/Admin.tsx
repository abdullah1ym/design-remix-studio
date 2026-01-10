import { useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Award, BookOpen, Download, Upload, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ExerciseManager from "@/components/admin/ExerciseManager";
import LessonManager from "@/components/admin/LessonManager";
import SkillsManager from "@/components/admin/SkillsManager";
import DataExport from "@/components/admin/DataExport";

type Tab = "exercises" | "skills" | "lessons";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("exercises");

  const tabs = [
    { id: "exercises" as Tab, label: "التمارين", icon: Headphones },
    { id: "skills" as Tab, label: "المهارات", icon: Award },
    { id: "lessons" as Tab, label: "الدروس", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center">
                <Headphones className="w-5 h-5 text-yellow-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground">إدارة محتوى DeepDive</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DataExport />
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للتطبيق
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "exercises" && <ExerciseManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "lessons" && <LessonManager />}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;

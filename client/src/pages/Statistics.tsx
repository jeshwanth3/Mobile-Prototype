import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, TrendingUp } from "lucide-react";

const weeklyData = [
  { day: "Sun", hours: 0.5 },
  { day: "Mon", hours: 1.0 },
  { day: "Tue", hours: 1.5 },
  { day: "Wed", hours: 1.25 },
  { day: "Thu", hours: 1.75 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 1.5 },
];

const muscleGroupData = [
  { name: "Chest", value: 4, color: "#84ff5f" },
  { name: "Back", value: 3, color: "#4e5fff" },
  { name: "Legs", value: 5, color: "#ff84d4" },
  { name: "Shoulders", value: 3, color: "#ffa84e" },
];

export default function Statistics() {
  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const avgHours = (totalHours / weeklyData.length).toFixed(1);

  return (
    <Layout>
      <PageHeader title="Statistics" />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-2">This Week</p>
          <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground mb-2">Daily Avg</p>
          <p className="text-2xl font-bold text-primary">{avgHours}h</p>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Weekly Activity</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(24, 24, 28, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => `${value}h`}
            />
            <Bar dataKey="hours" fill="#84ff5f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-card rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Muscle Group Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={muscleGroupData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {muscleGroupData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(24, 24, 28, 0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
              labelStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {muscleGroupData.map((muscle) => (
            <div key={muscle.name} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: muscle.color }}
                />
                <span className="text-muted-foreground">{muscle.name}</span>
              </div>
              <p className="text-lg font-bold text-white">{muscle.value} sets</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Records */}
      <div className="bg-card rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Personal Records</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="text-muted-foreground">Heaviest Squat</span>
            <span className="font-bold text-primary">225 lbs</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="text-muted-foreground">Heaviest Bench</span>
            <span className="font-bold text-primary">185 lbs</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <span className="text-muted-foreground">Heaviest Deadlift</span>
            <span className="font-bold text-primary">315 lbs</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

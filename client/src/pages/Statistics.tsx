import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Activity, TrendingUp, Flame, Target, Award, Zap } from "lucide-react";

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

const progressData = [
  { week: "W1", bench: 155, squat: 185, deadlift: 275 },
  { week: "W2", bench: 160, squat: 190, deadlift: 285 },
  { week: "W3", bench: 165, squat: 200, deadlift: 295 },
  { week: "W4", bench: 170, squat: 205, deadlift: 305 },
];

export default function Statistics() {
  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const avgHours = (totalHours / weeklyData.length).toFixed(1);
  const maxDay = Math.max(...weeklyData.map(d => d.hours));

  return (
    <Layout>
      <PageHeader title="Statistics" subtitle="Track your progress" />

      {/* Quick Stats - Enhanced Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-5 bg-gradient-to-br from-primary/15 to-transparent border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Hours</p>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{totalHours.toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground mt-2">This week</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-accent/15 to-transparent border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Daily Avg</p>
            <Flame className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-bold text-white">{avgHours}h</p>
          <p className="text-xs text-muted-foreground mt-2">Per day</p>
        </Card>
      </div>

      {/* Streak & Consistency Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4 bg-white/5 border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <p className="text-2xl font-bold text-primary">4 days</p>
        </Card>
        <Card className="p-4 bg-white/5 border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-accent" />
            <p className="text-xs text-muted-foreground">Goal Progress</p>
          </div>
          <p className="text-2xl font-bold text-accent">75%</p>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Weekly Activity</h3>
            <p className="text-xs text-muted-foreground">Hours logged per day</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(24, 24, 28, 0.95)", border: "1px solid rgba(132,255,95,0.3)", borderRadius: "8px" }}
              labelStyle={{ color: "#84ff5f" }}
              formatter={(value) => `${value}h`}
              cursor={{ fill: "rgba(132,255,95,0.1)" }}
            />
            <Bar dataKey="hours" fill="#84ff5f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strength Progress Chart */}
      <div className="bg-card rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-accent/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Strength Progress</h3>
            <p className="text-xs text-muted-foreground">4-week trend (lbs)</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(24, 24, 28, 0.95)", border: "1px solid rgba(132,255,95,0.3)", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              cursor={{ stroke: "rgba(132,255,95,0.2)" }}
            />
            <Line type="monotone" dataKey="bench" stroke="#84ff5f" strokeWidth={2} dot={{ fill: "#84ff5f", r: 4 }} name="Bench" />
            <Line type="monotone" dataKey="squat" stroke="#4e5fff" strokeWidth={2} dot={{ fill: "#4e5fff", r: 4 }} name="Squat" />
            <Line type="monotone" dataKey="deadlift" stroke="#ffa84e" strokeWidth={2} dot={{ fill: "#ffa84e", r: 4 }} name="Deadlift" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Muscle Group Distribution */}
      <div className="bg-card rounded-2xl border border-white/5 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-white/10 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Muscle Distribution</h3>
            <p className="text-xs text-muted-foreground">Focus by muscle group</p>
          </div>
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
              contentStyle={{ backgroundColor: "rgba(24, 24, 28, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => `${value} sets`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {muscleGroupData.map((muscle) => (
            <Card key={muscle.name} className="p-3 bg-white/5 border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: muscle.color }}
                />
                <span className="text-xs text-muted-foreground font-medium">{muscle.name}</span>
              </div>
              <p className="text-lg font-bold text-white">{muscle.value}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Personal Records */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white">Personal Records</h3>
        </div>
        <div className="space-y-3">
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-transparent border-primary/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heaviest Squat</p>
              <p className="text-2xl font-bold text-white">225 lbs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Target: 250</p>
              <div className="w-16 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="w-9/12 h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-accent/10 to-transparent border-accent/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heaviest Bench</p>
              <p className="text-2xl font-bold text-white">185 lbs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Target: 225</p>
              <div className="w-16 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="w-8/12 h-full bg-accent rounded-full"></div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Heaviest Deadlift</p>
              <p className="text-2xl font-bold text-white">315 lbs</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Target: 400</p>
              <div className="w-16 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="w-8/12 h-full bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

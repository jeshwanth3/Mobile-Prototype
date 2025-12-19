import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateProfile } from "@/hooks/use-plans";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const steps = [
  { id: 'basics', title: 'The Basics', description: 'Tell us a bit about yourself.' },
  { id: 'goal', title: 'Your Goal', description: 'What do you want to achieve?' },
  { id: 'experience', title: 'Experience', description: 'How long have you been training?' },
  { id: 'details', title: 'Final Details', description: 'Equipment and schedule.' },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    experienceLevel: "",
    daysPerWeek: 3,
    equipment: [] as string[],
  });
  
  const [_, setLocation] = useLocation();
  const createProfile = useCreateProfile();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const handleSubmit = async () => {
    try {
      await createProfile.mutateAsync({
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        daysPerWeek: Number(formData.daysPerWeek),
        // Ensure required fields are present
        goal: formData.goal || "strength", 
        experienceLevel: formData.experienceLevel || "beginner",
        equipment: formData.equipment.length > 0 ? formData.equipment : ["bodyweight"],
      });
      setLocation("/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleEquipment = (item: string) => {
    setFormData(prev => {
      const exists = prev.equipment.includes(item);
      if (exists) return { ...prev, equipment: prev.equipment.filter(i => i !== item) };
      return { ...prev, equipment: [...prev.equipment, item] };
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-6 max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-8 mt-4">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <h1 className="text-3xl font-bold font-display mb-2 text-white">{steps[currentStep].title}</h1>
            <p className="text-muted-foreground mb-8">{steps[currentStep].description}</p>

            {/* Step 1: Basics */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input 
                      type="number" 
                      placeholder="25" 
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      className="bg-white/5 border-white/10 h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select onValueChange={(val) => updateField('gender', val)} value={formData.gender}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input 
                    type="number" 
                    placeholder="175" 
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input 
                    type="number" 
                    placeholder="70" 
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Goal */}
            {currentStep === 1 && (
              <div className="space-y-3">
                {[
                  { id: 'strength', label: 'Build Strength', desc: 'Lift heavier, get stronger' },
                  { id: 'hypertrophy', label: 'Build Muscle', desc: 'Maximize muscle growth' },
                  { id: 'weight_loss', label: 'Lose Fat', desc: 'Burn calories and tone up' },
                  { id: 'endurance', label: 'Endurance', desc: 'Improve stamina and cardio' },
                ].map((goal) => (
                  <div 
                    key={goal.id}
                    onClick={() => updateField('goal', goal.id)}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                      ${formData.goal === goal.id 
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(132,255,95,0.15)]' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'}
                    `}
                  >
                    <div>
                      <h3 className="font-bold text-white">{goal.label}</h3>
                      <p className="text-xs text-muted-foreground">{goal.desc}</p>
                    </div>
                    {formData.goal === goal.id && <Check className="w-5 h-5 text-primary" />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Experience */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {[
                  { id: 'beginner', label: 'Beginner', desc: '< 1 year training' },
                  { id: 'intermediate', label: 'Intermediate', desc: '1-3 years training' },
                  { id: 'advanced', label: 'Advanced', desc: '3+ years training' },
                ].map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => updateField('experienceLevel', level.id)}
                    className={`
                      p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                      ${formData.experienceLevel === level.id 
                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(132,255,95,0.15)]' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'}
                    `}
                  >
                    <div>
                      <h3 className="font-bold text-white">{level.label}</h3>
                      <p className="text-xs text-muted-foreground">{level.desc}</p>
                    </div>
                    {formData.experienceLevel === level.id && <Check className="w-5 h-5 text-primary" />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Equipment Available</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Dumbbells', 'Barbell', 'Bench', 'Pull-up Bar', 'Machines', 'Kettlebells'].map((item) => (
                      <div 
                        key={item}
                        onClick={() => toggleEquipment(item.toLowerCase())}
                        className={`
                          p-3 rounded-lg border cursor-pointer text-sm text-center transition-all
                          ${formData.equipment.includes(item.toLowerCase()) 
                            ? 'bg-white text-black border-white font-semibold' 
                            : 'bg-white/5 border-white/5 text-muted-foreground'}
                        `}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Days per week</Label>
                    <span className="text-xl font-bold font-display text-primary">{formData.daysPerWeek}</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="6" 
                    step="1"
                    value={formData.daysPerWeek}
                    onChange={(e) => updateField('daysPerWeek', parseInt(e.target.value))}
                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2 days</span>
                    <span>6 days</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-8">
        {currentStep > 0 && (
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex-1 h-14 rounded-xl border-white/10 hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
        )}
        <Button 
          onClick={handleNext}
          disabled={createProfile.isPending}
          className="flex-1 h-14 rounded-xl text-lg font-bold bg-primary text-black hover:bg-primary/90"
        >
          {createProfile.isPending ? "Saving..." : currentStep === steps.length - 1 ? "Finish Profile" : "Next"}
          {!createProfile.isPending && currentStep < steps.length - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  Terminal, 
  Plus, 
  Trash2, 
  Users, 
  Activity, 
  Cpu, 
  GitBranch, 
  Clock, 
  ArrowRight, 
  Layers, 
  HelpCircle,
  Eye, 
  Check, 
  ChevronRight,
  RefreshCw,
  Zap,
  Layers2,
  Play,
  Pause,
  Sliders,
  Sun,
  Moon,
  RotateCcw,
  Compass,
  TrendingUp,
  Monitor
} from "lucide-react";
import { Task, AiDiagnosis } from "@/types/landing";

// Dynamic tasks state matching live telemetry
const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Verify OAuth state verification protocol",
    description: "Improve security on auth flow callbacks by resolving iframe constraints.",
    status: "InProgress",
    assignee: "Alex K.",
    hours: 8,
    priority: "High"
  },
  {
    id: "task-2",
    title: "Setup automated database migrations",
    description: "Configure post-build migrations hook on server startup cycle.",
    status: "Review",
    assignee: "Siddharth M.",
    hours: 12,
    priority: "Medium"
  },
  {
    id: "task-3",
    title: "Refactor dynamic parallax scroll listeners",
    description: "Optimize layout triggers and passive events for high refresh screens.",
    status: "Backlog",
    assignee: "Elena R.",
    hours: 5,
    priority: "Low"
  },
  {
    id: "task-4",
    title: "Implement system alert webhooks",
    description: "Connect standard alert channels directly to production telemetry rails.",
    status: "Completed",
    assignee: "Alex K.",
    hours: 6,
    priority: "High"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"product" | "dashboard" | "ai">("product");

  // Parallax Cinematic Interactive States (Matches user video request)
  const [showcaseTheme, setShowcaseTheme] = useState<"light" | "dark">("light");
  const [scrollOffset, setScrollOffset] = useState<number>(0); // oscillates or user drags
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Auto oscillating kinetic drift
  useEffect(() => {
    if (!isAutoScrolling) return;
    let animationId: number;
    const startTime = Date.now();

    const updateParallax = () => {
      const elapsed = Date.now() - startTime;
      // Oscillate between -25 and 25 with smooth sinus periodicity
      const offset = Math.sin(elapsed / 2200) * 28;
      setScrollOffset(offset);
      animationId = requestAnimationFrame(updateParallax);
    };

    animationId = requestAnimationFrame(updateParallax);
    return () => cancelAnimationFrame(animationId);
  }, [isAutoScrolling]);

  // Kanban variables
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // New task form fields
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("Alex K.");
  const [newTaskPriority, setNewTaskPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newTaskHours, setNewTaskHours] = useState(6);

  // AI Evaluator parameters
  const [repoName, setRepoName] = useState("synalytix-infra");
  const [techStack, setTechStack] = useState("React, Vite, Node, PostgreSQL");
  const [teamSize, setTeamSize] = useState(4);
  const [sprintDuration, setSprintDuration] = useState("2 weeks");
  const [recentIssues, setRecentIssues] = useState("Frequent late nights. Slow review iterations during sprint ends. High developer context switching.");
  const [commitLoad, setCommitLoad] = useState("Clustered on Sunday nights with daily average of 14 commits per developer.");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<AiDiagnosis | null>({
    isDemo: true,
    productivityScore: 84,
    burnoutRisk: "Medium",
    burnoutExplanation: "Your workspace displays high velocity baseline metrics, but unstable commit schedules during weekend checkpoints suggest potential developer stress patterns. Code review duration cycles present latency friction.",
    predictedBlockers: [
      "Branch lock conflicts on final sprint integration milestone",
      "Workload focus clustering: 70% of deliveries rely on top 2 engineers",
      "Pull request check wait times average 19.5 hours to resolution"
    ],
    recommendations: [
      "Distribute pull requests proportionally via team alerts",
      "Inject automated status thresholds to reduce manual review overhead",
      "Encourage granular single-focus commit releases over massive merges"
    ]
  });

  // Automatically computed reactive stats
  const [nodesSynced, setNodesSynced] = useState(45914);
  const [almActivityIndex, setAlmActivityIndex] = useState(41.3);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const totalRemaining = tasks
      .filter(t => t.status !== "Completed")
      .reduce((sum, t) => sum + t.hours, 0);

    const completedHours = tasks
      .filter(t => t.status === "Completed")
      .reduce((sum, t) => sum + t.hours, 0);

    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0) || 1;
    const computedActivity = parseFloat((32 + (completedHours / totalHours) * 28).toFixed(1));
    const computedNodes = 45120 + (tasks.length * 150) + (completedHours * 16);

    setAlmActivityIndex(computedActivity);
    setNodesSynced(computedNodes);
    
    setIsFlashing(true);
    const t = setTimeout(() => setIsFlashing(false), 600);
    return () => clearTimeout(t);
  }, [tasks]);

  // Handle task relocation index
  const handleMoveTask = (id: string, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Create new play room task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || "Standard workspace sub-task assigned to maintain sprint velocity metrics.",
      status: "Backlog",
      assignee: newTaskAssignee,
      hours: Number(newTaskHours),
      priority: newTaskPriority
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowAddTask(false);
  };

  // Remove task cleanly
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Launch Server-side Gemini productivity diagnosis
  const handleTriggerDiagnosis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName,
          techStack,
          teamSize,
          sprintDuration,
          recentIssues,
          commitLoad
        })
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      console.error("Diagnostic engine failure:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Abstract Artistic Mesh Background Lights */}
      <div className="absolute top-[5%] right-[10%] w-[550px] h-[550px] bg-gradient-to-br from-indigo-900/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-indigo-950/15 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Dot Grid Layer from Synalytix visual requirements */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-80" />

      {/* HEADER NAVIGATION - Artistic Flair theme layout */}
      <nav className="px-6 md:px-12 py-6 md:py-8 flex justify-between items-center z-20 border-b border-white/5 bg-[#050505]/60 backdrop-blur-md sticky top-0">
        <div 
          onClick={() => setActiveTab("product")} 
          className="text-xl font-bold tracking-tighter flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-5 h-5 bg-indigo-500 rounded-sm rotate-45 animate-pulse-subtle"></div>
          <span className="font-display tracking-tight text-white">SYNALYTIX</span>
        </div>

        {/* Navigation tabs */}
        <div className="hidden md:flex gap-8 lg:gap-10 text-[11px] uppercase tracking-[0.2em] font-medium opacity-70">
          <button 
            onClick={() => setActiveTab("product")}
            className={`hover:opacity-100 transition-all ${activeTab === "product" ? "text-indigo-400 font-bold opacity-100" : "opacity-60"}`}
          >
            Intelligence
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`hover:opacity-100 transition-all flex items-center gap-2 ${activeTab === "dashboard" ? "text-indigo-400 font-bold opacity-100" : "opacity-60"}`}
          >
            Playroom sandbox
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className={`hover:opacity-100 transition-all ${activeTab === "ai" ? "text-indigo-400 font-bold opacity-100" : "opacity-60"}`}
          >
            AI DIAGNOSIS
          </button>
        </div>

        <div>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="px-5 py-2 border border-white/20 rounded-full text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all font-semibold active:scale-95"
          >
            Launch app
          </button>
        </div>
      </nav>

      {/* MOBILE SWITCHER COLUMN */}
      <div className="md:hidden flex justify-center p-2 bg-white/5 border-b border-white/5 gap-2 z-10 sticky top-[73px]">
        <button 
          onClick={() => setActiveTab("product")}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded ${activeTab === "product" ? "bg-white/10 text-white" : "text-white/50"}`}
        >
          Intelligence
        </button>
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded ${activeTab === "dashboard" ? "bg-white/10 text-white" : "text-white/50"}`}
        >
          Workspace
        </button>
        <button 
          onClick={() => setActiveTab("ai")}
          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded ${activeTab === "ai" ? "bg-white/10 text-white" : "text-white/50"}`}
        >
          AI Diagnostic
        </button>
      </div>

      {/* CORE WORKSPACE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-10 relative z-10 flex flex-col gap-12">
        
        {/* TAB 1: MINIMAL HERO WITH ARTISTIC CHOREOGRAPHY */}
        {activeTab === "product" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start min-h-[550px]"
          >
            {/* Left Column: Extreme Hero Header & Showcase Interactive Controls */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-6">
              <div className="inline-block">
                <span className="text-indigo-400 text-[10px] uppercase tracking-[0.3em] font-bold border-l-2 border-indigo-500 pl-4 py-1">
                  Cinematic Engine v3.0
                </span>
              </div>
              
              <h1 className="text-5xl md:text-[76px] leading-[0.85] font-black tracking-tighter italic uppercase text-white">
                ENGINEER <br/> 
                <span className="text-transparent text-stroke font-display tracking-tight">KINETICS.</span>
              </h1>
              
              <p className="text-sm md:text-base text-white/50 max-w-[460px] leading-relaxed font-light">
                Synalytix correlates agile task checklists with connected git streams automatically. Explore our interactive scrolling simulator below or swipe cards to witness three-dimensional viewport triggers.
              </p>

              {/* Redesigned interactive Control Hub for Parallax Showcase (Directly refers to video) */}
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5" />
                    SCROLL SHOWROOM CONSOLE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] uppercase font-semibold">
                    Interactive
                  </span>
                </div>

                {/* Theme Selector (Exact match with user requested options) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono tracking-widest text-white/40 uppercase">SHOWCASE CODESPACE THEME</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowcaseTheme("light")}
                      className={`flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        showcaseTheme === "light"
                          ? "bg-white text-black border-white font-black"
                          : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                      }`}
                    >
                      <Sun className="w-3 h-3" />
                      Studio Light Frame
                    </button>
                    <button
                      onClick={() => setShowcaseTheme("dark")}
                      className={`flex items-center justify-center gap-2 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        showcaseTheme === "dark"
                          ? "bg-indigo-600 text-white border-indigo-500 font-black shadow-glow"
                          : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                      }`}
                    >
                      <Moon className="w-3 h-3" />
                      Cyberpunk Night
                    </button>
                  </div>
                </div>

                {/* Hand Draggable Scroll Simulator Dial */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono tracking-widest text-white/40 uppercase">KINETIC SCROLL DIAL</label>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">{Math.round(scrollOffset * 4)}px offset</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    value={Math.round(scrollOffset)}
                    onChange={(e) => {
                      setIsAutoScrolling(false);
                      setScrollOffset(Number(e.target.value));
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
                    <span>▲ Reverse Scroll</span>
                    <span>▼ Direct Scroll</span>
                  </div>
                </div>

                {/* Play/Pause controls */}
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                      className={`p-1.5 rounded-md ${isAutoScrolling ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'} hover:scale-105 transition-transform`}
                      title={isAutoScrolling ? "Pause Auto Scroll" : "Play Auto Scroll"}
                    >
                      {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] text-white/70 font-light">
                      {isAutoScrolling ? "Simulating drift oscillation" : "Offset locked. Drag above or scroll right"}
                    </span>
                  </div>
                  {!isAutoScrolling && (
                    <button
                      onClick={() => {
                        setIsAutoScrolling(true);
                      }}
                      className="text-[9px] text-indigo-400 font-mono tracking-wider hover:text-white font-bold flex items-center gap-1 uppercase"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Auto
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold hover:scale-110 transition-transform shadow-glow shrink-0 group active:scale-95"
                  title="Launch Playground"
                >
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/80">Launch Sandbox Playground</span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 italic">Relocate task tickets and monitor indexes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mesh and Redesigned Cinematic Scroll Frame (Matches video) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 font-mono px-2">
                <span>Viewport Preview Container</span>
                <span className="flex items-center gap-1 text-indigo-400 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                  Hover to scroll with trackpad
                </span>
              </div>

              {/* Parallax viewport window */}
              <div 
                onWheel={(e) => {
                  e.preventDefault();
                  setIsAutoScrolling(false);
                  setScrollOffset(prev => {
                    const next = prev + e.deltaY * 0.15;
                    return Math.max(-90, Math.min(90, next));
                  });
                }}
                className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border ${
                  showcaseTheme === "light"
                    ? "bg-[#eef1f6] border-slate-300 grid-light text-slate-900"
                    : "bg-[#060611] border-indigo-950 grid-dark text-white"
                }`}
                style={{
                  backgroundImage: showcaseTheme === "light"
                    ? "radial-gradient(circle, rgba(99,102,241, 0.12) 1.5px, transparent 1.5px)"
                    : "radial-gradient(circle, rgba(99,102,241, 0.05) 1.5px, transparent 1.5px)",
                  backgroundSize: "28px 28px"
                }}
              >
                {/* Embedded Cinematic static title from video frames */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                  <div className="text-center select-none scale-90 md:scale-100">
                    <h2 
                      className={`text-6xl md:text-[96px] font-black tracking-[0.08em] uppercase ${
                        showcaseTheme === "light" ? "text-slate-800" : "text-white"
                      }`}
                      style={{ fontFamily: "'Anton', sans-serif" }}
                    >
                      SYNALYTIX
                    </h2>
                    
                    {/* The solid brilliant line from video file */}
                    <div 
                      className="mx-auto h-[6px] rounded relative shadow-sm my-3 animate-pulse-subtle transition-all duration-300"
                      style={{ 
                        width: '320px', 
                        backgroundColor: '#1d4ed8', // classic royal blue
                        boxShadow: "0 2px 10px rgba(29, 78, 216, 0.3)"
                      }}
                    />

                    <p 
                      className={`text-[12px] md:text-sm tracking-[0.25em] font-semibold uppercase italic ${
                        showcaseTheme === "light" ? "text-slate-500" : "text-white/40"
                      }`}
                      style={{ fontFamily: "'Arimo', sans-serif" }}
                    >
                      Productivity. Social Growth. AI Insights.
                    </p>
                  </div>
                </div>

                {/* Floating Deck Card 1: Dashboard (Y axis offsets) */}
                <motion.div
                  animate={{ y: scrollOffset * -1.6 }}
                  transition={{ type: "spring", stiffness: 90, damping: 25 }}
                  onHoverStart={() => setHoveredCard("dashboard")}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`absolute top-[5%] left-[6%] w-[240px] md:w-[280px] p-4 rounded-xl shadow-xl backdrop-blur-xl transition-all duration-300 z-10 select-none border cursor-pointer ${
                    showcaseTheme === "light"
                      ? "bg-white/85 border-slate-200/50 text-slate-800 hover:shadow-2xl hover:bg-white"
                      : "bg-[#0b0c14]/85 border-white/10 text-white hover:border-indigo-500/40 hover:bg-[#0c0d16]"
                  } ${hoveredCard === "dashboard" ? "scale-[1.03] z-20" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">DASHBOARD</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 text-[8px] font-mono uppercase font-semibold">
                      ALM INDEX
                    </span>
                  </div>

                  {/* Inline vector sparkline graph with gradient area */}
                  <div className="h-16 relative w-full mb-2 bg-black/[0.02] rounded border border-black/[0.04] overflow-hidden flex items-end">
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 35 Q15 20, 30 25 T60 5 T80 15 T100 10 L100 40 L0 40 Z"
                        fill="url(#chartGrad)"
                      />
                      <path
                        d="M0 35 Q15 20, 30 25 T60 5 T80 15 T100 10"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="60" cy="5" r="2.5" fill="#10b981" className="animate-pulse" />
                    </svg>
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono text-indigo-500 font-bold">LIVE STREAMING</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1.5 border-t border-black/5 dark:border-white/5">
                    <div>
                      <span className="text-[8px] uppercase text-slate-400 block">Activity level</span>
                      <span className="font-bold text-slate-800 dark:text-white">{almActivityIndex}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase text-slate-400 block">Rating score</span>
                      <span className="font-bold text-slate-800 dark:text-white">84.9 stable</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Deck Card 2: Live Repos (Y axis offset opposite) */}
                <motion.div
                  animate={{ y: scrollOffset * 1.5 }}
                  transition={{ type: "spring", stiffness: 80, damping: 22 }}
                  onHoverStart={() => setHoveredCard("repos")}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`absolute bottom-[6%] right-[10%] w-[210px] md:w-[240px] p-3.5 rounded-xl shadow-xl backdrop-blur-xl transition-all duration-300 z-10 select-none border cursor-pointer ${
                    showcaseTheme === "light"
                      ? "bg-white/80 border-slate-200/50 text-slate-800 hover:shadow-2xl"
                      : "bg-[#0b0c14]/80 border-white/10 text-white hover:border-indigo-500/40"
                  } ${hoveredCard === "repos" ? "scale-[1.03] z-20" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-slate-400 dark:text-white/40">LIVE REPOSITORY SYNC</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[8px] font-bold text-emerald-500 font-mono">ON</span>
                    </span>
                  </div>

                  <div className="text-2xl font-stats tracking-wider text-slate-800 dark:text-white mb-2 leading-none">
                    {nodesSynced.toLocaleString()} HZ
                  </div>

                  {/* Horizontal visual ticker load bars matching user requested style */}
                  <div className="flex gap-1 items-end h-8">
                    <div className="flex-1 bg-indigo-500 h-[30%] rounded-sm"></div>
                    <div className="flex-1 bg-indigo-500/70 h-[60%] rounded-sm"></div>
                    <div className="flex-1 bg-[#10b981] h-[85%] rounded-sm"></div>
                    <div className="flex-1 bg-indigo-500/40 h-[45%] rounded-sm"></div>
                    <div className="flex-1 bg-indigo-500 h-[70%] rounded-sm"></div>
                    <div className="flex-1 bg-red-400 h-[25%] rounded-sm"></div>
                    <div className="flex-1 bg-[#10b981] h-[95%] rounded-sm"></div>
                  </div>
                </motion.div>

                {/* Floating Deck Card 3: Burnout Sentinel Warnings */}
                <motion.div
                  animate={{ y: scrollOffset * -0.9 }}
                  transition={{ type: "spring", stiffness: 100, damping: 24 }}
                  onHoverStart={() => setHoveredCard("burnout")}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`absolute top-[48%] left-[4%] w-[250px] md:w-[290px] p-4 rounded-xl shadow-2xl backdrop-blur-xl transition-all duration-300 z-10 text-left border cursor-pointer ${
                    showcaseTheme === "light"
                      ? "bg-slate-900 border-none text-white hover:scale-[1.02]"
                      : "bg-[#181024]/90 border-purple-500/25 text-white hover:border-purple-500/50"
                  } ${hoveredCard === "burnout" ? "scale-[1.03] z-20" : ""}`}
                >
                  <div className="flex items-center gap-1.5 mb-2 border-b border-white/15 pb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase font-mono">
                      PREVENTATIVE SENTINEL
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed font-light text-slate-200 italic mb-3">
                    &quot;Sprint workload capacity is bottlenecked. Context-switching exceeds limits due to late stage integrations.&quot;
                  </p>

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("ai");
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[8px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Deeper Diagnosis
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("dashboard");
                      }}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[8px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Balance Work
                    </button>
                  </div>
                </motion.div>

                {/* Floating Deck Card 4: Branches Nodes & Slack Synced */}
                <motion.div
                  animate={{ y: scrollOffset * 2.1 }}
                  transition={{ type: "spring", stiffness: 75, damping: 20 }}
                  className={`absolute bottom-[48%] right-[4%] w-[150px] md:w-[170px] p-3 rounded-lg shadow-xl backdrop-blur-xl border select-none ${
                    showcaseTheme === "light"
                      ? "bg-white/70 border-slate-200 text-slate-800"
                      : "bg-indigo-950/40 border-indigo-500/10 text-white"
                  }`}
                >
                  <div className="text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">COLLABORATOR LOG</div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-bold font-mono">Siddharth M.</span>
                  </div>
                  <div className="text-[9px] text-[#10b981] font-mono font-medium pl-4">
                    ▲ 8 files pushed
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Redesigned bottom stats overview */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  step: "01",
                  title: "Symmetric Repository Connect",
                  body: "Integrate with source streams to automatically synthesize timeline forecasts based on commits instead of manual user estimation logs."
                },
                {
                  step: "02",
                  title: "Interactive Playroom Room",
                  body: "Maintain project sprints inside our playroom. Shift cards from backlog to review and observe composite efficiency coefficients."
                },
                {
                  step: "03",
                  title: "Generative Health Audit",
                  body: "Leverage Gemini generative models to balance workload allocations and mitigate burnout conditions before milestone dates."
                }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="p-6 bg-[#0c0c0e] border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#111114] transition-all flex flex-col gap-3 justify-between group"
                >
                  <div>
                    <span className="text-xs text-indigo-500 font-mono block mb-1 font-bold">MUT_STREAMS // {card.step}</span>
                    <h3 className="text-lg font-bold tracking-tight text-white uppercase">{card.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-light mt-1.5">{card.body}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-4 flex items-center gap-1 group-hover:text-white transition-colors text-left"
                  >
                    Open sandbox
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE KANBAN PLAYROOM SANDBOX */}
        {activeTab === "dashboard" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col gap-6"
          >
            {/* Playroom Control Header */}
            <div className="p-5 bg-gradient-to-r from-[#111111] to-[#0c0c0e] border border-white/10 rounded-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest font-bold">
                    Interactive sandbox console
                  </span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] uppercase tracking-wider font-semibold animate-pulse">
                    ALM live linked
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">SPRINT PLAYROOM PLAYGROUND</h2>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Directly relocate sprint cards across columns to watch the telemetry sensors react in real-time.
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setTasks(INITIAL_TASKS)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-semibold hover:text-indigo-400 transition-all flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restore layout
                </button>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-bold transition-all flex items-center gap-1.5 uppercase tracking-wider shadow-glow active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add ticket
                </button>
              </div>
            </div>

            {/* Quick telemetry indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "NODES_SYNCHRONISED", value: nodesSynced.toLocaleString(), sub: "raw repository processes", glow: true },
                { label: "LIVE_ACTIVITY_COEFFICIENT", value: `${almActivityIndex}%`, sub: "composited deployment velocity", glow: false },
                { label: "SPRINT_ALLOCATED_CAPACITY", value: `${tasks.reduce((sum, t) => sum + t.hours, 0)} hours`, sub: "cumulative sprint focus weight", glow: false },
                { label: "UNRESOLVED_BACKLOG_DENSITY", value: `${tasks.filter(t => t.status !== "Completed").length} tickets`, sub: "active tasks pending resolution", glow: false }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="p-4 bg-[#0d0d0f] border border-white/5 rounded-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40" />
                  <span className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-mono block mb-1">{stat.label}</span>
                  <div>
                    <span className={`text-3xl font-stats tracking-wider block leading-none text-white transition-colors duration-300 ${isFlashing ? "text-indigo-400" : ""}`}>
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-white/40 font-light mt-1 block">{stat.sub}</span>
                  </div>
                  {stat.glow && (
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive Kanban Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {(["Backlog", "InProgress", "Review", "Completed"] as const).map((column) => {
                const columnTasks = tasks.filter(t => t.status === column);
                return (
                  <div 
                    key={column}
                    className="p-4 bg-[#0a0a0c]/80 border border-white/5 rounded-xl min-h-[460px] flex flex-col gap-4"
                  >
                    {/* Column label */}
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${column === "Completed" ? "bg-emerald-500" : column === "Review" ? "bg-amber-400" : "bg-indigo-500"}`} />
                        <span className="text-xs uppercase tracking-[0.1em] font-semibold text-white/90">
                          {column === "InProgress" ? "In Progress" : column}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold bg-white/5 text-white/60 px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Column lists */}
                    <div className="flex-1 flex flex-col gap-3">
                      {columnTasks.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-lg py-12 px-4 text-center">
                          <span className="text-[10px] text-white/30 italic font-light">
                            No tickets open. Use actions on adjacent cards or click Add ticket.
                          </span>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <div 
                            key={task.id} 
                            className="p-3.5 bg-[#121215] border border-white/10 rounded-lg hover:border-indigo-500/40 transition-all flex flex-col gap-3 group relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                task.priority === "High" 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                  : task.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-white/5 text-white/40"
                              }`}>
                                {task.priority} Priority
                              </span>
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-white/30 hover:text-red-400 transition-colors p-0.5"
                                title="Remove task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-white/40 leading-relaxed font-light mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            </div>

                            {/* Ticket owners details */}
                            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5 text-white/50">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-white/30" />
                                {task.assignee}
                              </span>
                              <span className="flex items-center gap-0.5 font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[9px]">
                                <Clock className="w-2.5 h-2.5" />
                                {task.hours}h
                              </span>
                            </div>

                            {/* Shift ticket simulation buttons */}
                            <div className="flex flex-wrap gap-1 mt-1 pt-1.5 border-t border-white/5">
                              {(["Backlog", "InProgress", "Review", "Completed"] as const)
                                .filter(s => s !== column)
                                .map(ns => (
                                  <button
                                    key={ns}
                                    onClick={() => handleMoveTask(task.id, ns)}
                                    className="flex-1 text-[8px] font-semibold tracking-wider text-center py-1 bg-white/5 text-white/60 hover:text-indigo-400 hover:bg-indigo-500/10 rounded border border-white/5"
                                  >
                                    ➜ {ns === "InProgress" ? "PRG" : ns.substring(0, 3).toUpperCase()}
                                  </button>
                                ))}
                            </div>

                          </div>
                        ))
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Sandbox banner */}
            <div className="p-6 bg-[#0c0c0e] border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 mt-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/4 h-full bg-indigo-500/5 blur-2xl rounded-l-full pointer-events-none" />
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full">
                  <Layers2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase text-white">Need deep contextual intelligence?</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light max-w-xl">
                    Our platform correlates these local sandbox tickets with high-fidelity analytical models. Use our server-side system prompts powered by Google Gemini to get real insights.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab("ai")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold font-label text-[10px] uppercase tracking-widest text-white rounded-md shadow-glow transition-all active:scale-95 flex items-center gap-1.5"
              >
                Run AI Diagnosis
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

          </motion.div>
        )}

        {/* TAB 3: SERVER-SIDE AI SPRINT EVALUATOR */}
        {activeTab === "ai" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input variables column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="p-6 bg-[#0a0a0c] border border-white/5 rounded-xl flex flex-col gap-5">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wider text-white">AI DIAGNOSTIC CONSOLE</h3>
                    <p className="text-[10px] text-white/40 tracking-wider">Powered by Gemini 3.5 AI prompts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Repo input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      PROJECT REPOSITORY / WORKSPACE NAME
                    </label>
                    <input 
                      type="text"
                      className="w-full glass-input px-3 py-2 rounded text-xs text-white font-mono"
                      value={repoName}
                      onChange={e => setRepoName(e.target.value)}
                    />
                  </div>

                  {/* Sprints and team counts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        TEAMS SIZE (DEVS)
                      </label>
                      <input 
                        type="number"
                        className="w-full glass-input px-3 py-1.5 rounded text-xs text-white"
                        value={teamSize}
                        onChange={e => setTeamSize(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        SPRINT DURATION
                      </label>
                      <select 
                        className="w-full glass-input px-3 py-1.5 rounded text-xs text-white"
                        value={sprintDuration}
                        onChange={e => setSprintDuration(e.target.value)}
                      >
                        <option value="1 week">1 Week</option>
                        <option value="2 weeks">2 Weeks</option>
                        <option value="1 month">1 Month</option>
                      </select>
                    </div>
                  </div>

                  {/* Technical Stack */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      ACTIVE TECHNICAL STACK
                    </label>
                    <input 
                      type="text"
                      className="w-full glass-input px-3 py-2 rounded text-xs text-white"
                      value={techStack}
                      onChange={e => setTechStack(e.target.value)}
                    />
                  </div>

                  {/* Recent issues described by workspace users */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      BOTTLEENCKS & COMPRESSION SIGNALS
                    </label>
                    <textarea 
                      className="w-full glass-input px-3 py-2 rounded text-xs text-white min-h-[70px] leading-relaxed"
                      value={recentIssues}
                      onChange={e => setRecentIssues(e.target.value)}
                      placeholder="e.g., Late sprint deliveries, long PR cycles..."
                    />
                  </div>

                  {/* Commit loads info */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      COMMIT PATTERNS OBSERVED
                    </label>
                    <input 
                      type="text"
                      className="w-full glass-input px-3 py-2 rounded text-xs text-white"
                      value={commitLoad}
                      onChange={e => setCommitLoad(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleTriggerDiagnosis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs uppercase tracking-widest rounded-md shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Evaluating patterns...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      Generate workspace evaluation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Diagnostics Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {diagnosis ? (
                <div className="p-6 bg-[#0a0a0c] border border-white/10 rounded-xl relative overflow-hidden flex flex-col gap-6">
                  {/* Decorative faint glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />

                  {/* Diagnostic status tags */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono block">EVALUATION SUMMARY</span>
                      <h4 className="text-lg font-bold text-white uppercase tracking-tight">WORKSPACE SIGNALS ANALYSIS</h4>
                    </div>
                    {diagnosis.isDemo ? (
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/60 rounded text-[9px] uppercase tracking-wider font-semibold">
                        DEMO BACKUP PROFILE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] uppercase tracking-wider font-semibold">
                        LIVE GENERATIVE INSIGHTS
                      </span>
                    )}
                  </div>

                  {/* Productivity score and Burnout danger */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                      <span className="text-[9px] text-white/40 block mb-1 font-mono uppercase tracking-widest">PRODUCTIVITY_RATING</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-stats tracking-wider text-indigo-400">{diagnosis.productivityScore}%</span>
                        <span className="text-[10px] text-white/40 font-light">stable ratio</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                      <span className="text-[9px] text-white/40 block mb-1 font-mono uppercase tracking-widest">BURNOUT_KINETIC_RISK</span>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-stats tracking-wider ${
                          diagnosis.burnoutRisk === "High" ? "text-red-400" : diagnosis.burnoutRisk === "Medium" ? "text-amber-400" : "text-emerald-400"
                        }`}>{diagnosis.burnoutRisk}</span>
                        <span className="text-[10px] text-white/40 font-light">tension indicator</span>
                      </div>
                    </div>
                  </div>

                  {/* Narrative paragraph diagnostics structured in Artistic style */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono block">DIAGNOSTIC_REMARKS</span>
                    <p className="text-xs text-white/70 leading-relaxed font-light italic bg-white/5 p-4 rounded-lg border-l-2 border-indigo-400">
                      &ldquo;{diagnosis.burnoutExplanation}&rdquo;
                    </p>
                  </div>

                  {/* Predicted list blocks */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono block">DETECTED_SPRINT_BLOCKERS</span>
                    <ul className="space-y-2">
                      {diagnosis.predictedBlockers.map((blocker, bIdx) => (
                        <li key={bIdx} className="flex gap-2.5 items-start text-xs text-white/80 font-light">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{blocker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable items */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-mono block">REMEDIAL_ACTION_STEPS</span>
                    <ul className="space-y-2">
                      {diagnosis.recommendations.map((rec, rIdx) => (
                        <li key={rIdx} className="flex gap-2.5 items-start text-xs text-white/80 font-light">
                          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="p-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center gap-3">
                  <Sparkles className="w-8 h-8 text-white/20 animate-pulse" />
                  <p className="text-xs text-white/40 font-light">
                    No diagnostics active. Enter parameters on the left and click &quot;Generate workspace evaluation&quot;.
                  </p>
                </div>
              )}
            </div>

          </motion.div>
        )}

      </main>

      {/* ADD PLAYROOM TICKET MODAL */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleCreateTask}
              className="p-6 bg-[#0d0d0f] border border-white/20 rounded-xl w-full max-w-md flex flex-col gap-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                <span className="text-sm font-bold uppercase tracking-wider text-indigo-400">Add playground item</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddTask(false)}
                  className="text-[10px] text-white/40 tracking-wider hover:text-white uppercase"
                >
                  [ESC] Close
                </button>
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50">Task Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full glass-input px-3 py-2 rounded text-xs"
                  placeholder="e.g. Optimize main API thread pipeline"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>

              {/* Desc Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50">Task description</label>
                <textarea 
                  className="w-full glass-input px-3 py-2 rounded text-xs min-h-[50px]"
                  placeholder="Enter sprint telemetry context..."
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                />
              </div>

              {/* Assignee & hour split */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50">Assignee</label>
                  <select 
                    className="w-full glass-input px-3 py-1.5 rounded text-xs bg-[#0d0d0f]"
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="Alex K.">Alex K.</option>
                    <option value="Siddharth M.">Siddharth M.</option>
                    <option value="Elena R.">Elena R.</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-white/50">Hours (Weight)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="40" 
                    className="w-full glass-input px-3 py-1.5 rounded text-xs"
                    value={newTaskHours}
                    onChange={e => setNewTaskHours(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50">Task urgency</label>
                <div className="flex gap-2">
                  {(["Low", "Medium", "High"] as const).map(pr => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setNewTaskPriority(pr)}
                      className={`flex-1 py-1.5 rounded text-[10px] uppercase tracking-wider font-semibold transition-all ${
                        newTaskPriority === pr 
                          ? "bg-indigo-600 text-white font-bold" 
                          : "bg-white/5 text-white/40 border border-white/5"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 font-bold uppercase tracking-wider text-xs rounded transition-all shadow-glow"
              >
                Insert task
              </button>

            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER BAR (Artistic Flair spec integration) */}
      <footer className="mt-auto px-6 md:px-12 py-6 border-t border-white/5 bg-[#050505] flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <div className="flex gap-12 text-left">
          <div>
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-mono">Active Playground Tasks</div>
            <div className="text-lg font-mono text-white flex items-center gap-2">
              <span>{tasks.length}</span>
              <span className="text-[10px] text-white/40 font-light">tickets loaded</span>
            </div>
          </div>
          <div>
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-mono">Simulated Streams Synced</div>
            <div className="text-lg font-mono text-indigo-400">
              {nodesSynced.toLocaleString()} Hz
            </div>
          </div>
        </div>
        <div className="text-[11px] text-white/30 uppercase tracking-tighter text-center md:text-right">
          INTEGRATED CODESPACES: <span className="text-white/60 ml-2 font-mono">GitHub — Jira — Slack — Linear</span>
        </div>
      </footer>

    </div>
  );
}

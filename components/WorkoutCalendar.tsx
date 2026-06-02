"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, X, Footprints, Dumbbell } from "lucide-react";
import {
  getWorkout,
  getTrainingWeek,
  getLiftTemplate,
  formatDateKey,
  type Workout,
  type WorkoutCategory,
  type CompletionStatus,
} from "@/lib/workouts";
import { LiftDetail } from "@/components/LiftDetail";
import type { WorkoutStatusRow } from "@/app/api/workout-statuses/route";

type ViewMode = "month" | "week" | "day";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// --- Style helpers ---

function statusBorder(s?: CompletionStatus) {
  if (s === "completed") return "border-l-emerald-500";
  if (s === "partial") return "border-l-yellow-500";
  if (s === "missed") return "border-l-red-500";
  return "border-l-transparent";
}

function statusBg(s?: CompletionStatus) {
  if (s === "completed") return "bg-emerald-500/5 dark:bg-emerald-400/10";
  if (s === "partial") return "bg-yellow-500/5 dark:bg-yellow-400/10";
  if (s === "missed") return "bg-red-500/5 dark:bg-red-400/10";
  return "";
}

function statusDot(s?: CompletionStatus) {
  if (s === "completed") return "bg-emerald-500";
  if (s === "partial") return "bg-yellow-500";
  if (s === "missed") return "bg-red-500";
  return "bg-muted-foreground/30";
}

function categoryColor(cat: WorkoutCategory) {
  if (cat === "run") return "text-blue-600 dark:text-blue-400";
  if (cat === "lift") return "text-purple-600 dark:text-purple-400";
  return "text-amber-600 dark:text-amber-400";
}

function statusBtnClass(s: CompletionStatus, active: boolean) {
  const map: Record<CompletionStatus, [string, string]> = {
    completed: [
      "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      "border-border text-muted-foreground hover:border-emerald-500/50",
    ],
    partial: [
      "border-yellow-500 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
      "border-border text-muted-foreground hover:border-yellow-500/50",
    ],
    missed: [
      "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300",
      "border-border text-muted-foreground hover:border-red-500/50",
    ],
  };
  return map[s][active ? 0 : 1];
}

function formatWorkoutDescription(description: string): string {
  const formatRunBlock = (text: string) =>
    text
      .trim()
      .replace(/\.\s*$/, "")
      .split(/\s*,\s*/)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("\n");

  const trimmed = description.trim().replace(/\s+/g, " ");
  const pmIndex = trimmed.indexOf("PM Lift");

  if (pmIndex === -1) return formatRunBlock(trimmed);

  const runPart = formatRunBlock(trimmed.slice(0, pmIndex));
  const liftPart = trimmed.slice(pmIndex).replace(/\.\s*$/, "").trim();
  const colonIndex = liftPart.indexOf(":");

  if (colonIndex === -1) {
    return runPart ? `${runPart}\n\n${liftPart}` : liftPart;
  }

  const liftHeader = liftPart.slice(0, colonIndex + 1).trim();
  const liftItemsRaw = liftPart.slice(colonIndex + 1).trim();
  const liftItems = liftItemsRaw
    .split(/\s*[·+]\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (liftItems.length === 0) {
    return runPart ? `${runPart}\n\n${liftHeader}` : liftHeader;
  }

  const liftBlock = `${liftHeader}\n${liftItems.join("\n")}`;
  return runPart ? `${runPart}\n\n${liftBlock}` : liftBlock;
}

function compactMonthLabel(label: string): string {
  if (label === "RACE: Half") return "RACE HM";
  if (label === "RACE: 10-Mi") return "RACE 10M";
  if (label.startsWith("RACE:")) return `RACE ${label.slice(5).trim()}`;
  // New summer-block labels
  if (label === "MLR + Lower") return "MLR+Low";
  if (label === "Recovery + Upper B") return "Rec+UB";
  if (label === "Recovery + Strides") return "Rec+Str";
  if (label === "Easy + Upper A") return "Easy+UA";
  if (label === "Easy + Strides") return "Easy+Str";
  if (label === "Long Run") return "Long";
  // Legacy spring-block labels
  if (/^LT[12]$/.test(label)) return label;
  if (label.startsWith("Easy + Lift ")) return `E+L ${label.slice(-1)}`;
  if (label === "Easy Run") return "Easy";
  if (label === "Easy/Steady") return "E/Steady";
  if (label === "Recovery + Lift C") return "REC+L C";
  if (label === "Shakeout + Strides") return "Shk+Str";
  return label;
}

function compactMonthDetail(workout: Workout): string {
  const [milesPartRaw, detailPartRaw] = workout.summary.split("·");
  const miles = (milesPartRaw ?? "").trim();
  const detailPart = (detailPartRaw ?? "").trim();

  if (detailPart) return `${miles} · ${detailPart}`;
  if (workout.category === "race") return `${miles} · Race`;
  return miles;
}

// --- Date helpers ---

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// --- Run / Lift view mode ---

type TrainingMode = "run" | "lift";

const LIFT_SHORT: Record<string, string> = {
  upperA: "Upper A",
  lower: "Lower",
  upperB: "Upper B",
};

function liftExerciseSummary(liftKey: string): string {
  const t = getLiftTemplate(liftKey);
  if (!t) return "";
  return t.groups.flatMap((g) => g.exercises.map((e) => e.name)).join(" · ");
}

/**
 * Filter a day's workout for the active mode (used by the month/week grids).
 * Run mode hides lift-only days and the lift block; lift mode surfaces the
 * loggable lift as the cell's workout. Day/detail views bypass this and show
 * the full day.
 */
function displayWorkout(dateStr: string, mode: TrainingMode): Workout | undefined {
  const w = getWorkout(dateStr);
  if (!w) return undefined;
  if (mode === "run") {
    if (w.category === "lift") return undefined;
    const label = w.label.replace(/\s*\+\s*(Upper A|Upper B|Lower)$/, "");
    return { ...w, label, lift: undefined };
  }
  // lift mode
  if (!w.lift) return undefined;
  const short = LIFT_SHORT[w.lift] ?? w.label;
  return {
    ...w,
    category: "lift",
    label: short,
    summary: short,
    description: liftExerciseSummary(w.lift),
  };
}

// --- Component ---

export function WorkoutCalendar() {
  const today = new Date();
  const detailPanelRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<ViewMode>("month");
  const [mode, setMode] = useState<TrainingMode>("run");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(today));
  const [dayDate, setDayDate] = useState(() => today);
  const [selected, setSelected] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, CompletionStatus>>({});
  const [liftStatuses, setLiftStatuses] = useState<Record<string, CompletionStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const notesTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setTodayStr(formatDateKey(new Date()));
    fetch("/api/workout-statuses")
      .then((r) => r.json())
      .then((data: Record<string, WorkoutStatusRow>) => {
        const s: Record<string, CompletionStatus> = {};
        const ls: Record<string, CompletionStatus> = {};
        const n: Record<string, string> = {};
        for (const [date, row] of Object.entries(data)) {
          if (row.status) s[date] = row.status;
          if (row.liftStatus) ls[date] = row.liftStatus;
          if (row.notes) n[date] = row.notes;
        }
        setStatuses(s);
        setLiftStatuses(ls);
        setNotes(n);
      })
      .catch(() => {});
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data: { admin: boolean }) => setIsAdmin(data.admin))
      .catch(() => {});
  }, []);

  function handleTodayClick() {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setWeekStart(getMondayOfWeek(now));
    setDayDate(now);

    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 500);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (!isAdmin) {
        setShowLogin(true);
        setLoginError(false);
        setLoginPassword("");
      }
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPassword }),
    });
    if (res.ok) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginPassword("");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  }

  useEffect(() => {
    if (!selected || view === "day") return;

    requestAnimationFrame(() => {
      detailPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [selected, view]);

  function updateStatus(
    dateStr: string,
    status: CompletionStatus | null,
    kind: "run" | "lift" = "run",
  ) {
    const setter = kind === "lift" ? setLiftStatuses : setStatuses;
    setter((prev) => {
      if (status === null) {
        const next = { ...prev };
        delete next[dateStr];
        return next;
      }
      return { ...prev, [dateStr]: status };
    });
    const workout = getWorkout(dateStr);
    fetch("/api/workout-statuses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: dateStr,
        status,
        kind,
        category: workout?.category ?? "",
        label: workout?.label ?? "",
        summary: workout?.summary ?? "",
        description: workout?.description ?? "",
      }),
    }).catch(() => {});
  }

  const saveNotes = useCallback((dateStr: string, value: string) => {
    fetch("/api/workout-statuses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr, notes: value }),
    }).catch(() => {});
  }, []);

  function handleNotesChange(dateStr: string, value: string) {
    setNotes((prev) => ({ ...prev, [dateStr]: value }));
    clearTimeout(notesTimers.current[dateStr]);
    notesTimers.current[dateStr] = setTimeout(() => {
      saveNotes(dateStr, value);
    }, 500);
  }

  // --- Navigation ---

  function navPrev() {
    if (view === "month") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else {
        setMonth((m) => m - 1);
      }
    } else if (view === "week") {
      setWeekStart((d) => addDays(d, -7));
    } else {
      setDayDate((d) => addDays(d, -1));
    }
  }

  function navNext() {
    if (view === "month") {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else {
        setMonth((m) => m + 1);
      }
    } else if (view === "week") {
      setWeekStart((d) => addDays(d, 7));
    } else {
      setDayDate((d) => addDays(d, 1));
    }
  }

  function goToDay(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    setDayDate(new Date(y, m - 1, d));
    setView("day");
  }

  // --- Navigation label ---

  let navLabel: string;
  if (view === "month") {
    navLabel = `${MONTHS[month]} ${year}`;
  } else if (view === "week") {
    const end = addDays(weekStart, 6);
    navLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  } else {
    navLabel = dayDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // === Run / Lift switch ===

  function renderModeSwitch() {
    const opts = [
      ["run", "Running", Footprints],
      ["lift", "Lifting", Dumbbell],
    ] as const;
    return (
      <div className="flex gap-1 rounded-lg bg-muted-foreground/10 p-1 shrink-0">
        {opts.map(([m, label, Icon]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-label={label}
            title={label}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-md transition-colors ${
              mode === m
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  // === Status controls (separate run + lift on combined days) ===

  function renderStatusSection(
    dateStr: string,
    runStatus: CompletionStatus | undefined,
    liftStatus: CompletionStatus | undefined,
    hasRun: boolean,
    hasLift: boolean,
    compact: boolean,
  ) {
    if (!isAdmin || (!hasRun && !hasLift)) return null;
    const both = hasRun && hasLift;
    const btnSize = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

    const row = (
      kind: "run" | "lift",
      current: CompletionStatus | undefined,
      label: string,
    ) => (
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="flex flex-wrap gap-2">
          {(["completed", "partial", "missed"] as CompletionStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(dateStr, current === s ? null : s, kind)}
              className={`${btnSize} rounded-lg border transition-colors capitalize ${statusBtnClass(s, current === s)}`}
            >
              {s === "completed" ? "Completed" : s === "partial" ? "Partial" : "Missed"}
            </button>
          ))}
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        {hasRun && row("run", runStatus, both ? "Run — status" : "Status")}
        {hasLift && row("lift", liftStatus, both ? "Lift — status" : "Status")}
      </div>
    );
  }

  // === MONTH VIEW ===

  function renderMonthView() {
    // Full Mon–Sun weeks spanning month boundaries — adjacent-month days are
    // filled in (dimmed) so the calendar flows continuously with no gaps.
    const gridStart = getMondayOfWeek(new Date(year, month, 1));
    const lastOfMonth = new Date(year, month + 1, 0);
    const cells: Date[] = [];
    for (
      let cur = gridStart;
      cur <= lastOfMonth || cells.length % 7 !== 0;
      cur = addDays(cur, 1)
    ) {
      cells.push(cur);
    }

    return (
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-xs text-muted-foreground text-center py-2 font-medium"
            >
              {d}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="grid grid-cols-7 border-t border-border">
          {cells.map((date) => {
            const dateStr = formatDateKey(date);
            const day = date.getDate();
            const inMonth = date.getMonth() === month;
            const workout = displayWorkout(dateStr, mode);
            const status = (mode === "lift" ? liftStatuses : statuses)[dateStr];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selected;
            const mobileDetail = workout ? compactMonthDetail(workout) : "";

            return (
              <button
                key={dateStr}
                onClick={() =>
                  setSelected(selected === dateStr ? null : dateStr)
                }
                onDoubleClick={() => goToDay(dateStr)}
                className={`
                  border-b border-r border-l border-border min-h-[68px] sm:min-h-[120px]
                  p-1 sm:p-2 text-left transition-all relative flex flex-col items-start
                  hover:bg-muted-foreground/5 cursor-pointer
                  ${status ? `border-l-4 ${statusBorder(status)} ${statusBg(status)}` : ""}
                  ${isSelected ? "ring-2 ring-accent ring-inset" : ""}
                  ${inMonth ? "" : "opacity-40"}
                `}
              >
                {/* Date number */}
                <span
                  className={`
                    inline-flex items-center justify-center text-xs sm:text-sm
                    ${
                      isToday
                        ? "w-6 h-6 rounded-full bg-accent text-white font-medium"
                        : workout
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                    }
                  `}
                >
                  {day}
                </span>

                {/* Workout info */}
                {workout && (
                  <div className="mt-1 min-w-0 space-y-0.5">
                    <span
                      className={`text-[10px] sm:text-xs leading-tight block truncate font-medium ${
                        workout.category === "race"
                          ? "text-amber-600 dark:text-amber-400"
                          : categoryColor(workout.category)
                      }`}
                    >
                      <span className="sm:hidden">{compactMonthLabel(workout.label)}</span>
                      <span className="hidden sm:inline">{workout.label}</span>
                    </span>
                    <p className="sm:hidden text-[10px] leading-snug text-muted-foreground line-clamp-2">
                      {mobileDetail}
                    </p>
                    <p className="hidden sm:block text-[10px] sm:text-[11px] leading-snug text-muted-foreground line-clamp-3">
                      {workout.description}
                    </p>
                  </div>
                )}

              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // === WEEK VIEW ===

  function renderWeekView() {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div>
        {/* Day headers (desktop) */}
        <div className="hidden sm:grid grid-cols-7 mb-1">
          {days.map((d, i) => {
            const dateStr = formatDateKey(d);
            const isToday = dateStr === todayStr;
            return (
              <div key={i} className="text-center py-2">
                <div className="text-xs text-muted-foreground font-medium">
                  {DAYS[i]}
                </div>
                <span
                  className={`inline-flex items-center justify-center text-sm mt-0.5 ${
                    isToday
                      ? "w-7 h-7 rounded-full bg-accent text-white font-medium"
                      : "text-foreground font-medium"
                  }`}
                >
                  {d.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop: 7-column grid */}
        <div className="hidden sm:grid grid-cols-7 border-t border-border">
          {days.map((d) => {
            const dateStr = formatDateKey(d);
            const workout = displayWorkout(dateStr, mode);
            const status = (mode === "lift" ? liftStatuses : statuses)[dateStr];
            const isSelected = dateStr === selected;
            const formattedDescription = workout
              ? formatWorkoutDescription(workout.description)
              : "";

            return (
              <button
                key={dateStr}
                onClick={() =>
                  setSelected(selected === dateStr ? null : dateStr)
                }
                onDoubleClick={() => goToDay(dateStr)}
                className={`
                  border-b border-r border-border min-h-[220px] lg:min-h-[260px]
                  p-3 text-left transition-all
                  hover:bg-muted-foreground/5 cursor-pointer border-l
                  ${status ? `border-l-4 ${statusBorder(status)} ${statusBg(status)}` : ""}
                  ${isSelected ? "ring-2 ring-accent ring-inset" : ""}
                `}
              >
                {workout ? (
                  <div className="h-full flex flex-col space-y-2">
                    <span
                      className={`text-xs font-medium ${
                        workout.category === "race"
                          ? "text-amber-600 dark:text-amber-400"
                          : categoryColor(workout.category)
                      }`}
                    >
                      {workout.label}
                    </span>
                    <p className="text-[12px] text-muted-foreground leading-5 whitespace-pre-line">
                      {formattedDescription}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/50">Rest</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile: stacked list */}
        <div className="sm:hidden space-y-2">
          {days.map((d, i) => {
            const dateStr = formatDateKey(d);
            const workout = displayWorkout(dateStr, mode);
            const status = (mode === "lift" ? liftStatuses : statuses)[dateStr];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selected;
            const formattedDescription = workout
              ? formatWorkoutDescription(workout.description)
              : "";

            return (
              <button
                key={dateStr}
                onClick={() =>
                  setSelected(selected === dateStr ? null : dateStr)
                }
                className={`
                  w-full text-left p-3 rounded-lg border transition-all
                  ${status ? `border-l-4 ${statusBorder(status)} ${statusBg(status)} border-border` : "border-border"}
                  ${isSelected ? "ring-2 ring-accent ring-inset" : ""}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-medium w-8">
                    {DAYS[i]}
                  </span>
                  <span
                    className={`text-sm font-medium ${isToday ? "inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-white" : "text-foreground"}`}
                  >
                    {d.getDate()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {d.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  {workout && (
                    <span
                      className={`text-xs font-medium ${categoryColor(workout.category)}`}
                    >
                      {workout.label}
                    </span>
                  )}
                </div>
                {workout && (
                  <p className="text-xs text-muted-foreground ml-10 whitespace-pre-line">
                    {formattedDescription}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // === DAY VIEW ===

  function renderDayView() {
    const dateStr = formatDateKey(dayDate);
    const workout = getWorkout(dateStr);
    const week = getTrainingWeek(dateStr);
    const runStatus = statuses[dateStr];
    const liftStatus = liftStatuses[dateStr];
    const hasRun = !!workout && (workout.category === "run" || workout.category === "race");
    const hasLift = !!workout?.lift;
    const cardStatus = hasRun ? runStatus : liftStatus;
    const isToday = dateStr === todayStr;
    const formattedDescription = workout
      ? formatWorkoutDescription(workout.description)
      : "";

    return (
      <div className="max-w-lg">
        {/* Date header */}
        <div className="mb-6">
          {isToday && (
            <span className="text-xs font-medium text-accent mb-1 block">
              Today
            </span>
          )}
          {week && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                {week.label}
              </span>
              <span className="text-xs text-muted-foreground">
                Target: {week.miles} mi
              </span>
              {week.note && (
                <span className="text-xs text-muted-foreground">
                  · {week.note}
                </span>
              )}
            </div>
          )}
        </div>

        {workout ? (
          <div className="space-y-6">
            {/* Workout card */}
            <div
              className={`rounded-lg border border-border p-4 ${
                cardStatus
                  ? `border-l-4 ${statusBorder(cardStatus)} ${statusBg(cardStatus)}`
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    workout.category === "run"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : workout.category === "lift"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {workout.category === "run"
                    ? "Run"
                    : workout.category === "lift"
                      ? "Lift"
                      : "Race"}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{workout.label}</h3>
              {workout.category !== "lift" && (
                <p className="text-muted leading-relaxed whitespace-pre-line">
                  {formattedDescription}
                </p>
              )}
              {/* Combined days: status sits above the lift breakdown */}
              {isAdmin && hasRun && hasLift && (
                <div className="mt-4">
                  {renderStatusSection(dateStr, runStatus, liftStatus, true, true, false)}
                </div>
              )}
              {workout.lift && (
                <div className={hasRun && hasLift ? "mt-5" : "mt-3"}>
                  <LiftDetail dateStr={dateStr} liftKey={workout.lift} isAdmin={isAdmin} />
                </div>
              )}
            </div>

            {/* Single-activity status (combined days show it above, before the lift) */}
            {!(hasRun && hasLift) &&
              renderStatusSection(dateStr, runStatus, liftStatus, hasRun, hasLift, false)}

            {/* Notes */}
            {isAdmin && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Notes
                </p>
                <textarea
                  value={notes[dateStr] ?? ""}
                  onChange={(e) => handleNotesChange(dateStr, e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border p-6 text-center">
            <p className="text-muted-foreground">
              No workout scheduled — Rest day
            </p>
          </div>
        )}
      </div>
    );
  }

  // === DETAIL PANEL (shown below month/week when a day is selected) ===

  function renderDetailPanel() {
    if (!selected) return null;

    const workout = getWorkout(selected);
    const week = getTrainingWeek(selected);
    const runStatus = statuses[selected];
    const liftStatus = liftStatuses[selected];
    const hasRun = !!workout && (workout.category === "run" || workout.category === "race");
    const hasLift = !!workout?.lift;
    const cardStatus = hasRun ? runStatus : liftStatus;
    const [y, m, d] = selected.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const displayDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const formattedDescription = workout
      ? formatWorkoutDescription(workout.description)
      : "";

    return (
      <div
        className={`mt-4 rounded-lg border border-border p-4 ${
          cardStatus
            ? `border-l-4 ${statusBorder(cardStatus)} ${statusBg(cardStatus)}`
            : ""
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium">{displayDate}</p>
            {week && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {week.label} · {week.miles} mi
                {week.note ? ` · ${week.note}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {workout ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium ${categoryColor(workout.category)}`}
                >
                  {workout.category === "run"
                    ? "Run"
                    : workout.category === "lift"
                      ? "Lift"
                      : "Race"}
                </span>
                <span className="text-sm font-medium">{workout.label}</span>
              </div>
              {workout.category !== "lift" && (
                <p className="text-sm text-muted whitespace-pre-line leading-relaxed">
                  {formattedDescription}
                </p>
              )}
              {/* Combined days: status sits above the lift breakdown */}
              {isAdmin && hasRun && hasLift && (
                <div className="mt-3">
                  {renderStatusSection(selected, runStatus, liftStatus, true, true, true)}
                </div>
              )}
              {workout.lift && (
                <LiftDetail
                  dateStr={selected}
                  liftKey={workout.lift}
                  compact
                  isAdmin={isAdmin}
                />
              )}
            </div>

            {/* Single-activity status (combined days show it above, before the lift) */}
            {!(hasRun && hasLift) &&
              renderStatusSection(selected, runStatus, liftStatus, hasRun, hasLift, true)}

            {/* Notes */}
            {isAdmin && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Notes
                </p>
                <textarea
                  value={notes[selected] ?? ""}
                  onChange={(e) => handleNotesChange(selected, e.target.value)}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Rest day</p>
        )}
      </div>
    );
  }

  // === MAIN RENDER ===

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="space-y-2 sm:space-y-0">
        {/* Mobile: two rows */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            {/* View tabs */}
            <div className="flex gap-1 rounded-lg bg-muted-foreground/10 p-1">
              {(["month", "week", "day"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                    view === v
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {renderModeSwitch()}
          </div>
          {/* Today */}
          <button
            onClick={handleTodayClick}
            className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors select-none"
          >
            Today
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 sm:hidden">
          <button
            onClick={navPrev}
            className="p-1.5 rounded hover:bg-muted-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-center">
            {navLabel}
          </span>
          <button
            onClick={navNext}
            className="p-1.5 rounded hover:bg-muted-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop: single row */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex gap-1 rounded-lg bg-muted-foreground/10 p-1 shrink-0">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {renderModeSwitch()}
          <div className="flex-1 flex items-center justify-center gap-2">
            <button
              onClick={navPrev}
              className="p-1.5 rounded hover:bg-muted-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium min-w-[220px] text-center">
              {navLabel}
            </span>
            <button
              onClick={navNext}
              className="p-1.5 rounded hover:bg-muted-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleTodayClick}
            className="shrink-0 px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors select-none"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}

      {/* Detail panel for month/week selection */}
      {view !== "day" && selected && (
        <div ref={detailPanelRef}>{renderDetailPanel()}</div>
      )}

      {/* Login modal */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLogin(false)}
        >
          <form
            onSubmit={handleLogin}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-lg p-6 w-full max-w-xs space-y-4 shadow-lg"
          >
            <h3 className="text-sm font-medium">Admin Login</h3>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError(false);
              }}
              placeholder="Password"
              autoFocus
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-accent ${
                loginError ? "border-red-500" : "border-border"
              }`}
            />
            {loginError && (
              <p className="text-xs text-red-500">Wrong password</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

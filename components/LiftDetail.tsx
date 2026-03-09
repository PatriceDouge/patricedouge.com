"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getLiftTemplate,
  type LiftTemplate,
  type SetLog,
  type Exercise,
} from "@/lib/workouts";

interface LiftDetailProps {
  dateStr: string;
  workoutLabel: string;
  compact?: boolean;
}

export function LiftDetail({ dateStr, workoutLabel, compact }: LiftDetailProps) {
  const [logs, setLogs] = useState<Record<string, SetLog[]>>({});
  const [mounted, setMounted] = useState(false);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const template = getLiftTemplate(workoutLabel);

  useEffect(() => {
    setMounted(true);
    fetch(`/api/lift-logs?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => setLogs(data))
      .catch(() => {});
  }, [dateStr]);

  const debouncedSave = useCallback(
    (exerciseName: string, setIndex: number, field: "weight" | "reps", value: string) => {
      const key = `${exerciseName}-${setIndex}-${field}`;
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }
      debounceTimers.current[key] = setTimeout(() => {
        fetch("/api/lift-logs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateStr, exercise: exerciseName, setIndex, field, value }),
        }).catch(() => {});
        delete debounceTimers.current[key];
      }, 500);
    },
    [dateStr],
  );

  if (!template) return null;

  function updateSet(
    exerciseName: string,
    setIndex: number,
    field: "weight" | "reps",
    value: string,
  ) {
    setLogs((prev) => {
      const next = { ...prev };
      const sets = [...(next[exerciseName] ?? [])];
      while (sets.length <= setIndex) {
        sets.push({ weight: "", reps: "" });
      }
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      next[exerciseName] = sets;
      return next;
    });
    debouncedSave(exerciseName, setIndex, field, value);
  }

  if (!mounted) return null;

  function renderExerciseInputs(exercise: Exercise) {
    const exerciseLogs = logs[exercise.name] ?? [];
    return (
      <div key={exercise.name} className="space-y-1.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {exercise.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {exercise.sets}×{exercise.reps}
            {exercise.rir ? ` · RIR ${exercise.rir}` : ""}
          </span>
        </div>
        <div className="space-y-1">
          {Array.from({ length: exercise.sets }, (_, i) => {
            const setLog = exerciseLogs[i] ?? { weight: "", reps: "" };
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-6 shrink-0">
                  S{i + 1}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="lbs"
                  value={setLog.weight}
                  onChange={(e) =>
                    updateSet(exercise.name, i, "weight", e.target.value)
                  }
                  className="w-16 px-2 py-1 rounded border border-border bg-transparent text-foreground text-center placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-muted-foreground">×</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="reps"
                  value={setLog.reps}
                  onChange={(e) =>
                    updateSet(exercise.name, i, "reps", e.target.value)
                  }
                  className="w-16 px-2 py-1 rounded border border-border bg-transparent text-foreground text-center placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3 mt-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {template.title}
        </p>
        {template.groups.map((group, gi) => (
          <div key={gi}>
            {group.type === "superset" && (
              <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
                Superset
              </span>
            )}
            <div
              className={
                group.type === "superset"
                  ? "border-l-2 border-amber-500/30 pl-3 space-y-3 mt-1"
                  : "space-y-3"
              }
            >
              {group.exercises.map((ex) => renderExerciseInputs(ex))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {template.title}
        </h4>
      </div>

      {template.groups.map((group, gi) => (
        <div key={gi}>
          {group.type === "superset" && (
            <div className="mb-2">
              <span className="text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-medium">
                Superset
              </span>
            </div>
          )}
          <div
            className={
              group.type === "superset"
                ? "border-l-2 border-amber-500/30 pl-4 space-y-4"
                : "space-y-4"
            }
          >
            {group.exercises.map((ex) => renderExerciseInputs(ex))}
          </div>
        </div>
      ))}
    </div>
  );
}

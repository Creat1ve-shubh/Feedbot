"use client";

import { motion } from "motion/react";
import { IconCheck, IconLoader, IconAlertCircle } from "@tabler/icons-react";
import { AnalysisStep, STEP_LABELS } from "@/store/brandStore";

interface Step {
  key: AnalysisStep;
  label: string;
  sublabel: string;
  estimatedMs: number;
}

const STEPS: Step[] = [
  {
    key: "scraping",
    label: "Data Collection",
    sublabel: "Reddit & Twitter posts",
    estimatedMs: 15000,
  },
  {
    key: "inferring",
    label: "Model Inference",
    sublabel: "Sentiment · Emotion · Topic",
    estimatedMs: 30000,
  },
  {
    key: "aggregating",
    label: "Aggregation",
    sublabel: "Compiling results",
    estimatedMs: 5000,
  },
];

// Map each step key to its 0-based index in STEPS
const stepIndex = (key: AnalysisStep): number =>
  STEPS.findIndex((s) => s.key === key);

type StepState = "done" | "active" | "pending";

function stepState(
  stepKey: AnalysisStep,
  currentStep: AnalysisStep,
  isError: boolean,
): StepState {
  if (currentStep === "done") return "done";
  if (isError && currentStep === stepKey) return "active"; // show error on last-active
  const curr = stepIndex(currentStep);
  const idx = stepIndex(stepKey);
  if (idx < curr) return "done";
  if (idx === curr) return "active";
  return "pending";
}

interface AnalysisStepperProps {
  currentStep: AnalysisStep;
  brand?: string;
}

export default function AnalysisStepper({
  currentStep,
  brand,
}: AnalysisStepperProps) {
  const isError = currentStep === "error";
  const isDone = currentStep === "done";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-[#0b0b0b]">
            {isDone
              ? "Analysis Complete"
              : isError
                ? "Analysis Failed"
                : "Running Analysis"}
          </h3>
          {brand && (
            <p className="text-xs text-gray-500 mt-0.5">
              Target:{" "}
              <span className="font-mono font-medium text-[#0b0b0b]">
                {brand}
              </span>
            </p>
          )}
        </div>

        {/* Overall status icon */}
        {isDone ? (
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <IconCheck size={16} className="text-emerald-600" />
          </div>
        ) : isError ? (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <IconAlertCircle size={16} className="text-red-600" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center animate-spin">
            <IconLoader size={16} className="text-indigo-600" />
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const state = stepState(step.key, currentStep, isError);
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.key} className="relative flex gap-3">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[15px] top-8 w-px h-full">
                  <motion.div
                    className="w-full bg-emerald-400 origin-top"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: state === "done" ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ height: "100%" }}
                  />
                  <div
                    className="w-full bg-gray-200 absolute inset-0 -z-10"
                    style={{ height: "100%" }}
                  />
                </div>
              )}

              {/* Step node */}
              <div className="flex-shrink-0 relative z-10">
                {state === "done" ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                  >
                    <IconCheck size={14} className="text-white" />
                  </motion.div>
                ) : state === "active" ? (
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(99,102,241,0.4)",
                        "0 0 0 8px rgba(99,102,241,0)",
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
                    <span className="text-xs font-mono text-gray-400">
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors ${
                        state === "done"
                          ? "text-emerald-700"
                          : state === "active"
                            ? "text-[#0b0b0b]"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 transition-colors ${
                        state === "pending" ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {step.sublabel}
                    </p>
                  </div>

                  {/* Time estimate / done badge */}
                  {state === "done" && (
                    <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      done
                    </span>
                  )}
                  {state === "active" && !isError && (
                    <span className="text-xs font-mono text-indigo-500">
                      ~{step.estimatedMs / 1000}s
                    </span>
                  )}
                  {state === "pending" && (
                    <span className="text-xs font-mono text-gray-300">
                      queued
                    </span>
                  )}
                </div>

                {/* Active progress bar */}
                {state === "active" && !isError && (
                  <motion.div className="mt-2 h-0.5 bg-gray-100 rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-400 rounded"
                      initial={{ width: "0%" }}
                      animate={{ width: "95%" }}
                      transition={{
                        duration: step.estimatedMs / 1000,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer message */}
      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center"
        >
          Redirecting to dashboard…
        </motion.div>
      )}
    </div>
  );
}

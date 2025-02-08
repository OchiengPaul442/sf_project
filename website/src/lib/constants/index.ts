import type { StepWithData } from "@/utils/types/section";

export const JSON_PATHS = [
  "/lottie/sailing_boat_2.json",
  "/lottie/paper_flying.json",
  "/lottie/spag_json.json",
  "/lottie/mark_json.json",
  "/lottie/data2.json",
  "/lottie/robot.json",
  "/lottie/contruction.json",
  "/lottie/angel.json",
] as const;

export const SECTIONS = [
  { id: "home", title: "Home" },
  { id: "robot", title: "Robot" },
  { id: "how", title: "How it works" },
  { id: "how-carousel", title: "How It Works Carousel" },
  { id: "work", title: "Work" },
  { id: "footer", title: "Footer" },
] as const;

export const NAV_SECTIONS = [
  { id: "home", title: "HOME" },
  { id: "how", title: "SOLUTIONS" },
  { id: "work", title: "WORK WITH US" },
] as const;

export const STEPS_WITH_IDS: StepWithData[] = [
  { id: "smooth-onboarding", title: "Smooth Onboarding", animationData: null },
  { id: "data-integrity", title: "Data Integrity", animationData: null },
  {
    id: "managed-consumables",
    title: "Tightly Managed Consumables",
    animationData: null,
  },
  { id: "recipe-adherence", title: "Recipe Adherence", animationData: null },
  { id: "fraud-eliminated", title: "Fraud Eliminated", animationData: null },
];

/**
 * Animation configuration constants
 */
export const ANIMATION_CONFIG = {
  threshold: 50,
  transitionDuration: 0.6,
  debounceTime: 500,
} as const;

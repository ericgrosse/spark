export type ModerationSeverity = "low" | "medium" | "high" | "critical";

export interface Report {
  reason: string;
  details?: string;
  createdAt: Date;
}

const criticalReasons = new Set(["minor", "unsafe"]);
const mediumReasons = new Set(["harassment", "impersonation"]);

export function moderationSeverity(report: Report): ModerationSeverity {
  if (criticalReasons.has(report.reason)) return "critical";
  if (mediumReasons.has(report.reason)) return "medium";
  if ((report.details ?? "").length > 300) return "medium";
  return "low";
}

export function shouldAutoHideProfile(reports: Report[]) {
  return reports.some((report) => moderationSeverity(report) === "critical") || reports.length >= 5;
}

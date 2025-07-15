export interface URLAnalysisResult {
  id: number;
  url: string;
  title: string | null;
  htmlVersion: string | null;
  internalLinks: number | null;
  externalLinks: number | null;
  status: "Queued" | "Running" | "Done" | "Error";
  loginForm?: boolean | null;
  validFrom: string;
  validUntil: string;
}

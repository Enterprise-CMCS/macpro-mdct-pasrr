export function isDatadogEnabled(stage: string): boolean {
  return stage === "val" || stage === "production";
}

export function datadogEnvForStage(stage: string): "prod" | "val" {
  return stage === "production" ? "prod" : "val";
}

export function cmsEnvForStage(stage: string): "prod" | "impl" {
  return stage === "production" ? "prod" : "impl";
}

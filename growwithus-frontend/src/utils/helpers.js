export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || "Something went wrong";
}

export function calculateCompletionPercent(totalModules, completedModules) {
  if (!totalModules) return 0;
  return Math.round((completedModules / totalModules) * 100);
}
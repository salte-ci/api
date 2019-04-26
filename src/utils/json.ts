export function safeParse(json: any, defaultValue: any = json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return defaultValue;
  }
}

const formatter = Intl.DateTimeFormat("default", {
  dateStyle: "short",
  timeStyle: "short",
  hourCycle: "h12",
});

export const formatDateTime = (date: Date | string): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return formatter.format(date);
};

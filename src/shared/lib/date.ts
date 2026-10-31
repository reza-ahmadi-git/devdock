export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekRange(now = new Date()) {
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return {
    today: getLocalDateString(now),
    weekEnd: getLocalDateString(weekEnd),
  };
}

export function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function formatDate(date: string) {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(`${date}T00:00:00`));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatTimestamp(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(iso));
}

export function isDueWithinWeek(
  task: { completed: boolean; dueDate: string },
  range: { today: string; weekEnd: string },
) {
  return (
    !task.completed &&
    Boolean(task.dueDate) &&
    task.dueDate >= range.today &&
    task.dueDate <= range.weekEnd
  );
}

export function isOverdue(date: string) {
  return Boolean(date) && date < getLocalDateString();
}

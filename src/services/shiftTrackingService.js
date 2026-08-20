const ACTIVE_SHIFT_KEY = "swiftopsbd-caregiver-active-shift";
const SHIFT_HISTORY_KEY = "swiftopsbd-caregiver-shift-history";

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const isSameLocalDay = (firstDate, secondDate) => {
  const first = new Date(firstDate);
  const second = new Date(secondDate);
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
};

export const getActiveShift = () => readJson(ACTIVE_SHIFT_KEY, null);
export const getShiftHistory = () => readJson(SHIFT_HISTORY_KEY, []);

export const clockInCaregiver = ({ caregiverName }) => {
  const existingShift = getActiveShift();
  if (existingShift) return existingShift;

  const shift = {
    id: globalThis.crypto?.randomUUID?.() ?? `shift-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    caregiverName,
    startedAt: new Date().toISOString(),
    status: "active",
  };
  localStorage.setItem(ACTIVE_SHIFT_KEY, JSON.stringify(shift));
  return shift;
};

export const clockOutCaregiver = () => {
  const activeShift = getActiveShift();
  if (!activeShift) return null;

  const endedAt = new Date().toISOString();
  const completedShift = {
    ...activeShift,
    endedAt,
    durationSeconds: Math.max(0, Math.floor((new Date(endedAt).getTime() - new Date(activeShift.startedAt).getTime()) / 1000)),
    status: "completed",
  };
  localStorage.setItem(SHIFT_HISTORY_KEY, JSON.stringify([completedShift, ...getShiftHistory()].slice(0, 100)));
  localStorage.removeItem(ACTIVE_SHIFT_KEY);
  return completedShift;
};

export const getTodayCompletedShiftSeconds = (now = new Date()) =>
  getShiftHistory()
    .filter((shift) => shift.endedAt && isSameLocalDay(shift.endedAt, now))
    .reduce((total, shift) => total + (shift.durationSeconds ?? 0), 0);

// Later this adapter can call the REST API without changing the dashboard UI.
// The backend should store caregiverId, startedAt, endedAt, durationSeconds,
// and server-verified timestamps for every shift.

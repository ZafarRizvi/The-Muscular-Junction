// utils/time.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "Asia/Karachi"; // Pakistan Standard Time

/**
 * Converts a "HH:mm" or "HH:mm:ss" time string into a JS Date object
 * using today's date in Pakistan timezone.
 *
 * @param {string} timeString - The time string, e.g. "17:00" or "17:00:00"
 * @returns {Date} UTC Date object (Prisma stores DateTime as UTC)
 */
export const timeStringToDate = (timeString) => {
  if (!timeString || typeof timeString !== "string") {
    console.warn("⚠️ Invalid time string provided:", timeString);
    return null;
  }

  // Extract hours/minutes safely
  const [hh, mm = "00", ss = "00"] = timeString.split(":");
  if (isNaN(hh) || isNaN(mm)) {
    console.warn("⚠️ Could not parse time:", timeString);
    return null;
  }

  // Build a full datetime using today's date in Pakistan timezone
  const today = dayjs().tz(TIMEZONE).format("YYYY-MM-DD");
  const combined = `${today} ${hh}:${mm}:${ss}`;

  // Convert to UTC Date object
  const dt = dayjs.tz(combined, "YYYY-MM-DD HH:mm:ss", TIMEZONE);
  return dt.toDate();
};

/**
 * Helper for debugging — returns formatted local time string.
 * Example: formatLocalTime(new Date()) → "17:00"
 */
export const formatLocalTime = (dateObj) => {
  if (!dateObj) return null;
  return dayjs(dateObj).tz(TIMEZONE).format("HH:mm");
};

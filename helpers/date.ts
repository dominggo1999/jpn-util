export const readable = (time: Date) => {
  const hours = String(time.getUTCHours()).padStart(2, "0");
  const minutes = String(time.getUTCMinutes()).padStart(2, "0");
  const seconds = String(time.getUTCSeconds()).padStart(2, "0");
  const month = time.toLocaleString("default", { month: "short" });
  const year = time.getUTCFullYear();

  return `${hours}:${minutes}:${seconds} ${month} ${year}`;
};

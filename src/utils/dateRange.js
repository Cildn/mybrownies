export const getDateRange = (period) => {
  const now = new Date();
  let start, end;

  switch (period.toLowerCase()) {
    case "daily":
      start = new Date(now.setUTCHours(0, 0, 0, 0));
      end = new Date(now);
      break;
    case "weekly":
      start = new Date(now.setDate(now.getDate() - 7));
      end = new Date(now);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "previous-monthly":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "quarterly":
      start = new Date(now.setUTCMonth(now.getUTCMonth() - 3));
      end = new Date(now);
      break;
    case "yearly":
      start = new Date(now.setUTCFullYear(now.getUTCFullYear() - 1));
      end = new Date(now);
      break;
    default:
      start = new Date(0); // all-time
      end = new Date();
  }

  console.log(`Period: ${period}, Start: ${start.toISOString()}, End: ${end.toISOString()}`);
  return { start: start.toISOString(), end: end.toISOString() };
};
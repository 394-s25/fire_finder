export function getGoogleCalendarUrl(event) {
  const formatDate = (dateStr) =>
    new Date(dateStr).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const start = formatDate(event.startDate);
  const end = formatDate(event.endDate);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

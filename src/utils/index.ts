export function formatDate(timestamp: number | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString(undefined, options);
}

export function formatTime(timestamp: number | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString(undefined, options);
}

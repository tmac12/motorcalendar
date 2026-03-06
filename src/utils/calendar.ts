export interface Session {
  name: string;
  shortName: string;
  date: string;
  time: string;
  tv?: string;
  tvTime?: string;
}

export interface Race {
  name: string;
  circuit: string;
  country: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  sessions: Session[];
}

export interface Championship {
  championship: string;
  season: number;
  color: string;
  slug: string;
  races: Race[];
}

const TODAY = new Date().toISOString().split('T')[0];

export function getNextRace(races: Race[]): Race | null {
  return races.find(race => race.endDate >= TODAY) ?? null;
}

export function isPast(dateStr: string): boolean {
  return dateStr < TODAY;
}

export function isToday(dateStr: string): boolean {
  return dateStr === TODAY;
}

export function isRacePast(race: Race): boolean {
  return race.endDate < TODAY;
}

export function getMonthGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1);
  // Monday = 0, Sunday = 6
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[][] = [];
  let week: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }

  return grid;
}

export function getRacesInMonth(races: Race[], year: number, month: number): Race[] {
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  return races.filter(race =>
    race.startDate.startsWith(monthStr) || race.endDate.startsWith(monthStr)
  );
}

export function getRaceOnDay(races: Race[], year: number, month: number, day: number): Race | null {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return races.find(race => dateStr >= race.startDate && dateStr <= race.endDate) ?? null;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
}

export function getMonthName(month: number): string {
  const date = new Date(2026, month, 1);
  return date.toLocaleDateString('it-IT', { month: 'long' });
}

export function groupSessionsByDay(sessions: Session[]): Record<string, Session[]> {
  const groups: Record<string, Session[]> = {};
  for (const session of sessions) {
    if (!groups[session.date]) groups[session.date] = [];
    groups[session.date].push(session);
  }
  return groups;
}

export function getCalendarMonths(races: Race[]): { year: number; month: number }[] {
  if (races.length === 0) return [];
  const first = races[0].startDate;
  const last = races[races.length - 1].endDate;
  const months: { year: number; month: number }[] = [];
  let [y, m] = first.split('-').map(Number);
  const [lastY, lastM] = last.split('-').map(Number);
  while (y < lastY || (y === lastY && m <= lastM)) {
    months.push({ year: y, month: m - 1 });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

export function countryCodeToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

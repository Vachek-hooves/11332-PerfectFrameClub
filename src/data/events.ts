import { ClubEvent } from '../types';

export const clubEvents: ClubEvent[] = [
  {
    id: 'event-01',
    title: 'Possibilities+ Weekly Draws',
    category: 'Promotion',
    badge: 'Live event',
    dateLabel: 'Friday 11 September',
    isoDate: '2026-09-11T18:00:00',
    timeLabel: '18:00 – 20:00',
    venue: 'Belleville / Peterborough / Thousand Islands / Kawartha Downs',
    detail: 'Three live draws throughout the evening',
    description:
      'Friday night brings three scheduled Possibilities+ draws. Eligible Great Canadian Rewards members can take part in the September event, with winners choosing between Slot Play and a merchandise prize.',
    tournament: false,
  },
  {
    id: 'event-02',
    title: 'Summer Ends, Winning Doesn’t',
    category: 'Special event',
    dateLabel: 'Saturday 12 September',
    isoDate: '2026-09-12T18:00:00',
    timeLabel: '18:00 – 21:00',
    venue: 'Belleville / Peterborough / Thousand Islands',
    detail: 'Saturday event · September series',
    description:
      'A Saturday evening event running throughout September at participating Perfect Frame Club locations. Eligible Great Canadian Rewards members can unlock the promotional U-Spin after meeting the required play conditions.',
    tournament: false,
  },
  {
    id: 'event-03',
    title: 'Jackpot Party',
    category: 'Member event',
    dateLabel: 'Monday 14 September',
    isoDate: '2026-09-14T15:00:00',
    timeLabel: 'Check-in from 15:00',
    venue: 'Belleville / Peterborough / Thousand Islands',
    detail: 'Draws · 16:30 – 20:00',
    description:
      'The September Jackpot Party brings eligible qualifying guests together for an evening of scheduled draws. Draws take place every 30 minutes from 16:30 until 20:00, with participants required to be present to win.',
    tournament: false,
  },
  {
    id: 'event-04',
    title: 'Great Canadian Slot Classic — Thousand Islands',
    category: 'Tournament',
    dateLabel: 'Saturday 19 September',
    isoDate: '2026-09-19T15:00:00',
    timeLabel: '15:00 – 18:00',
    venue: 'Perfect Frame Club Thousand Islands · Gananoque',
    detail: 'Quarter-final · Perfect Frame Club regional stage',
    description:
      'The 2026 Great Canadian Slot Classic reaches Perfect Frame Club Thousand Islands with an official quarter-final event. Across the three Perfect Frame Club qualifying events, 24 top finishers advance to the semifinal at Pickering Resort.',
    format: 'Quarter-final · 24 finishers advance',
    tournament: true,
  },
  {
    id: 'event-05',
    title: 'Possibilities+ Grand Finale',
    category: 'Finale',
    badge: 'Member event',
    dateLabel: 'Friday 25 September',
    isoDate: '2026-09-25T17:00:00',
    timeLabel: '17:00 – 20:00',
    venue: 'Participating Perfect Frame Club',
    detail: 'Four scheduled draws',
    description:
      'The September Possibilities+ campaign concludes with four draws and year-long prize packages that may include lottery tickets, concert tickets or dining vouchers.',
    tournament: false,
  },
  {
    id: 'event-06',
    title: 'Live Music at Perfect Frame Club Belleville',
    category: 'Live music',
    badge: 'Weekly',
    dateLabel: 'Weekly · schedule varies',
    isoDate: '2026-09-26T20:00:00',
    timeLabel: 'Schedule varies',
    venue: 'Perfect Frame Club Belleville',
    detail: 'Local & guest performers',
    description:
      'Regular live music is part of the entertainment programme at Perfect Frame Club Belleville. The official Perfect Frame Club page describes performances by local and guest artists covering styles from soul and jazz to rock. The site currently identifies the programme as weekly without publishing one fixed performer or time for every date.',
    tournament: false,
  },
  {
    id: 'event-07',
    title: 'Great Canadian Slot Classic — Belleville',
    category: 'Tournament',
    dateLabel: 'Saturday 3 October',
    isoDate: '2026-10-03T15:00:00',
    timeLabel: '15:00 – 18:00',
    venue: 'Perfect Frame Club Belleville',
    detail: 'Quarter-final · Perfect Frame Club regional stage',
    description:
      'The regional tournament continues in Belleville with another three-hour competition session. Qualified Perfect Frame Club players compete for advancement toward the November semifinal at Pickering Resort.',
    format: 'Quarter-final · three-hour session',
    tournament: true,
  },
  {
    id: 'event-08',
    title: 'Great Canadian Slot Classic — Peterborough',
    category: 'Tournament',
    dateLabel: 'Saturday 17 October',
    isoDate: '2026-10-17T16:00:00',
    timeLabel: '16:00 – 19:00',
    venue: 'Perfect Frame Club Peterborough',
    detail: 'Quarter-final · final Perfect Frame Club stop',
    description:
      'Peterborough hosts the third listed Perfect Frame Club stage of the 2026 tournament series, completing the regional Perfect Frame Club schedule before the semifinal round at Pickering.',
    format: 'Quarter-final · final regional stage',
    tournament: true,
  },
  {
    id: 'event-09',
    title: 'Autumn Handicap Final',
    category: 'Tournament',
    badge: '4 seats left',
    dateLabel: 'Friday 2 October',
    isoDate: '2026-10-02T20:00:00',
    timeLabel: '20:00 – 23:00',
    venue: 'Table 1, Snooker Club · viewing area open',
    detail: 'Best of nine frames · referee in attendance',
    description:
      'The season’s handicap competition concludes with a best-of-nine final on Table 1. Club guests can follow the match from the viewing area, with the trophy presentation taking place after the final frame.',
    format: 'Best of nine frames · referee in attendance',
    tournament: true,
  },
  {
    id: 'event-10',
    title: 'Beginners’ Snooker Evening',
    category: 'Club night',
    badge: 'Beginner',
    dateLabel: 'Thursday 8 October',
    isoDate: '2026-10-08T19:00:00',
    timeLabel: '19:00 – 21:30',
    venue: 'Snooker Club · Tables 2–4',
    detail: 'Guided practice · friendly matches',
    description:
      'An easy-going club evening for players who are still learning the game. Practice basic scoring, positioning and safety play before joining short friendly frames with other beginners.',
    tournament: false,
  },
  {
    id: 'event-11',
    title: 'Perfect Frame Club Open Snooker Cup',
    category: 'Tournament',
    badge: 'Registration open',
    dateLabel: 'Saturday 24 October',
    isoDate: '2026-10-24T14:00:00',
    timeLabel: '14:00 – 20:00',
    venue: 'Snooker Club · Main Hall',
    detail: 'Knockout format · best of five frames',
    description:
      'A one-day club competition open to registered members. Players progress through a knockout bracket, with shorter early rounds leading to an evening final on the main table.',
    format: 'Knockout · best of five frames',
    tournament: true,
  },
  {
    id: 'event-12',
    title: 'Doubles Snooker Social',
    category: 'Social',
    badge: 'Doubles',
    dateLabel: 'Friday 6 November',
    isoDate: '2026-11-06T19:30:00',
    timeLabel: '19:30 – 22:30',
    venue: 'Snooker Club · Tables 1–4',
    detail: 'Teams of two · rotating opponents',
    description:
      'A relaxed doubles evening built around shorter frames and rotating matchups. Guests can join with a partner or register individually and be paired with another club member.',
    tournament: false,
  },
];

export const eventFilters = ['Upcoming', 'This month', 'Tournaments'] as const;
export type EventFilter = (typeof eventFilters)[number];

export function eventById(id: string): ClubEvent | undefined {
  return clubEvents.find(event => event.id === id);
}

const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;

export function startOfDay(reference = new Date()): number {
  return new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
  ).getTime();
}

export function isLiveNow(event: ClubEvent, reference = new Date()): boolean {
  const start = new Date(event.isoDate).getTime();
  const now = reference.getTime();
  return now >= start && now <= start + LIVE_WINDOW_MS;
}

export function filterEvents(filter: EventFilter, reference = new Date()): ClubEvent[] {
  const today = startOfDay(reference);

  const upcoming = clubEvents
    .filter(event => new Date(event.isoDate).getTime() >= today)
    .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());

  if (filter === 'Tournaments') {
    return upcoming.filter(event => event.tournament);
  }

  if (filter === 'This month') {
    return upcoming.filter(event => {
      const date = new Date(event.isoDate);
      return (
        date.getMonth() === reference.getMonth() && date.getFullYear() === reference.getFullYear()
      );
    });
  }

  return upcoming;
}

export interface EventDayGroup {
  key: string;
  label: string;
  data: ClubEvent[];
}

export function groupEventsByDay(events: ClubEvent[], reference = new Date()): EventDayGroup[] {
  const map = new Map<string, ClubEvent[]>();
  events.forEach(event => {
    const date = new Date(event.isoDate);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(event);
    } else {
      map.set(key, [event]);
    }
  });

  return Array.from(map.entries()).map(([key, data]) => {
    const date = new Date(data[0].isoDate);
    const sameDay =
      date.getDate() === reference.getDate() &&
      date.getMonth() === reference.getMonth() &&
      date.getFullYear() === reference.getFullYear();

    const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });

    return {
      key,
      label: sameDay ? `Today · ${weekday} ${day} ${month}` : `${weekday} ${day} ${month}`,
      data,
    };
  });
}

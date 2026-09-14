/**
 * Résumé data — the backbone of the "About me" half of the site.
 * ---------------------------------------------------------------------------
 * TIMELINE  : everything you have *done*, in reverse-chronological order.
 * HONORS    : everything you have been *given* — formal titles, awards,
 *             grants, selections, residencies.
 *
 * Dates use "YYYY-MM" (or "YYYY" for year-only). Leave `end` out to mean
 * "still ongoing".
 */

export type TimelineKind = 'work' | 'education' | 'project';

export interface TimelineEntry {
  id: string;
  kind: TimelineKind;
  /** "YYYY-MM" or "YYYY" */
  start: string;
  /** Omit for ongoing. */
  end?: string;
  title: string;
  org?: string;
  location?: string;
  /** One or two sentences. Rendered as plain text. */
  summary: string;
  /** Optional bullet list of concrete outcomes. */
  highlights?: string[];
  /** Must match tag slugs used in your articles if you want cross-links. */
  tags?: string[];
}

export interface Honor {
  id: string;
  year: string;
  title: string;
  issuer?: string;
  note?: string;
  /** A link to proof, if any (external). */
  href?: string;
}

export const timeline: TimelineEntry[] = [
  {
    id: 'independent-filmmaker',
    kind: 'work',
    start: '2022-04',
    title: 'Independent Documentary Filmmaker',
    org: 'Self-employed',
    location: 'Your City',
    summary:
      'Making short observational documentaries about people whose work is easy to overlook. Typically one film every four to six months, shot and cut alone on a two-person crew.',
    highlights: [
      'Completed four short films, two of which screened at regional festivals.',
      'Built a repeatable interview method: two visits before the camera comes out.',
      'Handle everything from research and consent paperwork to colour and sound mix.',
    ],
    tags: ['documentary', 'field-notes'],
  },
  {
    id: 'staff-writer',
    kind: 'work',
    start: '2019-03',
    end: '2022-03',
    title: 'Staff Writer',
    org: 'A Publication You Have Heard Of',
    location: 'Somewhere',
    summary:
      'Long-form features on labour, infrastructure and the people who keep both running. Roughly 40,000 words published a year across print and web.',
    highlights: [
      'Wrote the most-read feature of 2021, a 9,000-word piece on night-shift logistics.',
      'Ran the intern programme for two years and rewrote the style guide.',
    ],
    tags: ['essay', 'reportage'],
  },
  {
    id: 'freelance-reporter',
    kind: 'work',
    start: '2016-06',
    end: '2019-02',
    title: 'Freelance Reporter',
    org: 'Various',
    location: 'Several cities',
    summary:
      'Stringing for magazines and radio while learning to record sound properly. The years when I found out that the story is usually not where you think it is.',
    tags: ['reportage'],
  },
  {
    id: 'radio-producer',
    kind: 'project',
    start: '2015-01',
    end: '2016-05',
    title: 'Volunteer Radio Producer',
    org: 'Community Radio Station',
    location: 'Somewhere',
    summary:
      'Produced a weekly half-hour interview show, which is where I first learned that editing is really just listening twice.',
    tags: ['documentary'],
  },
  {
    id: 'ba-journalism',
    kind: 'education',
    start: '2011-09',
    end: '2015-06',
    title: 'BA, Journalism & Media Studies',
    org: 'Your University',
    location: 'Your City',
    summary:
      'Thesis on how local newspapers covered a factory closure, which is arguably where this whole site started.',
    tags: ['essay'],
  },
];

export const honors: Honor[] = [
  {
    id: 'festival-selection-2025',
    year: '2025',
    title: 'Official Selection — Short Documentary',
    issuer: 'A Regional Film Festival',
    note: 'For "The Last Shift" (18 min).',
  },
  {
    id: 'grant-2024',
    year: '2024',
    title: 'Documentary Production Grant',
    issuer: 'An Arts Foundation',
    note: 'One of twelve awards, supporting a year of fieldwork.',
  },
  {
    id: 'press-award-2021',
    year: '2021',
    title: 'Feature Writing Award, Runner-up',
    issuer: 'A Press Association',
    note: 'For reporting on night-shift workers.',
  },
  {
    id: 'residency-2018',
    year: '2018',
    title: 'Journalism Residency, 3 months',
    issuer: 'A University Research Centre',
    note: 'Focused on oral-history interviewing methods.',
  },
];

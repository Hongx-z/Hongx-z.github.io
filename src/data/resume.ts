/**
 * Résumé data — the backbone of the "About me" half of the site.
 * ---------------------------------------------------------------------------
 * TIMELINE  : everything you have *done*, in reverse-chronological order.
 * HONORS    : everything you have been *given* — formal titles, awards,
 *             grants, selections, residencies.
 *
 * Dates use "YYYY-MM" (or "YYYY" for year-only). Leave `end` out to mean
 * "still ongoing".
 *
 * `note` is a second, quieter line under an entry — somewhere to put a remark
 * in Chinese (中文备注) without disturbing the English summary above it. The
 * timeline is a place where a Chinese line often says more than a translated
 * one: an institution's own name, a title as it was actually held, what the
 * work was called at the time. Write it in whichever language the fact lives
 * in; the type is set for both.
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
  /**
   * Optional quieter line under the summary — the place for a Chinese remark
   * (中文备注) or a name in its original form. Rendered as plain text.
   */
  note?: string;
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
    id: 'unknown',
    kind: 'work',
    start: '2026',
    title: 'Independent Documentary Filmmaker',
    org: 'Self-employed',
    location: 'IDK',
    summary:
      'Making short observational documentaries about people whose work is easy to overlook. Typically one film every four to six months, shot and cut alone on a two-person crew.',
    note: '拍摄那些容易被忽略的职业与日常。基本独自完成拍摄与剪辑，一部短片约四到六个月。',
    highlights: [
      'TBC.',
      'TBC.',
      'TBC.',
    ],
    tags: ['documentary', 'field-notes'],
  },
  {
    id: 'writering',
    kind: 'work',
    start: '2026',
    end: '2025-06',
    title: 'Propaganda writer',
    org: 'still confidential',
    location: 'Nanjing, PRC China',
    summary:
      'Wrote hundreds of articles, including product introductions, project promotions, and popular science articles. Involved in events, coordinating with the media, and writing interview drafts',
    note: '南京 · 内容以产品介绍、项目推广与科普为主，同时参与活动执行、媒体对接与采访稿撰写。',
    highlights: [
      'Published in 2025: 3,600GW Green Installed Capacity: How Do Grid Digital Twins Underpin?',
      'TBC.',
    ],
    tags: ['essay', 'reportage'],
  },
  {
    id: 'software engineering',
    kind: 'work',
    start: '2025-06',
    end: '2023-06',
    title: 'Software designer',
    org: 'confidential',
    location: 'Nanjing, PRC China',
    summary:
      'Designed and developed data dashboards and a comprehensive management platform for standard data. Planned a data management foundation based on first principles. Abortion',
    note: '南京 · 负责数据看板与标准数据管理平台的设计与开发，并规划数据治理的底层结构。',
    tags: ['reportage'],
  },
  {
    id: 'statistics, data science',
    kind: 'education',
    start: '2021-09',
    end: '2022-11',
    title: 'Degree of Master of Science - Distinction',
    org: 'the University of Edinburgh',
    location: 'Edinburgh, Scotland',
    summary:
      'Thesis on ',
    note: '爱丁堡大学 · 统计学与数据科学，硕士，以 Distinction 毕业。',
    tags: ['essay'],
  },
  {
    id: 'data science',
    kind: 'education',
    start: '2018-07',
    end: '2021-08',
    title: 'Degree of Bachelor of Science - Dalyell scholar',
    org: 'the University of Sydney',
    location: 'Sydney, Australia',
    summary:
      'Thesis on ',
    note: '悉尼大学 · 数据科学，本科，Dalyell Scholar。',
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

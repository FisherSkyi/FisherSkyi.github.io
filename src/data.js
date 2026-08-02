// Content ported from the previous Jekyll site. Structure mirrors Letian.dc.html.
// Placeholder-free where possible — finetune copy here.

export const PAGES = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'writing', label: 'Writing' },
  { id: 'pubs', label: 'Publications' },
  { id: 'talks', label: 'Talks' },
  { id: 'work', label: 'Experience' },
  { id: 'gallery', label: 'Photography' },
  { id: 'misc', label: 'Miscellaneous' },
]

export const PROFILE = {
  name: 'Lester, Yu Letian',
  nameZh: '',
  tagline: 'National University of Singapore',
  prompt: '~/letian',
  socials: [
    { label: 'GitHub', href: 'https://github.com/FisherSkyi' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/letian-yu/' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=nFFolY0AAAAJ&hl=en' },
    { label: 'Email', href: 'mailto:yuletian@u.nus.edu' },
  ],
}

export const DATA = {
  about: {
    lede: 'Too young too simple, sometimes naïve.',
    paras: [
      "I'm a third-year Computer Science student at NUS (Singapore)",
      "I am interested in guitar, café and coding",
      "I speak Chinese, English and German (beginner level)"
    ],
  },
  facts: [
    { k: 'Focus', v: 'Systems + applied ML' },
    { k: 'Based in', v: 'Singapore' },
    { k: 'Studying', v: 'B.Comp. Computer Science, NUS' },
    { k: 'Languages', v: 'English · 中文 · Deutsch' },
  ],
  now: [
    'Extending the learning-to-defer framework to time-series data with bandit feedback.',
    'Teaching assistant for CS2030S Programming Methodology II (Java, OOP).',
    'Selected by NUS for an exchange programme to ETH Zürich.',
  ],
  projects: [
    {
      name: 'Soulless Knight',
      year: '2026',
      blurb:
        'iOS dungeon game built with a team for CS3217. ECS architecture; I owned the weapon and projectile systems and the command pattern for input. Won 86 votes for best project at NUS STePS.',
      stack: ['Swift', 'ECS', 'iOS'],
      href: 'https://cs3217-2526.github.io/group-project-dungeonCrawler/',
    },
    {
      name: 'SkyPeggle',
      year: '2025',
      blurb:
        'Solo Peggle-style iPad game with a bespoke physics engine. OBB collision, chain reactions, physics callbacks plus a level designer and persistent levels.',
      stack: ['Swift', 'UIKit', 'Physics'],
      href: 'https://drive.google.com/file/d/1O69BMAY5rIX0vHvJYiK-KcyPy9Ux6z6U/view?usp=sharing',
    },
    {
      name: 'RepoSense',
      year: '2026',
      blurb:
        'Contributor to RepoSense (NUS OSS, CS3281). Implemented glob-pattern file filtering across multiple repositories.',
      stack: ['Java', 'OSS', 'Gradle'],
      href: 'https://github.com/reposense/RepoSense/pull/2526/changes',
    },
    {
      name: 'SoCTAssist',
      year: '2025',
      blurb:
        'Team tool for CS2103T that helps undergraduate TAs manage tasks.',
      stack: ['Java', 'JavaFX'],
      href: 'https://github.com/AY2526S1-CS2103T-W11-1/tp',
    },
    {
      name: 'pOpOp',
      year: '2026',
      blurb:
        'Chrome extension built at NUS Hack&Roll 2026. Uses MediaPipe gesture detection so you can control the browser without a mouse or keyboard.',
      stack: ['JS', 'MediaPipe', 'Chrome'],
      href: 'https://github.com/wuliyq/pOpOp',
    },
    {
      name: 'Seb',
      year: '2025',
      blurb: 'A task-tracking chatbot built as an independent project for CS2103T Software Engineering.',
      stack: ['Java', 'CLI'],
      href: 'https://fisherskyi.github.io/ip/',
    },
  ],
  posts: [
    {
      date: '2026-01',
      title: 'Adversarially Robust Learning-to-Defer accepted to AISTATS 2026',
      sub: 'Our paper on robust L2D for classification and regression was accepted.',
      href: 'https://arxiv.org/abs/2510.10988',
    },
    {
      date: '2025-10',
      title: 'Preprint: Adversarial robustness in one-stage learning-to-defer',
      sub: 'Now available on arXiv.',
      href: 'https://arxiv.org/abs/2510.10988',
    },
    {
      date: '2025-09',
      title: 'AR(1) process and its properties',
      sub: 'A brief note on the AR(1) process and its key properties.',
      href: '/assets/files/TSA4__Problem_3_2-1.pdf',
    },
  ],
  pubs: [
    {
      title: 'Learning-to-Defer in Non-Stationary Time Series via Switching State-Space Models',
      authors: 'Montreuil, Y., Yu, L., et al.',
      venue: 'Preprint · arXiv 2601.22538',
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2601.22538' },
      ],
    },
    {
      title: 'Adversarially Robust Learning-to-Defer for Classification and Regression',
      authors: 'Yu, L., Montreuil, Y., et al.',
      venue: 'AISTATS 2026 · arXiv 2510.10988',
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2510.10988' }],
    },
    {
      title: 'Road Sign Classification with a Denoising Pipeline Approach',
      authors: 'Yu, L., Sun, Y., Zhang, J., Liu, H., Hu, Z.',
      venue: 'ICoIAS 2025',
      links: [
        { label: 'paper', href: 'https://ieeexplore.ieee.org/document/11450091' },
        { label: 'code', href: 'https://github.com/FisherSkyi/classify_denoise_SwinIR' }
      ],
    },
  ],
  talks: [
    { date: '2026-04', title: 'Introduction to MCP (Model Context Protocol)', where: 'NUS · CS3281 Software Engineering' },
  ],
  roles: [
    {
      when: 'May 2026 - Aug 2026',
      role: 'Software Engineer Intern',
      org: 'AICET, NUS',
      what: 'Built a full-stack applicant tracking system that streamlined recruitment workflows.',
    },
    {
      when: '2025 — 2026',
      role: 'Undergraduate research',
      org: 'NUS School of Computing',
      what: 'Fortunated to research learning-to-defer with Yannis (NUS & CNRS).',
    },
    {
      when: 'AY25/26 S2',
      role: 'Teaching assistant · CS2030S Programming Methodology II',
      org: 'NUS School of Computing · Object-Oriented Programming in Java',
      what: 'Grading and giving feedback to student. Running the labs. Student feedback report 4.5/5.0',
    },
    {
      when: 'AY25/26 S1',
      role: 'Teaching assistant · CS1101S Programming Methodology I',
      org: 'NUS School of Computing · Functional programming (SICP)',
      what: 'Led weekly tutorials and consultations.',
    },
    {
      when: '2024 — 2028',
      role: "B.Comp. Computer Science (Hons)",
      org: 'National University of Singapore',
      what: "Dean's list in AY24/25 S1 and AY25/26 S1. Top student in CS2109S.",
    },
  ],
  misc: [
    {
      title: 'Hacker News',
      description: 'A social news website focusing on computer science and entrepreneurship.',
      hostname: 'news.ycombinator.com',
      href: 'https://news.ycombinator.com/',
    },
    {
      title: 'The Unknown Thing',
      description: 'My friend\'s blog',
      hostname: 'theunknownth.ing',
      href: 'https://theunknownth.ing/',
    },
    {
      title: 'NUS School of Computing',
      description: 'Where I study Computer Science.',
      hostname: 'comp.nus.edu.sg',
      href: 'https://www.comp.nus.edu.sg/',
    },
    {
      title: 'ETH Zürich',
      description: 'Where I will be on exchange in AY26/27 S2.',
      hostname: 'inf.ethz.ch',
      href: 'https://inf.ethz.ch/',
    },
    {
      title: 'VisuAlgo',
      description: 'A visualisation tool for algorithms and data structures.',
      hostname: 'visualgo.net',
      href: 'https://visualgo.net/en',
    }
  ],
  photos: [
    { src: '/assets/images/hangzhou.JPG', caption: 'Hangzhou' },
    { src: '/assets/images/coffee.JPG', caption: 'Coffee' },
    { src: '/assets/images/guitar-of-Tsien-Hsue-shen.JPG', caption: 'Guitar of Tsien Hsue-shen' },
    { src: '/assets/images/singapore.JPG', caption: 'Singapore' },
    { src: '/assets/images/hkust.JPG', caption: 'HKUST' },
    { src: '/assets/images/utown.JPG', caption: 'UTown, NUS' },
  ],
}

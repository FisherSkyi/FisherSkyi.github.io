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
      "I'm a third-year Computer Science student at NUS working across systems, interfaces, and applied machine learning. My research is in selective prediction (learning-to-defer), human–AI collaboration, decision theory, and risk minimization — where the hard part isn't the model, it's making the result legible to a person who has to act on it.",
      "I've shipped features into open-source projects, built games with their own engines, and taught programming to two cohorts of NUS students. I'm always happy to talk about research, teaching, or a good systems problem.",
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
      name: 'RepoSense',
      year: '2026',
      blurb:
        'Contributor to RepoSense (NUS OSS, CS3281). Implemented glob-pattern file filtering across multiple repositories — a significant UX improvement for tracking changes.',
      stack: ['Java', 'OSS', 'Gradle'],
      href: 'https://github.com/reposense/RepoSense/pull/2526/changes',
    },
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
        'Solo Peggle-style iPad game with a bespoke physics engine — circle–OBB collision, chain reactions, physics callbacks — plus a level designer and persistent JSON levels.',
      stack: ['Swift', 'UIKit', 'Physics'],
      href: 'https://drive.google.com/file/d/1O69BMAY5rIX0vHvJYiK-KcyPy9Ux6z6U/view?usp=sharing',
    },
    {
      name: 'SoCTAssist',
      year: '2025',
      blurb:
        'Team tool for CS2103T that helps undergraduate TAs manage tasks — task tracking and scheduling behind a friendly interface.',
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
      sub: 'Our paper on robust L2D for classification and regression was accepted — looking forward to presenting.',
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
      title: 'L2D in Time Series',
      authors: 'Yu, L., Montreuil, Y.',
      venue: 'Preprint · arXiv 2601.22538',
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2601.22538' },
        { label: 'code', href: 'https://github.com/yannismontreuil/Time_Series_L2D' },
      ],
    },
    {
      title: 'Adversarially Robust Learning-to-Defer for Classification and Regression',
      authors: 'Montreuil, Y., Yu, L., et al.',
      venue: 'AISTATS 2026 · arXiv 2510.10988',
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2510.10988' }],
    },
    {
      title: 'Road Sign Classification with a Denoising Pipeline Approach',
      authors: 'Yu, L., Sun, Y., Zhang, J., Liu, H., Hu, Z.',
      venue: 'ICoIAS 2025',
      links: [{ label: 'code', href: 'https://github.com/FisherSkyi/classify_denoise_SwinIR' }],
    },
  ],
  talks: [
    { date: '2026-04', title: 'Introduction to MCP (Model Context Protocol)', where: 'NUS · CS3281 Software Engineering' },
  ],
  roles: [
    {
      when: '2025 — now',
      role: 'Undergraduate research assistant',
      org: 'NUS School of Computing',
      what: 'Learning-to-defer research with Yannis Montreuil (NUS & CNRS): extending the L2D framework to time series and adversarial robustness.',
    },
    {
      when: 'AY25/26 S2',
      role: 'Teaching assistant · CS2030S Programming Methodology II',
      org: 'NUS · Object-Oriented Programming in Java',
      what: 'Preparing lab materials (quizzes, slides, help sheets) and leading sessions for the upcoming semester.',
    },
    {
      when: 'AY25/26 S1',
      role: 'Teaching assistant · CS1101S Programming Methodology I',
      org: 'NUS · Functional programming (SICP JS)',
      what: 'Led weekly tutorials and consultations, using problem sets and live coding to reinforce core concepts.',
    },
    {
      when: '2023 — now',
      role: "B.Comp. Computer Science · Dean's List, Top Student (CS2103T, top 1.6%)",
      org: 'National University of Singapore',
      what: "Coursework across systems, software engineering, and machine learning. Dean's List AY24/25 S1 and AY25/26 S1.",
    },
  ],
}

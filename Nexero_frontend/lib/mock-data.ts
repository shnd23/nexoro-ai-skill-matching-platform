import { User, Skill, GigRequest, Match, UserSkill } from './types';

export const SKILLS: Skill[] = [
  { id: 's1', name: 'React' },
  { id: 's2', name: 'TypeScript' },
  { id: 's3', name: 'Python' },
  { id: 's4', name: 'UI Design' },
  { id: 's5', name: 'Node.js' },
  { id: 's6', name: 'Data Analysis' },
  { id: 's7', name: 'Machine Learning' },
  { id: 's8', name: 'GraphQL' },
  { id: 's9', name: 'Docker' },
  { id: 's10', name: 'AWS' },
  { id: 's11', name: 'Figma' },
  { id: 's12', name: 'PostgreSQL' },
  { id: 's13', name: 'Next.js' },
  { id: 's14', name: 'Tailwind CSS' },
  { id: 's15', name: 'Rust' },
  { id: 's16', name: 'Go' },
  { id: 's17', name: 'Swift' },
  { id: 's18', name: 'Flutter' },
  { id: 's19', name: 'DevOps' },
  { id: 's20', name: 'Blockchain' },
  { id: 's21', name: 'Video Editing' },
  { id: 's22', name: 'Copywriting' },
  { id: 's23', name: 'SEO' },
  { id: 's24', name: 'Mobile Development' },
  { id: 's25', name: 'API Design' },
];

function sk(skillId: string, level?: 'Beginner' | 'Intermediate' | 'Expert'): UserSkill {
  const skill = SKILLS.find(s => s.id === skillId)!;
  return { skillId, skill, proficiencyLevel: level };
}

export const USERS: User[] = [
  {
    id: 'u1', email: 'alex.chen@mail.com', displayName: 'Alex Chen',
    bio: 'Full-stack developer specializing in React ecosystems and cloud architecture. 5 years building scalable web apps.',
    avatarUrl: '', createdAt: '2025-11-01T10:00:00Z',
    skillsOffered: [sk('s1', 'Expert'), sk('s2', 'Expert'), sk('s5', 'Expert'), sk('s13', 'Expert'), sk('s10', 'Intermediate')],
  },
  {
    id: 'u2', email: 'priya.sharma@mail.com', displayName: 'Priya Sharma',
    bio: 'ML engineer & data scientist. Passionate about NLP, recommender systems, and making AI accessible.',
    avatarUrl: '', createdAt: '2025-11-05T12:00:00Z',
    skillsOffered: [sk('s3', 'Expert'), sk('s7', 'Expert'), sk('s6', 'Expert'), sk('s12', 'Intermediate')],
  },
  {
    id: 'u3', email: 'jordan.williams@mail.com', displayName: 'Jordan Williams',
    bio: 'UI/UX designer with a love for clean interfaces and motion design. Figma enthusiast.',
    avatarUrl: '', createdAt: '2025-11-10T09:00:00Z',
    skillsOffered: [sk('s4', 'Expert'), sk('s11', 'Expert'), sk('s14', 'Expert'), sk('s1', 'Beginner')],
  },
  {
    id: 'u4', email: 'maria.rodriguez@mail.com', displayName: 'Maria Rodriguez',
    bio: 'Backend engineer focused on microservices, API design, and database optimization.',
    avatarUrl: '', createdAt: '2025-11-15T14:00:00Z',
    skillsOffered: [sk('s5', 'Expert'), sk('s12', 'Expert'), sk('s9', 'Expert'), sk('s25', 'Expert'), sk('s8', 'Intermediate')],
  },
  {
    id: 'u5', email: 'sam.okafor@mail.com', displayName: 'Sam Okafor',
    bio: 'DevOps & cloud infrastructure specialist. Automating everything from CI/CD to container orchestration.',
    avatarUrl: '', createdAt: '2025-12-01T08:00:00Z',
    skillsOffered: [sk('s9', 'Expert'), sk('s10', 'Expert'), sk('s19', 'Expert'), sk('s16', 'Intermediate')],
  },
  {
    id: 'u6', email: 'luna.nakamura@mail.com', displayName: 'Luna Nakamura',
    bio: 'Creative frontend developer blending design and code. Specializing in interactive experiences.',
    avatarUrl: '', createdAt: '2025-12-05T11:00:00Z',
    skillsOffered: [sk('s1', 'Expert'), sk('s14', 'Expert'), sk('s13', 'Expert'), sk('s2', 'Intermediate'), sk('s4', 'Intermediate')],
  },
  {
    id: 'u7', email: 'david.mueller@mail.com', displayName: 'David Mueller',
    bio: 'Mobile developer building native iOS and cross-platform apps. Swift and Flutter.',
    avatarUrl: '', createdAt: '2025-12-10T16:00:00Z',
    skillsOffered: [sk('s17', 'Expert'), sk('s18', 'Expert'), sk('s24', 'Expert'), sk('s2', 'Intermediate')],
  },
  {
    id: 'u8', email: 'aisha.khan@mail.com', displayName: 'Aisha Khan',
    bio: 'Content strategist & copywriter. Helping startups tell their story and grow their audience.',
    avatarUrl: '', createdAt: '2025-12-15T13:00:00Z',
    skillsOffered: [sk('s22', 'Expert'), sk('s23', 'Expert'), sk('s4', 'Beginner')],
  },
  {
    id: 'u9', email: 'ryan.brooks@mail.com', displayName: 'Ryan Brooks',
    bio: 'Blockchain developer and Web3 enthusiast. Building the decentralized future.',
    avatarUrl: '', createdAt: '2025-12-20T10:00:00Z',
    skillsOffered: [sk('s20', 'Expert'), sk('s15', 'Expert'), sk('s2', 'Expert'), sk('s5', 'Intermediate')],
  },
  {
    id: 'u10', email: 'emma.larsson@mail.com', displayName: 'Emma Larsson',
    bio: 'Full-stack TypeScript developer. React + Node.js + PostgreSQL. Building SaaS products.',
    avatarUrl: '', createdAt: '2026-01-05T09:00:00Z',
    skillsOffered: [sk('s1', 'Expert'), sk('s2', 'Expert'), sk('s5', 'Expert'), sk('s12', 'Expert'), sk('s13', 'Intermediate')],
  },
  {
    id: 'u11', email: 'kai.tanaka@mail.com', displayName: 'Kai Tanaka',
    bio: 'Systems programmer and performance enthusiast. Rust and Go for high-throughput services.',
    avatarUrl: '', createdAt: '2026-01-10T15:00:00Z',
    skillsOffered: [sk('s15', 'Expert'), sk('s16', 'Expert'), sk('s9', 'Intermediate'), sk('s19', 'Intermediate')],
  },
  {
    id: 'u12', email: 'sofia.petrov@mail.com', displayName: 'Sofia Petrov',
    bio: 'Data analyst turned ML engineer. Python, SQL, and visualization expert.',
    avatarUrl: '', createdAt: '2026-01-15T11:00:00Z',
    skillsOffered: [sk('s3', 'Expert'), sk('s6', 'Expert'), sk('s12', 'Expert'), sk('s7', 'Intermediate')],
  },
  {
    id: 'u13', email: 'marcus.james@mail.com', displayName: 'Marcus James',
    bio: 'Video editor and multimedia creator. Turning raw footage into polished content.',
    avatarUrl: '', createdAt: '2026-01-20T14:00:00Z',
    skillsOffered: [sk('s21', 'Expert'), sk('s4', 'Intermediate')],
  },
  {
    id: 'u14', email: 'nina.vasquez@mail.com', displayName: 'Nina Vasquez',
    bio: 'GraphQL advocate and API architect. Making data access elegant and efficient.',
    avatarUrl: '', createdAt: '2026-02-01T10:00:00Z',
    skillsOffered: [sk('s8', 'Expert'), sk('s25', 'Expert'), sk('s5', 'Expert'), sk('s2', 'Expert')],
  },
  {
    id: 'u15', email: 'tom.anderson@mail.com', displayName: 'Tom Anderson',
    bio: 'Product-minded engineer. React, Next.js, and a keen eye for UX. Previously at two YC startups.',
    avatarUrl: '', createdAt: '2026-02-10T08:00:00Z',
    skillsOffered: [sk('s1', 'Expert'), sk('s13', 'Expert'), sk('s2', 'Expert'), sk('s14', 'Expert'), sk('s4', 'Beginner')],
  },
  {
    id: 'u16', email: 'zara.ahmed@mail.com', displayName: 'Zara Ahmed',
    bio: 'AWS solutions architect. Designing resilient, cost-effective cloud infrastructure at scale.',
    avatarUrl: '', createdAt: '2026-02-15T12:00:00Z',
    skillsOffered: [sk('s10', 'Expert'), sk('s9', 'Expert'), sk('s19', 'Expert'), sk('s5', 'Intermediate')],
  },
  {
    id: 'u17', email: 'leo.fischer@mail.com', displayName: 'Leo Fischer',
    bio: 'Flutter developer crafting beautiful cross-platform mobile experiences. UI polish is everything.',
    avatarUrl: '', createdAt: '2026-03-01T09:00:00Z',
    skillsOffered: [sk('s18', 'Expert'), sk('s24', 'Expert'), sk('s4', 'Intermediate'), sk('s11', 'Intermediate')],
  },
  {
    id: 'u18', email: 'chloe.park@mail.com', displayName: 'Chloe Park',
    bio: 'SEO specialist and growth hacker. Data-driven strategies to boost organic traffic.',
    avatarUrl: '', createdAt: '2026-03-10T13:00:00Z',
    skillsOffered: [sk('s23', 'Expert'), sk('s22', 'Intermediate'), sk('s6', 'Intermediate')],
  },
  {
    id: 'u19', email: 'omar.hassan@mail.com', displayName: 'Omar Hassan',
    bio: 'Python developer and automation wizard. Building tools that save teams hours every day.',
    avatarUrl: '', createdAt: '2026-03-15T10:00:00Z',
    skillsOffered: [sk('s3', 'Expert'), sk('s9', 'Intermediate'), sk('s19', 'Intermediate'), sk('s6', 'Intermediate')],
  },
  {
    id: 'u20', email: 'ivy.wright@mail.com', displayName: 'Ivy Wright',
    bio: 'Design systems thinker. Bridging design and engineering with component libraries and style guides.',
    avatarUrl: '', createdAt: '2026-04-01T11:00:00Z',
    skillsOffered: [sk('s4', 'Expert'), sk('s11', 'Expert'), sk('s1', 'Intermediate'), sk('s14', 'Expert'), sk('s2', 'Intermediate')],
  },
];

export const GIG_REQUESTS: GigRequest[] = [
  {
    id: 'g1', authorId: 'u2', author: USERS[1],
    title: 'Build a React dashboard for ML model metrics',
    description: 'Need an experienced React developer to build an interactive dashboard that visualizes ML model performance metrics. Should include real-time charts, data tables, and export functionality. The backend API is already built in Python.',
    status: 'Open', budget: 2500, timeframe: '2 weeks',
    createdAt: '2026-07-20T10:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[1], SKILLS[12]],
  },
  {
    id: 'g2', authorId: 'u1', author: USERS[0],
    title: 'Design a mobile-first onboarding flow',
    description: 'Looking for a UI/UX designer to create a modern, engaging onboarding experience for our SaaS app. Should feel premium with smooth animations and clear user guidance. Figma deliverables expected.',
    status: 'Open', budget: 1800, timeframe: '1 week',
    createdAt: '2026-07-21T14:00:00Z',
    requiredSkills: [SKILLS[3], SKILLS[10]],
  },
  {
    id: 'g3', authorId: 'u3', author: USERS[2],
    title: 'Set up CI/CD pipeline with Docker + AWS',
    description: 'Our startup needs a robust CI/CD pipeline. We use GitHub Actions, Docker, and deploy to AWS ECS. Need someone to set up the infrastructure, write the workflows, and document everything.',
    status: 'Open', budget: 3000, timeframe: '3-5 days',
    createdAt: '2026-07-22T09:00:00Z',
    requiredSkills: [SKILLS[8], SKILLS[9], SKILLS[18]],
  },
  {
    id: 'g4', authorId: 'u5', author: USERS[4],
    title: 'Python data pipeline for analytics',
    description: 'Need a Python developer to build an ETL pipeline that ingests data from multiple APIs, transforms it, and loads it into PostgreSQL. Should include error handling, logging, and scheduling.',
    status: 'Open', budget: 2000, timeframe: '10 days',
    createdAt: '2026-07-23T11:00:00Z',
    requiredSkills: [SKILLS[2], SKILLS[11], SKILLS[5]],
  },
  {
    id: 'g5', authorId: 'u4', author: USERS[3],
    title: 'Build a GraphQL API layer',
    description: 'We have a REST API and want to add a GraphQL layer on top for our frontend team. Need someone experienced with schema design, resolvers, and performance optimization.',
    status: 'Open', budget: 2200, timeframe: '2 weeks',
    createdAt: '2026-07-24T16:00:00Z',
    requiredSkills: [SKILLS[7], SKILLS[4], SKILLS[1]],
  },
  {
    id: 'g6', authorId: 'u8', author: USERS[7],
    title: 'Create a brand identity & landing page design',
    description: 'Early-stage startup looking for a designer to create our visual brand identity (logo, color palette, typography) and design a high-converting landing page in Figma.',
    status: 'Open', budget: 3500, timeframe: '2 weeks',
    createdAt: '2026-07-25T10:00:00Z',
    requiredSkills: [SKILLS[3], SKILLS[10]],
  },
  {
    id: 'g7', authorId: 'u7', author: USERS[6],
    title: 'Build a recommendation engine in Python',
    description: 'Need an ML engineer to build a content recommendation system. Should use collaborative filtering + content-based hybrid approach. Data is in PostgreSQL, model should be servable via FastAPI.',
    status: 'Open', budget: 4000, timeframe: '3 weeks',
    createdAt: '2026-07-26T13:00:00Z',
    requiredSkills: [SKILLS[2], SKILLS[6], SKILLS[11]],
  },
  {
    id: 'g8', authorId: 'u10', author: USERS[9],
    title: 'Implement real-time chat with WebSockets',
    description: 'Add real-time messaging to our platform. Need WebSocket server (Node.js), message persistence, typing indicators, read receipts, and a clean React chat UI.',
    status: 'Open', budget: 2800, timeframe: '2 weeks',
    createdAt: '2026-07-27T08:00:00Z',
    requiredSkills: [SKILLS[4], SKILLS[0], SKILLS[1]],
  },
  {
    id: 'g9', authorId: 'u6', author: USERS[5],
    title: 'Write blog content about web development trends',
    description: 'Looking for a technical copywriter to produce 8-10 blog posts about modern web development. Topics include React Server Components, edge computing, AI-assisted coding, and more.',
    status: 'Open', budget: 1200, timeframe: '1 month',
    createdAt: '2026-07-28T15:00:00Z',
    requiredSkills: [SKILLS[21], SKILLS[22]],
  },
  {
    id: 'g10', authorId: 'u9', author: USERS[8],
    title: 'Smart contract audit & optimization',
    description: 'We have a set of Solidity smart contracts that need a thorough security audit and gas optimization. Experience with DeFi protocols preferred.',
    status: 'Open', budget: 5000, timeframe: '1 week',
    createdAt: '2026-07-29T10:00:00Z',
    requiredSkills: [SKILLS[19], SKILLS[14]],
  },
  {
    id: 'g11', authorId: 'u12', author: USERS[11],
    title: 'Build a cross-platform fitness app',
    description: 'Looking for a Flutter developer to build a fitness tracking app. Features: workout logging, progress charts, social sharing, and Apple Health/Google Fit integration.',
    status: 'Open', budget: 6000, timeframe: '1 month',
    createdAt: '2026-07-30T09:00:00Z',
    requiredSkills: [SKILLS[17], SKILLS[23], SKILLS[3]],
  },
  {
    id: 'g12', authorId: 'u15', author: USERS[14],
    title: 'PostgreSQL performance tuning',
    description: 'Our PostgreSQL database is struggling with complex queries at scale. Need someone to analyze query plans, add proper indexes, optimize schema, and set up monitoring.',
    status: 'Open', budget: 1500, timeframe: '3 days',
    createdAt: '2026-07-31T11:00:00Z',
    requiredSkills: [SKILLS[11], SKILLS[5]],
  },
  {
    id: 'g13', authorId: 'u11', author: USERS[10],
    title: 'Build a Tailwind component library',
    description: 'Create a reusable React + Tailwind component library with Storybook documentation. Should include buttons, forms, cards, modals, tables, and navigation components.',
    status: 'Matched', budget: 3000, timeframe: '3 weeks',
    createdAt: '2026-08-01T14:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[1], SKILLS[13]],
  },
  {
    id: 'g14', authorId: 'u13', author: USERS[12],
    title: 'Edit promotional videos for product launch',
    description: 'We have raw footage from our product photoshoot. Need a video editor to create 3 promotional videos: a 60-second hero video, a 30-second social clip, and a 15-second teaser.',
    status: 'Open', budget: 800, timeframe: '5 days',
    createdAt: '2026-08-02T10:00:00Z',
    requiredSkills: [SKILLS[20]],
  },
  {
    id: 'g15', authorId: 'u16', author: USERS[15],
    title: 'Migrate monolith to microservices on AWS',
    description: 'Help us break apart a Node.js monolith into microservices. Need architecture guidance, container setup, service mesh, and deployment automation on AWS ECS/EKS.',
    status: 'Open', budget: 8000, timeframe: '6 weeks',
    createdAt: '2026-08-03T09:00:00Z',
    requiredSkills: [SKILLS[4], SKILLS[8], SKILLS[9], SKILLS[18]],
  },
  {
    id: 'g16', authorId: 'u14', author: USERS[13],
    title: 'Next.js e-commerce storefront',
    description: 'Build a modern e-commerce frontend with Next.js App Router. Server-side rendering, dynamic product pages, cart, checkout flow, and Stripe integration.',
    status: 'Open', budget: 4500, timeframe: '4 weeks',
    createdAt: '2026-08-04T12:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[12], SKILLS[1], SKILLS[13]],
  },
  {
    id: 'g17', authorId: 'u18', author: USERS[17],
    title: 'iOS app for event management',
    description: 'Build a native iOS app for managing local community events. Features: event creation, RSVP, push notifications, map view, and social sharing.',
    status: 'Open', budget: 5500, timeframe: '5 weeks',
    createdAt: '2026-08-05T10:00:00Z',
    requiredSkills: [SKILLS[16], SKILLS[23]],
  },
  {
    id: 'g18', authorId: 'u17', author: USERS[16],
    title: 'SEO audit and content optimization',
    description: 'Need an SEO expert to audit our SaaS website, identify keyword opportunities, optimize existing content, and create a 3-month content strategy for organic growth.',
    status: 'Open', budget: 1500, timeframe: '1 week',
    createdAt: '2026-08-06T14:00:00Z',
    requiredSkills: [SKILLS[22], SKILLS[21]],
  },
  {
    id: 'g19', authorId: 'u20', author: USERS[19],
    title: 'Build a Go microservice for payment processing',
    description: 'Need a Go developer to build a high-performance payment processing microservice. Must handle webhooks from Stripe, manage transaction state, and integrate with our existing Node.js API.',
    status: 'Open', budget: 3500, timeframe: '2 weeks',
    createdAt: '2026-08-07T09:00:00Z',
    requiredSkills: [SKILLS[15], SKILLS[24], SKILLS[8]],
  },
  {
    id: 'g20', authorId: 'u19', author: USERS[18],
    title: 'Design system implementation in React',
    description: 'We have a Figma design system and need it implemented as a React component library. Token-based theming, accessibility, and comprehensive Storybook docs required.',
    status: 'Open', budget: 4000, timeframe: '3 weeks',
    createdAt: '2026-08-08T11:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[1], SKILLS[3], SKILLS[13]],
  },
  {
    id: 'g21', authorId: 'u1', author: USERS[0],
    title: 'ML model deployment pipeline',
    description: 'Need help containerizing ML models and building an inference pipeline. Models are in PyTorch, should be served via FastAPI with Docker, deployed to AWS.',
    status: 'Open', budget: 3000, timeframe: '2 weeks',
    createdAt: '2026-08-09T08:00:00Z',
    requiredSkills: [SKILLS[2], SKILLS[6], SKILLS[8], SKILLS[9]],
  },
  {
    id: 'g22', authorId: 'u3', author: USERS[2],
    title: 'API documentation with OpenAPI/Swagger',
    description: 'Document our REST API using OpenAPI spec. Need interactive Swagger UI, example requests/responses, authentication docs, and error code reference.',
    status: 'Open', budget: 900, timeframe: '4 days',
    createdAt: '2026-08-09T15:00:00Z',
    requiredSkills: [SKILLS[24], SKILLS[4]],
  },
  {
    id: 'g23', authorId: 'u6', author: USERS[5],
    title: 'Rust CLI tool for file processing',
    description: 'Build a CLI tool in Rust that batch-processes large CSV files. Should support filtering, aggregation, and output to multiple formats. Performance is critical.',
    status: 'Open', budget: 2000, timeframe: '10 days',
    createdAt: '2026-08-10T10:00:00Z',
    requiredSkills: [SKILLS[14]],
  },
  {
    id: 'g24', authorId: 'u10', author: USERS[9],
    title: 'Figma to React component conversion',
    description: 'We have 40+ components designed in Figma. Need pixel-perfect React implementations with Tailwind CSS. Must be responsive and accessible.',
    status: 'Open', budget: 2500, timeframe: '2 weeks',
    createdAt: '2026-08-10T14:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[13], SKILLS[3], SKILLS[10]],
  },
  {
    id: 'g25', authorId: 'u4', author: USERS[3],
    title: 'Data visualization dashboard in Python',
    description: 'Build an interactive data visualization dashboard using Plotly Dash. Should connect to our PostgreSQL database and display real-time analytics with filters and drill-downs.',
    status: 'Open', budget: 2200, timeframe: '2 weeks',
    createdAt: '2026-08-11T09:00:00Z',
    requiredSkills: [SKILLS[2], SKILLS[5], SKILLS[11]],
  },
  {
    id: 'g26', authorId: 'u15', author: USERS[14],
    title: 'Flutter app for food delivery startup',
    description: 'Build the customer-facing Flutter app for a food delivery startup. Features: restaurant browsing, menu ordering, real-time order tracking, and payment integration.',
    status: 'Matched', budget: 7000, timeframe: '6 weeks',
    createdAt: '2026-08-11T12:00:00Z',
    requiredSkills: [SKILLS[17], SKILLS[23], SKILLS[3]],
  },
  {
    id: 'g27', authorId: 'u8', author: USERS[7],
    title: 'Technical blog ghostwriting',
    description: 'Need a technical writer who understands Python and ML to ghostwrite a series of blog posts explaining machine learning concepts to a business audience.',
    status: 'Open', budget: 1500, timeframe: '3 weeks',
    createdAt: '2026-08-11T16:00:00Z',
    requiredSkills: [SKILLS[21], SKILLS[2]],
  },
  {
    id: 'g28', authorId: 'u9', author: USERS[8],
    title: 'Kubernetes cluster setup and management',
    description: 'Set up a production-grade Kubernetes cluster on AWS (EKS). Need service mesh, monitoring (Prometheus + Grafana), log aggregation, and auto-scaling configuration.',
    status: 'Open', budget: 4500, timeframe: '2 weeks',
    createdAt: '2026-08-12T08:00:00Z',
    requiredSkills: [SKILLS[8], SKILLS[9], SKILLS[18]],
  },
  {
    id: 'g29', authorId: 'u12', author: USERS[11],
    title: 'React Native app for habit tracking',
    description: 'Build a habit tracking mobile app with React Native. Features: daily habit checklist, streak tracking, statistics, reminders, and a beautiful dark mode UI.',
    status: 'Open', budget: 3500, timeframe: '3 weeks',
    createdAt: '2026-08-12T09:00:00Z',
    requiredSkills: [SKILLS[0], SKILLS[1], SKILLS[23]],
  },
  {
    id: 'g30', authorId: 'u20', author: USERS[19],
    title: 'Machine learning model for sentiment analysis',
    description: 'Build a sentiment analysis model for product reviews. Should handle multi-language text, output sentiment scores, and be deployable as a REST API.',
    status: 'Open', budget: 2800, timeframe: '2 weeks',
    createdAt: '2026-08-12T10:00:00Z',
    requiredSkills: [SKILLS[2], SKILLS[6]],
  },
];

export const MATCHES: Match[] = [
  {
    id: 'm1', gigRequestId: 'g1', gigRequest: GIG_REQUESTS[0],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.94, status: 'Suggested', createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'm2', gigRequestId: 'g5', gigRequest: GIG_REQUESTS[4],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.87, status: 'Suggested', createdAt: '2026-08-10T13:00:00Z',
  },
  {
    id: 'm3', gigRequestId: 'g8', gigRequest: GIG_REQUESTS[7],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.91, status: 'Suggested', createdAt: '2026-08-10T14:00:00Z',
  },
  {
    id: 'm4', gigRequestId: 'g13', gigRequest: GIG_REQUESTS[12],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.96, status: 'Accepted', createdAt: '2026-08-10T15:00:00Z',
  },
  {
    id: 'm5', gigRequestId: 'g16', gigRequest: GIG_REQUESTS[15],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.93, status: 'Suggested', createdAt: '2026-08-10T16:00:00Z',
  },
  {
    id: 'm6', gigRequestId: 'g20', gigRequest: GIG_REQUESTS[19],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.88, status: 'Suggested', createdAt: '2026-08-11T09:00:00Z',
  },
  {
    id: 'm7', gigRequestId: 'g24', gigRequest: GIG_REQUESTS[23],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.90, status: 'Suggested', createdAt: '2026-08-11T10:00:00Z',
  },

  {
    id: 'm8', gigRequestId: 'g2', gigRequest: GIG_REQUESTS[1],
    candidateUserId: 'u3', candidateUser: USERS[2],
    score: 0.95, status: 'Suggested', createdAt: '2026-08-10T12:30:00Z',
  },
  {
    id: 'm9', gigRequestId: 'g2', gigRequest: GIG_REQUESTS[1],
    candidateUserId: 'u20', candidateUser: USERS[19],
    score: 0.89, status: 'Suggested', createdAt: '2026-08-10T12:30:00Z',
  },
  {
    id: 'm10', gigRequestId: 'g3', gigRequest: GIG_REQUESTS[2],
    candidateUserId: 'u5', candidateUser: USERS[4],
    score: 0.97, status: 'Accepted', createdAt: '2026-08-10T13:30:00Z',
  },
  {
    id: 'm11', gigRequestId: 'g3', gigRequest: GIG_REQUESTS[2],
    candidateUserId: 'u16', candidateUser: USERS[15],
    score: 0.92, status: 'Declined', createdAt: '2026-08-10T13:30:00Z',
  },
  {
    id: 'm12', gigRequestId: 'g4', gigRequest: GIG_REQUESTS[3],
    candidateUserId: 'u2', candidateUser: USERS[1],
    score: 0.93, status: 'Suggested', createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'm13', gigRequestId: 'g4', gigRequest: GIG_REQUESTS[3],
    candidateUserId: 'u12', candidateUser: USERS[11],
    score: 0.90, status: 'Suggested', createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'm14', gigRequestId: 'g4', gigRequest: GIG_REQUESTS[3],
    candidateUserId: 'u19', candidateUser: USERS[18],
    score: 0.85, status: 'Suggested', createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'm15', gigRequestId: 'g7', gigRequest: GIG_REQUESTS[6],
    candidateUserId: 'u2', candidateUser: USERS[1],
    score: 0.96, status: 'Suggested', createdAt: '2026-08-10T15:30:00Z',
  },
  {
    id: 'm16', gigRequestId: 'g11', gigRequest: GIG_REQUESTS[10],
    candidateUserId: 'u7', candidateUser: USERS[6],
    score: 0.85, status: 'Suggested', createdAt: '2026-08-11T09:30:00Z',
  },
  {
    id: 'm17', gigRequestId: 'g11', gigRequest: GIG_REQUESTS[10],
    candidateUserId: 'u17', candidateUser: USERS[16],
    score: 0.92, status: 'Suggested', createdAt: '2026-08-11T09:30:00Z',
  },
  {
    id: 'm18', gigRequestId: 'g29', gigRequest: GIG_REQUESTS[28],
    candidateUserId: 'u1', candidateUser: USERS[0],
    score: 0.82, status: 'Suggested', createdAt: '2026-08-12T10:30:00Z',
  },
];

export const DEFAULT_USER = USERS[0];

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatBudget(budget: number | null): string {
  if (budget === null) return 'Flexible';
  return `$${budget.toLocaleString()}`;
}

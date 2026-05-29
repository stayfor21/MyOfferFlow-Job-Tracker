export const PREP_CATEGORIES = [
  'Frontend Developer',
  'Backend Developer',
  'UX/UI Designer',
  'Software Engineering',
  'Product / Business',
  'Marketing',
  'Finance / Banking',
  'Design',
  'Other'
];

export const prepData = {
  'Frontend Developer': {
    questions: {
      behavioral: [
        'Tell me about a time you improved the user experience of a web application.',
        'Describe a situation where you disagreed with a designer or backend engineer.',
        'Tell me about a time you had to balance speed, quality, and technical debt.',
        'How do you handle feedback during code reviews?'
      ],
      technical: [
        'How do you structure reusable React components?',
        'How do you manage state in a complex frontend application?',
        'What are common causes of poor frontend performance and how do you fix them?',
        'How do you approach accessibility in web interfaces?',
        'Explain the difference between client-side rendering, server-side rendering, and static generation.',
        'How do you handle API loading, error, and empty states in the UI?',
        'How do you test frontend components?',
        'What are the benefits and tradeoffs of TypeScript in frontend development?'
      ],
      roleSpecific: [
        'How would you build a responsive dashboard from a Figma design?',
        'How do you ensure consistency across a design system?',
        'How would you debug a layout that breaks on mobile?',
        'How do you collaborate with backend developers when API requirements change?'
      ]
    },
    strategy: [
      'Explain decisions in terms of user experience, maintainability, and performance.',
      'Mention accessibility, responsive behavior, and edge states.',
      'Use concrete examples from real UI work.',
      'Talk about tradeoffs between speed and quality.'
    ],
    prepRoutine: [
      ['5 min', 'Review role and product context'],
      ['10 min', 'Review React, TypeScript, state management, and API integration'],
      ['10 min', 'Prepare one UI project story with measurable impact'],
      ['5 min', 'Prepare questions about design systems, team workflow, and frontend architecture']
    ]
  },
  'Backend Developer': {
    questions: {
      behavioral: [
        'Tell me about a time you designed or improved a backend system.',
        'Describe a situation where you had to debug a production issue.',
        'Tell me about a time you had to make a tradeoff between speed, reliability, and scalability.',
        'How do you communicate technical risks to non-technical teammates?'
      ],
      technical: [
        'How do you design a REST API?',
        'What is the difference between SQL and NoSQL databases?',
        'How do you approach database schema design?',
        'How do you handle authentication and authorization?',
        'What strategies do you use for error handling and logging?',
        'How would you improve the performance of a slow API endpoint?',
        'What is caching and when would you use it?',
        'How do you test backend services?',
        'What are common security concerns in backend development?',
        'Explain horizontal scaling and when it becomes necessary.'
      ],
      roleSpecific: [
        'How would you design an API for a job application tracking system?',
        'How would you model users, jobs, statuses, and reminders in a database?',
        'How would you prevent duplicate applications or invalid status transitions?',
        'How would you monitor failures in a backend service?'
      ]
    },
    strategy: [
      'Structure answers around reliability, data consistency, security, and scalability.',
      'Explain tradeoffs clearly.',
      'Use diagrams or step-by-step reasoning if appropriate.',
      'Mention observability, testing, and failure cases.'
    ],
    prepRoutine: [
      ['5 min', 'Review role and business context'],
      ['10 min', 'Review API design, databases, authentication, and error handling'],
      ['10 min', 'Practice one system design example'],
      ['5 min', 'Prepare questions about architecture, infrastructure, and team practices']
    ]
  },
  'UX/UI Designer': {
    questions: {
      behavioral: [
        'Tell me about a design project you are proud of.',
        'Describe a time you received difficult feedback on your design.',
        'Tell me about a time you had to defend a design decision.',
        'How do you collaborate with developers and product managers?',
        'Tell me about a time you improved a product based on user feedback.'
      ],
      technical: [
        'Walk me through your design process from problem to final UI.',
        'How do you create user flows and wireframes?',
        'How do you use Figma in your design workflow?',
        'How do you decide visual hierarchy on a page?',
        'What makes a dashboard easy to understand?',
        'How do you approach responsive design?',
        'How do you work with design systems?',
        'How do you validate whether a design is effective?',
        'How do you balance business goals and user needs?',
        'How do you prepare a design handoff for developers?'
      ],
      portfolio: [
        'Walk me through one case study in your portfolio.',
        'What problem were you solving in this project?',
        'What constraints did you work with?',
        'What changed after your design?',
        'What would you improve if you had more time?'
      ],
      practical: [
        'How would you redesign a confusing job application tracker dashboard?',
        'How would you improve empty states in a SaaS product?',
        'How would you design a mobile version of a Kanban board?',
        'How would you make an interview preparation flow feel more premium?'
      ]
    },
    strategy: [
      'Explain the problem before the visual solution.',
      'Connect design choices to user goals and business goals.',
      'Mention constraints, iterations, and feedback.',
      'Use portfolio examples instead of abstract answers.',
      'Discuss accessibility, hierarchy, and developer handoff.'
    ],
    prepRoutine: [
      ['5 min', 'Review company product and target users'],
      ['10 min', 'Prepare one portfolio case study'],
      ['10 min', 'Practice explaining design decisions and tradeoffs'],
      ['5 min', 'Prepare questions about design process, team collaboration, and product goals']
    ]
  },
  'Software Engineering': {
    questions: {
      behavioral: [
        "Tell me about a time you had to deal with a significant technical debt.",
        "How do you handle disagreements with a peer during code reviews?",
        "Describe a complex project you led from start to finish.",
        "Tell me about a time you failed to meet a deadline."
      ],
      technical: [
        "Explain the difference between SQL and NoSQL databases.",
        "What are the SOLID principles in object-oriented design?",
        "How do you optimize front-end performance in a React application?",
        "Explain how a microservices architecture handles data consistency.",
        "What is your approach to automated testing and CI/CD?"
      ]
    },
    checklist: [
      "Review your most impactful projects and prepare metrics.",
      "Brush up on system design patterns.",
      "Practice 2-3 LeetCode medium problems related to the stack.",
      "Check the company's tech blog for recent engineering challenges.",
      "Prepare your development environment for a potential live coding."
    ],
    tips: [
      "Focus on the 'Why' behind your technical decisions, not just the 'How'.",
      "If doing a live coding session, communicate your thought process constantly.",
      "Be honest about what you don't know, but explain how you'd find out."
    ]
  },
  'Product / Business': {
    questions: {
      behavioral: [
        "Tell me about a product decision you made based on data.",
        "How do you prioritize features when resources are limited?",
        "Describe a time you had to manage a difficult stakeholder.",
        "How do you handle a product launch that didn't go as planned?"
      ],
      technical: [
        "How do you define success for a new feature?",
        "Walk me through your process for creating a product roadmap.",
        "What's your favorite product and how would you improve it?",
        "How do you balance user needs with business goals?"
      ]
    },
    checklist: [
      "Study the company's current product suite and market position.",
      "Prepare stories using the STAR method for key product challenges.",
      "Review common PM frameworks (CIRCLES, 5Ws).",
      "Analyze the competitors and their value propositions."
    ],
    tips: [
      "Always tie your answers back to the user and the bottom line.",
      "Be prepared to talk about trade-offs; there is rarely a perfect solution.",
      "Show curiosity about their internal processes and challenges."
    ]
  },
  'Finance / Banking': {
    questions: {
      behavioral: [
        "Describe a time you had to work under extreme pressure to meet a regulatory deadline.",
        "How do you ensure accuracy in your financial reporting?",
        "Tell me about a time you identified an ethical concern at work."
      ],
      technical: [
        "Explain the impact of rising interest rates on a company's valuation.",
        "How do you calculate the Weighted Average Cost of Capital (WACC)?",
        "Walk me through the three financial statements and how they link.",
        "What is your experience with financial modeling and risk assessment?"
      ]
    },
    checklist: [
      "Review recent market trends affecting this specific industry.",
      "Memorize key financial formulas and ratios.",
      "Check the company's latest annual report or quarterly earnings.",
      "Prepare a conservative and sharp outfit (Finance culture is often formal)."
    ],
    tips: [
      "Attention to detail is your most valuable asset—demonstrate it.",
      "Keep your answers concise and data-driven.",
      "Show an understanding of both risk and reward."
    ]
  },
  'Other': {
    questions: {
      behavioral: [
        "Tell me about yourself and your background.",
        "Why are you interested in this company and role?",
        "What are your greatest strengths and weaknesses?",
        "Where do you see yourself in five years?"
      ],
      technical: [
        "What is your unique value proposition for this role?",
        "Describe a challenging project you've worked on recently.",
        "How do you stay updated with industry trends?"
      ]
    },
    checklist: [
      "Research the interviewers on LinkedIn.",
      "Prepare 3-5 thoughtful questions to ask the interviewer.",
      "Review the job description and map your skills to each requirement."
    ],
    tips: [
      "Maintain good eye contact and positive body language.",
      "Research the company's mission and values.",
      "Follow up with a thank-you note within 24 hours."
    ]
  }
};

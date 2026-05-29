import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Layers3,
  MessageSquareText,
  Sparkles,
  Target,
  X,
  Zap
} from 'lucide-react';
import { prepData, PREP_CATEGORIES } from './prepData';
import CustomSelect from './src/components/UI/CustomSelect';
import Button from './src/components/UI/Button';
import { useTranslation } from './src/i18n.jsx';

const FALLBACK_INSIGHTS = {
  interviewType: 'Technical / Behavioral',
  focusAreas: 'Role-specific questions, communication, problem solving',
  prepTime: '30 min'
};

const CATEGORY_INTERVIEW_TYPES = {
  'Frontend Developer': 'prep.type.frontend',
  'Backend Developer': 'prep.type.backend',
  'UX/UI Designer': 'prep.type.ux',
  'Software Engineering': 'prep.type.software',
  'Product / Business': 'prep.type.product',
  Marketing: 'prep.type.marketing',
  'Finance / Banking': 'prep.type.finance',
  Design: 'prep.type.design',
  Other: 'prep.type.frontend'
};

const CATEGORY_FOCUS_AREAS = {
  'Frontend Developer': ['Component architecture', 'State management', 'Performance optimization', 'Accessibility', 'API integration', 'Responsive UI', 'Testing', 'Code review communication'],
  'Backend Developer': ['API design', 'Database modeling', 'Authentication and authorization', 'Performance and scalability', 'System design basics', 'Error handling', 'Security', 'Testing and observability'],
  'UX/UI Designer': ['Design process', 'User flows', 'Design systems', 'Portfolio storytelling', 'Wireframing and prototyping', 'Usability decisions', 'Visual hierarchy', 'Collaboration with developers'],
  'Software Engineering': ['Problem solving', 'Technical fundamentals', 'Architecture tradeoffs', 'Code quality', 'Collaboration'],
  'Product / Business': ['Prioritization', 'Stakeholder communication', 'Product metrics', 'Roadmap tradeoffs', 'Launch planning'],
  Marketing: ['Campaign strategy', 'Audience insights', 'Growth experiments', 'Content performance', 'Channel tradeoffs'],
  'Finance / Banking': ['Risk assessment', 'Financial statements', 'Market awareness', 'Accuracy under pressure', 'Ethics and compliance'],
  Design: ['Design process', 'User research', 'Portfolio storytelling', 'Design systems', 'Cross-functional feedback'],
  Other: ['Role fit', 'Communication', 'Problem solving', 'Company motivation', 'Transferable impact']
};

const FOCUS_AREA_DE = {
  'Component architecture': 'Komponentenarchitektur',
  'State management': 'State Management',
  'Performance optimization': 'Performance-Optimierung',
  Accessibility: 'Barrierefreiheit',
  'API integration': 'API-Integration',
  'Responsive UI': 'Responsive UI',
  Testing: 'Testing',
  'Code review communication': 'Code-Review-Kommunikation',
  'API design': 'API-Design',
  'Database modeling': 'Datenbankmodellierung',
  'Authentication and authorization': 'Authentifizierung und Autorisierung',
  'Performance and scalability': 'Performance und Skalierbarkeit',
  'System design basics': 'System-Design-Grundlagen',
  'Error handling': 'Fehlerbehandlung',
  Security: 'Sicherheit',
  'Testing and observability': 'Testing und Observability',
  'Design process': 'Designprozess',
  'User flows': 'User Flows',
  'Design systems': 'Designsysteme',
  'Portfolio storytelling': 'Portfolio-Storytelling',
  'Wireframing and prototyping': 'Wireframing und Prototyping',
  'Usability decisions': 'Usability-Entscheidungen',
  'Visual hierarchy': 'Visuelle Hierarchie',
  'Collaboration with developers': 'Zusammenarbeit mit Entwicklern',
  'Problem solving': 'Problemlösung',
  'Technical fundamentals': 'Technische Grundlagen',
  'Architecture tradeoffs': 'Architekturabwägungen',
  'Code quality': 'Codequalität',
  Collaboration: 'Zusammenarbeit',
  Prioritization: 'Priorisierung',
  'Stakeholder communication': 'Stakeholder-Kommunikation',
  'Product metrics': 'Produktmetriken',
  'Roadmap tradeoffs': 'Roadmap-Abwägungen',
  'Launch planning': 'Launch-Planung',
  'Campaign strategy': 'Kampagnenstrategie',
  'Audience insights': 'Zielgruppen-Insights',
  'Growth experiments': 'Growth-Experimente',
  'Content performance': 'Content-Performance',
  'Channel tradeoffs': 'Channel-Abwägungen',
  'Risk assessment': 'Risikobewertung',
  'Financial statements': 'Finanzberichte',
  'Market awareness': 'Marktverständnis',
  'Accuracy under pressure': 'Genauigkeit unter Druck',
  'Ethics and compliance': 'Ethik und Compliance',
  'User research': 'User Research',
  'Cross-functional feedback': 'Cross-funktionales Feedback',
  'Role fit': 'Rollen-Fit',
  Communication: 'Kommunikation',
  'Company motivation': 'Motivation für das Unternehmen',
  'Transferable impact': 'Übertragbarer Impact'
};

const FOCUS_AREA_RU = {
  'Component architecture': 'Архитектура компонентов',
  'State management': 'Управление состоянием',
  'Performance optimization': 'Оптимизация производительности',
  Accessibility: 'Доступность',
  'API integration': 'Интеграция API',
  'Responsive UI': 'Адаптивный UI',
  Testing: 'Тестирование',
  'Code review communication': 'Коммуникация на code review',
  'API design': 'Дизайн API',
  'Database modeling': 'Моделирование базы данных',
  'Authentication and authorization': 'Аутентификация и авторизация',
  'Performance and scalability': 'Производительность и масштабируемость',
  'System design basics': 'Основы system design',
  'Error handling': 'Обработка ошибок',
  Security: 'Безопасность',
  'Testing and observability': 'Тестирование и наблюдаемость',
  'Design process': 'Дизайн-процесс',
  'User flows': 'Пользовательские сценарии',
  'Design systems': 'Дизайн-системы',
  'Portfolio storytelling': 'Рассказ о портфолио',
  'Wireframing and prototyping': 'Вайрфреймы и прототипирование',
  'Usability decisions': 'Решения по удобству',
  'Visual hierarchy': 'Визуальная иерархия',
  'Collaboration with developers': 'Работа с разработчиками',
  'Problem solving': 'Решение задач',
  'Technical fundamentals': 'Технические основы',
  'Architecture tradeoffs': 'Архитектурные компромиссы',
  'Code quality': 'Качество кода',
  Collaboration: 'Командная работа',
  Prioritization: 'Приоритизация',
  'Stakeholder communication': 'Коммуникация со стейкхолдерами',
  'Product metrics': 'Продуктовые метрики',
  'Roadmap tradeoffs': 'Компромиссы roadmap',
  'Launch planning': 'Планирование запуска',
  'Campaign strategy': 'Стратегия кампаний',
  'Audience insights': 'Инсайты аудитории',
  'Growth experiments': 'Growth-эксперименты',
  'Content performance': 'Эффективность контента',
  'Channel tradeoffs': 'Компромиссы каналов',
  'Risk assessment': 'Оценка рисков',
  'Financial statements': 'Финансовая отчетность',
  'Market awareness': 'Понимание рынка',
  'Accuracy under pressure': 'Точность под давлением',
  'Ethics and compliance': 'Этика и compliance',
  'User research': 'User research',
  'Cross-functional feedback': 'Кросс-функциональный feedback',
  'Role fit': 'Соответствие роли',
  Communication: 'Коммуникация',
  'Company motivation': 'Мотивация к компании',
  'Transferable impact': 'Переносимый опыт'
};

function localizeFocusAreas(areas, language) {
  if (language === 'de') return areas.map((area) => FOCUS_AREA_DE[area] || area);
  if (language === 'ru') return areas.map((area) => FOCUS_AREA_RU[area] || area);
  return areas;
}

const PREP_TEXT_DE = {
  'Use STAR for behavioral answers.': 'STAR für Verhaltensfragen nutzen.',
  'Explain tradeoffs, not only definitions.': 'Abwägungen klar erklären.',
  'Prepare one project story with measurable impact.': 'Ein Projektbeispiel mit Wirkung vorbereiten.',
  'Keep answers structured: context -> action -> result.': 'Antworten strukturiert halten.',
  'Explain decisions in terms of user experience, maintainability, and performance.': 'Entscheidungen mit UX, Wartbarkeit und Performance verbinden.',
  'Mention accessibility, responsive behavior, and edge states.': 'Barrierefreiheit, responsive UI und Edge States nennen.',
  'Use concrete examples from real UI work.': 'Nutze konkrete Beispiele aus echter UI-Arbeit.',
  'Talk about tradeoffs between speed and quality.': 'Speed-vs-Quality-Abwägungen erklären.',
  'Structure answers around reliability, data consistency, security, and scalability.': 'Zuverlässigkeit, Datenkonsistenz, Sicherheit und Skalierung betonen.',
  'Explain tradeoffs clearly.': 'Erkläre Abwägungen klar.',
  'Use diagrams or step-by-step reasoning if appropriate.': 'Bei Bedarf Schritt-für-Schritt argumentieren.',
  'Mention observability, testing, and failure cases.': 'Nenne Observability, Testing und Fehlerfälle.',
  'Explain the problem before the visual solution.': 'Problem zuerst erklären, dann Lösung zeigen.',
  'Connect design choices to user goals and business goals.': 'Entscheidungen mit Nutzer- und Geschäftszielen verbinden.',
  'Mention constraints, iterations, and feedback.': 'Einschränkungen, Iterationen und Feedback nennen.',
  'Use portfolio examples instead of abstract answers.': 'Konkrete Portfolio-Beispiele nutzen.',
  'Discuss accessibility, hierarchy, and developer handoff.': 'Barrierefreiheit, Hierarchie und Handoff erwähnen.',
  'Review company and role context': 'Unternehmen und Rolle prüfen',
  'Practice behavioral stories': 'Behavioral Stories üben',
  'Review technical fundamentals': 'Technische Grundlagen wiederholen',
  'Prepare questions for the interviewer': 'Fragen vorbereiten',
  'Review role and product context': 'Rolle und Produkt prüfen',
  'Review React, TypeScript, state management, and API integration': 'React, TypeScript, State und APIs wiederholen',
  'Prepare one UI project story with measurable impact': 'UI-Projektstory vorbereiten',
  'Prepare questions about design systems, team workflow, and frontend architecture': 'Fragen zu Designsystem und Frontend vorbereiten',
  'Review role and business context': 'Rolle und Business prüfen',
  'Review API design, databases, authentication, and error handling': 'APIs, Datenbanken und Auth wiederholen',
  'Practice one system design example': 'System-Design-Beispiel üben',
  'Prepare questions about architecture, infrastructure, and team practices': 'Fragen zu Architektur und Team vorbereiten',
  'Review company product and target users': 'Unternehmen und Nutzer prüfen',
  'Prepare one portfolio case study': 'Portfolio-Case vorbereiten',
  'Practice explaining design decisions and tradeoffs': 'Designentscheidungen üben',
  'Prepare questions about design process, team collaboration, and product goals': 'Fragen zum Team vorbereiten'
};

const PREP_TEXT_RU = {
  'Use STAR for behavioral answers.': 'Используй STAR для поведенческих вопросов.',
  'Explain tradeoffs, not only definitions.': 'Объясняй компромиссы, а не только определения.',
  'Prepare one project story with measurable impact.': 'Подготовь один пример проекта с измеримым результатом.',
  'Keep answers structured: context -> action -> result.': 'Держи структуру: контекст -> действие -> результат.',
  'Explain decisions in terms of user experience, maintainability, and performance.': 'Объясняй решения через пользовательский опыт, поддержку и производительность.',
  'Mention accessibility, responsive behavior, and edge states.': 'Упоминай доступность, адаптивность и edge states.',
  'Use concrete examples from real UI work.': 'Используй конкретные примеры из реальной UI-работы.',
  'Talk about tradeoffs between speed and quality.': 'Говори о компромиссах между скоростью и качеством.',
  'Structure answers around reliability, data consistency, security, and scalability.': 'Строй ответы вокруг надежности, консистентности данных, безопасности и масштабируемости.',
  'Explain tradeoffs clearly.': 'Четко объясняй компромиссы.',
  'Use diagrams or step-by-step reasoning if appropriate.': 'При необходимости рассуждай пошагово.',
  'Mention observability, testing, and failure cases.': 'Упоминай observability, тестирование и сценарии отказа.',
  'Explain the problem before the visual solution.': 'Сначала объясняй проблему, затем визуальное решение.',
  'Connect design choices to user goals and business goals.': 'Связывай дизайн-решения с целями пользователей и бизнеса.',
  'Mention constraints, iterations, and feedback.': 'Упоминай ограничения, итерации и feedback.',
  'Use portfolio examples instead of abstract answers.': 'Используй примеры из портфолио вместо абстрактных ответов.',
  'Discuss accessibility, hierarchy, and developer handoff.': 'Обсуждай доступность, иерархию и handoff разработчикам.',
  'Review company and role context': 'Повтори контекст компании и роли',
  'Practice behavioral stories': 'Отработай поведенческие истории',
  'Review technical fundamentals': 'Повтори технические основы',
  'Prepare questions for the interviewer': 'Подготовь вопросы интервьюеру',
  'Review role and product context': 'Повтори контекст роли и продукта',
  'Review React, TypeScript, state management, and API integration': 'Повтори React, TypeScript, state management и API-интеграцию',
  'Prepare one UI project story with measurable impact': 'Подготовь UI-проект с измеримым результатом',
  'Prepare questions about design systems, team workflow, and frontend architecture': 'Подготовь вопросы о дизайн-системах, workflow и frontend-архитектуре',
  'Review role and business context': 'Повтори контекст роли и бизнеса',
  'Review API design, databases, authentication, and error handling': 'Повтори API design, базы данных, auth и обработку ошибок',
  'Practice one system design example': 'Отработай один system design пример',
  'Prepare questions about architecture, infrastructure, and team practices': 'Подготовь вопросы об архитектуре, инфраструктуре и командных практиках',
  'Review company product and target users': 'Изучи продукт компании и целевых пользователей',
  'Prepare one portfolio case study': 'Подготовь один portfolio case',
  'Practice explaining design decisions and tradeoffs': 'Отработай объяснение дизайн-решений и компромиссов',
  'Prepare questions about design process, team collaboration, and product goals': 'Подготовь вопросы о дизайн-процессе, команде и продуктовых целях'
};

function localizePrepText(value, language) {
  if (language === 'de') return PREP_TEXT_DE[value] || value;
  if (language === 'ru') return PREP_TEXT_RU[value] || value;
  return value;
}

const QUESTION_DE = {
  'Tell me about a time you improved the user experience of a web application.': 'Erzähle von einer Situation, in der du die User Experience einer Webanwendung verbessert hast.',
  'Describe a situation where you disagreed with a designer or backend engineer.': 'Beschreibe eine Situation, in der du mit Design oder Backend anderer Meinung warst.',
  'Tell me about a time you had to balance speed, quality, and technical debt.': 'Erzähle von einer Situation, in der du Tempo, Qualität und technische Schulden abgewogen hast.',
  'How do you handle feedback during code reviews?': 'Wie gehst du mit Feedback in Code Reviews um?',
  'How do you structure reusable React components?': 'Wie strukturierst du wiederverwendbare React-Komponenten?',
  'How do you manage state in a complex frontend application?': 'Wie verwaltest du State in einer komplexen Frontend-App?',
  'What are common causes of poor frontend performance and how do you fix them?': 'Was sind typische Ursachen schlechter Frontend-Performance und wie behebst du sie?',
  'How do you approach accessibility in web interfaces?': 'Wie gehst du Barrierefreiheit in Weboberflächen an?',
  'Explain the difference between client-side rendering, server-side rendering, and static generation.': 'Erkläre den Unterschied zwischen Client-Side Rendering, Server-Side Rendering und Static Generation.',
  'How do you handle API loading, error, and empty states in the UI?': 'Wie gehst du mit Lade-, Fehler- und Empty States in der UI um?',
  'How do you test frontend components?': 'Wie testest du Frontend-Komponenten?',
  'What are the benefits and tradeoffs of TypeScript in frontend development?': 'Welche Vorteile und Tradeoffs hat TypeScript im Frontend?',
  'How would you build a responsive dashboard from a Figma design?': 'Wie würdest du ein responsives Dashboard aus einem Figma-Design umsetzen?',
  'How do you ensure consistency across a design system?': 'Wie stellst du Konsistenz in einem Designsystem sicher?',
  'How would you debug a layout that breaks on mobile?': 'Wie würdest du ein Layout debuggen, das auf Mobile bricht?',
  'How do you collaborate with backend developers when API requirements change?': 'Wie arbeitest du mit Backend-Entwicklern zusammen, wenn sich API-Anforderungen ändern?',
  'Tell me about a time you designed or improved a backend system.': 'Erzähle von einer Situation, in der du ein Backend-System entworfen oder verbessert hast.',
  'Describe a situation where you had to debug a production issue.': 'Beschreibe eine Situation, in der du ein Produktionsproblem debuggen musstest.',
  'Tell me about a time you had to make a tradeoff between speed, reliability, and scalability.': 'Erzähle von einer Abwägung zwischen Tempo, Zuverlässigkeit und Skalierbarkeit.',
  'How do you communicate technical risks to non-technical teammates?': 'Wie kommunizierst du technische Risiken an nicht-technische Teammitglieder?',
  'How do you design a REST API?': 'Wie entwirfst du eine REST API?',
  'What is the difference between SQL and NoSQL databases?': 'Was ist der Unterschied zwischen SQL- und NoSQL-Datenbanken?',
  'How do you approach database schema design?': 'Wie gehst du an Datenbankschema-Design heran?',
  'How do you handle authentication and authorization?': 'Wie gehst du mit Authentifizierung und Autorisierung um?',
  'What strategies do you use for error handling and logging?': 'Welche Strategien nutzt du für Fehlerbehandlung und Logging?',
  'How would you improve the performance of a slow API endpoint?': 'Wie verbesserst du die Performance eines langsamen API-Endpunkts?',
  'What is caching and when would you use it?': 'Was ist Caching und wann würdest du es einsetzen?',
  'How do you test backend services?': 'Wie testest du Backend-Services?',
  'What are common security concerns in backend development?': 'Welche Sicherheitsrisiken sind im Backend besonders wichtig?',
  'Explain horizontal scaling and when it becomes necessary.': 'Erkläre horizontale Skalierung und wann sie notwendig wird.',
  'How would you design an API for a job application tracking system?': 'Wie würdest du eine API für ein Bewerbungstracking-System entwerfen?',
  'How would you model users, jobs, statuses, and reminders in a database?': 'Wie würdest du Nutzer, Jobs, Status und Erinnerungen in einer Datenbank modellieren?',
  'How would you prevent duplicate applications or invalid status transitions?': 'Wie würdest du doppelte Bewerbungen oder ungültige Statuswechsel verhindern?',
  'How would you monitor failures in a backend service?': 'Wie würdest du Fehler in einem Backend-Service überwachen?',
  'Tell me about a design project you are proud of.': 'Erzähle von einem Designprojekt, auf das du stolz bist.',
  'Describe a time you received difficult feedback on your design.': 'Beschreibe eine Situation, in der du schwieriges Feedback zu deinem Design erhalten hast.',
  'Tell me about a time you had to defend a design decision.': 'Erzähle von einer Situation, in der du eine Designentscheidung verteidigen musstest.',
  'How do you collaborate with developers and product managers?': 'Wie arbeitest du mit Entwicklern und Product Managern zusammen?',
  'Tell me about a time you improved a product based on user feedback.': 'Erzähle von einer Situation, in der du ein Produkt durch Nutzerfeedback verbessert hast.',
  'Walk me through your design process from problem to final UI.': 'Führe mich durch deinen Designprozess vom Problem bis zur finalen UI.',
  'How do you create user flows and wireframes?': 'Wie erstellst du User Flows und Wireframes?',
  'How do you use Figma in your design workflow?': 'Wie nutzt du Figma in deinem Designprozess?',
  'How do you decide visual hierarchy on a page?': 'Wie entscheidest du die visuelle Hierarchie auf einer Seite?',
  'What makes a dashboard easy to understand?': 'Was macht ein Dashboard leicht verständlich?',
  'How do you approach responsive design?': 'Wie gehst du an responsives Design heran?',
  'How do you work with design systems?': 'Wie arbeitest du mit Designsystemen?',
  'How do you validate whether a design is effective?': 'Wie validierst du, ob ein Design wirksam ist?',
  'How do you balance business goals and user needs?': 'Wie balancierst du Geschäftsziele und Nutzerbedürfnisse?',
  'How do you prepare a design handoff for developers?': 'Wie bereitest du ein Design-Handoff für Entwickler vor?',
  'Walk me through one case study in your portfolio.': 'Führe mich durch eine Case Study in deinem Portfolio.',
  'What problem were you solving in this project?': 'Welches Problem hast du in diesem Projekt gelöst?',
  'What constraints did you work with?': 'Mit welchen Einschränkungen hast du gearbeitet?',
  'What changed after your design?': 'Was hat sich nach deinem Design verändert?',
  'What would you improve if you had more time?': 'Was würdest du verbessern, wenn du mehr Zeit hättest?',
  'How would you redesign a confusing job application tracker dashboard?': 'Wie würdest du ein unübersichtliches Dashboard verbessern?',
  'How would you improve empty states in a SaaS product?': 'Wie würdest du Empty States in einem SaaS-Produkt verbessern?',
  'How would you design a mobile version of a Kanban board?': 'Wie würdest du eine mobile Kanban-Ansicht gestalten?',
  'How would you make an interview preparation flow feel more premium?': 'Wie würdest du einen Interview-Vorbereitungsflow hochwertiger gestalten?',
  'Tell me about a time you had to deal with a significant technical debt.': 'Erzähle von einer Situation, in der du mit hoher technischer Schuld umgehen musstest.',
  'How do you handle disagreements with a peer during code reviews?': 'Wie gehst du mit Meinungsverschiedenheiten in Code Reviews um?',
  'Describe a complex project you led from start to finish.': 'Beschreibe ein komplexes Projekt, das du von Anfang bis Ende geleitet hast.',
  'Tell me about a time you failed to meet a deadline.': 'Erzähle von einer Situation, in der du eine Deadline verpasst hast.',
  'Explain the difference between SQL and NoSQL databases.': 'Erkläre den Unterschied zwischen SQL- und NoSQL-Datenbanken.',
  'What are the SOLID principles in object-oriented design?': 'Was sind die SOLID-Prinzipien im objektorientierten Design?',
  'How do you optimize front-end performance in a React application?': 'Wie optimierst du Frontend-Performance in einer React-Anwendung?',
  'Explain how a microservices architecture handles data consistency.': 'Erkläre, wie eine Microservices-Architektur Datenkonsistenz behandelt.',
  'What is your approach to automated testing and CI/CD?': 'Wie gehst du an automatisiertes Testing und CI/CD heran?',
  'Tell me about a product decision you made based on data.': 'Erzähle von einer Produktentscheidung, die du datenbasiert getroffen hast.',
  'How do you prioritize features when resources are limited?': 'Wie priorisierst du Features bei begrenzten Ressourcen?',
  'Describe a time you had to manage a difficult stakeholder.': 'Beschreibe eine Situation mit einem schwierigen Stakeholder.',
  "How do you handle a product launch that didn't go as planned?": 'Wie gehst du mit einem Produktlaunch um, der nicht wie geplant verläuft?',
  'How do you define success for a new feature?': 'Wie definierst du Erfolg für ein neues Feature?',
  'Walk me through your process for creating a product roadmap.': 'Führe mich durch deinen Prozess für eine Produkt-Roadmap.',
  "What's your favorite product and how would you improve it?": 'Was ist dein Lieblingsprodukt und wie würdest du es verbessern?',
  'How do you balance user needs with business goals?': 'Wie balancierst du Nutzerbedürfnisse mit Geschäftszielen?',
  'Describe a time you had to work under extreme pressure to meet a regulatory deadline.': 'Beschreibe eine Situation, in der du unter hohem Druck eine regulatorische Deadline einhalten musstest.',
  'How do you ensure accuracy in your financial reporting?': 'Wie stellst du Genauigkeit im Financial Reporting sicher?',
  'Tell me about a time you identified an ethical concern at work.': 'Erzähle von einer Situation, in der du ein ethisches Risiko erkannt hast.',
  "Explain the impact of rising interest rates on a company's valuation.": 'Erkläre den Einfluss steigender Zinsen auf die Unternehmensbewertung.',
  'How do you calculate the Weighted Average Cost of Capital (WACC)?': 'Wie berechnest du den Weighted Average Cost of Capital (WACC)?',
  'Walk me through the three financial statements and how they link.': 'Führe mich durch die drei Finanzberichte und ihre Zusammenhänge.',
  'What is your experience with financial modeling and risk assessment?': 'Welche Erfahrung hast du mit Financial Modeling und Risikobewertung?',
  'Tell me about yourself and your background.': 'Erzähle etwas über dich und deinen Hintergrund.',
  'Why are you interested in this company and role?': 'Warum interessierst du dich für dieses Unternehmen und diese Rolle?',
  'What are your greatest strengths and weaknesses?': 'Was sind deine größten Stärken und Schwächen?',
  'Where do you see yourself in five years?': 'Wo siehst du dich in fünf Jahren?',
  'What is your unique value proposition for this role?': 'Was ist dein besonderer Mehrwert für diese Rolle?',
  "Describe a challenging project you've worked on recently.": 'Beschreibe ein anspruchsvolles Projekt, an dem du kürzlich gearbeitet hast.',
  'How do you stay updated with industry trends?': 'Wie bleibst du bei Branchentrends auf dem Laufenden?'
};

const QUESTION_RU = {
  'Tell me about a time you improved the user experience of a web application.': 'Расскажи о случае, когда ты улучшил пользовательский опыт веб-приложения.',
  'Describe a situation where you disagreed with a designer or backend engineer.': 'Опиши ситуацию, когда ты не согласился с дизайнером или backend-инженером.',
  'Tell me about a time you had to balance speed, quality, and technical debt.': 'Расскажи, как ты балансировал скорость, качество и технический долг.',
  'How do you handle feedback during code reviews?': 'Как ты работаешь с feedback на code review?',
  'How do you structure reusable React components?': 'Как ты структурируешь переиспользуемые React-компоненты?',
  'How do you manage state in a complex frontend application?': 'Как ты управляешь состоянием в сложном frontend-приложении?',
  'What are common causes of poor frontend performance and how do you fix them?': 'Какие причины чаще всего ухудшают frontend-производительность и как ты их исправляешь?',
  'How do you approach accessibility in web interfaces?': 'Как ты подходишь к доступности веб-интерфейсов?',
  'Explain the difference between client-side rendering, server-side rendering, and static generation.': 'Чем отличаются client-side rendering, server-side rendering и static generation?',
  'How do you handle API loading, error, and empty states in the UI?': 'Как ты обрабатываешь состояния загрузки, ошибки и пустые состояния в UI?',
  'How do you test frontend components?': 'Как ты тестируешь frontend-компоненты?',
  'What are the benefits and tradeoffs of TypeScript in frontend development?': 'Какие плюсы и компромиссы дает TypeScript во frontend-разработке?',
  'How would you build a responsive dashboard from a Figma design?': 'Как бы ты собрал адаптивный dashboard по Figma-дизайну?',
  'How do you ensure consistency across a design system?': 'Как ты обеспечиваешь консистентность дизайн-системы?',
  'How would you debug a layout that breaks on mobile?': 'Как бы ты отлаживал layout, который ломается на мобильном?',
  'How do you collaborate with backend developers when API requirements change?': 'Как ты работаешь с backend-разработчиками, когда меняются требования к API?',
  'Tell me about a time you designed or improved a backend system.': 'Расскажи о случае, когда ты проектировал или улучшал backend-систему.',
  'Describe a situation where you had to debug a production issue.': 'Опиши ситуацию, когда тебе пришлось разбирать production issue.',
  'Tell me about a time you had to make a tradeoff between speed, reliability, and scalability.': 'Расскажи о компромиссе между скоростью, надежностью и масштабируемостью.',
  'How do you communicate technical risks to non-technical teammates?': 'Как ты объясняешь технические риски нетехническим коллегам?',
  'How do you design a REST API?': 'Как ты проектируешь REST API?',
  'What is the difference between SQL and NoSQL databases?': 'Чем отличаются SQL и NoSQL базы данных?',
  'How do you approach database schema design?': 'Как ты подходишь к проектированию схемы базы данных?',
  'How do you handle authentication and authorization?': 'Как ты реализуешь аутентификацию и авторизацию?',
  'What strategies do you use for error handling and logging?': 'Какие стратегии используешь для обработки ошибок и логирования?',
  'How would you improve the performance of a slow API endpoint?': 'Как бы ты ускорил медленный API endpoint?',
  'What is caching and when would you use it?': 'Что такое caching и когда его стоит использовать?',
  'How do you test backend services?': 'Как ты тестируешь backend-сервисы?',
  'What are common security concerns in backend development?': 'Какие основные риски безопасности есть в backend-разработке?',
  'Explain horizontal scaling and when it becomes necessary.': 'Что такое горизонтальное масштабирование и когда оно нужно?',
  'How would you design an API for a job application tracking system?': 'Как бы ты спроектировал API для трекера заявок?',
  'How would you model users, jobs, statuses, and reminders in a database?': 'Как бы ты смоделировал пользователей, вакансии, статусы и напоминания в базе данных?',
  'How would you prevent duplicate applications or invalid status transitions?': 'Как бы ты предотвращал дубли заявок и некорректные переходы статусов?',
  'How would you monitor failures in a backend service?': 'Как бы ты мониторил сбои backend-сервиса?',
  'Tell me about a design project you are proud of.': 'Расскажи о дизайн-проекте, которым ты гордишься.',
  'Describe a time you received difficult feedback on your design.': 'Опиши случай, когда ты получил сложный feedback по дизайну.',
  'Tell me about a time you had to defend a design decision.': 'Расскажи о ситуации, когда тебе пришлось защищать дизайн-решение.',
  'How do you collaborate with developers and product managers?': 'Как ты работаешь с разработчиками и product managers?',
  'Tell me about a time you improved a product based on user feedback.': 'Расскажи, как ты улучшил продукт на основе user feedback.',
  'Walk me through your design process from problem to final UI.': 'Проведи меня через свой дизайн-процесс от проблемы до финального UI.',
  'How do you create user flows and wireframes?': 'Как ты создаешь user flows и wireframes?',
  'How do you use Figma in your design workflow?': 'Как ты используешь Figma в рабочем процессе?',
  'How do you decide visual hierarchy on a page?': 'Как ты принимаешь решения о визуальной иерархии?',
  'What makes a dashboard easy to understand?': 'Что делает dashboard понятным?',
  'How do you approach responsive design?': 'Как ты подходишь к адаптивному дизайну?',
  'How do you work with design systems?': 'Как ты работаешь с дизайн-системами?',
  'How do you validate whether a design is effective?': 'Как ты валидируешь эффективность дизайна?',
  'How do you balance business goals and user needs?': 'Как ты балансируешь бизнес-цели и потребности пользователей?',
  'How do you prepare a design handoff for developers?': 'Как ты готовишь handoff для разработчиков?',
  'Walk me through one case study in your portfolio.': 'Проведи меня через один case study в портфолио.',
  'What problem were you solving in this project?': 'Какую проблему ты решал в этом проекте?',
  'What constraints did you work with?': 'С какими ограничениями ты работал?',
  'What changed after your design?': 'Что изменилось после твоего дизайна?',
  'What would you improve if you had more time?': 'Что бы ты улучшил, если бы было больше времени?',
  'How would you redesign a confusing job application tracker dashboard?': 'Как бы ты улучшил непонятный dashboard трекера заявок?',
  'How would you improve empty states in a SaaS product?': 'Как бы ты улучшил empty states в SaaS-продукте?',
  'How would you design a mobile version of a Kanban board?': 'Как бы ты спроектировал мобильную Kanban-доску?',
  'How would you make an interview preparation flow feel more premium?': 'Как бы ты сделал flow подготовки к интервью более premium?',
  'Tell me about a time you had to deal with a significant technical debt.': 'Расскажи о случае, когда тебе пришлось работать с серьезным техническим долгом.',
  'How do you handle disagreements with a peer during code reviews?': 'Как ты решаешь разногласия с коллегой во время code review?',
  'Describe a complex project you led from start to finish.': 'Опиши сложный проект, который ты вел от начала до конца.',
  'Tell me about a time you failed to meet a deadline.': 'Расскажи о случае, когда ты не уложился в дедлайн.',
  'Explain the difference between SQL and NoSQL databases.': 'Объясни разницу между SQL и NoSQL базами данных.',
  'What are the SOLID principles in object-oriented design?': 'Что такое принципы SOLID в объектно-ориентированном дизайне?',
  'How do you optimize front-end performance in a React application?': 'Как ты оптимизируешь frontend-производительность в React-приложении?',
  'Explain how a microservices architecture handles data consistency.': 'Объясни, как микросервисная архитектура работает с консистентностью данных.',
  'What is your approach to automated testing and CI/CD?': 'Какой у тебя подход к автоматизированному тестированию и CI/CD?',
  'Tell me about a product decision you made based on data.': 'Расскажи о продуктовом решении, которое ты принял на основе данных.',
  'How do you prioritize features when resources are limited?': 'Как ты приоритизируешь фичи при ограниченных ресурсах?',
  'Describe a time you had to manage a difficult stakeholder.': 'Опиши ситуацию со сложным стейкхолдером.',
  "How do you handle a product launch that didn't go as planned?": 'Как ты действуешь, если запуск продукта пошел не по плану?',
  'How do you define success for a new feature?': 'Как ты определяешь успех новой фичи?',
  'Walk me through your process for creating a product roadmap.': 'Расскажи о процессе создания product roadmap.',
  "What's your favorite product and how would you improve it?": 'Какой твой любимый продукт и как бы ты его улучшил?',
  'How do you balance user needs with business goals?': 'Как ты балансируешь потребности пользователей и бизнес-цели?',
  'Describe a time you had to work under extreme pressure to meet a regulatory deadline.': 'Опиши ситуацию, когда ты работал под сильным давлением ради regulatory deadline.',
  'How do you ensure accuracy in your financial reporting?': 'Как ты обеспечиваешь точность финансовой отчетности?',
  'Tell me about a time you identified an ethical concern at work.': 'Расскажи о случае, когда ты заметил этический риск на работе.',
  "Explain the impact of rising interest rates on a company's valuation.": 'Объясни влияние роста процентных ставок на оценку компании.',
  'How do you calculate the Weighted Average Cost of Capital (WACC)?': 'Как рассчитывается Weighted Average Cost of Capital (WACC)?',
  'Walk me through the three financial statements and how they link.': 'Проведи меня через три финансовых отчета и их связь.',
  'What is your experience with financial modeling and risk assessment?': 'Какой у тебя опыт в финансовом моделировании и оценке рисков?',
  'Tell me about yourself and your background.': 'Расскажи о себе и своем опыте.',
  'Why are you interested in this company and role?': 'Почему тебе интересны эта компания и роль?',
  'What are your greatest strengths and weaknesses?': 'Какие у тебя главные сильные и слабые стороны?',
  'Where do you see yourself in five years?': 'Где ты видишь себя через пять лет?',
  'What is your unique value proposition for this role?': 'В чем твоя уникальная ценность для этой роли?',
  "Describe a challenging project you've worked on recently.": 'Опиши сложный проект, над которым ты недавно работал.',
  'How do you stay updated with industry trends?': 'Как ты следишь за трендами индустрии?'
};

function localizeQuestion(value, language) {
  if (language === 'de') return QUESTION_DE[value] || value;
  if (language === 'ru') return QUESTION_RU[value] || value;
  return value;
}

const DEFAULT_STRATEGY = [
  'Use STAR for behavioral answers.',
  'Explain tradeoffs, not only definitions.',
  'Prepare one project story with measurable impact.',
  'Keep answers structured: context -> action -> result.'
];

const DEFAULT_PREP_ROUTINE = [
  ['5 min', 'Review company and role context'],
  ['10 min', 'Practice behavioral stories'],
  ['10 min', 'Review technical fundamentals'],
  ['5 min', 'Prepare questions for the interviewer']
];

const behavioralPatterns = [
  /tell me about/i,
  /describe/i,
  /how do you handle/i,
  /time you/i,
  /stakeholder/i,
  /strengths/i,
  /weaknesses/i
];

const technicalPatterns = [
  /explain/i,
  /what is/i,
  /difference/i,
  /sql/i,
  /solid/i,
  /design/i,
  /architecture/i,
  /framework/i,
  /testing/i,
  /roadmap/i,
  /metrics/i
];

const MIN_CONTEXT_LENGTH = 30;
const allowedContextPattern = /^[A-Za-z0-9\s.,;:!?'"()[\]{}\/\\&+\-@#%$*_`|<>~=]+$/;
const contextKeywords = [
  'api',
  'backend',
  'code',
  'company',
  'developer',
  'development',
  'engineer',
  'engineering',
  'frontend',
  'interview',
  'job',
  'node',
  'position',
  'react',
  'recruiter',
  'rest',
  'role',
  'screen',
  'software',
  'sql',
  'system',
  'team',
  'teamwork',
  'technical',
  'typescript'
];

function scoreKeywords(text, keywords) {
  return keywords.reduce((score, keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
    const pattern = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    return pattern.test(text) ? score + 1 : score;
  }, 0);
}

function detectCategory(text = '') {
  const lower = text.toLowerCase();
  const frontendScore = scoreKeywords(lower, [
    'frontend', 'front-end', 'front end', 'react', 'next.js', 'nextjs', 'vue', 'angular',
    'javascript', 'typescript', 'html', 'css', 'tailwind', 'responsive', 'ui components',
    'web app', 'browser', 'accessibility', 'state management'
  ]);
  const backendScore = scoreKeywords(lower, [
    'backend', 'back-end', 'back end', 'node.js', 'nodejs', 'express', 'nestjs', 'django',
    'flask', 'fastapi', 'api', 'rest', 'graphql', 'database', 'sql', 'nosql', 'postgresql',
    'mongodb', 'redis', 'microservices', 'authentication', 'server', 'cloud', 'docker'
  ]);
  const designScore = scoreKeywords(lower, [
    'ux', 'ui', 'ux/ui', 'product design', 'interface design', 'user flows', 'wireframes',
    'prototypes', 'figma', 'usability', 'design system', 'user research', 'interaction design',
    'visual design', 'mobile design', 'web design', 'accessibility design'
  ]);

  if (designScore >= 2 && designScore >= frontendScore && designScore >= backendScore) return 'UX/UI Designer';
  if (frontendScore >= 2 && frontendScore >= backendScore) return 'Frontend Developer';
  if (backendScore >= 2) return 'Backend Developer';

  if (lower.match(/engineer|developer|dev|code|software|fullstack|full-stack|python|java|tech|architecture|testing/)) return 'Software Engineering';
  if (lower.match(/product|manager|business|owner|analyst|strategy|roadmap/)) return 'Product / Business';
  if (lower.match(/marketing|seo|content|growth|social|ads|campaign/)) return 'Marketing';
  if (lower.match(/bank|finance|invest|trading|tax|accountant|valuation/)) return 'Finance / Banking';
  if (lower.match(/design|creative|art|product designer/)) return 'Design';
  return 'Other';
}

function validateContext(value = '') {
  const trimmed = value.trim();
  const words = trimmed.toLowerCase().match(/[a-z]+(?:\.[a-z]+)?/g) || [];
  const alphaNumeric = trimmed.replace(/[^A-Za-z0-9]/g, '');
  const uniqueWords = new Set(words);
  const hasContextKeyword = contextKeywords.some((keyword) => (
    new RegExp(`\\b${keyword}\\b`, 'i').test(trimmed)
  ));
  const mostRepeatedWordCount = words.reduce((maxCount, word) => {
    const count = words.filter((item) => item === word).length;
    return Math.max(maxCount, count);
  }, 0);

  if (trimmed.length === 0) {
    return {
      isValid: false,
      reason: 'empty',
      messageKey: 'prep.validationEmpty'
    };
  }

  if (trimmed.length < MIN_CONTEXT_LENGTH) {
    return {
      isValid: false,
      reason: 'too_short',
      messageKey: 'prep.validationShort'
    };
  }

  if (!allowedContextPattern.test(trimmed)) {
    return {
      isValid: false,
      reason: 'non_english',
      messageKey: 'prep.validationEnglish'
    };
  }

  if (!/[A-Za-z]/.test(trimmed) || /^[\d\s.,;:!?'"()[\]{}\/\\&+\-@#%$*_`|<>~=]+$/.test(trimmed)) {
    return {
      isValid: false,
      reason: 'numbers_symbols_only',
      messageKey: 'prep.validationNumbers'
    };
  }

  if (alphaNumeric.length >= 10 && /^([A-Za-z0-9])\1+$/.test(alphaNumeric)) {
    return {
      isValid: false,
      reason: 'spam',
      messageKey: 'prep.validationMeaningful'
    };
  }

  if (words.length >= 3 && uniqueWords.size === 1) {
    return {
      isValid: false,
      reason: 'spam',
      messageKey: 'prep.validationMeaningful'
    };
  }

  if (words.length >= 5 && mostRepeatedWordCount / words.length > 0.7) {
    return {
      isValid: false,
      reason: 'spam',
      messageKey: 'prep.validationMeaningful'
    };
  }

  if (words.length < 4 || !hasContextKeyword) {
    return {
      isValid: false,
      reason: 'gibberish',
      messageKey: 'prep.validationMeaningful'
    };
  }

  return {
    isValid: true,
    reason: 'valid',
    messageKey: 'prep.validationReady'
  };
}

function buildInitialContext(job) {
  if (!job) return '';

  const parts = [
    job.position || job.title,
    job.company ? `at ${job.company}` : '',
    job.location ? `Location: ${job.location}` : '',
    job.notes
  ].filter(Boolean);

  return parts.join('\n');
}

function classifyQuestions(questions) {
  const buckets = {
    behavioral: [],
    technical: [],
    roleSpecific: []
  };

  questions.forEach((question) => {
    if (behavioralPatterns.some((pattern) => pattern.test(question))) {
      buckets.behavioral.push(question);
      return;
    }

    if (technicalPatterns.some((pattern) => pattern.test(question))) {
      buckets.technical.push(question);
      return;
    }

    buckets.roleSpecific.push(question);
  });

  return buckets;
}

function getQuestionGroups(prep) {
  if (Array.isArray(prep?.questions)) {
    return classifyQuestions(prep.questions);
  }

  return {
    behavioral: prep?.questions?.behavioral || [],
    technical: prep?.questions?.technical || [],
    roleSpecific: prep?.questions?.roleSpecific || [],
    portfolio: prep?.questions?.portfolio || [],
    practical: prep?.questions?.practical || []
  };
}

function getQuestionSections(category, questionGroups) {
  if (category === 'Frontend Developer') {
    return [
      { titleKey: 'prep.behavioral', tone: 'behavioral', questions: questionGroups.behavioral },
      { titleKey: 'prep.frontendTechnical', tone: 'technical', questions: questionGroups.technical },
      { titleKey: 'prep.practicalUi', tone: 'practical', questions: questionGroups.roleSpecific }
    ];
  }

  if (category === 'Backend Developer') {
    return [
      { titleKey: 'prep.behavioral', tone: 'behavioral', questions: questionGroups.behavioral },
      { titleKey: 'prep.backendTechnical', tone: 'technical', questions: questionGroups.technical },
      { titleKey: 'prep.systemApi', tone: 'system', questions: questionGroups.roleSpecific }
    ];
  }

  if (category === 'UX/UI Designer') {
    return [
      { titleKey: 'prep.behavioral', tone: 'behavioral', questions: questionGroups.behavioral },
      { titleKey: 'prep.designProcess', tone: 'design', questions: questionGroups.technical },
      { titleKey: 'prep.portfolio', tone: 'portfolio', questions: questionGroups.portfolio },
      { titleKey: 'prep.practicalDesign', tone: 'practical', questions: questionGroups.practical }
    ];
  }

  return [
    { titleKey: 'prep.behavioral', tone: 'behavioral', questions: questionGroups.behavioral },
    {
      titleKey: 'prep.technical',
      tone: 'technical',
      questions: [
        ...questionGroups.technical,
        ...questionGroups.roleSpecific,
        ...questionGroups.portfolio,
        ...questionGroups.practical
      ]
    }
  ];
}

function getInterviewType(category, t) {
  return t(CATEGORY_INTERVIEW_TYPES[category] || CATEGORY_INTERVIEW_TYPES.Other);
}

function PrepChip({ children, tone = 'zinc' }) {
  const tones = {
    zinc: 'of-chip-default',
    indigo: 'of-chip-violet',
    amber: 'of-chip-warning',
    emerald: 'of-chip-success'
  };

  return (
    <span className={`of-chip rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function InsightRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-100">{value}</p>
    </div>
  );
}

function PrepSetup({
  sourceJob,
  jobText,
  setJobText,
  category,
  setCategory,
  isGenerating,
  onGenerate,
  contextValidation,
  showValidationError,
  setHasEditedContext,
  setHasBlurredContext
}) {
  const { language, t } = useTranslation();
  const focusAreas = CATEGORY_FOCUS_AREAS[category] || CATEGORY_FOCUS_AREAS.Other;
  const displayFocusAreas = localizeFocusAreas(focusAreas, language);
  const interviewType = getInterviewType(category, t);
  const categoryOptions = PREP_CATEGORIES.map((option) => ({ value: option, label: t(`category.${option}`) }));
  const sourceDetails = [
    sourceJob?.position || sourceJob?.title,
    sourceJob?.company,
    sourceJob?.location
  ].filter(Boolean);
  const trimmedContextLength = jobText.trim().length;
  const isContextValid = contextValidation.isValid;
  const contextMessage = showValidationError
    ? t(contextValidation.messageKey)
    : t('prep.validationMeaningful');
  const characterCount = trimmedContextLength >= MIN_CONTEXT_LENGTH
    ? `${MIN_CONTEXT_LENGTH}+`
    : `${trimmedContextLength}/${MIN_CONTEXT_LENGTH}`;
  const validationToneClass = showValidationError
    ? 'of-validation-error'
    : isContextValid
    ? 'of-validation-success'
    : 'of-helper-text';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]"
    >
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-2xl shadow-black/20">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <label htmlFor="prep-role-context" className="text-base font-semibold text-zinc-100">
              {t('prep.roleContext')}
            </label>
            <p className="mt-1 text-sm text-zinc-500">
              {t('prep.contextHelp')}
            </p>
          </div>
          <div className="hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-300 sm:block">
            <MessageSquareText size={18} />
          </div>
        </div>

        {sourceDetails.length > 0 && (
          <div className="mb-4 rounded-2xl border border-white/[0.08] bg-zinc-950/45 p-3">
            <div className="of-chip of-chip-violet mb-2 h-6 rounded-full px-2.5 text-[11px] font-semibold">
              {t('prep.detected')}
            </div>
            <div className="grid gap-2 text-xs text-zinc-500 sm:grid-cols-3">
              <div>
                <span className="block font-medium text-zinc-600">{t('modal.role')}</span>
                <span className="block truncate text-zinc-200">{sourceJob?.position || sourceJob?.title || t('common.notSet')}</span>
              </div>
              <div>
                <span className="block font-medium text-zinc-600">{t('modal.company')}</span>
                <span className="block truncate text-zinc-200">{sourceJob?.company || t('common.notSet')}</span>
              </div>
              <div>
                <span className="block font-medium text-zinc-600">{t('modal.location')}</span>
                <span className="block truncate text-zinc-200">{sourceJob?.location || t('common.notSet')}</span>
              </div>
            </div>
          </div>
        )}

        <textarea
          id="prep-role-context"
          required
          aria-required="true"
          minLength={MIN_CONTEXT_LENGTH}
          aria-invalid={showValidationError}
          aria-describedby="prep-role-context-validation"
          className={[
            'min-h-[290px] w-full resize-none rounded-2xl border bg-[#09090b] px-4 py-4 text-sm leading-6 text-zinc-200 outline-none transition-all placeholder:text-zinc-600',
            showValidationError
              ? 'border-rose-500/35 focus:border-rose-400/60 focus:ring-4 focus:ring-rose-500/10'
              : isContextValid
              ? 'border-zinc-800 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10'
              : 'border-zinc-800 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10'
          ].join(' ')}
          placeholder={t('placeholder.prepContext')}
          value={jobText}
          onBlur={() => setHasBlurredContext(true)}
          onChange={(e) => {
            setHasEditedContext(true);
            setJobText(e.target.value);
          }}
        />
        <div id="prep-role-context-validation" className="mt-3 flex items-start justify-between gap-3 text-xs leading-5">
          <p className={`min-w-0 flex-1 ${validationToneClass}`}>
            {contextMessage}
          </p>
          <span className={`shrink-0 font-semibold ${validationToneClass}`}>
            {characterCount}
          </span>
        </div>
      </section>

      <aside className="space-y-5">
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-300">
              <BrainCircuit size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">{t('prep.detectedInsights')}</h3>
              <p className="text-sm text-zinc-500">{t('prep.tuned')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="prep-category" className="mb-2 block text-xs font-medium text-zinc-500">
                {t('prep.category')}
              </label>
              <div id="prep-category">
                <CustomSelect
                  value={category}
                  options={categoryOptions}
                  onChange={setCategory}
                  ariaLabel={t('prep.category')}
                  className="rounded-2xl border-zinc-800 bg-zinc-950 px-4 font-semibold"
                />
              </div>
            </div>

            <InsightRow label={t('prep.interviewType')} value={interviewType} />
            <InsightRow label={t('prep.focusAreas')} value={displayFocusAreas.slice(0, 4).join(', ') || FALLBACK_INSIGHTS.focusAreas} />
            <InsightRow label={t('prep.estimatedTime')} value={FALLBACK_INSIGHTS.prepTime} />
          </div>
        </section>
      </aside>

      <div className="lg:col-span-2">
        <Button
          type="button"
          variant="primary"
          size="large"
          onClick={onGenerate}
          disabled={isGenerating || !isContextValid}
          className="group w-full"
        >
          <Sparkles size={18} />
          {isGenerating ? t('prep.generating') : t('prep.generate')}
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function QuestionCard({ badge, question, meta, tone }) {
  const toneClasses = {
    behavioral: 'of-chip-behavioral',
    technical: 'of-chip-technical',
    system: 'of-chip-system',
    design: 'of-chip-design',
    portfolio: 'of-chip-portfolio',
    practical: 'of-chip-practical'
  };

  return (
    <article className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4 transition-colors hover:border-zinc-700">
      <div className="mb-3">
        <span className={`of-chip whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClasses[tone]}`}>
          {badge}
        </span>
      </div>
      <p className="min-w-0 text-sm font-medium leading-6 text-zinc-100">{question}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{meta}</p>
    </article>
  );
}

function PrepPlan({ category, currentPrep, onBack, onClose }) {
  const { language, t } = useTranslation();
  const questionGroups = getQuestionGroups(currentPrep);
  const questionSections = getQuestionSections(category, questionGroups).filter((section) => section.questions.length > 0);
  const focusAreas = CATEGORY_FOCUS_AREAS[category] || CATEGORY_FOCUS_AREAS.Other;
  const displayFocusAreas = localizeFocusAreas(focusAreas, language);
  const priorityItems = language === 'ru'
    ? [
      `Повтори ${displayFocusAreas[0] || 'основы роли'}`,
      'Подготовь проектную историю с результатом',
      'Отработай примеры коммуникации'
    ]
    : language === 'de'
    ? [
      `Wiederhole ${displayFocusAreas[0] || 'Rollen-Grundlagen'}`,
      'Projektstory mit Wirkung vorbereiten',
      'Kommunikationsbeispiele üben'
    ]
    : [
      `Review ${displayFocusAreas[0] || 'role fundamentals'}`,
      'Prepare one project story with measurable impact',
      'Practice concise communication examples'
    ];
  const strategy = (currentPrep?.strategy || DEFAULT_STRATEGY).map((item) => localizePrepText(item, language));
  const routine = (currentPrep?.prepRoutine || DEFAULT_PREP_ROUTINE).map(([time, task]) => [time, localizePrepText(task, language)]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <section className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="of-chip of-chip-success mb-2 rounded-full px-3 py-1 text-xs font-semibold">
              <CheckCircle2 size={14} />
              {t('prep.ready')}
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-300">
              {t('prep.readyBody')}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-zinc-300">
              <p className="text-xs font-semibold uppercase text-zinc-500">{t('prep.priority')}</p>
              {priorityItems.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-indigo-300" />
                  <span className="min-w-0 flex-1 leading-5">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:min-w-[260px]">
            <PrepChip tone="indigo"><Target size={13} /> {t('prep.focusAreas')}</PrepChip>
            <PrepChip tone="amber"><MessageSquareText size={13} /> {t('prep.practiceQuestions')}</PrepChip>
            <PrepChip><ClipboardCheck size={13} /> {t('prep.answerStrategy')}</PrepChip>
            <PrepChip tone="emerald"><Clock3 size={13} /> 30 min</PrepChip>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-100">
          <Target size={17} className="text-indigo-300" />
          {t('prep.focusAreas')}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {displayFocusAreas.map((area) => (
            <div key={area} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
              {area}
            </div>
          ))}
        </div>
      </section>

      {questionSections.map((section) => (
        <section key={section.titleKey} className="space-y-3">
          <h3 className="font-semibold text-zinc-100">{t(section.titleKey || section.title)}</h3>
          <div className="grid gap-3">
            {section.questions.map((question) => (
              <QuestionCard
                key={question}
                badge={t(section.titleKey || section.title).replace(' Questions', '').replace('Fragen', '').replace('Вопросы', '').replace('вопросы', '').trim()}
                question={localizeQuestion(question, language)}
                meta={section.tone === 'behavioral' ? t('prep.tests') : t('prep.review')}
                tone={section.tone}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-100">
            <Zap size={17} className="text-amber-300" />
            {t('prep.answerStrategy')}
          </h3>
          <div className="space-y-3">
            {strategy.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm leading-5 text-zinc-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-indigo-300" />
                <span className="min-w-0 flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-zinc-100">
            <Clock3 size={17} className="text-emerald-300" />
            {t('prep.routine')}
          </h3>
          <div className="space-y-3">
            {routine.map(([time, task]) => (
              <div key={time} className="flex min-h-14 items-start gap-[9px] rounded-2xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                <span className="w-[47px] shrink-0 pt-0.5 text-xs font-semibold text-indigo-300">{time}</span>
                <span className="min-w-0 flex-1 text-sm leading-5 text-zinc-300">{task}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:justify-end sm:gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="w-full whitespace-nowrap sm:w-auto sm:min-w-[180px]"
        >
          <span className="hidden sm:inline">{t('prep.back')}</span>
          <span className="sm:hidden">{t('prep.backShort')}</span>
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onClose}
          className="w-full whitespace-nowrap sm:w-auto sm:min-w-[240px]"
        >
          <span className="hidden sm:inline">{t('prep.closePlan')}</span>
          <span className="sm:hidden">{t('prep.closePlanShort')}</span>
        </Button>
      </div>
    </motion.div>
  );
}

export default function InterviewPrepModal({ isOpen, onClose, initialData }) {
  const { t } = useTranslation();
  const [jobText, setJobText] = useState('');
  const [category, setCategory] = useState('Other');
  const [step, setStep] = useState('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasEditedContext, setHasEditedContext] = useState(false);
  const [hasBlurredContext, setHasBlurredContext] = useState(false);
  const [hasAttemptedGenerate, setHasAttemptedGenerate] = useState(false);
  const [hasManualCategory, setHasManualCategory] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const nextContext = buildInitialContext(initialData);
    setJobText(nextContext);
    setCategory(detectCategory(nextContext));
    setStep('input');
    setIsGenerating(false);
    setHasEditedContext(false);
    setHasBlurredContext(false);
    setHasAttemptedGenerate(false);
    setHasManualCategory(false);
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (hasManualCategory) return;

    if (!jobText.trim()) {
      setCategory('Other');
      return;
    }

    setCategory(detectCategory(jobText));
  }, [hasManualCategory, jobText]);

  const handleCategoryChange = (nextCategory) => {
    setHasManualCategory(true);
    setCategory(nextCategory);
  };

  const currentPrep = useMemo(() => prepData[category] || prepData.Other, [category]);
  const contextValidation = useMemo(() => validateContext(jobText), [jobText]);
  const isContextValid = contextValidation.isValid;
  const showValidationError = !isContextValid && (hasEditedContext || hasBlurredContext || hasAttemptedGenerate);

  const handleGenerate = () => {
    setHasAttemptedGenerate(true);

    if (!isContextValid) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep('result');
    }, 800);
  };

  const subtitle = step === 'result'
    ? `${t(`category.${category}`)} | ${getInterviewType(category, t)}`
    : t('prep.subtitle');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-prep-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative flex max-h-[92vh] w-full max-w-[960px] flex-col overflow-hidden rounded-[24px] border border-zinc-800 bg-[#0b0b0f] shadow-2xl shadow-black/70"
          >
            <header className="shrink-0 border-b border-zinc-800/80 bg-zinc-950/60 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                  {step === 'result' ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => setStep('input')}
                      aria-label={t('prep.back')}
                      className="mt-1 shrink-0 text-zinc-400"
                    >
                      <ArrowLeft size={18} />
                    </Button>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-500/10">
                      <Sparkles size={22} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 id="interview-prep-title" className="max-w-full break-words text-xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-2xl">
                      {step === 'result' ? t('prep.planTitle') : t('prep.title')}
                    </h2>
                    <p className="mt-1 max-w-full break-words text-sm leading-5 text-zinc-500">{subtitle}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label={t('prep.title')}
                  className="shrink-0"
                >
                  <X size={20} />
                </Button>
              </div>

              {step === 'input' && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <PrepChip tone="amber"><Layers3 size={13} /> {t('prep.statusInterview')}</PrepChip>
                  <PrepChip tone="indigo"><Target size={13} /> {t('prep.category')}: {t(`category.${category}`)}</PrepChip>
                  <PrepChip><Sparkles size={13} /> {t('prep.aiPrep')}</PrepChip>
                </div>
              )}
            </header>

            <div className="modal-scrollbar flex-1 overflow-y-auto p-5 pb-6 sm:p-6 sm:pb-7">
              {step === 'input' ? (
                <PrepSetup
                  sourceJob={initialData}
                  jobText={jobText}
                  setJobText={setJobText}
                  category={category}
                  setCategory={handleCategoryChange}
                  isGenerating={isGenerating}
                  contextValidation={contextValidation}
                  showValidationError={showValidationError}
                  setHasEditedContext={setHasEditedContext}
                  setHasBlurredContext={setHasBlurredContext}
                  onGenerate={handleGenerate}
                />
              ) : (
                <PrepPlan
                  category={category}
                  currentPrep={currentPrep}
                  onBack={() => setStep('input')}
                  onClose={onClose}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

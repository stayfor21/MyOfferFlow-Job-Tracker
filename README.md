# MyOfferFlow - Job Application Tracker

MyOfferFlow is a modern job application tracking dashboard designed to help users manage their hiring pipeline from the first application to the final offer.

It combines a visual Kanban board, smart planning tools, interview preparation, career goals, analytics, reminders, and multilingual support into one focused productivity workspace.

The goal of MyOfferFlow is simple: help job seekers stay organized, act on time, prepare better, and move through the hiring process with more clarity.

---

## Overview

<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/3ba563d9-2aa8-4176-85d7-135cb131d88e" />

Searching for a job often becomes chaotic: applications are spread across emails, notes, spreadsheets, job boards, and memory. MyOfferFlow solves this by giving users one structured workspace where every opportunity can be tracked, updated, planned, and analyzed.

Users can add job applications, move them through hiring stages, set priorities, mark dream jobs, schedule follow-ups, prepare for interviews, track career goals, and view insights about their job search progress.

MyOfferFlow is built as a polished SaaS-style dashboard with support for light and dark themes, multilingual UI, smart planner features, and a responsive interface.

Link: https://myofferflow.pages.dev

---

## Key Features

### 1. Kanban Job Pipeline

MyOfferFlow uses a visual Kanban board to track applications by status.

Default pipeline stages:

- Applied
- Screening
- Interview
- Offer
- Rejected

Users can drag and drop job cards between columns to update their current status.

Each column includes:

- Status label
- Application count
- Empty state
- Drop area
- Status-aware hover and drag states

The Kanban board gives users a clear overview of where every opportunity currently stands.

---

### 2. Job Application Cards

Each application is displayed as a compact but informative card.

A job card can show:

- Role title
- Company name
- Current status
- Priority level
- Dream Job tag
- Application date
- Next action
- Follow-up reminder
- Interview preparation shortcut
- Job link indicator

The card design is optimized to remain readable even when multiple tags and reminders are active.

Cards are designed to be:

- Compact
- Scannable
- Status-aware
- Drag-friendly
- Responsive
- Theme-aware

---

### 3. Add and Edit Application Drawer

Users can create or edit applications through a detailed side drawer.

The drawer includes sections for:

- Overview
- Company
- Role
- Location
- Date applied
- Job link
- Status
- Source
- Priority
- Dream Job preference
- Next action
- Due date
- Follow-up reminder
- Follow-up notes

The drawer supports both add mode and edit mode.

Edit mode includes actions such as:

- Save changes
- Close
- Archive application
- Delete application

The footer is adaptive and designed to avoid overflow in English, German, Russian, and Ukrainian.

---

### 4. Smart Filters

MyOfferFlow includes a smart filter bar that allows users to quickly focus on specific groups of applications.

Available filters include:

- All
- Dream Jobs
- High Priority
- Due Today
- Interviews
- Offers
- Rejected
- Archived
- Hide Rejected

Each filter displays a count and uses theme-aware styling.

The filters help users quickly narrow down the board without losing context.

---

### 5. Smart Planner

The Smart Planner helps users organize job search tasks by day.

<img width="709" height="730" alt="image" src="https://github.com/user-attachments/assets/ce69a5d0-2f71-49bc-8484-c81943e3ab58" />

It includes:

- Today view
- Week view
- Suggestions
- Completed tasks
- Calendar strip
- Manual task creation
- Auto-generated tasks from applications
- Task completion tracking

The calendar strip shows upcoming days and task counts, allowing users to quickly select a date and view relevant tasks.

Planner tasks can include:

- Prepare for interview
- Send follow-up
- Send thank-you note
- Respond to recruiter
- Review offer
- Manual custom tasks

The planner is connected to application data, so it can suggest or display tasks based on the current state of the hiring pipeline.

---

### 6. Interview Preparation

MyOfferFlow includes an interview preparation flow that helps users create structured preparation plans for specific applications.

The preparation system can use:

- Job description
- Role context
- Company information
- Application category
- Interview type
- Focus areas

Supported interview preparation categories include:

- Software Engineering
- Frontend Developer
- Backend Developer
- UX/UI Designer
- Product / Business
- Marketing
- Finance / Banking
- Design
- Other

The preparation plan can include:

- Technical questions
- Behavioral questions
- Answer strategy
- 30-minute preparation routine
- Focus areas
- Suggested talking points

The preparation flow is designed to help users prepare with more confidence and structure.

---

### 7. Insight Dashboard

MyOfferFlow includes a dedicated insights section for understanding job search performance.

<img width="1914" height="788" alt="image" src="https://github.com/user-attachments/assets/baba8e21-73c3-4c07-952d-519d25d4125b" />

The dashboard includes:

- Today’s Focus
- Application Efficiency
- Pipeline Distribution
- Success Ratio
- Active Trials
- Rejection Rate
- Total Reach

The dashboard helps users understand:

- How many applications are active
- How many interviews are in progress
- How many offers were received
- Where applications are concentrated
- Whether the current strategy is working

The design uses a clear visual hierarchy with cards, progress bars, metrics, and status indicators.

---

### 8. Career Goals

MyOfferFlow includes a Career Goals section where users can set and track job search targets.

<img width="1918" height="418" alt="image" src="https://github.com/user-attachments/assets/a6092ad5-f831-43cd-b223-f8b45d8b70ab" />

Supported goal types include:

- Applications
- Interviews
- Follow-ups
- Interview preparation
- New opportunities
- Custom goals

Goal periods can include:

- This week
- This month
- Next 7 days
- Next 30 days
- Custom date range

Each goal card can show:

- Goal title
- Period
- Progress
- Percentage
- Remaining count
- Deadline
- Goal status
- Progress bar

Goal progress is calculated from the current source of truth where possible.

For example:

- Interview goals reflect current jobs in the Interview stage.
- Application goals reflect applications added or applied within the selected period.
- Follow-up goals reflect completed follow-up tasks.
- Custom goals can be manually updated.

This makes the goal system dynamic and connected to real user activity.

---

### 9. Light and Dark Themes

MyOfferFlow supports both light and dark themes.

The default theme for new users is light mode.

Theme behavior:

- New users see light theme by default.
- Existing saved theme preferences are respected.
- Theme selection persists after refresh.
- Invalid saved theme values fallback to light mode.

Both themes are designed with:

- Theme-aware surfaces
- Accessible text contrast
- Soft borders
- Premium shadows
- Consistent cards
- Styled scrollbars
- Status-aware colors

The light theme is designed to feel clean, modern, and professional, while the dark theme provides a premium low-light dashboard experience.

---

### 10. Multilingual Support

MyOfferFlow supports three interface languages:

- English
- German
- Russian

The language switcher is available in the header.

The UI is localized across:

- Navigation
- Buttons
- Forms
- Drawers
- Filters
- Planner
- Interview preparation
- Career goals
- Dashboard
- Empty states
- Validation messages
- Footer

User-generated data such as company names, roles, notes, and job descriptions are not translated automatically.

The application avoids using translated strings as internal identifiers to prevent data and logic issues across languages.

---

### 11. Footer

MyOfferFlow includes a minimal product footer at the bottom of the dashboard.

The footer includes:

- Brand mark
- Product tagline
- Quick section links
- Version text
- Product status line

Footer links can navigate to:

- Board
- Insights
- Goals
- Planner

The footer is intentionally compact and designed as a quiet ending to the dashboard, not as a marketing landing-page footer.

---

## Design Philosophy

MyOfferFlow is designed as a premium productivity dashboard.

The visual style focuses on:

- Clean layout
- Strong visual hierarchy
- Soft shadows
- Rounded cards
- Muted surfaces
- Violet brand accents
- Compact information density
- Consistent spacing
- Smooth hover states
- Light and dark theme parity

The interface is built to feel calm, organized, and focused.

Design priorities:

1. Clarity over decoration
2. Productivity over noise
3. Consistency across all components
4. Strong readability in all themes
5. Smooth interactions without layout shifts
6. Responsive behavior across screen sizes

---

## Core User Flow

A typical user flow looks like this:

1. Add a new job application.
2. Fill in company, role, location, job link, and status.
3. Set priority and optionally mark it as a Dream Job.
4. Add a next action or follow-up reminder.
5. Move the job card through the Kanban pipeline.
6. Use Smart Planner to manage upcoming tasks.
7. Generate an interview preparation plan when the job reaches Interview.
8. Track progress through Insight Dashboard.
9. Set Career Goals and monitor progress.
10. Archive or update applications as the search evolves.

---

## Application Status Logic

MyOfferFlow tracks applications using status-based stages:

| Status | Purpose |
|---|---|
| Applied | Initial application submitted |
| Screening | Recruiter or company screening stage |
| Interview | Active interview process |
| Offer | Offer received |
| Rejected | Application rejected |

Moving a card between stages updates the current state of the application.

Status-based analytics and goals are derived from the current application data.

---

## Smart Planner Logic

The planner can include both manual and automatic tasks.

Auto-generated tasks may depend on:

- Current job status
- Follow-up dates
- Interview status
- Offer status
- Next action
- Reminder dates

Completed tasks should remain completed across language changes and page refreshes.

Task identity should be based on stable IDs, not translated labels.

---

## Career Goal Logic

Career Goals are calculated from current data whenever possible.

Auto-calculated goals should not store stale progress values.

Examples:

- Interview goals count jobs currently in Interview.
- Offer goals count jobs currently in Offer.
- Application goals count jobs created or applied within the goal date range.
- Follow-up goals count completed follow-up actions.
- Custom goals use manual progress.

Archived jobs are excluded from active goal calculations by default.

This ensures that goal progress stays accurate when applications are moved, archived, or updated.

---

## Interview Preparation Logic

Interview preparation is generated based on application context.

The user can provide job or interview context, and the system generates a structured preparation plan.

Validation rules can include:

- Required context
- Minimum character count
- English-only job context input
- Spam or meaningless text prevention

The generated preparation content should be displayed in the selected interface language where applicable.

---

## Responsive Design

MyOfferFlow is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile screens

Responsive behavior includes:

- Stacked layouts on smaller screens
- Horizontal scrolling where appropriate
- Adaptive drawer footer buttons
- Compact planner calendar strip
- Flexible filter row
- Responsive dashboard cards
- Mobile-friendly forms

The interface should avoid horizontal page overflow.

---

## Mobile and Tablet Access

MyOfferFlow is currently available as a web application and can be used directly from a browser on desktop, tablet, and mobile devices.

At this stage, MyOfferFlow does not have a native app in the Apple App Store or Google Play Store. Native iOS and Android applications may be considered in the future as the project grows and scales.

For now, users can still add MyOfferFlow to their device home screen and use it in an app-like experience.

### Add MyOfferFlow to the Home Screen

On mobile and tablet devices, users can add MyOfferFlow to the home screen through the browser.

#### On Android / Google Chrome

1. Open MyOfferFlow in Google Chrome.
2. Tap the three-dot menu in the top-right corner.
3. Select **Add to Home screen** or **Install app** if available.
4. Confirm the action.

After that, MyOfferFlow will appear on the home screen and can be opened like a regular app.

#### On iPhone or iPad / Safari

1. Open MyOfferFlow in Safari.
2. Tap the **Share** button.
3. Select **Add to Home Screen**.
4. Confirm the action.

This creates a home screen shortcut for quick access to MyOfferFlow.

### Current Mobile Experience

The mobile and tablet versions are optimized for browser-based usage, including:

- Responsive layouts
- Touch-friendly controls
- Mobile and tablet Kanban interaction
- Smart Planner access
- Light and dark themes
- English, German, Russian, and Ukrainian interface support

Native mobile apps are not available yet, but they are a possible future direction for the project.

---

## License

All rights reserved.

This project is provided for portfolio and demonstration purposes. The source code, design, structure, and implementation may not be copied, modified, distributed, sublicensed, or used in other projects without explicit written permission from the author.

Users are allowed to access and use the deployed MyOfferFlow application as an end product through the official website or authorized deployment.

You may not reverse engineer, reproduce, resell, redistribute, or create derivative works based on the source code or interface without permission.

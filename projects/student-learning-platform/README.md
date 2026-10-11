# LearnLab — Student Learning Platform MVP

A small interactive learning prototype with three short security fundamentals lessons, multiple-choice knowledge checks, and progress saved in the current browser.

## Features
- Three lessons on web fundamentals, password storage, and SQL injection prevention.
- Quiz feedback with explanations.
- Completion progress meter with accessible progress attributes.
- Browser-local progress persistence using `localStorage`.
- Reset progress control and responsive layout.

## Run
Open [index.html](index.html) in a modern browser. No build tools or external dependencies are required.

## Important limitations
This is a **frontend MVP**, not a production multi-user learning platform. It has no account system, backend API, server-side authorisation, or cloud progress sync. Browser-local progress can be modified by the user and is tied to that browser profile. Do not use it to store sensitive information.

## Next engineering milestones
1. Add a real backend and database schema for users, courses, lessons, quiz attempts, and progress.
2. Implement secure authentication and server-side access controls.
3. Add automated tests and migrations.
4. Deploy the backend with environment secrets stored outside source control.

## Skills demonstrated
JavaScript state management, form handling, quiz logic, local persistence, accessible UI, and explicit scope documentation.

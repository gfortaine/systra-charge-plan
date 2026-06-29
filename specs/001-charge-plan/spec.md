# Feature Specification: Charge Plan Table

## Objective

Deliver the SYSTRA coding exercise as a focused charge-plan application built from the provided Django and React boilerplate.

The application lets a reviewer manage planned workload rows, persist them in PostgreSQL, and verify that the monetary amount is calculated by the backend from a person's daily rate.

## Scope

In scope:

- Display a public charge-plan table without authentication.
- Seed selectable people and projects from the backend.
- Add and delete charge-plan rows.
- Edit planned hours directly in the table.
- Sort rows by person and project.
- Save the table and reload persisted rows.
- Compute each amount server-side with `amount = tjm * planned_hours / 8`.
- Keep `tjm` private to the backend.
- Keep the implementation on the original boilerplate stack.
- Provide automated backend and frontend tests plus Docker Compose validation.

Out of scope:

- Authentication and authorization.
- A public hosted demo environment.
- Product LLM features or assistant UI.
- Exposing `tjm` to the frontend, GraphQL schema, or client payloads.
- Preserving unrelated boilerplate demo pages as public runtime features.

## User Stories

### Reviewer opens the exercise

As a reviewer, I can start the application with Docker Compose and open the public charge-plan page without logging in.

Acceptance criteria:

- The root route displays the charge-plan table.
- The application starts with a simple Docker Compose command.
- Backend migrations and seed data run in the containerized environment.

### Reviewer creates a line

As a reviewer, I can add a new line, choose a person and a project, enter planned hours, and save the table.

Acceptance criteria:

- People and projects come from backend data.
- Planned hours are editable.
- Saving persists rows.
- Reloading the page shows the saved rows.

### Backend computes amounts

As a reviewer, I can see an amount for each row without the frontend knowing the daily rate.

Acceptance criteria:

- The backend computes `amount = tjm * planned_hours / 8`.
- The amount is rounded consistently to cents.
- The frontend receives the computed amount.
- The frontend never receives or sends `tjm`.

### Reviewer sorts and deletes rows

As a reviewer, I can sort by person or project and delete rows before saving.

Acceptance criteria:

- Sorting works for person and project columns.
- Deleting a row removes it from the draft table.
- Saving after deletion updates persisted rows.

## Quality Requirements

- Backend code remains typed and compatible with mypy.
- Backend linting remains green.
- Calculation behavior is covered by pytest service tests.
- Frontend code remains JavaScript, not TypeScript.
- Frontend linting remains green.
- Frontend helper behavior is covered by automated tests.
- The application remains testable through Docker Compose.

## AI-Augmented Development Guardrails

Spec Kit is used as the lightweight substrate for AI-assisted engineering:

- Requirements are written before implementation.
- The technical plan constrains the solution to the boilerplate stack.
- Tasks map the spec to reviewable implementation slices.
- Generated or assisted code is accepted only after deterministic validation.

This mirrors the kind of structure a team needs before adopting GitLab Duo or similar AI coding assistants broadly: clear intent, reviewable tasks, and objective gates before code is trusted.

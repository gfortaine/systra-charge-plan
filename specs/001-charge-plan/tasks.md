# Tasks: Charge Plan Table

## Specification and Setup

- [x] Preserve the exercise brief in `docs/specs/systra-coding-exercise.pdf`.
- [x] Keep the implementation on the SYSTRA Django and React boilerplate stack.
- [x] Define the public charge-plan feature scope.
- [x] Keep confidential interview context out of the repository.

## Backend

- [x] Add charge-plan models for people, projects, and lines.
- [x] Seed deterministic people and projects.
- [x] Implement a typed amount calculation service.
- [x] Cover formula behavior with pytest service tests.
- [x] Expose charge-plan GraphQL queries and mutation.
- [x] Keep daily rates backend-only.
- [x] Narrow the public GraphQL schema to the exercise surface.

## Frontend

- [x] Add a public charge-plan page on the root route.
- [x] Display the table with React and MUI DataGrid.
- [x] Support adding and deleting rows.
- [x] Support person and project selection.
- [x] Support planned-hours editing.
- [x] Support sorting by person and project.
- [x] Save and reload persisted rows.
- [x] Ensure save payloads never include `tjm`.
- [x] Cover frontend helper behavior with automated tests.

## Docker and Validation

- [x] Make Docker Compose run without a required local `.env` file.
- [x] Run migrations visibly during container startup.
- [x] Verify PostgreSQL-backed startup.
- [x] Verify the public UI loads without authentication.
- [x] Verify add, edit, save, reload, sort, and delete behavior.
- [x] Run backend pytest.
- [x] Run Django checks.
- [x] Run backend lint and mypy checks.
- [x] Run frontend tests.
- [x] Run frontend lint.
- [x] Run frontend production build.
- [x] Verify Docker Compose remains the canonical reviewer path.

## Public Repository Hygiene

- [x] Remove hardcoded production secret material from public history.
- [x] Keep local confidential PDFs ignored through local Git configuration.
- [x] Keep `.specify/` tool state out of the public deliverable.
- [x] Add concise Spec Kit artifacts as reviewable AI/DX documentation.
- [x] Keep the submitted branch focused on the deterministic exercise, not a product LLM feature.

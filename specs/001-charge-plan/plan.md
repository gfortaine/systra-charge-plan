# Implementation Plan: Charge Plan Table

## Technical Context

The exercise starts from the SYSTRA Django and React boilerplate. The implementation keeps the boilerplate stack and quality gates:

- Django and Python 3.14 backend
- Strawberry GraphQL API
- PostgreSQL persistence
- React and MUI frontend
- Vite build tooling
- JavaScript frontend files
- pytest, mypy, and backend linters
- Vitest and frontend linters
- Docker Compose for reviewer validation

## Architecture

### Backend domain

Add a small charge-plan domain:

- `Person`: first name, last name, backend-only daily rate.
- `Project`: project name.
- `ChargePlanLine`: person, project, planned hours.

Seed deterministic people and projects through migrations so a fresh database can be exercised immediately.

### Calculation service

Place the amount formula in a backend service instead of duplicating it in the frontend:

```text
amount = tjm * planned_hours / 8
```

The service is responsible for decimal handling, cent rounding, and rejecting invalid planned hours.

### GraphQL contract

Expose only the charge-plan contract needed by the exercise:

- list people
- list projects
- list charge-plan lines
- save the full charge-plan table

Do not expose daily rates in the schema or responses.

### Frontend table

Use a React/MUI DataGrid page for the root route:

- Add rows.
- Delete rows.
- Select person and project.
- Edit planned hours.
- Sort by person and project.
- Save the full table.

The frontend sends only person ID, project ID, and planned hours.

## Public Runtime Boundary

The submitted runtime is intentionally narrowed to the exercise feature. Because the app is public and does not require authentication, unrelated boilerplate demo GraphQL operations and pages are not part of the public surface.

The original boilerplate remains traceable through the `boilerplate-baseline` Git tag, while the delivered application focuses on the requested charge-plan behavior.

## Validation Strategy

Backend:

- pytest service tests for the amount formula
- Django system check
- backend lint and mypy checks

Frontend:

- helper tests for row normalization and save payloads
- checks that save payloads never include `tjm`
- lint and production build

Runtime:

- Docker Compose build/start
- PostgreSQL-backed migration and seed data
- GraphQL smoke checks
- browser validation of add, edit, save, reload, sort, and delete behavior

## AI-Augmented Development Strategy

Spec Kit structures AI assistance around durable engineering artifacts rather than one-off prompts:

1. Specification defines the expected behavior.
2. Plan constrains the implementation to the SYSTRA boilerplate stack.
3. Tasks split the work into reviewable increments.
4. Tests and Docker Compose decide whether assisted code is accepted.

This approach is compatible with GitLab Duo-style adoption because the AI tool operates inside a disciplined delivery process instead of replacing architecture review.

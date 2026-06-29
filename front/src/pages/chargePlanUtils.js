export function createDraftLine(people, projects) {
  return {
    id: `draft-${crypto.randomUUID()}`,
    personId: people[0]?.id ?? '',
    projectId: projects[0]?.id ?? '',
    plannedHours: '0',
    amount: null,
    isDraft: true,
  }
}

export function normalizeChargePlanLine(line) {
  return {
    id: line.id,
    personId: line.person.id,
    personName: line.person.fullName,
    projectId: line.project.id,
    projectName: line.project.name,
    plannedHours: String(line.plannedHours),
    amount: line.amount,
    isDraft: false,
  }
}

export function buildSavePayload(rows) {
  return rows.map(row => ({
    personId: row.personId,
    projectId: row.projectId,
    plannedHours: String(row.plannedHours).trim() || '0',
  }))
}

export function isPersonOrProjectSort(field) {
  return field === 'personName' || field === 'projectName'
}

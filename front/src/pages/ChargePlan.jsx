import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import useGraphql from '@src/graphql'
import chargePlanQuery from '@src/graphql/ChargePlan.query.graphql'
import saveChargePlanMutation from '@src/graphql/SaveChargePlan.mutation.graphql'
import {
  buildSavePayload,
  createDraftLine,
  isPersonOrProjectSort,
  normalizeChargePlanLine,
} from './chargePlanUtils'

function formatAmount(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return ''
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount))
}

export default function ChargePlan() {
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [people, setPeople] = useState([])
  const [projects, setProjects] = useState([])
  const [rows, setRows] = useState([])
  const [sortModel, setSortModel] = useState([{ field: 'personName', sort: 'asc' }])
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isCancelled = false
    graphqlQuery(chargePlanQuery).then(answer => {
      if (isCancelled) {
        return
      }
      setPeople(answer.allPeople ?? [])
      setProjects(answer.allProjects ?? [])
      setRows((answer.allChargePlanLines ?? []).map(normalizeChargePlanLine))
    }).catch(err => {
      setError(String(err))
    })
    return () => {
      isCancelled = true
    }
  }, [graphqlQuery])

  function patchRow(id, patch) {
    setRows(rows => rows.map(row => row.id === id ? { ...row, ...patch, amount: null } : row))
  }

  function handleAddRow() {
    setRows(rows => [...rows, createDraftLine(people, projects)])
  }

  function handleDeleteRow(id) {
    setRows(rows => rows.filter(row => row.id !== id))
  }

  async function handleSave() {
    setError(null)
    setIsSaving(true)
    try {
      const answer = await graphqlMutate(saveChargePlanMutation, { lines: buildSavePayload(rows) })
      setRows((answer.saveChargePlan ?? []).map(normalizeChargePlanLine))
    } catch (err) {
      setError(String(err))
    } finally {
      setIsSaving(false)
    }
  }

  const columns = useMemo(() => [
    {
      field: 'personName',
      headerName: 'Personne',
      flex: 1,
      minWidth: 220,
      renderCell: params => (
        <Select
          value={params.row.personId}
          onChange={event => {
            const person = people.find(person => person.id === event.target.value)
            patchRow(params.row.id, {
              personId: event.target.value,
              personName: person?.fullName ?? '',
            })
          }}
          fullWidth
          size="small"
        >
          {people.map(person => (
            <MenuItem key={person.id} value={person.id}>{person.fullName}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'projectName',
      headerName: 'Projet',
      flex: 1,
      minWidth: 220,
      renderCell: params => (
        <Select
          value={params.row.projectId}
          onChange={event => {
            const project = projects.find(project => project.id === event.target.value)
            patchRow(params.row.id, {
              projectId: event.target.value,
              projectName: project?.name ?? '',
            })
          }}
          fullWidth
          size="small"
        >
          {projects.map(project => (
            <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'plannedHours',
      headerName: 'Heures prevues',
      width: 160,
      sortable: false,
      renderCell: params => (
        <TextField
          value={params.row.plannedHours}
          onChange={event => patchRow(params.row.id, { plannedHours: event.target.value })}
          type="number"
          size="small"
          slotProps={{ htmlInput: { min: 0, step: 0.25 } }}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Montant',
      width: 160,
      sortable: false,
      valueFormatter: value => formatAmount(value),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: params => (
        <IconButton aria-label="Supprimer la ligne" onClick={() => handleDeleteRow(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ], [people, projects])

  return (
    <Stack className="view" spacing={2}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4">Plan de charge equipe</Typography>
          <Typography variant="body2" color="text.secondary">
            Le TJM reste calcule cote backend. Le front sauvegarde uniquement personne, projet et heures.
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRow} disabled={!people.length || !projects.length}>
            Ajouter
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={isSaving}>
            Sauvegarder
          </Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper elevation={5} sx={{ height: 560, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          sortModel={sortModel}
          onSortModelChange={model => setSortModel(model.filter(item => isPersonOrProjectSort(item.field)))}
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          localeText={{
            noRowsLabel: 'Aucune ligne sauvegardee',
          }}
        />
      </Paper>
    </Stack>
  )
}

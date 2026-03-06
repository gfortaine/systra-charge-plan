import Paper from '@mui/material/Paper'
import { DataGrid } from '@mui/x-data-grid'
import {
  BarChart,
  PieChart,
} from '@mui/x-charts'
import './DataGridDemo.scoped.scss'

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'gender',
    headerName: 'Gender',
    width: 110,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
]

const rows = [
  { id: 1, lastName: 'Ackerman', firstName: 'Mikasa', gender: 'F', age: 15 },
  { id: 2, lastName: 'Jäger', firstName: 'Eren', gender: 'M', age: 15 },
  { id: 3, lastName: 'Arlelt', firstName: 'Armin', gender: 'M', age: 15 },
  { id: 4, lastName: 'Ackerman', firstName: 'Livai', gender: 'M', age: 34 },
  { id: 5, lastName: 'Kirschtein', firstName: 'Jean', gender: 'M', age: 15 },
  { id: 6, lastName: 'Braus', firstName: 'Sasha', gender: 'F', age: 16 },
  { id: 7, lastName: 'Springer', firstName: 'Conny', gender: 'M', age: 15 },
  { id: 8, lastName: 'Smith', firstName: 'Erwin', gender: 'M', age: null },
  { id: 9, lastName: 'Zoe', firstName: 'Hansi', gender: '?', age: null },
  { id: 10, lastName: 'Leonhart', firstName: 'Annie', gender: 'F', age: 16 },
]

export default function DataGridDemo() {
  const ageRange = [...new Set(rows.map(item => item.age ? item.age : 'Unknown'))].sort()
  const ageRepartition = new Map(ageRange.map(age => [age, 0]))
  ageRepartition.keys().forEach(age => {
    if (age === 'Unknown') {
      ageRepartition.set('Unknown', rows.filter(item => item.age === null).length)
    } else {
      ageRepartition.set(age, rows.filter(item => item.age === age).length)
    }
  })
  const ageData = Object.values(Object.fromEntries(ageRepartition))

  function countByGender (gender) {
    return rows.filter(item => item.gender === gender).length
  }

  return (
    <div className="view">
      <Paper elevation="5" className="charts-paper">
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: ageRange,
            },
          ]}
          series={[
            {
              data: ageData,
            },
          ]}
          height={300}
        />
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: countByGender('M'), label: 'M' },
                { id: 1, value: countByGender('F'), label: 'F' },
                { id: 2, value: countByGender('?'), label: 'Unknown' },
              ],
            },
          ]}
          width={200}
          height={200}
        />
      </Paper>
      <Paper elevation="5" className="grid-paper" sx={{ display: 'flex', flexDirection: 'column' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </div>
  )
}

export interface TableColumn {
  key: string
  title: string
  dataIndex?: string
  field?: string
  width: number
  fixed?: 'left' | 'right'
}

export function useTableColumns(): TableColumn[] {
  return [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      field: 'id',
      width: 60,
      fixed: 'left',
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      field: 'name',
      width: 120,
    },
    { key: 'age', title: 'Age', dataIndex: 'age', field: 'age', width: 80 },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      field: 'email',
      width: 280,
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'phone',
      field: 'phone',
      width: 180,
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      field: 'department',
      width: 120,
    },
    {
      key: 'address',
      title: 'Address',
      dataIndex: 'address',
      field: 'address',
      width: 280,
    },
    {
      key: 'date',
      title: 'Date',
      dataIndex: 'date',
      field: 'date',
      width: 120,
    },
  ]
}

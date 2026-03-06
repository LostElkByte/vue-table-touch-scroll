export interface TableRow {
  id: number
  name: string
  age: number
  email: string
  phone: string
  department: string
  address: string
  date: string
}

export function useTableData(count: number = 50): TableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    age: 20 + (i % 40),
    email: `user${i + 1}@example.com`,
    phone: `+1 ${String(i).padStart(3, '0')}-${String(i * 10).padStart(4, '0')}`,
    department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
    address: `No. ${i + 1}, Street ${i % 10}, City ${i % 5}`,
    date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
  }))
}

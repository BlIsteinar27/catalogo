import { EditProductServer } from './page-server'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <EditProductServer params={params} />
}

import { getCategoryListWithProductCount, getCategoryStats } from '@/server/categories'
import { CategoriesClient } from './page-client'

export async function CategoriesServer() {
  const [categories, stats] = await Promise.all([
    getCategoryListWithProductCount(),
    getCategoryStats()
  ])
  return <CategoriesClient categories={categories} stats={stats} />
}

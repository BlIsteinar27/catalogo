import { LoginClient } from './page-client'

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <LoginClient searchParams={searchParams} />
}

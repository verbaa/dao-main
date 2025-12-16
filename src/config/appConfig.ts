import { QueryClient } from '@tanstack/react-query'
import { projectId, metadata, networks } from '../config'

export const queryClient = new QueryClient()

export const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
	'--w3m-accent': '#000000',
  }
}

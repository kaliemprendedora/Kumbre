import { LocalStorageRepository } from './LocalStorageRepository'
import type {
  Account,
  Category,
  Fund,
  Objective,
  Project,
  Simulation,
  Transaction,
  Universe,
} from '@/types'

// One repository instance per entity — all backed by localStorage today.
// Swap to Supabase by replacing LocalStorageRepository with SupabaseRepository.

export const universeRepository = new LocalStorageRepository<Universe>('kumbre:universes')
export const accountRepository = new LocalStorageRepository<Account>('kumbre:accounts')
export const categoryRepository = new LocalStorageRepository<Category>('kumbre:categories')
export const transactionRepository = new LocalStorageRepository<Transaction>(
  'kumbre:transactions'
)
export const objectiveRepository = new LocalStorageRepository<Objective>('kumbre:objectives')
export const fundRepository = new LocalStorageRepository<Fund>('kumbre:funds')
export const simulationRepository = new LocalStorageRepository<Simulation>(
  'kumbre:simulations'
)
export const projectRepository = new LocalStorageRepository<Project>('kumbre:projects')

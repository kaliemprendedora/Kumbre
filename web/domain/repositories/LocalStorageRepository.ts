import { type IFilterableRepository } from './IRepository'

// localStorage implementation — fulfils the repository contract.
// Replace this class with a SupabaseRepository later without touching callers.

export class LocalStorageRepository<T extends { id: string }>
  implements IFilterableRepository<T>
{
  constructor(private readonly key: string) {}

  private getAll(): T[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  private setAll(items: T[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.key, JSON.stringify(items))
  }

  async findAll(): Promise<T[]> {
    return this.getAll()
  }

  async findById(id: string): Promise<T | null> {
    return this.getAll().find((item) => item.id === id) ?? null
  }

  async findWhere(predicate: (entity: T) => boolean): Promise<T[]> {
    return this.getAll().filter(predicate)
  }

  async save(entity: T): Promise<T> {
    const items = this.getAll()
    const index = items.findIndex((item) => item.id === entity.id)
    if (index >= 0) {
      items[index] = entity
    } else {
      items.push(entity)
    }
    this.setAll(items)
    return entity
  }

  async delete(id: string): Promise<void> {
    const items = this.getAll().filter((item) => item.id !== id)
    this.setAll(items)
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.key)
  }
}

// Generic repository contract — swap implementation without touching domain logic

export interface IRepository<T> {
  findAll(): Promise<T[]>
  findById(id: string): Promise<T | null>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}

export interface IFilterableRepository<T> extends IRepository<T> {
  findWhere(predicate: (entity: T) => boolean): Promise<T[]>
}

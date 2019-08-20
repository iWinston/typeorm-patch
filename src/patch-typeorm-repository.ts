import { Repository, SelectQueryBuilder } from 'typeorm'
import { SelectQueryBuilderPlus } from './query-builder/SelectQueryBuilderPlus'
import { RepositoryPlus } from './repository/RepositoryPlus'

export const patchRepositoryAndQueryBuilder = () => {
  Object.getOwnPropertyNames(RepositoryPlus.prototype).forEach(pName =>
    Object.defineProperty(Repository.prototype, pName, Object.getOwnPropertyDescriptor(
      RepositoryPlus.prototype,
      pName
    ) as PropertyDescriptor)
  )
  Object.getOwnPropertyNames(SelectQueryBuilderPlus.prototype).forEach(pName =>
    Object.defineProperty(SelectQueryBuilder.prototype, pName, Object.getOwnPropertyDescriptor(
      SelectQueryBuilderPlus.prototype,
      pName
    ) as PropertyDescriptor)
  )
}

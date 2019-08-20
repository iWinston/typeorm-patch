import { EntitySchema, getConnection, getConnectionManager, ObjectType } from 'typeorm'

export * from 'typeorm'
import { SelectQueryBuilderPlus } from './query-builder/SelectQueryBuilderPlus'
export {
  SelectQueryBuilderPlus as SelectQueryBuilder,
} from './query-builder/SelectQueryBuilderPlus'
import { RepositoryPlus } from './repository/RepositoryPlus'
export { RepositoryPlus as Repository } from './repository/RepositoryPlus'
export { FindManyPlusOptions as FindManyOptions } from './repository/FindManyPlusOptions'
export { FindOnePlusOptions as FindOneOptions } from './repository/FindOnePlusOptions'
export { RemovePlusOptions as RemoveOptions } from './repository/RemovePlusOptions'
export { SavePlusOptions as saveOptions } from './repository/SavePlusOptions'

export { patchRepositoryAndQueryBuilder } from './patch-typeorm-repository'

/**
 * Gets repository for the given entity class.
 */
export function getRepository<Entity>(
  entityClass: ObjectType<Entity> | EntitySchema<Entity> | string,
  connectionName: string = 'default'
): RepositoryPlus<Entity> {
  return getConnectionManager()
    .get(connectionName)
    .getRepository<Entity>(entityClass) as RepositoryPlus<Entity>
}

/**
 * Creates a new query builder.
 */
export function createQueryBuilder<Entity>(
  entityClass?: ObjectType<Entity> | string,
  alias?: string,
  connectionName: string = 'default'
): SelectQueryBuilderPlus<Entity> {
  if (entityClass) {
    return getRepository(entityClass, connectionName).createQueryBuilder(alias)
  }

  return getConnection(connectionName).createQueryBuilder()
}

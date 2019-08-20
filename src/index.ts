import { EntitySchema, getConnection, getConnectionManager, ObjectType } from 'typeorm'

export * from 'typeorm'
import { SelectQueryBuilderPlus } from './query-builder/SelectQueryBuilderPlus'
export { SelectQueryBuilderPlus } from './query-builder/SelectQueryBuilderPlus'
import { RepositoryPlus } from './repository/RepositoryPlus'
export { RepositoryPlus } from './repository/RepositoryPlus'
export { FindManyPlusOptions } from './repository/FindManyPlusOptions'
export { FindOnePlusOptions } from './repository/FindOnePlusOptions'
export { RemovePlusOptions } from './repository/RemovePlusOptions'
export { SavePlusOptions } from './repository/SavePlusOptions'

export { patchRepositoryAndQueryBuilder } from './patch-typeorm-repository'

/**
 * Gets repository for the given entity class.
 */
export function getRepositoryPlus<Entity>(
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
export function createQueryBuilderPlus<Entity>(
  entityClass?: ObjectType<Entity> | string,
  alias?: string,
  connectionName: string = 'default'
): SelectQueryBuilderPlus<Entity> {
  if (entityClass) {
    return getRepositoryPlus(entityClass, connectionName).createQueryBuilder(alias)
  }

  return getConnection(connectionName).createQueryBuilder()
}

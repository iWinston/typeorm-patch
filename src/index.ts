import {
  ConnectionOptions,
  ConnectionOptionsReader,
  EntitySchema,
  getConnectionManager,
  getConnectionOptions,
  ObjectType,
  PromiseUtils,
} from 'typeorm'

export * from 'typeorm'
import { SelectQueryBuilderPlus } from './query-builder/SelectQueryBuilderPlus'
export {
  SelectQueryBuilderPlus as SelectQueryBuilder,
} from './query-builder/SelectQueryBuilderPlus'
import { ConnectionPlus } from './connection/Connection'
export { ConnectionPlus as Connection } from './connection/Connection'
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

/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(): Promise<ConnectionPlus>

/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export async function createConnection(name: string): Promise<ConnectionPlus>

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnection(options: ConnectionOptions): Promise<ConnectionPlus>

/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnection(optionsOrName?: any): Promise<ConnectionPlus> {
  const connectionName = typeof optionsOrName === 'string' ? optionsOrName : 'default'
  const options =
    optionsOrName instanceof Object ? optionsOrName : await getConnectionOptions(connectionName)
  return getConnectionManager()
    .create(options)
    .connect() as Promise<ConnectionPlus>
}

/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export async function createConnections(options?: ConnectionOptions[]): Promise<ConnectionPlus[]> {
  if (!options) {
    options = await new ConnectionOptionsReader().all()
  }
  const connections = options.map(options => getConnectionManager().create(options))
  return PromiseUtils.runInSequence(connections, connection => connection.connect()) as Promise<
    ConnectionPlus[]
  >
}

/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getConnection(connectionName: string = 'default'): ConnectionPlus {
  return getConnectionManager().get(connectionName) as ConnectionPlus
}

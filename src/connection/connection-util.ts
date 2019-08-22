import {
  ConnectionOptions,
  createConnection,
  createConnections,
  createQueryBuilder,
  EntitySchema,
  getConnection,
  getRepository,
  ObjectType,
} from 'typeorm'
import { SelectQueryBuilderPlus } from '../query-builder/SelectQueryBuilderPlus'
import { RepositoryPlus } from '../repository/RepositoryPlus'
import { ConnectionPlus } from './ConnectionPlus'

/**
 * Gets repository for the given entity class.
 */
export function getRepositoryPlus<Entity>(
  entityClass: ObjectType<Entity> | EntitySchema<Entity> | string,
  connectionName: string = 'default'
): RepositoryPlus<Entity> {
  return getRepository(entityClass, connectionName) as RepositoryPlus<Entity>
}

/**
 * Creates a new query builder.
 */
export function createQueryBuilderPlus<Entity>(
  entityClass?: ObjectType<Entity> | string,
  alias?: string,
  connectionName: string = 'default'
): SelectQueryBuilderPlus<Entity> {
  return createQueryBuilder(entityClass, alias, connectionName)
}

/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnectionPlus(): Promise<ConnectionPlus>

/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export async function createConnectionPlus(name: string): Promise<ConnectionPlus>

/**
 * Creates a new connection and registers it in the manager.
 */
export async function createConnectionPlus(options: ConnectionOptions): Promise<ConnectionPlus>

/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export async function createConnectionPlus(optionsOrName?: any): Promise<ConnectionPlus> {
  return createConnection(optionsOrName) as Promise<ConnectionPlus>
}

/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export async function createConnectionsPlus(
  options?: ConnectionOptions[]
): Promise<ConnectionPlus[]> {
  return createConnections(options) as Promise<ConnectionPlus[]>
}

/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getConnectionPlus(connectionName: string = 'default'): ConnectionPlus {
  return getConnection(connectionName) as ConnectionPlus
}

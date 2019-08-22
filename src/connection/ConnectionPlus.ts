import { Connection, EntitySchema, MongoEntityManager, ObjectType, QueryRunner } from 'typeorm'
import { SelectQueryBuilderPlus } from '../query-builder/SelectQueryBuilderPlus'
import { RepositoryPlus } from '../repository/RepositoryPlus'

/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export class ConnectionPlus extends Connection {
  /**
   * Gets repository for the given entity.
   */
  public getRepository<Entity>(
    target: ObjectType<Entity> | EntitySchema<Entity> | string
  ): RepositoryPlus<Entity> {
    return this.manager.getRepository(target) as RepositoryPlus<Entity>
  }

  /**
   * Creates a new query builder that can be used to build a sql query.
   */
  public createQueryBuilder<Entity>(
    entityClass: ObjectType<Entity> | EntitySchema<Entity> | Function | string,
    alias: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilderPlus<Entity>

  /**
   * Creates a new query builder that can be used to build a sql query.
   */
  public createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilderPlus<any>

  /**
   * Creates a new query builder that can be used to build a sql query.
   */
  public createQueryBuilder<Entity>(
    entityOrRunner?: ObjectType<Entity> | EntitySchema<Entity> | Function | string | QueryRunner,
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilderPlus<Entity> {
    if (this instanceof MongoEntityManager) {
      throw new Error(`Query Builder is not supported by MongoDB.`)
    }

    if (alias) {
      const metadata = this.getMetadata(entityOrRunner as Function | EntitySchema<Entity> | string)
      return new SelectQueryBuilderPlus(this, queryRunner)
        .select(alias)
        .from(metadata.target, alias)
    } else {
      return new SelectQueryBuilderPlus(this, entityOrRunner as QueryRunner | undefined)
    }
  }
}

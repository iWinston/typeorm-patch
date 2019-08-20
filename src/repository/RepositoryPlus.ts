import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  InsertResult,
  ObjectID,
  ObjectLiteral,
  QueryRunner,
  Repository,
  UpdateResult,
} from 'typeorm-copy'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { SelectQueryBuilderPlus } from '../query-builder/SelectQueryBuilderPlus'
import { FindManyPlusOptions } from './FindManyPlusOptions'
import { FindOnePlusOptions } from './FindOnePlusOptions'
import { FindOptionsUtils } from './FindOptionsUtils'
import { RemovePlusOptions } from './RemovePlusOptions'
import { SavePlusOptions } from './SavePlusOptions'

export class RepositoryPlus<Entity extends ObjectLiteral> extends Repository<Entity> {
  /**
   * Creates a new query builder that can be used to build a sql query.
   */
  public createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilderPlus<Entity> {
    return this.manager.createQueryBuilder<Entity>(
      this.metadata.target as any,
      alias || this.metadata.targetName,
      queryRunner || this.queryRunner
    )
  }

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  public save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SavePlusOptions & { reload: false }
  ): Promise<T[]>

  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  public save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SavePlusOptions
  ): Promise<Array<T & Entity>>

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  public save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SavePlusOptions & { reload: false }
  ): Promise<T>

  /**
   * Saves a given entity in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  public save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SavePlusOptions
  ): Promise<T & Entity>
  /**
   * Saves one or many given entities.
   */
  public async save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SavePlusOptions
  ): Promise<T | T[]> {
    await this.checkUnique(entityOrEntities, options)
    return this.manager.save<T>(this.metadata.target as any, entityOrEntities as any, options)
  }

  /**
   * Removes a given entities from the database.
   */
  public remove(entities: Entity[], options?: RemovePlusOptions): Promise<Entity[]>

  /**
   * Removes a given entity from the database.
   */
  public remove(entity: Entity, options?: RemovePlusOptions): Promise<Entity>

  /**
   * Removes one or many given entities.
   */
  public remove(
    entityOrEntities: Entity | Entity[],
    options?: RemovePlusOptions
  ): Promise<Entity | Entity[]> {
    if (options && options.soft) {
      return this.save(
        entityOrEntities as any,
        {
          deletedAt: new Date(),
        } as any
      )
    } else {
      return this.manager.remove(this.metadata.target as any, entityOrEntities as any, options)
    }
  }

  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   */
  public async insert(
    entity: QueryDeepPartialEntity<Entity> | (Array<QueryDeepPartialEntity<Entity>>),
    options?: SavePlusOptions
  ): Promise<InsertResult> {
    await this.checkUnique(entity, options)
    return this.manager.insert(this.metadata.target as any, entity)
  }

  /**
   * Updates entity partially. Entity can be found by a given conditions.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient UPDATE query.
   * Does not check if entity exist in the database.
   */
  public async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
    options?: SavePlusOptions
  ): Promise<UpdateResult> {
    await this.checkUnique(partialEntity, options)
    return this.manager.update(this.metadata.target as any, criteria as any, partialEntity)
  }

  /**
   * Deletes entities by a given criteria.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient DELETE query.
   * Does not check if entity exist in the database.
   */
  public async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindConditions<Entity>,
    options?: RemovePlusOptions
  ): Promise<DeleteResult | UpdateResult> {
    let result: DeleteResult | UpdateResult
    if (options && options.soft) {
      result = await this.update(criteria, {
        deletedAt: new Date(),
      } as any)
    } else {
      result = await this.manager.delete(this.metadata.target as any, criteria as any)
    }
    return result
  }

  /**
   * Counts entities that match given options.
   */
  public count(options?: FindManyPlusOptions<Entity>): Promise<number>

  /**
   * Counts entities that match given conditions.
   */
  public count(conditions?: FindConditions<Entity>): Promise<number>

  /**
   * Counts entities that match given find options or conditions.
   */
  public count(
    optionsOrConditions?: FindManyPlusOptions<Entity> | FindConditions<Entity>
  ): Promise<number> {
    optionsOrConditions = this.addScope(optionsOrConditions as FindManyPlusOptions<Entity>)
    return this.manager.count(this.metadata.target as any, optionsOrConditions as any)
  }

  /**
   * Finds entities that match given options.
   */
  public find(options?: FindManyPlusOptions<Entity>): Promise<Entity[]>

  /**
   * Finds entities that match given conditions.
   */
  public find(conditions?: FindConditions<Entity>): Promise<Entity[]>

  /**
   * Finds entities that match given find options or conditions.
   */
  public find(
    optionsOrConditions?: FindManyPlusOptions<Entity> | FindConditions<Entity>
  ): Promise<Entity[]> {
    optionsOrConditions = this.addScope(optionsOrConditions as FindManyPlusOptions<Entity>)
    return this.manager.find(
      this.metadata.target as any,
      optionsOrConditions as FindManyPlusOptions<Entity>
    )
  }

  /**
   * Finds entities that match given find options.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  public findAndCount(options?: FindManyPlusOptions<Entity>): Promise<[Entity[], number]>

  /**
   * Finds entities that match given conditions.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  public findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>

  /**
   * Finds entities that match given find options or conditions.
   * Also counts all entities that match given conditions,
   * but ignores pagination settings (from and take options).
   */
  public findAndCount(
    optionsOrConditions?: FindManyPlusOptions<Entity> | FindConditions<Entity>
  ): Promise<[Entity[], number]> {
    optionsOrConditions = this.addScope(optionsOrConditions as FindManyPlusOptions<Entity>)
    if (optionsOrConditions && optionsOrConditions.current && optionsOrConditions.take) {
      optionsOrConditions.take = optionsOrConditions.size
      optionsOrConditions.skip =
        ((optionsOrConditions.current as number) - 1) * (optionsOrConditions.take as number)
    }
    return this.manager.findAndCount(
      this.metadata.target as any,
      optionsOrConditions as FindManyPlusOptions<Entity>
    )
  }

  /**
   * Finds first entity that matches given options.
   */
  public findOne(
    id?: string | number | Date | ObjectID,
    options?: FindOnePlusOptions<Entity>
  ): Promise<Entity | undefined>

  /**
   * Finds first entity that matches given options.
   */
  public findOne(options?: FindOnePlusOptions<Entity>): Promise<Entity | undefined>

  /**
   * Finds first entity that matches given conditions.
   */
  public findOne(
    conditions?: FindConditions<Entity>,
    options?: FindOnePlusOptions<Entity>
  ): Promise<Entity | undefined>

  /**
   * Finds first entity that matches given conditions.
   */
  public findOne(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOnePlusOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOnePlusOptions<Entity>
  ): Promise<Entity | undefined> {
    optionsOrConditions = this.addScope(optionsOrConditions as FindManyPlusOptions<Entity>)
    if (maybeOptions) {
      optionsOrConditions = this.addScope(maybeOptions as FindOnePlusOptions<Entity>)
    }
    return this.manager.findOne(
      this.metadata.target as any,
      optionsOrConditions as any,
      maybeOptions
    )
  }

  /**
   * Finds first entity that matches given options.
   */
  public findOneOrFail(
    id?: string | number | Date | ObjectID,
    options?: FindOnePlusOptions<Entity>
  ): Promise<Entity>

  /**
   * Finds first entity that matches given options.
   */
  public findOneOrFail(options?: FindOnePlusOptions<Entity>): Promise<Entity>

  /**
   * Finds first entity that matches given conditions.
   */
  public findOneOrFail(
    conditions?: FindConditions<Entity>,
    options?: FindOnePlusOptions<Entity>
  ): Promise<Entity>

  /**
   * Finds first entity that matches given conditions.
   */
  public findOneOrFail(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOnePlusOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOnePlusOptions<Entity>
  ): Promise<Entity> {
    optionsOrConditions = this.addScope(optionsOrConditions as FindManyPlusOptions<Entity>)
    if (maybeOptions) {
      optionsOrConditions = this.addScope(maybeOptions as FindOnePlusOptions<Entity>)
    }
    return this.manager.findOneOrFail(
      this.metadata.target as any,
      optionsOrConditions as any,
      maybeOptions
    )
  }

  // 为条件参数添加限制条件
  private addScope<T extends FindManyPlusOptions<Entity> | FindConditions<Entity>>(
    params: T & { scope?: string | boolean },
    options?: any
  ): T {
    if (typeof params === 'number') {
      params = {
        id: params,
      } as any
    }
    const scopeConditions: {
      [propName: string]: FindConditions<Entity>
    } = (this.metadata.target as any).scope || {}
    let scope: string | boolean = 'default'
    if (params && typeof params.scope !== 'undefined') {
      scope = params.scope
    }
    if (options && typeof options.scope !== 'undefined') {
      scope = options.scope
    }
    if (scope && scopeConditions[scope as string]) {
      if (FindOptionsUtils.isFindOneOptions(params) || FindOptionsUtils.isFindManyOptions(params)) {
        params.where = Object.assign({}, scopeConditions[scope as string], params.where)
      } else {
        params = Object.assign({}, scopeConditions[scope as string], params)
      }
    }
    return params
  }

  private async checkUnique<
    T extends
      | DeepPartial<Entity>
      | QueryDeepPartialEntity<Entity>
      | (Array<QueryDeepPartialEntity<Entity>>)
  >(entityOrEntities: T | T[], options: SavePlusOptions | undefined) {
    if (options && options.unique) {
      if (!Array.isArray(entityOrEntities)) {
        entityOrEntities = [entityOrEntities]
      }
      for (const entity of entityOrEntities) {
        for (const unique of options.unique) {
          const coloums = unique.split(',')
          const uniqueEntity: any = {}
          for (const coloum of coloums) {
            uniqueEntity[coloum] = (entity as any)[coloum]
          }
          const count = await this.count(uniqueEntity as FindConditions<Entity>)
          const UNIQUE_ALLOW_COUNT = (entity as any).id ? 1 : 0
          if (count > UNIQUE_ALLOW_COUNT) {
            throw new Error('EntityUniqueException')
          }
        }
      }
    }
  }
}

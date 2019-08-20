import { ObjectType, SelectQueryBuilder, WhereExpression } from 'typeorm'

/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export class SelectQueryBuilderPlus<Entity> extends SelectQueryBuilder<Entity>
  implements WhereExpression {
  /**
   * Sets number of entities to skip.
   */
  public paginate?(current: number, size: number): this {
    current = this.normalizeNumber(current)
    size = this.normalizeNumber(size)
    if (current !== undefined && isNaN(current)) {
      throw new Error(`Provided "current" value is not a number. Please provide a numeric value.`)
    }
    if (size !== undefined && isNaN(size)) {
      throw new Error(`Provided "size" value is not a number. Please provide a numeric value.`)
    }
    this.expressionMap.take = size
    this.expressionMap.skip = (current - 1) * size
    return this
  }

  /**
   * Sets number of entities to skip.
   */
  public paginateRaw?(current: number, size: number): this {
    current = this.normalizeNumber(current)
    size = this.normalizeNumber(size)
    if (current !== undefined && isNaN(current)) {
      throw new Error(`Provided "current" value is not a number. Please provide a numeric value.`)
    }
    if (size !== undefined && isNaN(size)) {
      throw new Error(`Provided "size" value is not a number. Please provide a numeric value.`)
    }
    this.expressionMap.limit = size
    this.expressionMap.offset = (current - 1) * size
    return this
  }

  public when?(condition: any, callback: (qb: this) => this): this {
    if (condition) {
      callback(this)
    }
    return this
  }

  /**
   * Specifies FROM which entity's table select/update/delete will be executed.
   * Also sets a main string alias of the selection data.
   * Removes all previously set from-s.
   */
  public from<T>(
    entityTarget: (qb: SelectQueryBuilderPlus<any>) => SelectQueryBuilderPlus<any>,
    aliasName: string
  ): SelectQueryBuilderPlus<T>

  /**
   * Specifies FROM which entity's table select/update/delete will be executed.
   * Also sets a main string alias of the selection data.
   * Removes all previously set from-s.
   */
  public from<T>(entityTarget: ObjectType<T> | string, aliasName: string): SelectQueryBuilderPlus<T>

  /**
   * Specifies FROM which entity's table select/update/delete will be executed.
   * Also sets a main string alias of the selection data.
   * Removes all previously set from-s.
   */
  public from<T>(
    entityTarget:
      | ObjectType<T>
      | string
      | ((qb: SelectQueryBuilderPlus<any>) => SelectQueryBuilderPlus<any>),
    aliasName: string
  ): SelectQueryBuilderPlus<T> {
    const mainAlias = this.createFromAlias(entityTarget, aliasName)
    this.expressionMap.setMainAlias(mainAlias)
    return (this as any) as SelectQueryBuilderPlus<T>
  }
}

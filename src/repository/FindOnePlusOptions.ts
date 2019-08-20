import { FindOneOptions } from 'typeorm'

/**
 * Defines a special criteria to find specific entities.
 */
export interface FindOnePlusOptions<Entity = any> extends FindOneOptions<Entity> {
  /**
   * Select scope apply to the reposity
   * If it is fasle, none of scope will be applied
   */
  scope?: boolean | string
}

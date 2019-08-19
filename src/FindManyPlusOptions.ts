import { FindManyOptions } from "typeorm";

/**
 * Defines a special criteria to find specific entities.
 */
export interface FindManyPlusOptions<Entity = any> extends FindManyOptions<Entity> {
    /**
     * Offset page (paginated) where from entities should be taken.
     */
    current?: number;

    /**
     * Alias name for take, just effected for the conditions that current and size are both defined
     */
    size?: number;

    /**
     * Select scope apply to the reposity
     * If it is fasle, none of scope will be applied
     */
    scope: boolean | string;
}

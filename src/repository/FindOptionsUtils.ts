import { FindOneOptions } from "typeorm";
import { FindManyPlusOptions } from "./FindManyPlusOptions";

/**
 * Utilities to work with FindOptions.
 */
export class FindOptionsUtils {
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------

    /**
     * Checks if given object is really instance of FindOneOptions interface.
     */
    public static isFindOneOptions(obj: any): obj is FindOneOptions<any> {
        const possibleOptions: FindOneOptions<any> = obj;
        return (
            possibleOptions &&
            (possibleOptions.select instanceof Array ||
                possibleOptions.where instanceof Object ||
                typeof possibleOptions.where === "string" ||
                possibleOptions.relations instanceof Array ||
                possibleOptions.join instanceof Object ||
                possibleOptions.order instanceof Object ||
                possibleOptions.cache instanceof Object ||
                typeof possibleOptions.cache === "boolean" ||
                typeof possibleOptions.cache === "number" ||
                possibleOptions.lock instanceof Object ||
                possibleOptions.loadRelationIds instanceof Object ||
                typeof possibleOptions.loadRelationIds === "boolean" ||
                typeof possibleOptions.loadEagerRelations === "boolean")
        );
    }

    /**
     * Checks if given object is really instance of FindManyOptions interface.
     */
    public static isFindManyOptions(obj: any): obj is FindManyPlusOptions<any> {
        const possibleOptions: FindManyPlusOptions<any> = obj;
        return (
            possibleOptions &&
            (this.isFindOneOptions(possibleOptions) ||
                typeof (possibleOptions as FindManyPlusOptions<any>).skip === "number" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).take === "number" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).size === "number" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).current === "number" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).skip === "string" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).take === "string" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).size === "string" ||
                typeof (possibleOptions as FindManyPlusOptions<any>).current === "string")
        );
    }
}

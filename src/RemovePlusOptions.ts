import { RemoveOptions } from "typeorm";

/**
 * Special options passed to Repository#remove and Repository#delete methods.
 */
export interface RemovePlusOptions extends RemoveOptions {
    /**
     * Indicates if this behaviour is soft
     * If it is undefined, this behaviour isn't soft
     */
    soft?: boolean;
}

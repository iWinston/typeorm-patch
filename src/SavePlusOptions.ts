import { SaveOptions } from "typeorm";

export interface SavePlusOptions extends SaveOptions {
    /**
     * Specifies if column's value must be unique or not.
     *
     */
    unique?: string[];
}

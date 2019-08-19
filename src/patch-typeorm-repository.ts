import { Repository } from "typeorm";
import { RepositoryPlus } from "./RepositoryPlus";

export const patchTypeORMRepositoryWithRepositoryPlus = () => {
  Object.getOwnPropertyNames(RepositoryPlus.prototype).forEach(pName =>
    Object.defineProperty(Repository.prototype, pName, Object.getOwnPropertyDescriptor(
      RepositoryPlus.prototype,
      pName
    ) as PropertyDescriptor)
  );
};

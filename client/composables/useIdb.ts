import { get, set } from "idb-keyval";

export const useIdb = () => {
  return {
    set,
    get,
  };
};

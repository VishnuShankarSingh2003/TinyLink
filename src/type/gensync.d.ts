declare module "gensync" {
  export type Handler<T, U = T> = (item: T) => Generator<T, U, T>;

  export default function gensync<T, U = T>(
    handler: Handler<T, U>
  ): {
    sync: (item: T) => U;
    async: (item: T) => Promise<U>;
  };
}

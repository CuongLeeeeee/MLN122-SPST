//Util
export class Pool<T> {
  private free: T[] = [];
  private create: () => T;

  constructor(create: () => T, prewarm = 0) {
    this.create = create;
    for (let i = 0; i < prewarm; i++) this.free.push(create());
  }

  acquire() {
    return this.free.pop() ?? this.create();
  }

  release(item: T) {
    this.free.push(item);
  }
}

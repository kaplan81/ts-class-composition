export class C {
  p = 'property';

  m(n: string): string {
    return `My ${this.p} name is: ${n}.`;
  }
}

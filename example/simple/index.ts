
export class ClassSample {
  constructor(private name = "world") {

  }

  get greetings() {
    return `Hello ${this.name}`;
  }
}

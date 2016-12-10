"use strict";
class ClassSample {
    constructor(name = "world") {
        this.name = name;
    }
    get greetings() {
        return `Hello ${this.name}`;
    }
}
exports.ClassSample = ClassSample;

//# sourceMappingURL=index.js.map

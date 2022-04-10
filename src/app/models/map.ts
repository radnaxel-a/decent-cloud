/** @format */

export class Map {
    constructor(public integer: number) {}
}

export class Car {
    constructor(public vin, engine, brand, model) {}

    public getVin() {
        return this.vin;
    }
}

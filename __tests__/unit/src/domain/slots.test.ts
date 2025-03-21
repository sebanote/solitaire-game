import { describe, expect, test } from '@jest/globals';
import { Slot } from "../../../../src/domain/slots";

describe("Class slot", () => {

    beforeEach(() => {
        const testSlot = new Slot(1,2);
        return testSlot;
    })

    test("create new slot instance with position 1, 2", () => {

        const testSlot = new Slot(1,2);

        expect(testSlot.position_x).toEqual(1);
        expect(testSlot.position_y).toEqual(2);

    })

    test("get slot position x", () => {

        const testSlot = new Slot(1,2);
        const slotPositionX = testSlot.getSlotPositionX();

        expect(slotPositionX).toEqual(1);

    })

    test("get slot position y", () => {

        const testSlot = new Slot(1,2);
        const slotPositionY = testSlot.getSlotPositionY();

        expect(slotPositionY).toEqual(2);

    })

    test("set slot as full", () => {

        const testSlot = new Slot(1,2);

        testSlot.setFull();
        
        expect(testSlot.isEmpty).toBeFalsy();

    })

})
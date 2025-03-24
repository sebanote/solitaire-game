import { describe, expect, test } from '@jest/globals';
import { PlayableSlot, notPlayableSlot } from "../../../../src/domain/entities/slots";

describe("Class PlayableSlot", () => {

    beforeEach(() => {
        const testSlot = new PlayableSlot(1,2);
        return testSlot;
    })

    test("create new slot instance with position 1, 2", () => {

        const testSlot = new PlayableSlot(1,2);

        expect(testSlot.getSlotPositionX).toEqual(1);
        expect(testSlot.getSlotPositionY).toEqual(2);

    })

    test("get slot position x", () => {

        const testSlot = new PlayableSlot(1,2);
        const slotPositionX = testSlot.getSlotPositionX;

        expect(slotPositionX).toEqual(1);

    })

    test("get slot position y", () => {

        const testSlot = new PlayableSlot(1,2);
        const slotPositionY = testSlot.getSlotPositionY;

        expect(slotPositionY).toEqual(2);

    })

    test("set slot as full", () => {

        const testSlot = new PlayableSlot(1,2);

        testSlot.setFull = false;
        
        expect(testSlot.isEmptyStatus).toBeFalsy();

    })

})

describe("NotPlayableSlot", () => {

    test("create new slot instance with position 1, 2", () => {

        const testSlot = new notPlayableSlot(1,2);

        expect(testSlot.getSlotPositionX).toEqual(1);
        expect(testSlot.getSlotPositionY).toEqual(2);

    })

    test("get slot position x", () => {

        const testSlot = new PlayableSlot(1,2);
        const slotPositionX = testSlot.getSlotPositionX;

        expect(slotPositionX).toEqual(1);

    })

    test("get slot position y", () => {

        const testSlot = new PlayableSlot(1,2);
        const slotPositionY = testSlot.getSlotPositionY;

        expect(slotPositionY).toEqual(2);

    })
})
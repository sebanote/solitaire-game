import { describe, expect, test } from '@jest/globals';
import { GenericSlot } from "../../../../src/domain/entities/slot";
import { PlayableSlot } from '../../../../src/domain/decorators/playableSlotDecorator';

describe("GenericSlot class", () => {

    test("create new slot instance with position 1, 2", () => {

        const testSlot = new GenericSlot(1,2);

        expect(testSlot.position_x).toEqual(1);
        expect(testSlot.position_y).toEqual(2);

    })
})

describe("PlayableSlot", () => {

    test("create a GenericSlot and make it playable", () => {
        
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot);

        expect(playableSlot.isTaken).toEqual(false)
    })

    test("make a GenericSlot playable and taken", () => {
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot, true);

        expect(playableSlot.isTaken).toEqual(true)
    })

    test("make a GenericSlot playable and not taken", () => {
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot, false);

        expect(playableSlot.isTaken).toEqual(false)
    })

    test("get PlayableSlot position_x", () => {
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot);

        const position_x = playableSlot.positionX;

        expect(position_x).toBe(1);
    })

    test("get PlayableSlot position_y", () => {
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot);

        const position_y = playableSlot.positionY;

        expect(position_y).toBe(2);
    })

    test("set PlayableSlot as taken", () => {
        const genericSlot = new GenericSlot(1,2);
        const playableSlot = new PlayableSlot(genericSlot);

        playableSlot.setTaken(true);

        expect(playableSlot.isTaken).toBe(true);
    })
})
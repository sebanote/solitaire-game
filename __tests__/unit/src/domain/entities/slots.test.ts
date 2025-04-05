import { describe, expect, test } from '@jest/globals';
import { GenericSlot } from "../../../../../src/domain/entities/slot";
import { PlayableSlot } from '../../../../../src/domain/entities/decorators/playableSlotDecorator';

describe("GenericSlot class", () => {

    test("create new slot instance with position 1, 2", () => {

        const testSlot = new GenericSlot(1,2);

        expect(testSlot.position_x).toEqual(2);
        expect(testSlot.position_y).toEqual(1);

    })
})

describe("PlayableSlot class", () => {

    test("create a GenericSlot and make it playable", () => {

        const genericSlot = new GenericSlot(1,2)
        
        const playableSlot = new PlayableSlot(genericSlot, false);

        expect(playableSlot.isTaken()).toEqual(false);
        expect(playableSlot).toBeInstanceOf(PlayableSlot);
    })

    test("make a GenericSlot playable and taken", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2), true);

        expect(playableSlot.isTaken()).toEqual(true)
    })

    test("make a GenericSlot playable and not taken", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2), false);

        expect(playableSlot.isTaken()).toEqual(false)
    })

    test("get PlayableSlot position_x", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        const position_x = playableSlot.positionX;

        expect(position_x).toBe(2);
    })

    test("get PlayableSlot position_y", () => {
        
        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        const position_y = playableSlot.positionY;

        expect(position_y).toBe(1);
    })

    test("set PlayableSlot as taken", () => {
        const playableSlot = new PlayableSlot(new GenericSlot(1,2),false);

        playableSlot.setTaken(true);

        expect(playableSlot.isTaken()).toBe(true);
    })
    test("get available moves", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        const moves = playableSlot.getAvailableMoves();

        expect(moves).toEqual([]);
    })
    test("update available moves", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        playableSlot.setAvailableMoves(['3,4','5,0','0,1000']);

        expect(playableSlot.getAvailableMoves()).toEqual(['3,4','5,0','0,1000']);

    })
    test("update available moves with zero moves", () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        playableSlot.setAvailableMoves([]);

        expect(playableSlot.getAvailableMoves()).toEqual([]);

    })
    test('get influenced slots', () => {

        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        const influencedSlots = playableSlot.getInfluencedSlots;

        expect(influencedSlots).toEqual([[],[],[],[]])
    })
    test('set influenced slots', () => {
        const playableSlot = new PlayableSlot(new GenericSlot(1,2),true);

        playableSlot.setInfluencedSlots = [["2,0"],["2,2"],["1,1","0,1"],[]];

        expect(playableSlot.getInfluencedSlots).toEqual([["2,0"],["2,2"],["1,1","0,1"],[]])
    })

})
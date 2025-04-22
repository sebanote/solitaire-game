export type ai_gen = {
    text: string,
    arrangements: Array<arrangement>,
    id: string | null | undefined
}

export type arrangement = Array<Array<null | boolean>>


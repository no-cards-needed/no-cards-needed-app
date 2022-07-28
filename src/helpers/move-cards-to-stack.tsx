import { calculateCardPosition } from "./calculate-card-position";
import { getPositionAtCenter } from "./get-position-at-center";
import { moveCardToPosition } from "./move-card-to-position";

export const moveCardsToStack = (
    usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref, animation: string, orientation: string}[],
    setUsedCards: (usedCards) => void,
    updateCardPosition: (cardId: number, { x, y }: {
        x: any;
        y: any;
    }) => void,
    stacks: {id: number, stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[],
    setStacks,
    stackRef: React.MutableRefObject<any[]>,
    targetStackIndex: number
) => {

        console.log("moving cards to stack "+targetStackIndex)
        const targetStack = stacks[targetStackIndex];
        

        // Add all cards to stack with stacktype "hand"
        setStacks(stacks.map((stack) => {
            if (stack.id === targetStackIndex) {
                stack.cards = usedCards.map(card => card.id);
            }
            return stack;
        }))

        const targetStackRef: React.MutableRefObject<HTMLElement> = stackRef[targetStackIndex]


        const cardDimensions = {width: 107, height: 150}
        console.log(stacks, targetStackIndex, targetStackRef)
        const stackPosition = getPositionAtCenter(targetStackRef)

        usedCards.map((card) => {
            moveCardToPosition(stacks, setStacks, usedCards, setUsedCards, targetStackIndex, updateCardPosition, card.id, stackPosition)
            return card
        })
}
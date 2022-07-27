import { calculateCardPosition } from "./calculate-card-position";
import { getPositionAtCenter } from "./get-position-at-center";

export const moveCardsToStack = (
    cards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref: React.MutableRefObject<HTMLElement>}[], 
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
                stack.cards = cards.map(card => card.id);
            }
            return stack;
        }))

        const targetStackRef: React.MutableRefObject<HTMLElement> = stackRef[targetStackIndex]


        const cardDimensions = {width: 107, height: 150}
        console.log(stacks, targetStackIndex, targetStackRef)
        const stackPosition = getPositionAtCenter(targetStackRef)

        cards.map((card) => {
            const newCardPosition = calculateCardPosition(card.ref, targetStackRef, targetStack, card.id)
            updateCardPosition(card.id, {
                x: stackPosition.x - cardDimensions.width / 2,
                y: stackPosition.y - cardDimensions.height / 2
            })
            return card
        })
}
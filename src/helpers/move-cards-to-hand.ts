import { calculateCardPosition } from "./calculate-card-position";
import { getPositionAtCenter } from "./get-position-at-center";

export const moveCardsToHand = (
    cards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref: React.MutableRefObject<HTMLElement>}[], 
    updateCardPosition: (cardId: number, { x, y }: {
        x: any;
        y: any;
    }) => void,
    stacks: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[], 
    setStacks,
    stackRef: React.MutableRefObject<any[]>) => {


        // Get Hand Stack Index
        const handStackIndex = stacks.findIndex(stack => stack.stackType === "hand");
        const handStack = stacks[handStackIndex];
        

        // Add all cards to stack with stacktype "hand"
        setStacks(stacks.map((stack, i) => {
            if (stack.stackType === "hand") {
                stack.cards = cards.map(card => card.id);
            }
            return stack;
        }))

        const currentStackRef: React.MutableRefObject<HTMLElement> = stackRef[handStackIndex]
        cards.map((card, i) => {
            const newCardPosition = calculateCardPosition(card.ref, currentStackRef, handStack, card.id)
            updateCardPosition(card.id, {
                x: newCardPosition,
                y: getPositionAtCenter(currentStackRef, "updateCardPosition - move-card-to-hands.ts 33").y - card.ref.current.getBoundingClientRect().height / 2
            })
        })
}
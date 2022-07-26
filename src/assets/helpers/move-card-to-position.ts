// Adding Card-ID into the Stack Object
export const addCardIntoStack = (stacks, setStacks, stackIndex, index, cardId) => {
    //Adding Card ID into the Stack Object at a specific index
    setStacks(stacks.map((stack, i) => {
        if (i === stackIndex) {
            stack.cards.splice(index, 0, cardId);
        }
        return stack;
    }))
}

export const moveCardToPosition = (
stacks: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}[],
setStacks: (value: React.SetStateAction<{
    stackType: string;
    orientation: string;
    cards: any[];
    currentlyNearest: boolean;
    colliding: boolean;
    distance: number;
    height: number;
    width: number;
    position: {
        x: number;
        y: number;
    };
}[]>) => void,
usedCards: {id: number, symbol: string, controlledPosition: {x: number, y: number}, zIndex: number, movedAside: string, onStackType: string, ref, animation: string}[],
setUsedCards: (usedCards) => void,
stackIndex: number,
updateCardPosition: (cardId: any, { x, y }: {
    x: any;
    y: any;
}) => void,
cardId,
stackPosition: {x: number, y: number}
) => {

    console.log("moveCardToPosition");
    const cardDimensions = {width: 107, height: 150}

    addCardIntoStack(stacks, setStacks, stackIndex, stacks[stackIndex].cards.length, cardId)
    updateCardPosition(cardId, {
        x: stackPosition.x - cardDimensions.width / 2,
        y: stackPosition.y - cardDimensions.height / 2
    })

    // Set On Stack Type of Card
    setUsedCards(usedCards.map((card, i) => {
        if (card.id === cardId) {
            card.onStackType = "stack";
        }
        return card;
    }))
}
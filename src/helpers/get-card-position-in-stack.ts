export const getCardPositionInStack = (card, stack: {cards: number[]}) => {
    let cardPositionInStack: number;
    for (let i = 0; i < stack.cards.length; i++) {
        const cardInStack = stack.cards[i];
        if (cardInStack === card) {
            cardPositionInStack = i
        }
    }
    return cardPositionInStack
}
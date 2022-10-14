export const getCardPositionInStack = (card, stack: {cards: number[]}) => {
    let cardPositionInStack: number = 0;
    console.log(stack, stack.cards)

    for (let i = 0; i < (stack.cards ? stack.cards.length : 0); i++) {
        const cardInStack = stack.cards[i];
        if (cardInStack === card) {
            cardPositionInStack = i
        }
    }

    return cardPositionInStack
}
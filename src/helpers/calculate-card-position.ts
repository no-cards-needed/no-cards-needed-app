import { getCardPositionInStack } from "./get-card-position-in-stack";
import { getPositionAtCenter } from "./get-position-at-center";

export const calculateCardPosition = (
    card: React.MutableRefObject<HTMLElement>, 
    stackRef: React.MutableRefObject<HTMLElement>, 
    stacksObject: {stackType: string, orientation: string, cards: number[], currentlyNearest: boolean, colliding: boolean, distance: number, height: number, width: number, position: {x: number, y: number}}, 
    cardId: number) => {	
    // Get Card Position in stack from id
    const cardPositionInStack = getCardPositionInStack(cardId, stacksObject)

    const cardCount = stacksObject.cards.length

    const stackCenter = getPositionAtCenter(stackRef, "stackCenter - calculate-card-position.ts 14");
    const { width: cardWidth, height: cardHeight } = card.current.getBoundingClientRect();

    const overlap = cardWidth / 2
    
    //X - position of first card (most left, bottom of stack)
    let firstCardX = 0 - cardWidth / 2
    
    //odd cards -> one is centered, even number -> no card centered
    if(cardCount%2 === 1){
        firstCardX += -1 * (cardCount - 1) / 2 * overlap;
    }
    else{
        firstCardX += -1 * cardCount / 2 * overlap + overlap / 2;
    }

    console.log(firstCardX + cardPositionInStack * overlap + stackCenter.x)
    return firstCardX + cardPositionInStack * overlap + stackCenter.x
}
import { getCardPositionInStack } from "./get-card-position-in-stack";
import { getPositionAtCenter } from "./get-position-at-center";

export const calculateCardPosition = (card, stackRef, stacksObject, id) => {	
    // Get Card Position in stack from id
    const cardPositionInStack = getCardPositionInStack(id, stacksObject)

    const cardCount = stacksObject.cards.length

    const stackCenter = getPositionAtCenter(stackRef);
    const { width: cardWidth, height: cardHeight } = card.getBoundingClientRect();

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
    return firstCardX + cardPositionInStack * overlap + stackCenter.x
}
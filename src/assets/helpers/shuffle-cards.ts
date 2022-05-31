export const shuffleCards = (cards: []) => {
    // Normal Shuffle, maybe better performance?
    // return cards.sort(() => Math.random() - 0.5)

    // Durstenfeld Shuffle
    const tempCards = [...cards]
    for (let i = tempCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempCards[i], tempCards[j]] = [tempCards[j], tempCards[i]];
    }

    return tempCards
}
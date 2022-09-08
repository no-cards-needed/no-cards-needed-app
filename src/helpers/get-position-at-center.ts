export const getPositionAtCenter = (element, caller?: string) => {
    if(element) {
        const { top, left, width, height } = element.getBoundingClientRect();
        return {
            x: left + width / 2,
            y: top + height / 2
        };
    } else {
        console.log(`Error getting porision at center from ${caller}`);
        return {
            x: 0,
            y: 0
        }
    }
}
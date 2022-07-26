export const getPositionAtCenter = (element) => {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2
    };
}
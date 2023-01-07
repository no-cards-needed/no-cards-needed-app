import { getPositionAtCenter } from "./get-position-at-center";

export const getDistanceBetweenTwoElements = (element1: HTMLDivElement, element2: HTMLDivElement) => {
    const { x: x1, y: y1 } = getPositionAtCenter(element1, "element1 - getDistanceBetweenTwoElements.ts 4");
    const { x: x2, y: y2 } = getPositionAtCenter(element2, "element2 - getDistanceBetweenTwoElements.ts 5");
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
import { getPositionAtCenter } from "./get-position-at-center";

export const getDistanceBetweenTwoElements = (element1, element2) => {
    const { x: x1, y: y1 } = getPositionAtCenter(element1);
    const { x: x2, y: y2 } = getPositionAtCenter(element2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
import { MutableRefObject, RefObject } from "react";
import { getDistanceBetweenTwoElements } from "./get-distance-between-two-elements";

export const getNearestStack: (
	cardRef: RefObject<HTMLDivElement>, 
	stacksDomRef: MutableRefObject<Map<number | string, HTMLDivElement>>
) => NearestStack = (
	cardRef: RefObject<HTMLDivElement>, 
	stacksDomRef: MutableRefObject<Map<number | string, HTMLDivElement>>
) => {

	let nearestStackObj: number | string = undefined
	let prevClosestStackDistance = 99999999
	stacksDomRef.current.forEach((stack, stackId) => {
		const distance = getDistanceBetweenTwoElements(stack, cardRef.current)
		if (distance < prevClosestStackDistance) {
			nearestStackObj = stackId
			prevClosestStackDistance = distance;
		}
	})

	return {nearestStack: stacksDomRef.current.get(nearestStackObj), distanceToCard: prevClosestStackDistance, stackIndex: nearestStackObj} as NearestStack;
}
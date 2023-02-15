import { RefObject } from "react";
import { getDistanceBetweenTwoElements } from "./get-distance-between-two-elements";

export const getNearestStack: (
	cardRef: RefObject<HTMLDivElement>, 
	usedStacksRef: React.MutableRefObject<StackMap>,
	stacksDomRef: React.MutableRefObject<HTMLDivElement[]>
) => NearestStack = (
	cardRef: RefObject<HTMLDivElement>, 
	usedStacksRef: React.MutableRefObject<StackMap>,
	stacksDomRef: React.MutableRefObject<HTMLDivElement[]>
) => {

	const distances = Array.from(usedStacksRef.current).map(([stackId, stack]) => {
		if (stacksDomRef.current[stackId]) {
			return getDistanceBetweenTwoElements(stacksDomRef.current[stackId], cardRef.current)
		} else {
			return 99999
		}
	});
	const nearestStack = stacksDomRef.current[distances.indexOf(Math.min(...distances))];

	return {nearestStack, distanceToCard: Math.min(...distances), stackIndex: distances.indexOf(Math.min(...distances))};
}
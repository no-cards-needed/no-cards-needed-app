import { useState, useRef, MutableRefObject } from "react";

function useStateRef<t>(initialValue: t) : [t, (updatedValue: t) => void, MutableRefObject<t>] {
	const [state, setState] = useState(initialValue);
	const stateRef = useRef(state);

	const updateValue = (value: t) => {
		stateRef.current = value;
		setState(value);
	}

	return [state, updateValue, stateRef];
}

export default useStateRef;
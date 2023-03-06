import { useState, useEffect } from 'react';

export function useWindowDimension() {
const [dimension, setDimension] = useState([
	window.innerWidth,
	window.innerHeight,
]);
useEffect(() => {
	const debouncedResizeHandler = debounce(() => {
		setDimension([window.innerWidth, window.innerHeight]);
	}, 100); // 100ms

	window.addEventListener('resize', debouncedResizeHandler);
	return () => window.removeEventListener('resize', debouncedResizeHandler);
}, []); // Note this empty array. this effect should run only on mount and unmount
return dimension;
}

const debounce = (fn: Function, ms = 300) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), ms);
	};
};
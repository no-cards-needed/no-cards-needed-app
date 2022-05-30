import { React, useEffect, useRef, useState } from "react";
import { useSpring } from "react-spring";
import './App.css';

import Card from "./assets/components/Card.tsx";
import { Stack } from "./assets/components/Stack.tsx";
import { calculateCardPosition } from "./assets/helpers/calculate-card-position.ts";
import { getPositionAtCenter } from "./assets/helpers/get-position-at-center.ts";
import { moveCardsAside } from "./assets/helpers/move-cards-aside.ts";

// https://www.npmjs.com/package/use-dynamic-refs
// import useDynamicRefs from "./assets/helpers/use-dynamic-refs";
function App () {
	return (<>
		<div className="App">

			<div className="App-header">
				<h2>No Cards Needed</h2>
			</div>
		</div>
	</>)
}

export default App
export const Stack = ({
	stackType,
	stackRef,
	positionX,
	positionY,
	cardCount,
}: {
	stackType: Stack["stackType"]
	stackRef: any
	positionX?: number
	positionY?: number
	cardCount?: number
}) => {
	return (
		<div
			className={`cardDropZone ${stackType}`}
			// style={{ gridArea: `${positionY} / ${positionX} / ${positionY} / ${positionX + 1}` }}
			style={{
				gridColumnStart: positionX,
				gridColumnEnd: "span 2",
				gridRowStart: positionY,
				gridRowEnd: "span 1",
			}}
			ref={stackRef}>
			<div className="pileSize">{cardCount}</div>
		</div>
	)
}

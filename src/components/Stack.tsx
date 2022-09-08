import {useState, useRef} from "react"

export const Stack = ({stack, updateCardPosition, stackRef}) => {
    // export const Stack = ({height, width, position, updateCardPosition, isColliding, stackRef}) => {

    const {stackType, orientation, cards, currentlyNearest, colliding, distance, height, width, position} = stack
    const {x, y} = position

    return (
        <div className={`cardDropZone ${stackType}`} ref={stackRef}>
        </div>
    )
}
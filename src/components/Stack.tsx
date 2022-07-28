import {useState, useRef} from "react"

export const Stack = ({stack, updateCardPosition, stackRef}) => {
    // export const Stack = ({height, width, position, updateCardPosition, isColliding, stackRef}) => {

    const {stackType, orientation, cards, currentlyNearest, colliding, distance, height, width, position} = stack
    const {x, y} = position

    const clamp = (value, min, max) => {
        return Math.min(Math.max(value, min), max)
    }

    //Styling for Hand Stack

    const opacity = 100000/ distance / 500



    return (
        <div className={`cardDropZone ${stackType}`} style={{border: colliding ? '4px solid green' : '4px dashed grey', width, height, opacity: clamp(opacity, 0, 1)}} ref={stackRef}>
        </div>
    )
}
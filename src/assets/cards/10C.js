import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { ReactDOM } from "react";

function TEN_C({positionCallback, colliding, stack}) {

    const nodeRef = useRef(null)

    const [activeDrags, setActiceDrags] = useState(0)
    const [deltaPosition, setDeltaPosition] = useState({x: 0, y: 0})
    const [controlledPosition, setControlledPosition] = useState({x: 0, y: 0})

    const getViewportPosition = (e) => {
        const boundingClientRect = nodeRef.current.getBoundingClientRect()
        const x = boundingClientRect.left
        const y = boundingClientRect.top
        return { x, y }
    }
    
    const handleStart = () => {
    
    }
    const handleDrag = (e, ui) => {
        const {x, y} = deltaPosition
        setDeltaPosition(
            {
                x: x + ui.deltaX,
                y: y + ui.deltaY
            }
        )
        // console.log(`x: ${x} -- y: ${y}`)
        // console.log(getViewportPosition())
        positionCallback(nodeRef)
    }
    const handleStop = (e) => {
        if(colliding) {
            const stackPosition = stack.current.getBoundingClientRect()
            console.log()
            setControlledPosition({x: stackPosition.left + stackPosition.width / 2 - nodeRef.current.clientWidth / 2, y: stackPosition.top + stackPosition.height / 2 - nodeRef.current.clientHeight / 2})
            console.log(stackPosition.left + stackPosition.width / 2)
        }
    }

  return (
    <Draggable
    nodeRef={nodeRef}
    defaultPosition={{x: 0, y: 0}}
    position={controlledPosition}
    // grid={[25, 25]}
    scale={1}
    onStart={handleStart}
    onDrag={handleDrag}
    onStop={handleStop}>
    <div ref={nodeRef} style={{position: 'absolute', top: 0, left: 0}}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="240"
        height="336"
        className="card"
        preserveAspectRatio="none"
        viewBox="-120 -168 240 336"
        >
        <symbol
            id="C"
            preserveAspectRatio="xMinYMid"
            viewBox="-600 -600 1200 1200"
        >
            <path d="M30 150c5 235 55 250 100 350h-260c45-100 95-115 100-350a10 10 0 00-20 0 210 210 0 11-74-201 10 10 0 0014-14 230 230 0 11220 0 10 10 0 0014 14 210 210 0 11-74 201 10 10 0 00-20 0z"></path>
        </symbol>
        <symbol
            id="CT"
            preserveAspectRatio="xMinYMid"
            viewBox="-500 -500 1000 1000"
        >
            <path
            fill="none"
            stroke="#000"
            strokeLinecap="square"
            strokeMiterlimit="1.5"
            strokeWidth="80"
            d="M-260 430v-860M-50 0v-310a150 150 0 01300 0v620a150 150 0 01-300 0z"
            ></path>
        </symbol>
        <rect
            width="239"
            height="335"
            x="-119.5"
            y="-167.5"
            fill="#fff"
            stroke="#000"
            rx="12"
            ry="12"
        ></rect>
        <use width="32" height="32" x="-114.4" y="-156" xlinkHref="#CT"></use>
        <use
            width="26.769"
            height="26.769"
            x="-111.784"
            y="-119"
            xlinkHref="#C"
        ></use>
        <use width="70" height="70" x="-87.501" y="-135.588" xlinkHref="#C"></use>
        <use width="70" height="70" x="17.501" y="-135.588" xlinkHref="#C"></use>
        <use width="70" height="70" x="-87.501" y="-68.529" xlinkHref="#C"></use>
        <use width="70" height="70" x="17.501" y="-68.529" xlinkHref="#C"></use>
        <use width="70" height="70" x="-35" y="-102.058" xlinkHref="#C"></use>
        <g transform="rotate(180)">
            <use width="32" height="32" x="-114.4" y="-156" xlinkHref="#CT"></use>
            <use
            width="26.769"
            height="26.769"
            x="-111.784"
            y="-119"
            xlinkHref="#C"
            ></use>
            <use
            width="70"
            height="70"
            x="-87.501"
            y="-135.588"
            xlinkHref="#C"
            ></use>
            <use
            width="70"
            height="70"
            x="17.501"
            y="-135.588"
            xlinkHref="#C"
            ></use>
            <use
            width="70"
            height="70"
            x="-87.501"
            y="-68.529"
            xlinkHref="#C"
            ></use>
            <use width="70" height="70" x="17.501" y="-68.529" xlinkHref="#C"></use>
            <use width="70" height="70" x="-35" y="-102.058" xlinkHref="#C"></use>
        </g>
        </svg>
    </div>
  </Draggable>

  );
}

export default TEN_C;

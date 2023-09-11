import { useState } from "react";

function Help({ explanation }: { explanation: string }) {
  const [display, setDisplay] = useState("none");

  // useScroll => setDisplay(none)

  return (
    <div style={{ position: "relative" }}>
      <button
        className="help"
        onClick={() => {
          setDisplay("block");
        }}
      >
        ?
      </button>
      <div
        className="helpExplanation"
        id="basicDrop"
        onClick={() => {
          setDisplay("none");
        }}
        style={{
          display: display,
        }}
      >
        <p>{explanation}</p>
      </div>
    </div>
  );
}
export default Help;

import { useState } from "react";

function Help({ explanation }: { explanation: string }) {
  const [display, setDisplay] = useState("none");

  return (
    <>
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
    </>
  );
}
export default Help;

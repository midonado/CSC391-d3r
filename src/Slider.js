import React from "react";

const Slider = (label, initialValue, onChangeFunc, min, max) => {
    return (
        < div key={label} className="toggle-container" >
            <p>{label}</p>
            <input
                type="range"
                min={min} max={max}
                value={initialValue}
                onChange={onChangeFunc}
                step="1" />
        </div >
    )
}

export default Slider;
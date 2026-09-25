"use client";

import { useAppDispatch, useAppSelector } from "../../store/redux-hooks";
import { counterActions } from "../../store/slices/counter-slice";
import "./counter.css";

export default function Counter() {
  const dispatch = useAppDispatch();
  const { counter, showCounter } = useAppSelector((state) => state.counter);

  return (
    <section className="panel counter" aria-labelledby="counter-title">
      <h2 id="counter-title">Redux Counter</h2>
      {/* Keep the element mounted so aria-controls always has a target. */}
      <div id="counter-value" hidden={!showCounter}>
        <output className="value" aria-label="Counter value" aria-live="polite">
          {counter}
        </output>
      </div>
      <div>
        <button type="button" onClick={() => dispatch(counterActions.increment())}>
          Increment
        </button>
        <button type="button" onClick={() => dispatch(counterActions.increase(10))}>
          Increase by 10
        </button>
        <button type="button" onClick={() => dispatch(counterActions.decrement())}>
          Decrement
        </button>
      </div>
      <button
        type="button"
        onClick={() => dispatch(counterActions.toggleCounter())}
        aria-expanded={showCounter}
        aria-controls="counter-value"
      >
        {showCounter ? "Hide Counter" : "Show Counter"}
      </button>
    </section>
  );
}

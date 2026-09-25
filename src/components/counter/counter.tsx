"use client";

import { useRef, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/redux-hooks";
import { canAdjustCounter, counterActions } from "../../store/slices/counter-slice";
import "./counter.css";

export default function Counter() {
  const dispatch = useAppDispatch();
  const { counter, showCounter } = useAppSelector((state) => state.counter);
  const amountInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleAdjust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = amountInput.current?.valueAsNumber ?? NaN;
    if (!canAdjustCounter(counter, amount)) {
      setError("Use a smaller whole number or reset the counter to stay within its safe range.");
      amountInput.current?.focus();
      return;
    }
    setError("");
    dispatch(counterActions.increase(amount));
  }

  return (
    <section className="panel counter" aria-labelledby="counter-title">
      <h2 id="counter-title">Redux Counter</h2>
      {/* Keep the element mounted so aria-controls always has a target. */}
      <div id="counter-value" hidden={!showCounter}>
        <output className="value" aria-label="Counter value" aria-live="polite">
          {counter}
        </output>
      </div>
      <div className="counter-actions" role="group" aria-label="Quick adjustments">
        <button type="button" disabled={!canAdjustCounter(counter, 1)} onClick={() => dispatch(counterActions.increment())}>
          Increment
        </button>
        <button type="button" disabled={!canAdjustCounter(counter, 10)} onClick={() => dispatch(counterActions.increase(10))}>
          Increase by 10
        </button>
        <button type="button" disabled={!canAdjustCounter(counter, -1)} onClick={() => dispatch(counterActions.decrement())}>
          Decrement
        </button>
        <button type="button" disabled={counter === 0} onClick={() => { setError(""); dispatch(counterActions.reset()); }}>
          Reset Counter
        </button>
      </div>
      <form className="counter-adjustment" aria-label="Adjust counter" onSubmit={handleAdjust}>
        <label htmlFor="counter-amount">Custom amount</label>
        <p id="amount-help" className="help-text">Use a positive or negative whole number.</p>
        <div className="amount-controls">
          <input
            ref={amountInput}
            id="counter-amount"
            type="number"
            defaultValue="5"
            step="1"
            min={Number.MIN_SAFE_INTEGER}
            max={Number.MAX_SAFE_INTEGER}
            required
            aria-describedby={error ? "amount-help amount-error" : "amount-help"}
            aria-invalid={error ? true : undefined}
            onChange={() => setError("")}
          />
          <button type="submit">Apply amount</button>
        </div>
        <p id="amount-error" className="error-text" role="alert">{error}</p>
      </form>
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

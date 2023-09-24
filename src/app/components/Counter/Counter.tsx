"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { counterActions } from "../../store/counter";
import "./Counter.css";

const Counter = (): JSX.Element => {
	const dispatch: AppDispatch = useDispatch();
	const counter: number = useSelector(
		(state: RootState) => state.counter.counter
	);
	const show: boolean = useSelector(
		(state: RootState) => state.counter.showCounter
	);

	const incrementHandler: () => void = () => {
		dispatch(counterActions.increment());
	};

	const increaseHandler: () => void = () => {
		dispatch(counterActions.increase(10));
	};

	const decrementHandler: () => void = () => {
		dispatch(counterActions.decrement());
	};

	const toggleCounterHandler: () => void = () => {
		dispatch(counterActions.toggleCounter());
	};

	return (
		<main className="counter">
			<h1>Redux Counter</h1>
			{show && <div className="value">{counter}</div>}
			<div>
				<button onClick={incrementHandler}>Increment</button>
				<button onClick={increaseHandler}>Increase by 10</button>
				<button onClick={decrementHandler}>Decrement</button>
			</div>
			<button onClick={toggleCounterHandler}>Toggle Counter</button>
		</main>
	);
};
export default Counter;

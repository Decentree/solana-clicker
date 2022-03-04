import { useReducer } from "react";

export const useCounter = () => {
  return useReducer((state: number, action: { type: "increment" | "decrement"; amount?: number }) => {
    switch (action.type) {
      case "increment":
        return state + (action.amount ?? 1);
      case "decrement":
        return state - (action.amount ?? 1);
      default:
        return state;
    }
  }, 0);
};

export default useCounter;

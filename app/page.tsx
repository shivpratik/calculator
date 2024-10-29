"use client";
import { Key } from "@/components/ui/key";
import { cn } from "@/lib/utils";
import { Diff, Divide, Equal, Minus, Percent, Plus, X } from "lucide-react";
import { useState } from "react";

enum Operations {
  PLUS = "plus",
  MINUS = "minus",
  DIVIDE = "divide",
  MULTIPLY = "multiply",
}

export default function Home() {
  const [total, setTotal] = useState<string>("0");
  const [input, setInput] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operations | null>(null);
  const isInputEmpty = input === null || input === "0";
  const numbers: number[] = [7, 8, 9, 4, 5, 6, 1, 2, 3];
  const displayLength =
    input !== null ? input.toString().length : total.toString().length;

  // Function to handle clear and all clear
  const handleClear = () => {
    if (input === null && total === "0") return;
    if (input !== null && input !== "0" && operation) {
      setInput("0");
    } else {
      setInput(null);
      setTotal("0");
      setOperation(null);
    }
  };

  const getFormatedValue = (value: string) => {
    const language = "en-US";

    let formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 7,
    });

    const match = /\.\d*?(0*)$/.exec(value);

    if (match) {
      formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];
    }

    return formattedValue.length >= 10
      ? parseFloat(value).toExponential(6).toString()
      : formattedValue;
  };

  // Function to handle when numbers are clicked
  const handleInput = (value: string) => {
    // Prevent multiple leading zeros
    if ((input === null || input === "0") && value === "0") return;

    // Prevent length from exceeding 9 digits
    if (input !== null && input.replace(".", "").length === 9) return;

    // Concatenate or set the new input
    if (input !== null && input !== "0") {
      // Check if we are trying to add a decimal point
      if (value === "." && input.includes(".")) return; // Prevent multiple decimals
      const concat = input.concat(value);
      setInput(concat);
    } else {
      // Handle initial input
      if (value === ".") {
        setInput("0" + value); // Start with "0."
      } else {
        setInput(value); // Set the new value directly
      }
    }
  };

  const calculate = (operator: Operations, a: number, b: number) => {
    switch (operator) {
      case Operations.PLUS:
        return a + b;
      case Operations.MINUS:
        return a - b;
      case Operations.DIVIDE:
        return b !== 0 ? a / b : 0; // Prevent division by zero
      case Operations.MULTIPLY:
        return a * b;
      default:
        return b;
    }
  };

  // Function to handle when operations are clicked
  const handleOperation = (operator: Operations) => {
    if (!input && total === "0") return;
    setOperation(operator);
    if (input !== null) {
      if (total !== "0") {
        const currentValue = parseFloat(input);
        const previousValue = parseFloat(total);
        const newTotal = calculate(
          operator,
          previousValue,
          currentValue
        ).toString();
        setTotal(newTotal);
      } else {
        setTotal(input);
      }
    }
    setInput(null);
  };

  // Function to handle when diff is clicked
  const handleDiff = () => {
    if (input !== null) {
      setInput((prev) => prev && (parseFloat(prev) * -1).toString());
    }
  };

  // Function to handle when percentage is clicked
  const percentage = () => {
    if (input && input !== "0") {
      const newValue: number = parseFloat(input) / 100;
      setInput(getFormatedValue(newValue.toString()));
    }
  };

  // Function to handle when equal is clicked
  const handleEqual = () => {
    if (total && operation && input !== null) {
      const currentValue = parseFloat(input);
      const previousValue = parseFloat(total);
      const newTotal = calculate(
        operation,
        previousValue,
        currentValue
      ).toString();
      setTotal(newTotal);
      setOperation(null);
      setInput(null);
    } else {
      return;
    }
  };

  const formatNumber = (value: string) => {
    // Split the input into integer and decimal parts
    const [integerPart, decimalPart] = value.split(".");

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${formattedInteger}${decimalPart ? "." + decimalPart : "."}`
      : formattedInteger;
  };

  return (
    <main className="h-full md:h-auto w-full max-w-md md:max-w-sm flex flex-col space-y-4 md:rounded-3xl bg-black p-10 text-white landscape:hidden lg:landscape:flex overflow-hidden">
      <div className="flex grow items-end min-h-fit">
        <div
          className={cn(
            "w-full text-right font-thin",
            displayLength > 7
              ? "text-5xl"
              : displayLength > 5
              ? "text-6xl"
              : "text-7xl"
          )}
        >
          {input !== null ? formatNumber(input) : getFormatedValue(total)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-black">
        <div className="col-span-3 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-black">
            <Key
              variant="function"
              className="text-3xl tracking-tighter"
              onClick={handleClear}
            >
              {input === null && total === "0" ? "AC" : "C"}
            </Key>
            <Key variant="function" onClick={handleDiff}>
              <Diff className="size-8" />
            </Key>
            <Key variant="function">
              <Percent className="size-8" onClick={percentage} />
            </Key>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {numbers.map((number, index) => (
              <Key
                variant="number"
                key={index}
                onClick={() => handleInput(number.toString())}
              >
                {number}
              </Key>
            ))}
            <Key
              className="col-span-2 aspect-auto h-full justify-start pl-[15%]"
              variant="number"
              onClick={() => handleInput("0")}
            >
              0
            </Key>
            <Key variant="number" onClick={() => handleInput(".")}>
              .
            </Key>
          </div>
        </div>
        <div className="col-span-1 grid gap-3">
          <Key
            className={
              operation === "divide" && isInputEmpty
                ? "bg-white hover:bg-white/90 group is-dirty"
                : ""
            }
            variant="operator"
            onClick={() => handleOperation("divide" as Operations)}
          >
            <Divide className="group-[.is-dirty]:text-amber-500 size-8" />
          </Key>
          <Key
            className={
              operation === "multiply" && isInputEmpty
                ? "bg-white hover:bg-white/90 group is-dirty"
                : ""
            }
            variant="operator"
            onClick={() => handleOperation("multiply" as Operations)}
          >
            <X className="group-[.is-dirty]:text-amber-500 size-8" />
          </Key>
          <Key
            className={
              operation === "minus" && isInputEmpty
                ? "bg-white hover:bg-white/90 group is-dirty"
                : ""
            }
            variant="operator"
            onClick={() => handleOperation("minus" as Operations)}
          >
            <Minus className="group-[.is-dirty]:text-amber-500 size-8" />
          </Key>
          <Key
            className={
              operation === "plus" && isInputEmpty
                ? "bg-white hover:bg-white/90 group is-dirty"
                : ""
            }
            variant="operator"
            onClick={() => handleOperation("plus" as Operations)}
          >
            <Plus className="group-[.is-dirty]:text-amber-500 size-8" />
          </Key>
          <Key variant="operator" onClick={handleEqual}>
            <Equal className="size-8" />
          </Key>
        </div>
      </div>
    </main>
  );
}

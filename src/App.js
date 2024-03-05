import { useEffect, useMemo, useState } from "react";
import Calculator from "./Calculator";
import ToggleSounds from "./ToggleSounds";

function formatTime(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function App() {
  const [allowSound, setAllowSound] = useState(true);
  const [time, setTime] = useState(formatTime(new Date()));

  // Will be be AM or PM
  const partOfDay = time.slice(-2);

  // So since this is an array,
  // which is essentially just a JavaScript object
  // this array gets recreated on every single render.
  // And so therefore we now need to memorize this array
  // in order for the memorizing of the component to work.
  // So let's do that.
  const workouts = useMemo(() => {
    return [
      {
        name: "Full-body workout",
        numExercises: partOfDay === "AM" ? 9 : 8,
      },
      {
        name: "Arms + Legs",
        numExercises: 6,
      },
      {
        name: "Arms only",
        numExercises: 3,
      },
      {
        name: "Legs only",
        numExercises: 4,
      },
      {
        name: "Core only",
        numExercises: partOfDay === "AM" ? 5 : 4,
      },
    ];
  }, [partOfDay]);

  /////////////////////////////////////
  //   Now there's just another small thing that we can do
  // which is about this function here.
  // So this function that is inside
  // the component body right here,
  // doesn't actually use any reactive value, right?
  // And so there's no need to recreate this function
  // on every render.
  // And so let's cut that and place it out here.
  // So another very small optimization
  // but yeah, we don't need to waste any resources
  // only to recreate this function when we don't need to to.

  // function formatTime(date) {
  //   return new Intl.DateTimeFormat("en", {
  //     month: "short",
  //     year: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   }).format(date);
  // }
  ///////////////////////////

  useEffect(function () {
    const id = setInterval(function () {
      setTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <main>
      <h1>Workout timer</h1>
      <time>For your workout on {time}</time>
      So let's see what we can do.
      {/* So remember that the memo function only works
      if the props that are being passed
      are the same between renders.
      So here in this toggle sounds component,
      that is apparently the case.
      So allowSound is just a primitive value
      so it's just a boolean
      and so therefore that doesn't change across renders.
      And then the second prop is this setAllowSound function.
      Now remember that the state setter function
      from useState is actually stable.
      So React guarantees that it doesn't change between renders.
      And so this means
      that these two props do not change between renders
      and so therefore the toggle sounds component
      does not re-render each time that the app re-renders.
      So we successfully memoed or memorized this one.
      Now about the calculator component.
      The allowSounds of course also stays stable.
       */}
      <ToggleSounds allowSound={allowSound} setAllowSound={setAllowSound} />
      {/* ///////////////// */}
      {/* But now the other prop is the workouts object
      or actually the array.
      And so here is where we have the problem. */}
      <Calculator workouts={workouts} allowSound={allowSound} />
    </main>
  );
}

export default App;

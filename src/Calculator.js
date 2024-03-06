import { memo, useEffect, useState } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  const [duration, setDuration] = useState(0);

  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  const playSound = function () {
    if (!allowSound) return;
    const sound = new Audio(clickSound);
    sound.play();
  };

  /////////////////////////////////
  // 2
  //   So, what we're going to do now, as I just said,
  // is to use the useEffect Hook
  // to keep this duration state here in sync
  // with all these other state variables.
  // Now, notice how I said earlier in that long lecture
  // about the useEffect Hook,
  // that this is exactly what we usually should not do.
  // However, I think that in this situation,
  // this is a perfectly fine use case for the useEffect Hook,
  // because there are so many state variables here involved,
  // that it just becomes very impractical,
  // and even unreadable and confusing to do it in a way
  // that I just demonstrated you.
  // And so again,
  // we should instead use an effect in this situation.
  useEffect(
    function () {
      setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
    },
    [number, sets, speed, durationBreak]
  );

  // 3
  //   So, only updating once, which we would think
  // only gives us one render.
  // But actually, we do have two renders.
  // So the calculator is rendered.
  // And then again, and so this is exactly the problem
  // of the useEffect Hook to update states.
  // So, right here.
  // So basically, this first state update
  // is this number of sets updating,
  // which will then trigger this effect here.
  // But the effect only runs
  // after the render has already happened.
  // And so then when we set the state here again,
  // we get a second render.
  // So React is not able to batch these two renders in one,
  // simply because, again, the effect actually runs
  // way after the render has already happened.
  // And so just be aware of that issue
  // whenever you do something like this.
  // So, whenever you can, again, avoid this.
  // But when you have so many state variables here
  // that influence the value of another state,
  // then you can do this.
  ////////////////////////////////////

  function handleInc() {
    setDuration((duration) => Math.floor(duration + 1));
  }
  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration - 1) : 0));
  }

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => {
              setDurationBreak(e.target.value);

              // 1
              //               So, this is not the solution that we're going for,
              // but I just want to exemplify this.
              // So now, here, of course,
              // we cannot use the break here because it is still stale.
              // So, the update only actually happens after the render,
              // as we have talked about many times before.
              // So here, we would even have to use e.target.value.
              //               And so that would actually work, right?
              // But we would then have to do this
              // in every single event handler.
              // So repeating all this code all over the place.
              // So instead of doing this,
              // we will now again use the useEffect Hook
              // to basically synchronize these states with one another.
              ////////////////
              // setDuration(
              //   (number * sets * speed) / 60 + (sets - 1) * e.target.value
              // );
            }}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
}

// Now remember how earlier we memorized a component
// by basically creating a new variable here,
// like toggle sounds
// and then we would wrap this function into memo.
// However since here,
// we are actually exporting these components,
// It's a lot easier and nicer to just memorize down here.
// So let me show you what I mean by that.
// So we can just export basically the results
// of memorizing this component.
// And so this again, is a lot better
// than creating a new separate variable here
// which makes the code look a little bit weird.
export default memo(Calculator);

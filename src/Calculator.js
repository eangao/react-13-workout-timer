import { memo, useCallback, useEffect, useState } from "react";
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

  const playSound = useCallback(
    function () {
      if (!allowSound) return;

      //     the audio API from the browser.
      // So this is here just a browser feature.
      const sound = new Audio(clickSound);
      sound.play();
    },
    [allowSound]
  );

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
      playSound();
    },
    [number, sets, speed, durationBreak, playSound]
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
    playSound();
  }
  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration - 1) : 0));
    playSound();
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

/////////////////////////
// In this video, we're gonna play a sound
// whenever the duration state changes.
// And this will bring up all kinds of interesting issues
// that we are gonna solve using
// the strategies that we have learned
// in the advanced useEffect lecture earlier.
// And I already created this function here
// to play a certain sound and I think it's pretty interesting.
// So what we have to do is to first import a sound file.
// So like this one that is here in the source folder.
// So we import that then store it into some variable,
// and then we can use that using
// the audio API from the browser.
// So this is here just a browser feature.

// So this then creates a new audio, which I just called sound.
// And then on that we can call the play method.
// And so now let's use this function
// in order to play this sound
// each time that the duration updates.
// So where does that actually happen?
// So where does the duration update?
// Well, easy enough.

// Here in these two handler functions and in this effect.
// And so let's just play or actually call
// that function in all those places.
// So here and here.
// So in the two event handlers
// and let's already test if this works.
// And yeah, I can very clearly hear
// that sound in my headphones.
// So it's not in the video because of my headphones,
// but you should probably also hear it.
// Now if you do not want that sound
// maybe because you need to be in silence or something,
// then you have this icon right here.

// So this is coming from the toggle sounds component.
// And so when you click here,
// it will set the allowSound state to false.
// And so then in this case, the sound is not played.
// So then it goes just back to normal.
// But here for the sake of this exercise,
// let's leave it on and see that it works just fine.

// But of course, as we change the duration here
// that will not yet play the sound.
// And so let's also place that here.
// But now this play sound is actually a reactive value
// because it uses another reactive value.
// So this allows sound prop, so it is actually a prop,
// but we see that it is a prop that is actually state.
// So that allowSound prop is a state variable
// and therefore it is a reactive value.
// And so this function is then also a reactive value
// and then we need to place it right here.

// So playSound like this.
// Now here since we are using
// not a normal function declaration, function expression,
// we need to place it here before.
// And so now it is back to working.
// Now notice how here in the console we get these issues,
// which tells us that a sound cannot be played
// before the user interacts with the document.
// So the user first need to click or really do
// something here before the first sound can be played.

// But let's just ignore this issue here in the situation.
// So we placed our playSound function here
// in the dependency array in order not to lie
// to React about the dependencies.

// But watch the problem that this actually creates.
// So as I try to update the state here now
// as I click here nothing really happens.
// I mean, we hear the sound like playing twice
// and very shortly it goes up and then goes down again.

// So you see this flicker here.
// And so that is a big problem.
// The same thing probably appears here.
// Now here it actually works fine
// but not when we click on these buttons.
// So let's find out what the problem here is.
// So each time that we click here on this button,
// it will set the duration and it will play the sound.

// Now updating the state will
// of course re-render the component,
// which will recreate this function here.
// So React will see a brand new function.
// And since this function is part of the dependency array
// of this effect, it will then run this effect as well.
// And so that's where the duration is
// then set again but using the current values,
// which actually haven't changed.

// So when we click here, none of these four values changes.
// And so when the duration is then set here
// for the second time, it will use these values again,
// which will make it so that the duration
// immediately goes back.
// And so that's why we see that flashing.
// So for a fraction of a second it'll go to 53,
// but then immediately it'll go back.
// So saw that here.
// So that is the reason why this is happening
// and also why we kind of hear the sound twice.
// So we hear it here
// and we then hear it again from this effect.

// So what can we do?
// Well, as we learned in that lecture about the strategies
// on how to deal with helper functions, which this clearly is,
// there is a few things that we can do.
// So the best strategy is always to move
// a function like this out of the component.
// However, that doesn't work because this function is
// of course a reactive value that depends on this prop
// and so we cannot move it outside.
// Then the other strategy would be to take
// the function and move it into the useEffect.
// So right into here.

// But then the problem with that would be
// that we could no longer use it out here.
// And so this is the situation where we need
// that function in multiple places.
// And so then what we have to do is to memorize the function.
// And so then the function will not be recreated
// between these renders.

// So let's do that, useCallback.
// And then here in the dependency array
// what do you think we will need to place there?
// Well, we will need for sure this allowSound variable
// because this is a reactive value.
// So a value that can change over time.

// But what about this click sound?
// Well, this one, not really.
// So this is never gonna change and React knows that.
// And therefore if we now save this, we get no warnings.
// So meaning that our dependency array is complete.
// And so if we try this now again,
// then it is actually back to working.
// And it does work everywhere.

// Nice, so yet another use case of the useCallback hook.
// Now one very interesting consequence is
// that now as we click on this button
// so on this icon right here, it will actually play a sound.
// So did you hear that?
// Not when we turn it off.
// But when we turn it back on, it will play a sound.
// So that's a bit strange, right?
// So why is that happening?
// Well, notice how here allowSound is in the dependency array
// of useCallback, which means that this function here
// actually does get recreated each time
// that allowSound changes.

// Therefore when we toggle this icon here
// we get a new function,
// which then in turn will make this effect here run again.
// And so that's where then the sound is played.
// So this can quickly become confusing when you use
// all these useCallbacks and useEffects in your code.
// And let's see how this actually becomes even worse.

// Because let me now update the state here a little bit,
// and then watch what happens when I click here.
// So you saw that it basically reset our state.
// So very strange, very confusing probably.
// But again, it is actually for the exact same reason
// that earlier we heard the sound when we click here.
// So the reason for that is once again,
// that whenever we click on that icon
// the allowSound state changes
// and so then the function is recreated.
// So then on that update, React sees a new function.
// And since that function is here in the dependency array,
// it will run this effect again.

// And so this effect will run with the current values
// of these four pieces of state.
// And so it will recalculate the duration based on that.
// Basically ignoring that earlier we had manually changed
// the duration with these buttons.
// So of course, I did all this on purpose.
// So I created this kind of sophisticated example
// to show you all these consequences
// that these hooks can have in our code.
// Just so I could show you the thought process
// behind analyzing what happens here so that you can
// in the future think about this stuff on your own.
// So I think that this is really, really important
// and will make you a better React developer for sure.

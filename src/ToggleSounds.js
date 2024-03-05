import { memo } from "react";

function ToggleSounds({ allowSound, setAllowSound }) {
  return (
    <button
      className="btn-sound"
      onClick={() => setAllowSound((allow) => !allow)}
    >
      {allowSound ? "🔈" : "🔇"}
    </button>
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
export default memo(ToggleSounds);

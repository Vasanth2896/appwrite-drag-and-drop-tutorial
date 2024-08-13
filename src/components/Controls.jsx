import AddButton from "./AddButton";
import colorData from "../assets/colors.json";
import Color from "./Color";

const Controls = () => {
  return (
    <div id="controls">
      <AddButton />
      {colorData.map((color) => {
        return <Color key={color.id} color={color} />;
      })}
    </div>
  );
};

export default Controls;

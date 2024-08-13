export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  try {
    const offsetLeft = card.offsetLeft - mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y;

    return {
      x: offsetLeft < 0 ? 0 : offsetLeft,
      y: offsetTop < 0 ? 0 : offsetTop,
    };
  } catch (error) {
    return ;
  }
};

export const setZIndex = (selectedCard) => {
  selectedCard.style.zIndex = 999;
  try {
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
      if (card !== selectedCard) {
        card.style.zIndex = selectedCard.style.zIndex - 1;
      }
    });
  } catch (error) {
    return;
  }
};

export const bodyParser = (value) => {
  try {
    JSON.parse(value);
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const Canvas = require("@napi-rs/canvas");

module.exports = async (context, x, y, card, cardSize, textSize) => {
   const img = await Canvas.loadImage(`src/assets/cards/${card.id}.jpg`);
   const sword = await Canvas.loadImage(`src/assets/crossed_swords.png`);
   const shield = await Canvas.loadImage(`src/assets/shield.png`);
   const marginBottom = 10;
   context.font = `bolder ${textSize}px gg`;
   const defWidth = context.measureText(" " + card.def.toString() + " %").width;
   const lineHeight = context.measureText("M").width;
   context.drawImage(img, x, y, cardSize[0], cardSize[1]);
   context.drawImage(
      sword,
      x,
      y + cardSize[1] + marginBottom,
      textSize,
      textSize
   );
   context.fillText(
      card.atk.toString(),
      x + textSize + 10,
      y + cardSize[1] + marginBottom + lineHeight
   );
   context.drawImage(
      shield,
      x + cardSize[0] - defWidth * 1.5,
      y + cardSize[1] + marginBottom,
      textSize,
      textSize
   );

   context.fillText(
      " " + card.def.toString() + " %",
      x + cardSize[0] - defWidth,
      y + cardSize[1] + marginBottom + lineHeight
   );
};

let currentLanguage;
let textDirection;
let lineDirection;

const getUserSetting = async () => {
  currentLanguage = await chrome.storage.sync.get("language");
  textDirection = await chrome.storage.sync.get("textDirection");
  lineDirection = await chrome.storage.sync.get("lineDirection");
  currentLanguage = undefined ? "en" : currentLanguage.language;
  textDirection = undefined ? "LR" : textDirection.textDirection;
  lineDirection = undefined ? "TB" : lineDirection.lineDirection;
};

getUserSetting();

//Main function
async function main() {
  getBase64Image(
    document.getElementById("imgtransTarget").src,
    function (base64image) {
      getTextAndTranslate(base64image);
    }
  );
}

//Submain function
async function getTextAndTranslate(image) {
  await getTextBlockAndTranslate(image, function (rowBlocks) {
    copyImageToCanvas(rowBlocks);
  });
}

//getTextBlock and translate
async function getTextBlockAndTranslate(image, callback) {
  const url = "https://img-chrome-server.vercel.app/";
  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      img: image,
      language: currentLanguage,
    }),
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      callback(data.rowBlocks);
    });
}

//Translate img to base64 string
function getBase64Image(imgUrl, callback) {
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png"),
      dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    callback(dataURL);
  };
  img.setAttribute("crossOrigin", "anonymous");
  img.src = imgUrl;
}

function copyImageToCanvas(blocks) {
  const oldimg = document.getElementById("imgtransTarget");
  oldimg.setAttribute("crossOrigin", "anonymous");
  let canvas = document.createElement("canvas");
  canvas.width = oldimg.naturalWidth;
  canvas.height = oldimg.naturalHeight;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(oldimg, 0, 0);
  if (currentLanguage == "en") {
    textDirection = "RL";
    lineDirection = "TB";
  }
  for (let block of blocks) {
    fillText(ctx, block);
  }
  oldimg.src = canvas.toDataURL("image/png");
}

const fillText = (ctx, block) => {
  const topL = block.vertices[0];
  const topR = block.vertices[1];
  const botL = block.vertices[2];
  const botR = block.vertices[3];
  ctx.fillStyle = "white";
  ctx.fillRect(
    topL.x,
    topL.y,
    Math.abs(topL.x - topR.x) + 5,
    Math.abs(topL.y - botL.y) + 10
  );
  let textX = lineDirection == "RL" ? topR.x - block.fontSize : topL.x;
  let textY = topL.y + block.fontSize;
  // ctx.fillStyle = "red";
  // ctx.fillRect(topL.x, topL.y, 10, 10);
  // ctx.fillRect(topR.x, topR.y, 10, 10);
  // ctx.fillRect(botL.x, botL.y, 10, 10);
  // ctx.fillRect(botR.x, botR.y, 10, 10);
  ctx.fillStyle = "black";
  ctx.font = `${block.fontSize}px serif`;
  let text = block.text;
  let txt = document.createElement("textarea");
  txt.innerHTML = text;
  text = txt.value;
  let textArray = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i].match(/[a-zA-Z]+/)) {
      let curr = "";
      while (i < text.length && text[i].match(/[a-zA-Z]+/)) {
        curr += text[i];
        i++;
      }
      textArray.push(curr);
      if (text[i]) textArray.push(text[i] + " ");
    } else {
      textArray.push(text[i]);
    }
  }
  if (currentLanguage == "en" || textDirection == "LR") {
    let line = "";
    let lineWidth = 0;
    for (const word of textArray) {
      const wordWidth = ctx.measureText(word).width;
      if (lineWidth + wordWidth >= topR.x - topL.x) {
        ctx.fillText(line, textX, textY);
        line = word;
        lineWidth = wordWidth;
        textY += block.fontSize * 1;
      } else {
        lineWidth += wordWidth;
        line += word;
      }
    }
    ctx.fillText(line, textX, textY);
  } else {
    for (let i = 0; i < textArray.length; i++) {
      ctx.fillText(textArray[i], textX, textY);
      let [x, y] = getNextTextPosition(
        textX,
        textY,
        block.fontSize,
        topL,
        topR,
        botL
      );
      textX = x;
      textY = y;
    }
  }
};

const getNextTextPosition = (x, y, fontSize, topL, topR, botL) => {
  if (textDirection == "LR") {
    x += fontSize;
    if (x > topR.x) {
      x = topL.x;
      y = y + fontSize;
    }
    return [x, y];
  } else if (textDirection == "TB") {
    y += fontSize;
    if (y > botL.y && lineDirection == "RL") {
      x = x - fontSize;
      y = topL.y + fontSize;
    }
    if (y > botL.y && lineDirection == "LR") {
      x = x + fontSize;
      y = topL.y + fontSize;
    }
    return [x, y];
  }
};

let oldImage;

document.addEventListener(
  "contextmenu",
  function (event) {
    oldImage = event.target;
  },
  true
);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "start") {
    oldImage.id = "imgtransTarget";
    await main();
  } else if (request.message === "languageChange") {
    currentLanguage = request.language;
  } else if (request.message === "text-direction-change") {
    textDirection = request.direction;
  } else if (request.message === "line-direction-change") {
    lineDirection = request.direction;
  } else if (request.message === "languageCheck") {
    chrome.storage.sync.get("language", function (data) {});
    chrome.storage.sync.get("textDirection", function (data) {});
    chrome.storage.sync.get("lineDirection", function (data) {});
  }
});

window.onload = function () {
  let collectButton = document.getElementById("collect_images");

  collectButton.onclick = function () {
    chrome.scripting.executeScript({ function: scriptCodeCollect });
    let textCollect = document.getElementById("textCollect");
    chrome.storage.local.get("savedImages", function (result) {
      textCollect.innerHTML =
        "collected " + result.savedImages.length + " images";
    });
  };

  let downloadButton = document.getElementById("download_images");

  downloadButton.onclick = function () {
    downloadButton.innerHTML = "Downloaded ";
    chrome.scripting.executeScript({ function: scriptCodeDownload });
  };
};

const scriptCodeCollect = (function () {
  // collect all images
  let images = document.querySelectorAll("img");
  let srcArray = Array.from(images).map(function (image) {
    return image.currentSrc;
  });
  chrome.storage.local.get("savedImages", function (result) {
    // remove empty images
    imagestodownload = [];
    for (img of srcArray) {
      if (img) imagestodownload.push(img);
    }
    result.savedImages = imagestodownload;
    chrome.storage.local.set(result);
    console.log(
      "local collection setting success:" + result.savedImages.length
    );
  });
})();

const scriptCodeDownload = (function () {
  chrome.storage.local.get("savedImages", function (result) {
    let message = {
      savedImages: result.savedImages,
    };
    chrome.runtime.sendMessage(message, function () {
      console.log("sending success");
    });
  });
})();

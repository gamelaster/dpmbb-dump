const webview = document.querySelector('webview');
const URL = require('url');
const fs = require("fs-extra-promise");
const cheerio = require("cheerio");
const bluebird = require("bluebird");
let loaded = false;

let htmlCallbacks = {};

function getHTML(url) {
  return new bluebird(function(resolve, reject) {
    let path = URL.parse(url).path;
    webview.loadURL(url);
    htmlCallbacks[path] = resolve;
  });
}

webview.addEventListener('dom-ready', () => {
  if (loaded == false) {
    webview.openDevTools();
    loaded = true;
    console.log("Loading main...");
    getHTML("http://www.dpmbb.eu/cp_internet.php")
      .then(function(html) {
        let $ = cheerio.load(html);
        let lines = [];
        $("select[name='kodlinky'] option").each(function() {
          if($(this).val()) {
            lines.push($(this).val());
          }
        });
        return lines;
      })
      .mapSeries(function(lineCode, lineIndex, linesLength) {
        console.log(`${lineIndex}/${linesLength} - Loading ${lineCode}`);
        return getHTML("http://www.dpmbb.eu/cp_internet.php?kodlinky=" + lineCode)
          .then(function(html) {
            let $ = cheerio.load(html);
            let stations = [];
            $("table a").each(function(index) {
              stations.push("http://www.dpmbb.eu/" + $(this).attr("href"));
            });
            return stations;
          })
          .mapSeries(function(link, stationIndex, stationsLength) {
            console.log(`${lineIndex}/${linesLength} - Loading ${stationIndex}/${stationsLength}`);
            return getHTML(link);
          });
      });
  }
});

webview.addEventListener('ipc-message', (event) => {
  if (event.channel == "saveMe") {
    let path = URL.parse(webview.getURL()).path;
    webview.getWebContents().savePage("./data/" + encodeURIComponent(path), "HTMLOnly", function(err) {
      if (htmlCallbacks[path]) {
        fs.readFileAsync("./data/" + encodeURIComponent(path), "utf-8")
          .then(function(data) {
            htmlCallbacks[path](data);
            delete htmlCallbacks[path];
          });
      }
    });
  }
})

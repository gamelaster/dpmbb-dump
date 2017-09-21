const {ipcRenderer} = require('electron');

window.addEventListener("load", function(event) {
  if (window.location.href.indexOf("dpmbb.eu") != -1) {
    ipcRenderer.sendToHost('saveMe');      
  }
});
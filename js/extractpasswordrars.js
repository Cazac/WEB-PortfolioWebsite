"use strict";

var startTime;
var fileToUnrar;
var imagesFound = [];
var rpc;

var rarFilePath = "";
var rarFileName = "";
var targetImageName = "";
var userPassword = "";

//////////////////////////////////////////////////////////////////////

var getUserPassRarFile = function() {

    fetch(rarFilePath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {

        const blob = new Blob([arrayBuffer]);
        const file = new File([blob], rarFileName, {type: blob.type, lastModified: Date.now() });

        fileToUnrar = file;
        startUnrar();
    })
    .catch(error => console.error('Error fetching the RAR file:', error));
}

var kickoffRarDownloaderSetup = function(inRarFilePath, inUserPassword) {

    rarFilePath = inRarFilePath;
    userPassword = inUserPassword;

    var so = {loaded:downloadRarFiles}
    RPC.new("./js/worker.js", so).then(function(r) {
      rpc = r
    })
}

var downloadRarFiles = function() {

    fetch(rarFilePath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {

        const blob = new Blob([arrayBuffer]);
        const file = new File([blob], "Replacement Rar Images", {type: blob.type, lastModified: Date.now() });

        fileToUnrar = file;
        startUnrar();
    })
    .catch(error => console.error('Error fetching the RAR file:', error));
}

var errShow = function(errMsg) {
    //document.querySelector("#loadStatus").innerHTML = "<strong>" + errMsg + "</strong>"
}

var startUnrar = function(){

    var buffers = []
    var dataToPass = []
    
    var reader = new FileReader();
    reader.onload = readerLoadedCallback
    
    if (fileToUnrar != null) {
        reader.readAsArrayBuffer(fileToUnrar);
    } else {
        errShow("No file selected")
    }

    // Callback for when the reader is loaded
    function readerLoadedCallback(e) {

        startTime = Date.now()

        var data = e.target.result;
        buffers.push(data)
        dataToPass.push({name: fileToUnrar.name, content: data})
        rpc.transferables = buffers

        rpc.unrar(dataToPass, userPassword).then(function(ret) {
            var FindAndAddFile = function(key, entry) 
            {
                if (entry.type === 'dir') 
                {
                    Object.keys(entry.ls).forEach(function(k) {
                        FindAndAddFile(k, entry.ls[k])
                    })
                }   
                else if (entry.type === 'file') {
                    const fullName = entry.fullFileName.split('/').pop()
                    const blob = new Blob([entry.fileContent]);
                    const file = new File([blob], fullName, {type: blob.type, lastModified: Date.now() });

                    imagesFound.push(file);

                    console.log("file!");
                    console.log(file);
                }
            }

            // Foreach of the files inside loop and add them to 
            Object.keys(ret.ls).forEach(function(k) {
                FindAndAddFile(k, ret.ls[k]);
            })

            //document.querySelector("#loadStatus").innerHTML = "Finish decompression, used " + ((Date.now() - startTime) / 1000).toFixed(2) + " s"


            // Call the function to handle images in index.html
            handleImagesInIndex(imagesFound);

        }).catch(errShow)
    };
}
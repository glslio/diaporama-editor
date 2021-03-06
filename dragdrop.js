var Dropzone  = require("./lib/dropzone");
var $         = require("jquery");

var imgurDropzone;

Dropzone.options.dropzone = { // The camelized version of the ID of the form element
  autoProcessQueue: false, /* we want to handle uploads ourselves */
  uploadMultiple: true,
  parallelUploads: 5,
  addRemoveLinks: true,
  maxFiles: 40,
  /* The setting up of the dropzone */
  init: function() {
    imgurDropzone = this;
    window.imgurDropzone = this;
  }
};

module.exports = function (onImageUploaded, onImageError) {

  var uploadToImgur = function(file) {

    /* imgur accepts only base64 images */
    var FR= new FileReader();
    FR.onload = function(e) {
      var imgurUrl            = "https://api.imgur.com/3/image";
      var imgurAuthorization  = 'Client-ID e44fba7377de423';
      var image               = e.target.result.replace(/^data:image\/(png|jpg|gif|jpeg);base64,/, "");
      $.ajax({ 
        url: imgurUrl,
        headers: {
            'Authorization': imgurAuthorization
        },
        type: "POST",
        data: {
            "image": image
        },
        success: function(data) {
          imgurDropzone.emit("success", file, "data", null);
          imgurDropzone.removeFile(file);
          onImageUploaded(data.data.link);

        },
        failure: function(msg) {
          imgurDropzone.emit("error", file, "data", null);
          onImageError(msg);
        }
      });
    };

    FR.readAsDataURL(file);
  };

  $("#upload-all").click(function (e) {
    var files = imgurDropzone.getQueuedFiles();
    for(var i=0; i<files.length; i++) {
      uploadToImgur(files[i]);
    }
  });

  $("#upload-all").click(function (e) {
    var files = imgurDropzone.getQueuedFiles();
    for(var i=0; i<files.length; i++) {
      uploadToImgur(files[i]);
    }
  });

  $("#dropzone").on('dragover', function(e) {
    e.preventDefault();
  });

  $("#dropzone").on('drop', function(e) {
    e.preventDefault();
    e.originalEvent.dataTransfer.items[0].getAsString(function(url) {
      onImageUploaded(url);
    });
    console.log("e.originalEvent.dataTransfer.items[0].", e.originalEvent.dataTransfer.items[0]);
    var hey = e.originalEvent.dataTransfer.items[0];
    console.log("e.originalEvent.dataTransfer.items[0] 2", hey);
  });

};

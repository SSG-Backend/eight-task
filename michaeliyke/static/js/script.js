!(function() {


  function select(selector) {
    return document.querySelector(selector);
  }

  Dropzone.options.myAwesomeDropzone = { // The camelized version of the ID of the form element

    // The configuration we've talked about above
    autoProcessQueue: false,
    uploadMultiple: false,
    parallelUploads: 1,
    maxFiles: 1,
    paramName: "book",
    url: "/upload-target",
    dictDefaultMessage: "Drop the book to upload (image/pdf)",
    acceptedFiles: "image/*, application/pdf, application/json",
    addRemoveLinks: true,

    params: function() {
      return {
        author: select("form #book-author2").value,
        title: select("form #book-title2").value
      }
    },


    // The setting up of the dropzone
    init: function() {
      var myDropzone = this;

      // First change the button to actually tell Dropzone to process the queue.
      this.element.parentNode.querySelector("button[type=submit]").addEventListener("click", function(e) {
        // Make sure that the form isn't actually being sent.
        e.preventDefault();
        e.stopPropagation();
        myDropzone.processQueue();
      });

      this.on("sending", function(formData, xhttp) {
        myDropzone.element.parentNode.reset();
        this.emit("reset");
      });

      this.on("maxfilesexceeded", function(file) {
        this.removeFile(file);
      });

      // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
      // of the sending event because uploadMultiple is set to true.
      this.on("sendingmultiple", function() {
        // Gets triggered when the form is actually being sent.
        // Hide the success button or the complete form.
      });
      this.on("successmultiple", function(files, response) {
        // Gets triggered when the files have successfully been sent.
        // Redirect user or notify of success.
      });
      this.on("errormultiple", function(files, response) {
        // Gets triggered when there was an error sending the files.
        // Maybe show form again, and notify user of error
      });
    }

  }

}());
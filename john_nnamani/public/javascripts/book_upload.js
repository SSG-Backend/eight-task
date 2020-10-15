Dropzone.options.myAwesomeDropzone = { // The camelized version of the ID of the form element

    // The configuration we've talked about above
    autoProcessQueue: false,
    parallelUploads: 100,
    maxFiles: 100,

    // The setting up of the dropzone
    init: function() {
        var myDropzone = this;

        // First change the button to actually tell Dropzone to process the queue.
        this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
        });

        this.previewsContainer = document.getElementById("preview-container");

        this.on("addedfile", function() {
            myDropzone.element.querySelector("#zone button").style.display = 'none';
        });
        // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
        // of the sending event because uploadMultiple is set to true.
        this.on("sending", function() {
            // Gets triggered when the form is actually being sent.
            // Hide the success button or the complete form.
        });
        this.on("success", function(files, response) {
            // Gets triggered when the files have successfully been sent.
            // Redirect user or notify of success.
        });
        this.on("error", function(files, response) {
            // Gets triggered when there was an error sending the files.
            // Maybe show form again, and notify user of error
        });
    },

    // previewTemplate: document.querySelector('#zone').innerHTML,
    // // Specifing an event as an configuration option overwrites the default
    // // `addedfile` event handler.
    // addedfile: function(file) {
    //     file.previewElement = Dropzone.createElement(this.options.previewTemplate);
    //     // Now attach this new element some where in your page
    // },
    // thumbnail: function(file, dataUrl) {
    //     // Display the image in your file.previewElement
    // },
    // uploadprogress: function(file, progress, bytesSent) {
    //     // Display the progress
    // }

}
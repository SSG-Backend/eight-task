Dropzone.options.bookDropzone= {
    paramName: 'file',
    url: '/book/upload',
    autoProcessQueue: false,
    uploadMultiple: false,
    parallelUploads: 100,
    maxFiles: 100,
    maxFilesize: 1,
    acceptedFiles: 'application/pdf',
    addRemoveLinks: true,
    success: function(file, response){
        var imgName = response;
            file.previewElement.classList.add("dz-success");
            console.log("Successfully uploaded :" + imgName);
            document.getElementById("submit").disabled = true;
            document.getElementById("submit").innerText = "Book Uploaded";
            document.getElementById("next").hidden = false;

    },
    init: function() {
        dzClosure = this; // Makes sure that 'this' is understood inside the functions below.

        // this.on("addedfile", function(e) { dzClosure.processQueue(); });

        // for Dropzone to process the queue (instead of default form behavior):
        document.getElementById("submit").addEventListener("click", function(e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            dzClosure.processQueue();
        });

        //send all the form data along with the files:
        this.on("sending", function(file, xhr, formData) {
            formData.append("isbn", $("#fieldIsbn").val());
            formData.append("title", $("#fieldTitle").val());
            formData.append("category", $("#fieldCategory").val());
            formData.append("author", $("#fieldAuthor").val());
            formData.append("publisher", $("#fieldPublisher").val());
            formData.append("pages", $("#fieldPages").val());
            formData.append("year", $("#fieldYear").val());
            formData.append("filename", file.upload.filename);
        });


    }
}



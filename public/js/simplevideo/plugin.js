var DEFAULT_BUTTON_TEXT = '▶♫';

tinymce.PluginManager.add('simplevideo', function(editor, url) {
    // Add a button that opens a window
    editor.addButton('simplevideo', {
        text: 'Upload Video',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'Upload a video',
                url: '/fileapitest.html',
                buttons: [
                    {
                        text: 'Close',
                        onclick: 'close'
                    }, 
                    //{   
                    //    text: 'Upload',
                    //    onclick: function(e){
                    //        console.log(editor.form);
                    //        //Set the form options.
                    //        var opts = {
                    //            url: '/api/fileupload/create',
                    //            data: editor.form,
                    //            cache: false,
                    //            contentType: false,
                    //            processData: false,
                    //            type: 'POST',

                    //            //This function is executed when the file uploads successfully.
                    //            success: function(data){
                    //                //Dev Note: KeystoneAPI only allows file and image uploads with the file itself. Any extra metadata will have to
                    //                //be uploaded/updated with a second call.

                    //                //debugger;
                    //                console.log('File upload succeeded! ID: ' + data.file_upload._id);

                    //                //Fill out the file metadata information
                    //                //data.file_upload.name = $('#file_name').val();
                    //                data.file_upload.url = '/uploads/videos/'+data.file_upload.file.filename;
                    //                //data.file_upload.fileType = data.file_upload.file.mimetype;
                    //                //data.file_upload.createdTimeStamp = new Date();


                    //                editor.insertContent('<img src="'+data.file_upload.url+'"/>');
                    //                //Update the file with the information above.
                    //                $.get('/api/fileupload/'+data.file_upload._id+'/update', data.file_upload, function(data) {
                    //                    //debugger;

                    //                    console.log('File information updated.');

                    //                    //Add the uploaded file to the uploaded file list.
                    //                    //$('#file_list').append('<li><a href="'+data.collection.url+'" download>'+data.collection.name+'</a></li>');

                    //                })

                    //                //If the metadata update fails:
                    //                    .fail(function(data) {
                    //                        debugger;

                    //                        console.error('The file metadata was not updated. Here is the error message from the server:');
                    //                        console.error('Server status: '+err.status);
                    //                        console.error('Server message: '+err.statusText);

                    //                        alert('Failed to connect to the server while trying to update file metadata!');
                    //                    });
                    //            },

                    //            //This error function is called if the POST fails for submitting the file itself.
                    //            error: function(err) {
                    //                //debugger;

                    //                console.error('The file was not uploaded to the server. Here is the error message from the server:');
                    //                console.error('Server status: '+err.status);
                    //                console.error('Server message: '+err.statusText);

                    //                alert('Failed to connect to the server!');
                    //            }
                    //        };

                    //        //Execute the AJAX call.
                    //        jQuery.ajax(opts);


                    //    },
                    //}
                ],
                /*body: [
                    {type: 'fileupload', name: 'title', label: 'Title'}
                ],
                onsubmit: function(e) {
                // Insert content when the window form is submitted
                    editor.insertContent('Title: ' + e.data.title);
                }*/

            });
        }
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('simplevideo', {
        text: 'Example plugin',
        context: 'tools',
        onclick: function() {
            // Open window with a specific url
            editor.windowManager.open({
                title: 'TinyMCE site',
                url: 'https://www.tinymce.com',
                width: 800,
                height: 600,
                buttons: [{
                    text: 'Close',
                    onclick: 'close'
                }]
            });
        }
    });

    return {
        getMetadata: function () {
            return  {
                title: "Example plugin",
                url: "http://exampleplugindocsurl.com"
            };
        }
    };
});


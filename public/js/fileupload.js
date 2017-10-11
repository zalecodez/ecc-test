$(document).ready(function(){

    $("#myUpload").change(function(e){
        var file = e.target.files[0];

        var data = new FormData();

        data.append("file", file, file.name);

        parent.tinymce.activeEditor.form = data;

    });

});

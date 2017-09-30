  var REGEX_TYPE_VIDEO = /video\/*/;
  var REGEX_TYPE_IMAGE = /image\/*/;
  var REGEX_TYPE_AUDIO = /audio\/*/;
  var REGEX_URL = /^https?:\/\//;
  var REGEX_VIDEO = /\.(webm|ogg|mp4)$/i;
  var REGEX_IMAGE = /\.(jpe?g|png|gif)$/i;
  var REGEX_AUDIO = /\.(wav|mp3)$/i;
  var REGEX_YOUTUBE = /^https?:\/\/www.youtube.com\/watch\?v=(.+)|^https?:\/\/youtu.be\/(.+)/;
  var REGEX_VIMEO = /^https?:\/\/vimeo.com\/(\d+(\?.+)*)/;
  var REGEX_WISTIA = /^https?:\/\/\w+\.wistia\.com\/medias\/(.+)/;
  var REGEX_MESSAGE_TOKEN = /\*(.*?)\*/g;
  var DEFAULT_BUTTON_TEXT = '▶♫';

  //--------------------------------------------------
  // Plugin
  //--------------------------------------------------

  // Register media uploader plugin with TinyMCE
  tinymce.PluginManager.add('mediauploader', function (editor, url) {
    var image = getParam(editor, 'button_image');
    var text = getMessage(editor, 'button_text', DEFAULT_BUTTON_TEXT);

    editor.addCommand('InsertMediaUploader', function() {
      // Only allow one at a time
      var element = getDOMNode(editor);
      if (element) {
        element.focus();
        return;
      }

      renderComponent(editor);
      componentDidMount(editor);
    });

    editor.addButton('mediauploader', {
      image: image,
      title: getMessage(editor, 'button_title', 'Upload Media'),
      text: (image && text === DEFAULT_BUTTON_TEXT) ? null : text,
      onclick: function () {
        editor.execCommand('InsertMediaUploader');
      }
    });
  });


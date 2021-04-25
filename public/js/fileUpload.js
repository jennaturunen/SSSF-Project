FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginImageTransform
);

FilePond.setOptions({
  stylePanelAspectRatio: 250 / 250,
  imageResizeTargetWidth: 250,
  imageResizeTargetHeight: 250,
  imageCropAspectRatio: 1,
  imageResizeMode: 'contain',
  imageTransformVariants: {
    thumb_large_: (transforms) => {
      transforms.resize = {
        size: {
          width: 640,
          height: 640,
        },
      };
      return transforms;
    },
    thumb_small_: (transforms) => {
      transforms.resize = {
        size: {
          width: 300,
          height: 300,
        },
      };
      return transforms;
    },
  },
});

FilePond.parse(document.body);

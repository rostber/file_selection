class FileSelection {
  constructor(options) {
    const defaultOptions = {
      maxFileSizeLimitMb: 0,
      elInputFile: null,
      elInputTextarea: null,
      elDropZone: null,
      classDropZomeHighlight: 'highlight',
      handleFileSelect: (file) => {},
      handleFileSelectSizeLimit: (file) => {}
    };
    this.options = Object.assign(defaultOptions, options);

    this.bind();
  }
  bind() {
    if (this.options.elInputFile) {
      this.options.elInputFile.addEventListener('change', this.handleInputFileChange.bind(this), false);
    }

    if (this.options.elInputTextarea) {
      this.options.elInputTextarea.addEventListener('paste', this.handlePast.bind(this), false);
    }

    if (this.options.elDropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        this.options.elDropZone.addEventListener(eventName, this.handleDragHighlight.bind(this), false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this.options.elDropZone.addEventListener(eventName, this.handleDragUnhighlight.bind(this), false);
      });

      this.options.elDropZone.addEventListener('dragover', this.handleDragOver.bind(this), false);
      this.options.elDropZone.addEventListener('drop', this.handleDrop.bind(this), false);
    }
  }
  handleInputFileChange (event) {
    this.handleFile(event.target.files[0]);
  }
  handleDragHighlight() {
    this.options.elDropZone.classList.add(this.options.classDropZomeHighlight);
  }
  handleDragUnhighlight() {
    this.options.elDropZone.classList.remove(this.options.classDropZomeHighlight);
  }
  handleDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer.files;
    this.handleFile(files[0]);
  }
  handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }
  handlePast(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.kind === 'file') {
        event.preventDefault();
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = this.handlePastOnload.bind(this);
        reader.readAsDataURL(blob);
      }
    }
  }
  handlePastOnload(event) {
    const base64 = event.target.result;
    const file = this.dataURLtoFile(base64, 'myfile');
    this.handleFile(file);
  }
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]);
    let n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    const fileExt = mime.split('/')[1];
    return new File([u8arr], filename + '.' + fileExt, {type: mime});
  }
  handleFile(file) {
    if (!this.options.maxFileSizeLimitMb || file.size / 1048576 < this.options.maxFileSizeLimitMb) {
      this.options.handleFileSelect(file);
    } else {
      this.options.handleFileSelectSizeLimit(file);
    }
  }
};

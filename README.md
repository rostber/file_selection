# HTML5 file selection

```
<script type="text/javascript" src="file_selection.js">//</script>

<p>Click:</p>
<input type="file" id="file" />

<p>Paste:</p>
<textarea id="textarea" placeholder="Ctrl+V/Cmd+V file"></textarea>

<p>Drag and drop:</p>
<div id="drop">Drag and drop</div>

<script type="text/javascript">

new FileSelection({
  maxFileSizeLimitMb: 10,
  elInputFile: document.getElementById('file'),
  elInputTextarea: document.getElementById('textarea'),
  elDropZone: document.getElementById('drop'),
  classDropZomeHighlight: 'highlight',
  handleFileSelect: (file) => {
    console.log('Selected', file);
  },
  handleFileSelectSizeLimit: (file) => {
    console.log('Error file size', file.size);
  }
});

</script>
```
#target photoshop;
app.bringToFront();

var importFolder = Folder.selectDialog("请选择单页所在文件夹");
var importFiles = importFolder.getFiles();
importFiles.shift();
var importNum = importFiles.length;
var exportNum = importNum/2;
var exportFiles = new Array();
var exportFolder = Folder.selectDialog("请选择导出位置");
var doc1, doc2, singlePageWidth, singlePageHeight;

// exporting options
var jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = 12;

alert("单页文件必须按顺序命名，尺寸相同，否则不保证转换结果。");
if(importNum%4!=0){
	alert("骑马钉P数必须是4的倍数");
} else {
	for(i=1;i<=exportNum;i++){
		// get the correct single pages
		if(i%2!=0){
			app.open(new File(importFiles[importNum-i+1-1]));
			doc1 = app.activeDocument;
			app.open(new File(importFiles[i-1]));
			doc2 = app.activeDocument;
		} else {
			app.open(new File(importFiles[i-1]));
			doc1 = app.activeDocument;
			app.open(new File(importFiles[importNum-i+1-1]));
			doc2 = app.activeDocument;
		}
		// concatenate them
		singlePageWidth = doc1.width;
		singlePageHeight = doc1.height;
		doc2.activeLayer.duplicate (doc1.layers[0], ElementPlacement.PLACEBEFORE);
		doc2.close(SaveOptions.DONOTSAVECHANGES);
		doc1.resizeCanvas(singlePageWidth*2, singlePageHeight, AnchorPosition.MIDDLELEFT);
		doc1.activeLayer.translate(singlePageWidth,0);
		doc1.mergeVisibleLayers();
		// export
		doc1.saveAs(new File(exportFolder + "/" + i + ".jpg"), jpgSaveOptions, true, Extension.LOWERCASE);
		doc1.close(SaveOptions.DONOTSAVECHANGES);
	}
}

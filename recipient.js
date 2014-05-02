//decodes base64 encoded string
// function base64ToString(base64){
// 	var decodedData = window.atob(base64);
// 	return decodedData;
// }

function drawNewImg(pixelArrayData, width, height){
	var newCanvas = document.createElement("canvas")
	newCanvas.setAttribute("id", "new-canvas");

	newCanvas.width = width;
	newCanvas.height = height;
	var ctx = newCanvas.getContext("2d");

	var palette = ctx.getImageData(0,0,width,height);

	palette.data.set(new Uint8ClampedArray(pixelArrayData));

	ctx.putImageData(palette, 0, 0);

	return newCanvas;

}

$(document).on('ready', function() {

	if (window.location.hash != ""){
		$('#sender').toggle();
		$('#recipient').toggle();
		var keyValue = window.location.hash.substr(1);

		var item = localStorage.getItem(keyValue);
		var object = JSON.parse(item);
		var data = object["encryptedData"];
		var width = object["width"];
		var height = object["height"];

		$('#re-pw-form').on('submit', function(e){
			e.preventDefault();
			var password = $('#re-pw').val();

			var decrypted = CryptoJS.AES.decrypt(data, password);
			var decryptToUTF = decrypted.toString(CryptoJS.enc.Utf8);
			var newpixelArr = stringToArray(decryptToUTF);

			
			var newCanvas = drawNewImg(newpixelArr, width, height);
			$(newCanvas).hide().appendTo('.decrypted-img').fadeIn(1000);
			$('#re-pw-form').toggle();
		});

	}



});
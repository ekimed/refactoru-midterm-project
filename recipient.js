//decodes base64 encoded string
// function base64ToString(base64){
// 	var decodedData = window.atob(base64);
// 	return decodedData;
// }

function drawNewImg(pixelArrayData){
	var newCanvas = document.createElement("canvas")

	newCanvas.width = 800;
	newCanvas.height = 1000;
	var ctx = newCanvas.getContext("2d");

	var palette = ctx.getImageData(0,0,442,656);

	palette.data.set(new Uint8ClampedArray(pixelArrayData));

	ctx.putImageData(palette, 0, 0);

	return newCanvas;

}

$(document).on('ready', function() {

	if (window.location.hash != ""){
		$('#sender').toggle();
		$('#recipient').toggle();
		var keyValue = window.location.hash.substr(1);

		var data = localStorage.getItem(keyValue);

		$('#re-pw-form').on('submit', function(e){
			e.preventDefault();
			var password = $('#re-pw').val();
			var decrypted = CryptoJS.AES.decrypt(data, password);
			var decryptToUTF = decrypted.toString(CryptoJS.enc.Utf8);
			var newpixelArr = stringToArray(decryptToUTF);
			console.log(newpixelArr);
			
			var newCanvas = drawNewImg(newpixelArr);
			$('.decrypted-img').append(newCanvas);
			$('#re-pw-form').toggle();
		});

	}



});
function upload(filename){
	var reader = new FileReader();
	reader.onload = function(e){
		var img = new Image();
		img.src = e.target.result;
		var c = document.createElement("canvas");
		$('.img-container').append(c);
		c.width = img.width;
		c.height = img.height;
		var ctx = c.getContext("2d");
		ctx.drawImage(img,0,0);
		}
	reader.readAsDataURL(document.getElementById('userImage').files[0]);
	
}


function getCanvasImgData($canvas){
	console.log('check');
	var context = document.getElementsByTagName("canvas")[0].getContext("2d");
	var imageData = context.getImageData(0,0, $canvas.width(), $canvas.height());
	var pixelArray = imageData.data;
	return pixelArray;

}

//convert array to string
//remove alpha component
function arrayToString(array){
	var str = "";
	for(var i=0; i<array.length; i+=4){
		str+=(String.fromCharCode(array[i]) 
			+ String.fromCharCode(array[i+1]) 
			+ String.fromCharCode(array[i+2]));
	}

	return str;
}

//encodes string to base64
function stringToBase64(string){
	var encodedData = window.btoa(string);
	return encodedData;
}

//decodes base64 encoded string
function base64ToString(base64){
	var decodedData = window.atob(base64);
	return decodedData;
}

//returns pixel data array
function stringToArray(string){
	var arr = [];
	for (var i=0; i<string.length; i++){
		if (i != 0 && i % 4 === 0){
			arr.push(255);
		}
		arr.push(string.charCodeAt(i));
	}
	return arr;
}

$(document).on('ready', function() {

	$('label').click(function(){
		$("input:file").click();
	}).show();

	$("input:file").change(function(){
		var filename = $(this).val();
		upload(filename);
		$('.encrypt-btn').toggle();
		$('body').animate({scrollTop:$('div.img-container').offset().top}, 500);

	})

	$('.encrypt-btn').on('click', function(){
		$('#pw-form').toggle();
		$('#show-form').toggle();
		$('body').animate({scrollTop:$('#pw-form').offset().top}, 500);
	})

	$('form').on('submit', function(e){
		//encrypt the base64data that is to be sent to the recipient
		e.preventDefault();

		var password = $('.encrypt-pw').val();

		//returns pixel data
		var pixelArr = getCanvasImgData($('canvas'))

		//turns pixel data to string of characters
		var stringifyedArray = arrayToString(pixelArr);

		//AES encryption of pixel data
		var encrypted = CryptoJS.AES.encrypt(stringifyedArray, password);


		//base64 encode encrypted image data
		//ensure transmit of data without loss or modification
		var encoded = stringToBase64(encrypted);

		//store encoded data in localStorage
		localStorage.setItem('encodedImage', encoded);



		//AES decryption of pixel data
		var decrypted = CryptoJS.AES.decrypt(encrypted, password);
		var decryptToUTF = decrypted.toString(CryptoJS.enc.Utf8);

		//convert decrypted pixel array data to array
		var pixelArr = stringToArray(decryptToUTF);



	})




});
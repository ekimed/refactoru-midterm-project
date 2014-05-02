//uploads a file from user's computer
//creates canvas of image file
function createCanvas(filename, cb){
	var reader = new FileReader();
	reader.onload = function(e){
		var img = new Image();
		img.src = e.target.result;
		var c = document.createElement("canvas");
		c.setAttribute("id", "loaded-img");
		c.width = img.width;
		c.height = img.height;
		var ctx = c.getContext("2d");
		ctx.drawImage(img,0,0);
		cb(c);
		}
	reader.readAsDataURL(document.getElementById('userImage').files[0]);
	
}

//returns the width and height in an object
function getDimensions(canvasId){
	var Dimensions = {};
	var canvas = document.getElementById(canvasId);

	Dimensions['width'] = canvas.width;
	Dimensions['height'] = canvas.height;

	return Dimensions;

}

//returns the pixel array data of canvas element
function getCanvasImgData(canvasId){
	var canvas = document.getElementById(canvasId)
	var context = canvas.getContext("2d");
	var imageData = context.getImageData(0,0, canvas.width, canvas.height);
	var pixelArray = imageData.data;

	return pixelArray;

}

//convert array to string
function arrayToString(array){
	var str = "";
	for(var i=0; i<array.length; i+=4){
		str+=(String.fromCharCode(array[i]) 
			+ String.fromCharCode(array[i+1]) 
			+ String.fromCharCode(array[i+2]));
	}

	return str;
}

//converts encrypted string of characters to
//an array of unicode characters
function stringToArray(string){
	var arr = [];
	for(var i=0; i<string.length; i++){
		if(i % 3 === 0 && i != 0){
			arr.push(255)
		}

		arr.push(string.charCodeAt(i));

	}

	return arr;
}

//generates a unique 4-character alphanumeric sequence
//generate random number
//number greater than 9 converted to character by providing a radix of 36
function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}

//encrypts user uploaded image with given password
function encryptLoadedImage($canvas, password){
	var pixelArr = getCanvasImgData($canvas);
	var stringifyedArray = arrayToString(pixelArr);
	var encryptedImageData = CryptoJS.AES.encrypt(stringifyedArray, password);
	return encryptedImageData;
}

var ImageObject = function(encryptedData, width, height){
	this.encryptedData = encryptedData;
	this.width = width;
	this.height = height;
}

$(document).on('ready', function() {
	// localStorage.clear();

	$('label').click(function(){
		$("input:file").click();
	}).show();

	$("input:file").change(function(){
		var filename = $(this).val();
		createCanvas(filename, function(c){
			$('.img-container').append(c);
		});
		$('.encrypt-btn').toggle();
		$('body').animate({scrollTop:$('div.img-container').offset().top}, 500);

	})

	$('.encrypt-btn').on('click', function(){
		$('#pw-form').toggle();
		$('#show-form').toggle();
		$('body').animate({scrollTop:$('#pw-form').offset().top}, 500);
	})

	$('#pw-form').on('submit', function(e){
		e.preventDefault();

		$('#show-form').slideToggle();

		

		//encrypt uploaded image
		var password = $('.encrypt-pw').val();
		var encryptedData = encryptLoadedImage('loaded-img', password);
		var dimensions = getDimensions("loaded-img");
		var uniqueId = generateUID();
		var imageObjectForStorage = new ImageObject(encryptedData.toString(), dimensions.width, dimensions.height);		
		var stringifiedObject = JSON.stringify(imageObjectForStorage);

		//remove uploaded image
		$('.img-container').fadeOut(1000, function(){ $(this).remove() })

		//store data with uniqueId as key
		localStorage.setItem(uniqueId, stringifiedObject);


		// var newUrl = $('<a target="_blank" href="localhost:8012/#'+uniqueId+'">localhost:8012/#'+uniqueId+'<a>');
		// $('.display-url').append(newUrl);



		var imgSrc = document.getElementById("loaded-img").toDataURL();

		//create img tag
		// var img = $('<img id="qbert" src="'+ imgSrc + '">')
		// $('.img-container').append(img);
		// $('#qbert').css('display', 'none');

		//set new canvas height and width for both style and canvas
		var qbertCanvas = $('#qbert-canvas');
		qbertCanvas.css("width", dimensions.width); 
		qbertCanvas.css("height", dimensions.height);

		var canvas = document.getElementById("qbert-canvas");
		canvas.width = dimensions.width;
		canvas.height = dimensions.height;


		//Qbertify image and load
		new Raster(imgSrc).on('load', function() {
			// $('#qbert').remove();
			raster = this;
			this.remove();

			init(canvas.width, canvas.height);
			raster.onFrame = onFrame;
			raster.onResize = onResize;
			$('.display-url').css('text-align', 'center');

			var newUrl = $('<a target="_blank" href="localhost:8012/#'+uniqueId+'">localhost:8012/#'+uniqueId+'<a>');
			$('.display-url').append(newUrl);
		});


	});
	





});
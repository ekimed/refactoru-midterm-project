
$(document).on('ready', function() {
	var encryptedImage = localStorage.getItem('encodedImage');

	//AES decryption of pixel data
	var decrypted = CryptoJS.AES.decrypt(encryptedImage, password);
	var decryptToUTF = decrypted.toString(CryptoJS.enc.Utf8);

	//convert decrypted pixel array data to array
	var pixelArr = stringToArray(decryptToUTF);

	
});
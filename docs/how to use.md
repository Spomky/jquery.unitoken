# How to use #

## Basics ##
Here are some basics methods. Look at the samples to get more about these functions.

### Version of the plugin ###

	var version = $my_interface.getPluginVersion();

### Version of the Firefox plugin ###

	var version = $my_interface.getLibraryVersion();

### Get all tokens ###

	var tokens = $my_interface.getTokens();
Will return a JSON list of tokens.

### Get a token ###

	var token = $my_interface.getToken(0);
Will return a token object. The argument is the slot where the is connected.
If the slot is invalid, all methods of the token object will return « undefined ».

### Refresh tokens ###

	$my_interface.refreshTokens();
Will update the tokens list. Usefull when you just have connected a new token.

## Token methods ##

All methods return a JSON list like this one:

	{
		code: … //Represent the response code.
		message: … //A textual message depending on the response code
		data: … //Data returned by the method or « undefined » if the methods returns nothing
	}

 See [response codes](response_codes) for more informations about these codes and messages.

### Logon / Logoff and PIN code ###

	var token = $my_interface.getToken(0);

	token.logon(2, "My current admin password"); //First argument is the mode: 1 means « user mode », 2 means « admin mode »
	
	token.changePin("My current admin password", "My new admin password"); //Change the password of the current level (admin in this example).
	token.changePin("", "My new user password", true); //Admin can change user's password. Old password is not needed and third argument must be true or 1.
	
	token.logoff();
	

### Token informations ###
Get informations about the token:

	var details = token.getDetails();

Will return a JSON list with all informations:

	{
	    'slot': ,
	    'type': ,
	    'firmware_version': ,
	    'id': ,
	    'hid': ,
	    'soft_id': ,
	    'attempt_count': ,
	    'user_level': ,
	    'token': 
    }

#### Change token informations ####

	//When you are logged in user mode
	token.setID("The new ID"); //A string to identify the token
	token.setSoftID(1234); //An integer between 0 and 4294967295
	token.setLed(0); //Set LED On/Off. 0 == Off and 1 == On

	//When you are logged in admin mode
	token.setAttemptCount(5); //An integer between 0 (unlimited) and 15.
	token.format(); //Format the key

### Keys operations ###
#### Random data ####

Get Random data using the token

	var data = token.getRandomData(100); // Return random 100 random numbers (base64 encoded).

#### Keys ####
##### Generate keys #####

	token.generateDESKey(); //Create a DES key. Return the handle or an error code.
	token.generateDES3Key(); //Create a DES3 key. Return the handle or an error code.
	token.generateAES16Key(); //Create an AES key (128 bits). Return the handle or an error code.
	token.generateAES24Key(); //Create an AES key (196 bits). Return the handle or an error code.
	token.generateRSA128KeyPair(); //Create an RSA key (1024 bits). Return a JSON list with public and private handles or an error code.
	token.generateRSA256KeyPair(); //Create an RSA key (2048 bits). Return a JSON list with public and private handles or an error code.

##### Data encryption #####

    token.encryptDES(handle, "Encrypt this string", 19);
    token.encryptDES3(handle, "Encrypt this string", 19);
    token.encryptAES(handle, "Encrypt this string", 19);
    token.encryptRSAPublicKey(handle, "Encrypt this string", 19);
    token.encryptRSAPrivateKey(handle, "Encrypt this string", 19);
 
These function will return an error code or a JSON list that represents the encrypted data.

##### Data decryption #####

    token.decryptDES(handle, "Encrypt this string", 19);
    token.decryptDES3(handle, "Encrypt this string", 19);
    token.decryptAES(handle, "Encrypt this string", 19);
    token.decryptRSAPublicKey(handle, "Encrypt this string", 19);
    token.decryptRSArivateKey(handle, "Encrypt this string", 19);
 
These function will return an error code or a JSON list that represents the decrypted data.

##### Keys management #####
###### Count keys ######

    token.countKey(); // Count all keys (except RSA ; see NOTA)
    token.countDESKey();
    token.countDES3Keys();
    token.countAESKey();
    token.countRSAKeys();
    token.countMD5HMACKeys();
    token.countSHA1HMACKeys();
 
These functions will return an error code or a JSON list that represents the decrypted data.

*NOTA: There is a known bug with countRSAKeys() that does not depend on this jQuery plugin but on the Firefox plugin.*

###### Get keys ######

	token.getKeys(); // Get all keys (except RSA ; see NOTA)
    token.getDESKeys();
    token.getDES3Keys();
    token.getAESKeys();
    token.getRSAKeys(); // See NOTA
    token.getMD5HMACKeys();
    token.getSHA1HMACKeys();

*NOTA: There is a known bug with getRSAKeys() that does not depend on this jQuery plugin but on the Firefox plugin.*

###### Delete keys ######

    token.deleteDESKey(handle);
    token.decryptDES3Key(handle);
    token.decryptAESKey(handle);
    token.deleteRSAKeyPair(public_key_handle, private_key_handle);
    token.deleteMD5HMACKey(handle);
    token.deleteSHA1HMACKey(handle);

###### Specific methods for RSA keys ######

    token.getRSAPublicKeyHandle(handle);
    token.getRSAPrivateKeyHandle(handle);
	token.exportRSAPublicKey(handle);

#### Files ####
##### Get space available #####

	token.getSpace();

Return a JSON list with total, free and used space.

	{
		used:,
		free:,
		total:
	}

##### Get files #####

	token.countFiles();
	var files = token.getFiles(); // Return a JSON list that contains File objects.
	var file = token.getFile("file1"); // Return a File object.

##### File object #####

	file.open();

	file.details();
	
	file.read(offset, len);

	file.write(offset, len, data);
	
	file.close();

	file.remove();
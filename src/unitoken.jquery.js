/*! UniToken jQuery Plugin v1.2 | (c) 2013 Florent Morselli | www.morselli.fr

This plugin aims to create an interface to get access UniToken keys and retreive files, certificates and methods provided them.
*/


/*
TODO:
    Add auto logoff after a while.
*/

(function($) {
    var PLUGIN_MAJOR_VERSION              = 1;
    var PLUGIN_MINOR_VERSION              = 2;
    var PLUGIN_VERSION              = PLUGIN_MAJOR_VERSION<<4+PLUGIN_MINOR_VERSION;

    // ---------  macro code -----------------
    var USER_LEVEL_GUEST            = 0x00;
    var USER_LEVEL_USER             = 0x01;
    var USER_LEVEL_ADMIN            = 0x02;

    // ---------  response codes -----------------
    var OK                    = 0x00000000;
    var NOT_INITIALIZE        = 0xC0000001;
    var BUFFER_TOO_SMALL      = 0xC0000002;
    var ARGUMENTS_BAD         = 0xC0000003;
    var NO_PERMISSION         = 0xC0000004;
    var NO_TOKEN              = 0xC0000006;
    var TOKEN_HANDLE_INVALID  = 0xC0000007;
    var SLOT_FULL             = 0xC0000008;
    var SLOT_ID_INVALID       = 0xC0000009;
    var DEVICE_ERROR          = 0xC0000010;
    var ALREADY_INITIALIZE    = 0xC0000011;
    var DEVICE_TX             = 0xC0000012;
    var PIN_ERROR             = 0xC0000013;
    var USER_LOCKED           = 0xC0000014;
    var USER_FULL             = 0xC0000015;
    var NO_USER               = 0xC0000016;
    var DEVICE_NEED_OPEN      = 0xC0000017;
    var KEY_EXIST             = 0xC0000018;
    var NO_KEY                = 0xC0000019;
    var KEY_FULL              = 0xC0000020;
    var KEY_HANDLE_INVALID    = 0xC0000021;
    var KEY_GENERATE          = 0xC0000022;
    var NOT_ALLOWED           = 0xC0000023;
    var OPERATE_INVALID       = 0xC0000024;

    var FS_INITIALIZE_FAILED  = 0xCF000001;
    var FS_NOSPACE            = 0xCF000002;
    var FS_OFFSET_INVALID     = 0xCF000003;
    var FS_DATA_LEN_RANGE     = 0xCF000004;
    var FS_NO_OPEN            = 0xCF000005;
    var FS_NO_FILE            = 0xCF000006;
    var FS_LIST_END           = 0xCF000007;
    var FS_NAME_LEN_RANGE     = 0xCF000008;
    var FS_FILE_EXIST         = 0xCF00000A;

    var KEY_DES               = 0xA0000000;
    var KEY_DES3              = 0xA0000001;
    var KEY_AES               = 0xA0000002;
    var KEY_RSA               = 0xA0000003;
    var KEY_RSA_PUBLIC        = 0xA0000004;
    var KEY_RSA_PRIVATE       = 0xA0000005;
    var KEY_MD5HMAC           = 0xA0000006;
    var KEY_MD5               = 0xA0000007;
    var KEY_SHA1HMAC          = 0xA0000008;
    var KEY_SHA1              = 0xA0000009;

    var defaults = {
        debug: false
    };
    var settings = {};

    var getCodeMessage = function(code)
    {
		code >>>= 0;
		var msg;
		switch(code)
		{
			case OK:
				msg = "No error";
				break;
			case NOT_INITIALIZE:
				msg = "Library not initialized";
				break;
			case BUFFER_TOO_SMALL:
				msg = "Buffer is not big enough";
				break;
			case ARGUMENTS_BAD:
				msg = "Invalid parameters";
				break;
			case NO_PERMISSION:
				msg = "No permission";
				break;
			case NO_TOKEN:
				msg = "No token available";
				break;
			case TOKEN_HANDLE_INVALID:
				msg = "Invalid token handle";
				break;
			case SLOT_FULL:
				msg = "Slot is full. No more token can be added";
				break;
			case SLOT_ID_INVALID:
				msg = "Invalid slot";
				break;
			case DEVICE_ERROR:
				msg = "Device error";
				break;
			case ALREADY_INITIALIZE:
				msg = "The token is already initialized";
				break;
			case DEVICE_TX:
				msg = "Communication error";
				break;
			case PIN_ERROR:
				msg = "PIN error";
				break;
			case USER_LOCKED:
				msg = "User has been locked";
				break;
			case USER_FULL:
				msg = "No more users can logon";
				break;
			case NO_USER:
				msg = "No such user available";
				break;
			case DEVICE_NEED_OPEN:
				msg = "Device is not opened yet";
				break;
			case KEY_EXIST:
				msg = "The key already exists";
				break;
			case NO_KEY:
				msg = "No key available";
				break;
			case KEY_FULL:
				msg = "The token is full and can't generate new keys";
				break;
			case KEY_HANDLE_INVALID:
				msg = "Key handle error";
				break;
			case KEY_GENERATE:
				msg = "Key generation failed";
				break;
			case NOT_ALLOWED:
				msg = "Operation not allowed";
				break;
			case OPERATE_INVALID:
				msg = "Invalid operation";
				break;
			case FS_INITIALIZE_FAILED:
				msg = "File initialization failed";
				break;
			case FS_NOSPACE:
				msg = "Not enough filesystem space";
				break;
			case FS_OFFSET_INVALID:
				msg = "Designated file offset is invalid";
				break;
			case FS_DATA_LEN_RANGE:
				msg = "Beyond data range";
				break;
			case FS_NO_OPEN:
				msg = "The file is not opened";
				break;
			case FS_NO_FILE:
				msg = "No file";
				break;
			case FS_LIST_END:
				msg = "End of file list";
				break;
			case FS_NAME_LEN_RANGE:
				msg = "Filename is too long";
				break;
			case FS_FILE_EXIST:
				msg = "The file already exists";
				break;
			default:
				msg = "The result of the method has code: 0x"+code.toString(16);
		};
		return msg;
    }

	var log = {};
    log.message = function(msg)
    {
        if(settings.debug)
             console.log(msg);
    }

    log.code = function(code)
    {
        if(settings.debug)
			log.message( getCodeMessage(code) );
    }
	
	var prepareResponse = function(code, data)
	{
		return {
			code: code >>>0,
			message: getCodeMessage(code),
			result: data
		};
	}


    var File = function(iface, handle, filename)
    {
        var file = this;
        var interface_ = iface;
        var handle_ = handle;
        var filename_ = filename;
        
        var init = function()
        {}

        file.open = function(){
            //if( handle_== undefined )
                //return undefined;

            log.message('Opening '+filename_);

            var result = interface_.UT_FS_OpenFile(handle_, filename_);
            log.code(result);
            return prepareResponse(result,undefined);
        }

        file.close = function(){
            //if( handle_== undefined )
                //return undefined;

            log.message('Closing '+filename_);

            var result = interface_.UT_FS_CloseFile(handle_, filename_);
            log.code(result);
            return prepareResponse(result,undefined);
        }

        file.remove = function(){
            //if( handle_== undefined )
                //return undefined;

            log.message('Removing '+filename_);

            var result = interface_.UT_FS_DeleteFile(handle_, filename_);
            log.code(result);
            return prepareResponse(result,undefined);
        }

        var size = function(){
            //if( handle_== undefined )
                //return undefined;

            log.message('Getting size of '+filename_);

            var result = interface_.UT_FS_GetFileSize(handle_, filename_);
            log.code(result);
            if(result == OK)
			{
				var value = interface_.FileSize;
                return prepareResponse(result,value);
			}
			
            return undefined;
        }

        var permission = function(){
            //if( handle_== undefined )
                //return undefined;

            log.message('Getting permission of '+filename_);

            var result = interface_.UT_FS_GetFilePermission(handle_, filename_);
            log.code(result);
            if(result == OK)
			{
				var value = interface_.FilePermission;
                return prepareResponse(result,value);
			}
			
            return undefined;
        }

        file.details = function(){
            return {
                'filename': filename_,
                'size': size(),
                'permission': permission()
            };
        }

        file.read = function(offset, len){
            //if( handle_== undefined )
                //return undefined;

            log.message('Trying to read '+filename_+' from offset '+offset+' with length '+len);

            var result = interface_.UT_FS_ReadFile(handle_, filename_, offset, len);
            log.code(result);
            if(result == OK)
			{
				var value = interface_.OutBuf;
                return prepareResponse(result,value);
			}
            return prepareResponse(result,undefined);
        }

        file.write = function(offset, len, data){
            //if( handle_== undefined )
                //return undefined;

            log.message('Trying to write '+filename_+' from offset '+offset+' with data length '+len);
            
            var result = interface_.UT_FS_WriteFile(handle_, filename_, offset, len, data);
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        init();
    };

    var Token = function(iface, slot)
    {
        var token = this;
        var interface_ = iface;
        var slot_ = slot;
        var handle_ = undefined;
        
        
        var init = function()
        {
            log.message('New token interface initialized on slot '+slot_);
        }
        
        var open = function()
        {
            log.message('Trying to open token on slot '+slot_);
            var result = interface_.UT_OpenDevice(slot_);
            log.code(result);
            if(result == OK)
            {
                handle_ = interface_.Handle;
				log.message('Handle is 0x'+handle_.toString(16));
            }
			return prepareResponse(result,undefined);
        }
        
        //Useless
        var close = function()
        {
            //if( handle_== undefined )
                //return undefined;
			
            log.message('Trying to close token on slot '+slot_);

            var result = interface_.UT_CloseDevice(handle_);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        /*
         Token informations
        */
        var getSlot = function()
        {
            return slot_;
        }
        
        var getType = function()
        {
            //if( handle_ == undefined )
                //return undefined;

            log.message('Trying to get type of token on slot '+slot_);
            
            var result = interface_.UT_GetTokenType(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
                var value = interface_.TokenType;
                log.message('\tType is '+value);
                return value;
            }
            return undefined;
        }
        
        var getFirmwareVersion = function()
        {
            //if( handle_ == undefined )
                //return undefined;

            log.message('Trying to get firmware version of token on slot '+slot_);
            
            var result = interface_.UT_GetFirmwareVersion(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.FirmwareVersion;
                log.message('\tFirmware version is 0x'+value.toString(16));
                return value;
            }
                
            return undefined;
        }
        
        token.logon = function(type, password)
        {
            //if( handle_ == undefined )
                //return undefined;

            log.message('Trying to logon token on slot '+slot_);
            
            var result = interface_.UT_Logon(handle_, type, password);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        token.logoff = function()
        {
            //if( handle_ == undefined )
                //return undefined;

            log.message('Trying to logoff token on slot '+slot_);
            
            var result = interface_.UT_Logoff(handle_);
                
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        var getCurrentUserLevel = function()
        {
            //if( handle_ == undefined )
                //return undefined;

            log.message('Trying to get current user level of token on slot '+slot_);
            
            var result = interface_.UT_GetCurrentUserLevel(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.Level;
                log.message('\tCurrent user level is '+(value==0?'guest':(value==1?'user':'admin')));
                return value;
            }
            
            return undefined;
        }
        
        token.changePin = function(oldPassword, newPassword, mode)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to change PIN of token on slot '+slot_);
			
			if(!mode)
			{
				log.message('Mode is not set. Using current permission');
				mode = 0x1;
			}

            var type = getCurrentUserLevel();
            if( mode == 0x2)
                type = USER_LEVEL_USER;

            log.message('Will change password of '+(type==1?'user':'admin'));

            var result = interface_.UT_ChangePin(handle_, type, mode, oldPassword, newPassword);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        var getID = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get ID of token on slot '+slot_);
            
            var result = interface_.UT_GetID(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
                var value = interface_.TokenId;
                log.message('\tThe ID is '+value);
                return value;
            }

            return undefined;
        }
        
        token.setID = function(id)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to set ID of token on slot '+slot_);
            
            var result = interface_.UT_SetID(handle_, id);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        var getHID = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get HID of token on slot '+slot_);
            
            var result = interface_.UT_GetHID(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.HID;
                log.message('\tThe ID is '+value+' (0x'+value.toString(16)+')');
                return value;
            }
            
            return undefined;
        }
        
        var getSoftID = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get Soft ID of token on slot '+slot_);
            
            var result = interface_.UT_GetSoftID(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.SoftID;
                log.message('\tThe ID is '+value+' (0x'+value.toString(16)+')');
                return value;
            }
            
            return undefined;
        }
        
        token.setSoftID = function(id)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to set Soft ID of token on slot '+slot_);
            
            var result = interface_.UT_SetSoftID(handle_, id);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        token.setLed = function(mode)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to set LED mode of token on slot '+slot_);
            
            var result = interface_.UT_LED(handle_, mode);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        var getAttemptCount = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get attempt count of token on slot '+slot_);
            
            var result = interface_.UT_GetAttemptCount(handle_);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.UserAttempt;
                log.message('\tAttempt count is at '+value);
                return value;
            }
            
            return undefined;
        }
        
        token.setAttemptCount = function(count)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to set attempt count of token on slot '+slot_);
            
            var result = interface_.UT_SetAttemptCount(handle_, count);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        token.format = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to format token on slot '+slot_);
            
            var result = interface_.UT_Format(handle_);
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        token.getDetails = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get details of token on slot '+slot_);
            
            return {
                'slot': getSlot(),
                'type': getType(),
                'firmware_version': getFirmwareVersion(),
                'id': getID(),
                'hid': getHID(),
                'soft_id': getSoftID(),
                'attempt_count': getAttemptCount(),
                'user_level': getCurrentUserLevel(),
                'token': this
            };
        }

        
        
        /*
         Password, keys and hash
        */
        token.getRandomData = function(length)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get random data from token on slot '+slot_);
            
            var result = interface_.UT_Rand(handle_, length);
            
            log.code(result);
            
            if(result == OK)
            {
				var value = interface_.OutBuf;
                log.message('\tData: '+value);
                return prepareResponse(result,value);
            }

            return prepareResponse(result,undefined);
        }
        
        token.generateDESKey = function(){ return generateKey(KEY_DES);}
        token.generateDES3Key = function(){ return generateKey(KEY_DES3);}
        token.generateAES16Key = function(){ return generateKey(KEY_AES,16);}
        token.generateAES24Key = function(){ return generateKey(KEY_AES,24);}
        token.generateRSA128KeyPair = function(){ return generateKey(KEY_RSA,128);}
        token.generateRSA256KeyPair = function(){ return generateKey(KEY_RSA,256);}
        token.generateMD5HMACKey = function(length){ return generateKey(KEY_MD5HMAC,length);}
        token.generateSHA1HMACKey = function(length){ return generateKey(KEY_SHA1HMAC,length);}
        var generateKey = function(type, length)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get generate a 0x'+type.toString(16)+' key with token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case KEY_DES:
                    result = interface_.UT_DESGenerateKey(handle_);
                    break;
                case KEY_DES3:
                    result = interface_.UT_DES3GenerateKey(handle_);
                    break;
                case KEY_AES:
                    result = interface_.UT_AESGenerateKey(handle_, length);
                    break;
                case KEY_RSA:
                    result = interface_.UT_RSAGenerateKeyPair(handle_, length, 65537);
                    break;
                case KEY_MD5HMAC:
                    result = interface_.UT_MD5HMACGenerateKey(handle_, length);
                    break;
                case KEY_SHA1HMAC:
                    result = interface_.UT_SHA1HMACGenerateKey(handle_, length);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            };
            
            log.code(result);
            
            if(result == OK)
			{
				var value = interface_.KeyHandle;
                log.message('\tKey handle is 0x'+value.toString(16));
                return prepareResponse(result,value);
			}
            return prepareResponse(result,undefined);
        }
        
        token.encryptDES = function(key, data, data_length){ return encrypt(KEY_DES, key, data, data_length);}
        token.encryptDES3 = function(key, data, data_length){ return encrypt(KEY_DES3, key, data, data_length);}
        token.encryptAES = function(key, data, data_length){ return encrypt(KEY_AES, key, data, data_length);}
        token.encryptRSAPublicKey = function(key, data, data_length){ return encrypt(KEY_RSA_PUBLIC, key, data, data_length);}
        token.encryptRSAPrivateKey = function(key, data, data_length){ return encrypt(KEY_RSA_PRIVATE, key, data, data_length);}
        token.MD5HMAC = function(key, data, data_length){ return encrypt(KEY_MD5HMAC, key, data, data_length);}
        token.MD5 = function(data, data_length){ return encrypt(KEY_MD5, data, data_length);}
        token.SHA1HMAC = function(key, data, data_length){ return encrypt(KEY_SHA1HMAC, key, data, data_length);}
        token.SHA1 = function(data, data_length){ return encrypt(KEY_SHA1, data, data_length);}
        var encrypt = function(type,key, data, data_length)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to encrypt data with key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case KEY_DES:
                    result = interface_.UT_DESEncrypt(handle_, key, data, data_length);
                    break;
                case KEY_DES3:
                    result = interface_.UT_DES3Encrypt(handle_, key, data, data_length);
                    break;
                case KEY_AES:
                    result = interface_.UT_AESEncrypt(handle_, key, data, data_length);
                    break;
                case KEY_RSA_PUBLIC:
                    result = interface_.UT_RSAPubKeyEncrypt(handle_, key, data, data_length);
                    break;
                case KEY_RSA_PRIVATE:
                    result = interface_.UT_RSAPriKeyEncrypt(handle_, key, data, data_length);
                    break;
                case KEY_MD5HMAC:
                    result = interface_.UT_MD5HMAC(handle_, key, data, data_length);
                    break;
                case KEY_MD5:
                    result = interface_.UT_MD5(handle_, data, data_length);
                    break;
                case KEY_SHA1HMAC:
                    result = interface_.UT_SHA1HMAC(handle_, key, data, data_length);
                    break;
                case KEY_SHA1:
                    result = interface_.UT_SHA1(handle_, data, data_length);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            };
            
            log.code(result);
            
            if(result == OK)
            {
                if(type == KEY_MD5HMAC || type == KEY_MD5 || type == KEY_SHA1HMAC || type == KEY_SHA1)
                    return {data: interface_.Degist, length: interface_.Degist.length};
                return {
                    data: interface_.Encrypt,
                    length: interface_.EncryptLength
                };
            }
            return prepareResponse(result,undefined);
        }
        
        token.decryptDES = function(key, data, data_length){ return decrypt(KEY_DES, key, data, data_length);}
        token.decryptDES3 = function(key, data, data_length){ return decrypt(KEY_DES3, key, data, data_length);}
        token.decryptAES = function(key, data, data_length){ return decrypt(KEY_AES, key, data, data_length);}
        token.decryptRSAPublicKey = function(key, data, data_length){ return decrypt(KEY_RSA_PUBLIC, key, data, data_length);}
        token.decryptRSArivateKey = function(key, data, data_length){ return decrypt(KEY_RSA_PRIVATE, key, data, data_length);}
        var decrypt = function(type,key, data, data_length)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to decrypt data with key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case KEY_DES:
                    result = interface_.UT_DESDecrypt(handle_, key, data, data_length);
                    break;
                case KEY_DES3:
                    result = interface_.UT_DES3Decrypt(handle_, key, data, data_length);
                    break;
                case KEY_AES:
                    result = interface_.UT_AESDecrypt(handle_, key, data, data_length);
                    break;
                case KEY_RSA_PRIVATE:
                    result = interface_.UT_RSAPriKeyDecrypt(handle_, key, data, data_length);
                    break;
                case KEY_RSA_PUBLIC:
                    result = interface_.UT_RSAPubKeyDecrypt(handle_, key, data, data_length);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            };
            
            log.code(result);
            
            if(result == OK)
                return {
                    data: interface_.OutBuf,
                    length: interface_.OutBufLength
                };
            return prepareResponse(result,undefined);
        }
        
        token.deleteDESKey = function(key){ return deleteKey(KEY_DES, key);}
        token.deleteDES3Key = function(key){ return deleteKey(KEY_DES3, key);}
        token.deleteAESKey = function(key){ return deleteKey(KEY_AES, key);}
        token.deleteRSAKeyPair = function(pub_key, priv_key){ return deleteKey(KEY_AES, pub_key, priv_key);}
        token.deleteMD5HMACKey = function(key){ return deleteKey(KEY_MD5HMAC, key);}
        token.deleteSHA1HMACKey = function(key){ return deleteKey(KEY_SHA1HMAC, key);}
        var deleteKey = function(type, key, key2)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to delete key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case KEY_DES:
                    result = interface_.UT_DESDeleteKey(handle_, key);
                    break;
                case KEY_DES3:
                    result = interface_.UT_DES3DeleteKey(handle_, key);
                    break;
                case KEY_AES:
                    result = interface_.UT_AESDeleteKey(handle_, key);
                    break;
                case KEY_RSA:
                    result = interface_.RSADeleteKeyPair(handle_, key, key2);
                    break;
                case KEY_MD5HMAC:
                    result = interface_.UT_MD5DeleteKey(handle_, key);
                    break;
                case KEY_SHA1HMAC:
                    result = interface_.UT_SHA1DeleteKey(handle_, key);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            };
            
            log.code(result);
            return prepareResponse(result,undefined);
        }
        
        token.countKeys = function()
        {
            return list = {
                DES: countDESKeys(),
                DES3: countDES3Keys(),
                AES: countDESKeys(),
                RSA: countRSAKeys(),
                MD5HMAC: countMD5HMACKeys(),
                SHA1HMAC: countSHA1HMACKeys()
            };
        }
        token.countDESKeys = function(){ return count_Keys(KEY_DES);}
        token.countDES3Keys = function(){ return count_Keys(KEY_DES3);}
        token.countAESKeys = function(){ return count_Keys(KEY_AES);}
        token.countRSAKeys = function(){ return count_Keys(KEY_RSA);}
        token.countMD5HMACKeys = function(){ return count_Keys(KEY_MD5HMAC);}
        token.countSHA1HMACKeys = function(){ return count_Keys(KEY_SHA1HMAC);}
        var count_Keys = function(type)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to count keys 0x'+type.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case KEY_DES:
                    result = interface_.UT_DESGetKeyCount(handle_);
                    break;
                case KEY_DES3:
                    result = interface_.UT_DES3GetKeyCount(handle_);
                    break;
                case KEY_AES:
                    result = interface_.UT_AESGetKeyCount(handle_);
                    break;
                case KEY_RSA:
                    result = interface_.UT_RSAGetKeyPairCount(handle_);
                    break;
                case KEY_MD5HMAC:
                    result = interface_.UT_MD5GetKeyCount(handle_);
                    break;
                case KEY_SHA1HMAC:
                    result = interface_.UT_SHA1GetKeyCount(handle_);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            };
            
            log.code(result);
            
            if(result == OK)
                return interface_.KeyCount;
            if(result == UT_NO_KEY)
                return 0;
            return prepareResponse(result,undefined);
        }
        
        token.getKeys = function()
        {
            return list = {
                DES: getDESKeys(),
                DES3: getDES3Keys(),
                AES: countDESKeys(),
                //RSA: getAESKeys(),
                MD5HMAC: getMD5HMACKeys(),
                SHA1HMAC: getSHA1HMACKeys()
            };
        }
        token.getDESKeys = function(){ return get_Keys(KEY_DES);}
        token.getDES3Keys = function(){ return get_Keys(KEY_DES3);}
        token.getAESKeys = function(){ return get_Keys(KEY_AES);}
        token.getRSAKeys = function(){ return get_Keys(KEY_RSA);}
        token.getMD5HMACKeys = function(){ return get_Keys(KEY_MD5HMAC);}
        token.getSHA1HMACKeys = function(){ return get_Keys(KEY_SHA1HMAC);}
        var get_Keys = function(type)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get first key 0x'+type.toString(16)+' of token on slot '+slot_);
            
            var list = [];
            var result = getKey(type, true);
            
            log.code(result);
			
            if ( result == OK)
            {
				log.message('Key found! We add it in the list');
                list = createKeyResponse(type, list);
            }
            else
            {
                return list;
            }
            
            log.message('Trying to get next keys 0x'+type.toString(16)+' of token on slot '+slot_);
			
            result = getKey(type, false);
            
            log.code(result);
			
            while( result == OK )
            {
				log.message('Key found! We add it in the list');
                list = createKeyResponse(type, list);
                result = getKey(type, false);
            }
            return list;
        }

        var createKeyResponse = function(type, list){

            var handle = interface_.KeyHandle;
            var length = undefined;

			switch(type)
            {
                case KEY_RSA:
                    var pub = interface_.PubKeyHandle;
                    var priv = interface_.PriKeyHandle;
                    var mod = undefined;
                    var result = UT_RSAGetKeyPairModulus(handle_, handle);
                    if(result == OK)
                        mod = interface_.ModulusBits;
                    list.push({
                        pub_key: pub,
                        priv_key:priv,
                        modulus: mod
                    });
                    break;
                case KEY_AES:
                    var result = interface_.UT_AESGetKeyLen(handle_, handle);
                    if(result == OK)
                        len = interface_.KeyLength;
                    list.push({
                        handle:handle,
                        length:len
                    });
                    break;
                case KEY_MD5HMAC:
                    var result = interface_.UT_MD5GetKeyLen(handle_, handle);
                    if(result == OK)
                        len = interface_.KeyLength;
                    list.push({
                        handle:handle,
                        length:len
                    });
                    break;
                case KEY_SHA1HMAC:
                    var result = interface_.UT_SHA1GetKeyLen(handle_, handle);
                    if(result == OK)
                        len = interface_.KeyLength;
                    list.push({
                        handle:handle,
                        length:len
                    });
                    break;
                default:
                    list.push(handle);
                    break;
            }
            return list;
        }
        
        var getKey = function(type, first)
        {
            var result = undefined;
            if(first)
            {
                switch(type)
                {
                    case KEY_DES:
                        result = interface_.UT_DESGetFirstKeyHandle(handle_);
                        break;
                    case KEY_DES3:
                        result = interface_.UT_DES3GetFirstKeyHandle(handle_);
                        break;
                    case KEY_AES:
                        result = interface_.UT_AESGetFirstKeyHandle(handle_);
                        break;
                    case KEY_RSA:
                        result = interface_.UT_RSAGetFirstKeyPairHandle(handle_);
                        break;
                    case KEY_MD5HMAC:
                        result = interface_.UT_MD5GetFirstKeyHandle(handle_);
                        break;
                    case KEY_SHA1HMAC:
                        result = interface_.UT_SHA1GetFirstKeyHandle(handle_);
                        break;
                    default:
                        result = KEY_BAD_TYPE;
                        break;
                };
            }
            else
            {
                switch(type)
                {
                    case KEY_DES:
                        result = interface_.UT_DESGetNextKeyHandle(handle_);
                        break;
                    case KEY_DES3:
                        result = interface_.UT_DES3GetNextKeyHandle(handle_);
                        break;
                    case KEY_AES:
                        result = interface_.UT_AESGetNextKeyHandle(handle_);
                        break;
                    case KEY_RSA:
                        result = interface_.UT_RSAGetNextKeyPairHandle(handle_);
                        break;
                    case KEY_MD5HMAC:
                        result = interface_.UT_MD5GetNextKeyHandle(handle_);
                        break;
                    case KEY_SHA1HMAC:
                        result = interface_.UT_SHA1GetNextKeyHandle(handle_);
                        break;
                    default:
                        result = KEY_BAD_TYPE;
                        break;
                };
            }
            return prepareResponse(result,undefined);
        }

        token.getRSAPublicKeyHandle = function(key){ return getRSAKeyHandle(KEY_RSA_PRIVATE, key);}
        token.getRSAPrivateKeyHandle = function(key){ return getRSAKeyHandle(KEY_RSA_PUBLIC, key);}
        var getRSAKeyHandle = function(type, key)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to get handle of RSA key from token on slot '+slot_);

            var result = undefined;
            var value = undefined

            switch(type)
            {
                case KEY_RSA_PUBLIC:
                    result = interface_.embed1.UT_RSAGetPubKeyHandle(handle_, key);
                    if(result == OK)
                    {
                        value = interface_.PubKeyHandle;
                    }
                    break;
                case KEY_RSA_PRIVATE:
                    result = interface_.embed1.UT_RSAGetPriKeyHandle(handle_, key);
                    if(result == OK)
                    {
                        value = interface_.PriKeyHandle;
                    }
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            }

            log.code(result);
            
            if(result == OK)
            {
                log.message('\tRSA key handle is: '+value);
                return prepareResponse(result,value);
            }
            return result;
        }

        /*
            Import / Export
            NOTA: this plugin can not import, the functions are not yet implemented by the Firefox plugin.
        */
        token.exportRSAPublicKey = function(key){ return exportKey(KEY_RSA_PUBLIC, key);}
        var exportKey = function(type, key)
        {
            //if( handle_ == undefined )
                //return undefined;
            
            log.message('Trying to export key from token on slot '+slot_);

            var result = undefined;

            switch(type)
            {
                case KEY_RSA_PUBLIC:
                    result = interface_.embed1.UT_RSAPubKeyExport(handle_, key);
                    break;
                default:
                    result = KEY_BAD_TYPE;
                    break;
            }

            log.code(result);
            
            if(result == OK)
            {
                var value = interface_.base64pubkey;
                log.message('\tRSA public key is: '+value);
                return prepareResponse(result,value);
            }
            return result;
        }

        /*
            Filesystem
        */
        token.getSpace = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            var result = interface_.UT_FS_GetSpace(handle_);
            
            log.code(result);
            
            if(result == OK)
			{
				var value = {used:interface_.UsedSpace, free: interface_.FreeSpace, total:interface_.UsedSpace+interface_.FreeSpace};
                return prepareResponse(result,value);
            }
			
			return prepareResponse(result,undefined);
        }

        token.countFiles = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            var result = interface_.UT_FS_GetFileCount(handle_);
            
            log.code(result);
            
            if(result == OK)
			{
				var value = interface_.FileCount;
                return prepareResponse(result,value);
			}
            return prepareResponse(result,undefined);
        }

        token.getFiles = function()
        {
            //if( handle_ == undefined )
                //return undefined;
            
            var list = [];
            
            var result = interface_.UT_FS_GetFirstFileName(handle_);
            if ( result == OK)
            {
                var file = token.getFile(interface_.FileName);
                list.push({details:file.details(), file: file});
            }
            else
            {
                return list;
            }
            
            result = interface_.UT_FS_GetNextFileName(handle_);
            while( result == OK )
            {
                var file = token.getFile(interface_.FileName);
                list.push({details:file.details(), file: file});
                result = interface_.UT_FS_GetNextFileName(handle_);
            }
            return list;
        }

        token.getFile = function(filename)
        {
            //if( handle_ == undefined )
                //return undefined;
            return new File(interface_, handle_, filename);
        }

        
        init();
        open();
    }
    
    $.Interface = function(element) {
        var settings = {};
        var element_ = $(element)[0];
        var interface_ = this;
        
        var init = function()
        {
            log.message('New interface created');
            log.message('Trying to initialize it');
			
            var result = element_.UT_Initialize();
			
			log.code(result);
        }
        
        var close = function()
        {
            element_.UT_Finalize();
            log.message('Interface is finalized.');
        }
        
        interface_.getTokens = function()
        {
            log.message('Trying to get first token');
            var list = [];
            var result = element_.UT_GetFirstToken();
			log.code(result);

            if (result == OK)
            {
                list = updateTokenList(list);
            }
            else
            {
                return list;
            }
            
            log.message('Trying to get next token');
            result = element_.UT_GetNextToken();
			log.code(result);
			
            while(result == OK)
            {
                list = updateTokenList(list);
                result = element_.UT_GetNextToken();
            }
            return list;
        }
		
		var updateTokenList = function(list)
		{
			log.message('Will add the token to the list');
			var details = getTokenDetails(element_.SlotID);
			if( details != undefined)
				list.push( details );
			return list;
		}
        
        interface_.getToken = function(slot)
        {
            return new Token(element_, slot);
        }
        
        var getTokenDetails = function(slot)
        {
            var token = interface_.getToken(slot);
            var list = token.getDetails();
            return list;
        }
        
        interface_.getLibraryVersion = function()
        {
            var result = element_.UT_GetLibraryVersion();
            if( result == OK )
                return element_.Version;
            return undefined;
        }
        
        init();
    }
    
    var tokens = undefined;

    $.fn.unitoken = function(options) {
        settings = $.extend({}, defaults, options);

        return this.each(function() {
            if (undefined == $(this).data('unitoken'))
            {
                if( $(this).attr("type") !== "application/mozilla-npsecuunitoken-scriptable-plugin" )
                {
                    console.log("Selected element is not an embed UniToken scriptable plugin." );
                    return;
                }
                
                var plugin = new $.Interface(this)
                $(this).data('unitoken', plugin);
            }
            return $(this);
        });
    }

    $.fn.getTokens = function() {
        if (undefined == $(this).data('unitoken'))
        {
            console.log("Selected element is not an UniToken object or must be initialized. Please use 'unitoken' function first." );
            return;
        }
        if( tokens == undefined )
            tokens = $(this).data('unitoken').getTokens();
        return tokens;
    }

    $.fn.refreshTokens = function() {
        if (undefined == $(this).data('unitoken'))
        {
            console.log("Selected element is not an UniToken object or must be initialized. Please use 'unitoken' function first." );
            return;
        }

        tokens = $(this).data('unitoken').getTokens();
        return $(this);
    }

    $.fn.getToken = function(slot) {
        if (undefined == $(this).data('unitoken'))
        {
            console.log("Selected element is not an UniToken object or must be initialized. Please use 'unitoken' function first." );
            return;
        }
        if( tokens == undefined )
            tokens = $(this).data('unitoken').getTokens();
        if(tokens.length == 0)
            return undefined;
        for(var i=0;i<tokens.length;i++)
            if(tokens[i].slot == slot)
                return tokens[i].token;
        return undefined;

    }

    $.fn.getLibraryVersion = function() {
        if (undefined == $(this).data('unitoken'))
        {
            console.log("Selected element is not an UniToken object or must be initialized. Please use 'unitoken' function first." );
            return;
        }
        return $(this).data('unitoken').getLibraryVersion();
    }

    $.fn.getPluginVersion = function() {
        return PLUGIN_VERSION;
    }
})(jQuery);

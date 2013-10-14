/*! UniToken jQuery Plugin v0.1 | (c) 2013 Florent Morselli | www.morselli.fr

This plugin aims to create an interface to get access UniToken keys and retreive files, certificates and methods provided them.

You just have to add an embed tag on your HTML page, include jQuery and this plugin libraries and call plugins methods.
*/


/*
TODO:
    Options: add debug mode.
    Add auto logoff after a while.
*/
var UT_PLUGIN_MAJOR_VERSION              = 1;
var UT_PLUGIN_MINOR_VERSION              = 1;
var UT_PLUGIN_VERSION              = UT_PLUGIN_MAJOR_VERSION<<4+UT_PLUGIN_MINOR_VERSION;

// ---------  macro code -----------------
var UT_USER_LEVEL_GUEST            = 0x00;
var UT_USER_LEVEL_USER             = 0x01;
var UT_USER_LEVEL_ADMIN            = 0x02;

// ---------  error code -----------------
var UT_OK                    = 0x00000000;
var UT_NOT_INITIALIZE        = 0xC0000001;
var UT_ARGUMENTS_BAD         = 0xC0000003;
var UT_NO_PERMISSION         = 0xC0000004;
var UT_NO_TOKEN              = 0xC0000006;
var UT_TOKEN_HANDLE_INVALID  = 0xC0000007;
var UT_SLOT_FULL             = 0xC0000008;
var UT_SLOT_ID_INVALID       = 0xC0000009;
var UT_DEVICE_ERROR          = 0xC0000010;
var UT_ALREADY_INITIALIZE    = 0xC0000011;
var UT_DEVICE_TX             = 0xC0000012;
var UT_PIN_ERROR             = 0xC0000013;
var UT_USER_LOCKED           = 0xC0000014;
var UT_USER_FULL             = 0xC0000015;
var UT_NO_USER               = 0xC0000016;
var UT_DEVICE_NEED_OPEN      = 0xC0000017;
var UT_KEY_EXIST             = 0xC0000018;
var UT_NO_KEY                = 0xC0000019;
var UT_KEY_FULL              = 0xC0000020;
var UT_KEY_HANDLE_INVALID    = 0xC0000021;
var UT_KEY_GENERATE          = 0xC0000022;
var UT_NOT_ALLOWED           = 0xC0000023;
var UT_OPERATE_INVALID       = 0xC0000024;

var UT_FS_INITIALIZE_FAILED  = 0xCF000001;
var UT_FS_NOSPACE            = 0xCF000002;
var UT_FS_OFFSET_INVALID     = 0xCF000003;
var UT_FS_DATA_LEN_RANGE     = 0xCF000004;
var UT_FS_NO_OPEN            = 0xCF000005;
var UT_FS_NO_FILE            = 0xCF000006;
var UT_FS_LIST_END           = 0xCF000007;
var UT_FS_NAME_LEN_RANGE     = 0xCF000008;
var UT_FS_FILE_EXIST         = 0xCF00000A;

var UT_KEY_DES               = 0xA0000000;
var UT_KEY_DES3              = 0xA0000001;
var UT_KEY_AES               = 0xA0000002;
var UT_KEY_RSA               = 0xA0000003;
var UT_KEY_RSA_PUBLIC        = 0xA0000004;
var UT_KEY_RSA_PRIVATE       = 0xA0000005;
var UT_KEY_MD5HMAC           = 0xA0000006;
var UT_KEY_MD5               = 0xA0000007;
var UT_KEY_SHA1HMAC          = 0xA0000008;
var UT_KEY_SHA1              = 0xA0000009;

var UT_LED_ON                = 0;
var UT_LED_OFF               = 1;

(function($) {
    $.Log = function(debug){
        var debug_ = debug;

        var log = this;

        log.message = function(msg)
        {
            if(debug_)
                 console.log(msg);
        }

        log.code = function(code)
        {
            if(debug_)
            {
                code >>>= 0;
               var msg;
                switch(code)
                {
                    case UT_OK:
                        msg = "OK";
                        break;
                    case UT_NOT_INITIALIZE:
                        msg = "NOT_INITIALIZE";
                        break;
                    case UT_ARGUMENTS_BAD:
                        msg = "ARGUMENTS_BAD";
                        break;
                    case UT_NO_PERMISSION:
                        msg = "NO_PERMISSION";
                        break;
                    case UT_NO_TOKEN:
                        msg = "NO_TOKEN";
                        break;
                    case UT_TOKEN_HANDLE_INVALID:
                        msg = "TOKEN_HANDLE_INVALID";
                        break;
                    case UT_SLOT_FULL:
                        msg = "SLOT_FULL";
                        break;
                    case UT_SLOT_ID_INVALID:
                        msg = "SLOT_ID_INVALID";
                        break;
                    case UT_DEVICE_ERROR:
                        msg = "DEVICE_ERROR";
                        break;
                    case UT_ALREADY_INITIALIZE:
                        msg = "ALREADY_INITIALIZE";
                        break;
                    case UT_DEVICE_TX:
                        msg = "DEVICE_TX";
                        break;
                    case UT_PIN_ERROR:
                        msg = "PIN_ERROR";
                        break;
                    case UT_USER_LOCKED:
                        msg = "USER_LOCKED";
                        break;
                    case UT_USER_FULL:
                        msg = "USER_FULL";
                        break;
                    case UT_NO_USER:
                        msg = "NO_USER";
                        break;
                    case UT_DEVICE_NEED_OPEN:
                        msg = "DEVICE_NEED_OPEN";
                        break;
                    case UT_KEY_EXIST:
                        msg = "KEY_EXIST";
                        break;
                    case UT_NO_KEY:
                        msg = "NO_KEY";
                        break;
                    case UT_KEY_FULL:
                        msg = "KEY_FULL";
                        break;
                    case UT_KEY_HANDLE_INVALID:
                        msg = "KEY_HANDLE_INVALID";
                        break;
                    case UT_KEY_GENERATE:
                        msg = "KEY_GENERATE";
                        break;
                    case UT_NOT_ALLOWED:
                        msg = "NOT_ALLOWED";
                        break;
                    case UT_OPERATE_INVALID:
                        msg = "OPERATE_INVALID";
                        break;
                    case UT_FS_INITIALIZE_FAILED:
                        msg = "FS_INITIALIZE_FAILED";
                        break;
                    case UT_FS_NOSPACE:
                        msg = "FS_NOSPACE";
                        break;
                    case UT_FS_OFFSET_INVALID:
                        msg = "FS_OFFSET_INVALID";
                        break;
                    case UT_FS_DATA_LEN_RANGE:
                        msg = "FS_DATA_LEN_RANGE";
                        break;
                    case UT_FS_NO_OPEN:
                        msg = "FS_NO_OPEN";
                        break;
                    case UT_FS_NO_FILE:
                        msg = "FS_NO_FILE";
                        break;
                    case UT_FS_LIST_END:
                        msg = "FS_LIST_END";
                        break;
                    case UT_FS_NAME_LEN_RANGE:
                        msg = "FS_NAME_LEN_RANGE";
                        break;
                    case UT_FS_FILE_EXIST:
                        msg = "FS_FILE_EXIST";
                        break;
                    default:
                        msg = "The result of the method has code: "+code;
                };
                log.message(msg);
            }
        }
    };

    $.File = function(iface, handle, filename, options) {
        var defaults = {
            debug: false
        };
        var settings = {};
        var log_ = undefined;
        var file = this;
        var interface_ = iface;
        var handle_ = handle;
        var filename_ = filename;
        
        var init = function()
        {
            settings = $.extend({}, defaults, options);
            log_ = new $.Log(settings.debug);
        }

        file.open = function(){
            if( handle_== undefined )
                return undefined;

            log_.message('Opening '+filename_);

            var result = interface_.UT_FS_OpenFile(handle_, filename_);
            log_.code(result);
            return result>>>0;
        }

        file.close = function(){
            if( handle_== undefined )
                return undefined;

            log_.message('Closing '+filename_);

            var result = interface_.UT_FS_CloseFile(handle_, filename_);
            log_.code(result);
            return result>>>0;
        }

        file.remove = function(){
            if( handle_== undefined )
                return undefined;

            log_.message('Removing '+filename_);

            var result = interface_.UT_FS_DeleteFile(handle_, filename_);
            log_.code(result);
            return result>>>0;
        }

        var size = function(){
            if( handle_== undefined )
                return undefined;

            log_.message('Getting size of '+filename_);

            var result = interface_.UT_FS_GetFileSize(handle_, filename_);
            log_.code(result);
            if(result == UT_OK)
                return interface_.FileSize;
            return undefined;
        }

        var permission = function(){
            if( handle_== undefined )
                return undefined;

            log_.message('Getting permission of '+filename_);

            var result = interface_.UT_FS_GetFilePermission(handle_, filename_);
            log_.code(result);
            if(result == UT_OK)
                return interface_.FilePermission;
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
            if( handle_== undefined )
                return undefined;

            log_.message('Trying to read '+filename_+' from offset '+offset+' with length '+len);

            var result = interface_.UT_FS_ReadFile(handle_, filename_, offset, len);
            log_.code(result);
            if(result == UT_OK)
                return interface_.OutBuf;
            return result>>>0;
        }

        file.write = function(offset, len, data){
            if( handle_== undefined )
                return undefined;

            log_.message('Trying to write '+filename_+' from offset '+offset+' with data length '+len);
            
            var result = interface_.UT_FS_WriteFile(handle_, filename_, offset, len, data);
            log_.code(result);
            return result>>>0;
        }
        
        init();
    };

    $.Token = function(iface, slot, options) {
        var defaults = {
            debug: false
        };
        var settings = {};
        var log_ = undefined;
        var token = this;
        var interface_ = iface;
        var slot_ = slot;
        var handle_ = undefined;
        
        
        var init = function()
        {
            settings = $.extend({}, defaults, options);
            log_ = new $.Log(settings.debug);
            log_.message('New token interface initialized on slot '+slot_);
        }
        
        var open = function()
        {
            log_.message('Trying to open token on slot '+slot_);
            var result = interface_.UT_OpenDevice(slot_);
            log_.code(result);
            if(result == UT_OK)
            {
                handle_ = interface_.Handle;
				log_.message('Handle is 0x'+handle_.toString(16));
            }
        }
        
        //Useless
        var close = function()
        {
            if( handle_== undefined )
                return undefined;
			
            log_.message('Trying to close token on slot '+slot_);

            var result = interface_.UT_CloseDevice(handle_);
            
            log_.code(result);
            return result>>>0;
        }
        
        /*
         Token informations
        */
        token.getSlot = function()
        {
            return slot_;
        }
        
        token.getType = function()
        {
            if( handle_ == undefined )
                return undefined;

            log_.message('Trying to get type of token on slot '+slot_);
            
            var result = interface_.UT_GetTokenType(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
                var value = interface_.TokenType;
                log_.message('\tType is '+value);
                return value;
            }
            return undefined;
        }
        
        token.getFirmwareVersion = function()
        {
            if( handle_ == undefined )
                return undefined;

            log_.message('Trying to get firmware version of token on slot '+slot_);
            
            var result = interface_.UT_GetFirmwareVersion(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.FirmwareVersion;
                log_.message('\tFirmware version is 0x'+value.toString(16));
                return value;
            }
                
            return undefined;
        }
        
        token.logon = function(type, password)
        {
            if( handle_ == undefined )
                return undefined;

            log_.message('Trying to logon token on slot '+slot_);
            
            var result = interface_.UT_Logon(handle_, type, password);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.logoff = function()
        {
            if( handle_ == undefined )
                return undefined;

            log_.message('Trying to logoff token on slot '+slot_);
            
            var result = interface_.UT_Logoff(handle_);
                
            log_.code(result);
            return result>>>0;
        }
        
        token.getCurrentUserLevel = function()
        {
            if( handle_ == undefined )
                return undefined;

            log_.message('Trying to get current user level of token on slot '+slot_);
            
            var result = interface_.UT_GetCurrentUserLevel(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.Level;
                log_.message('\tCurrent user level is '+(value==0?'guest':(value==1?'user':'admin')));
                return value;
            }
            
            return undefined;
        }
        
        token.changePin = function(type, oldPassword, newPassword, mode)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to change PIN of token on slot '+slot_);
			
			if(mode == undefined)
			{
				log_.message('Mode is not set. Using current permission');
				mode = 0x1;
			}

            var result = interface_.UT_ChangePin(handle_, type, mode, oldPassword, newPassword);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.getID = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get ID of token on slot '+slot_);
            
            var result = interface_.UT_GetID(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
                var value = interface_.TokenId;
                log_.message('\tThe ID is '+value);
                return value;
            }

            return undefined;
        }
        
        token.setID = function(id)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to set ID of token on slot '+slot_);
            
            var result = interface_.UT_SetID(handle_, id);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.getHID = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get HID of token on slot '+slot_);
            
            var result = interface_.UT_GetHID(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.HID;
                log_.message('\tThe ID is '+value+' (0x'+value.toString(16)+')');
                return interface_.HID;
            }
            
            return undefined;
        }
        
        token.getSoftID = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get Soft ID of token on slot '+slot_);
            
            var result = interface_.UT_GetSoftID(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.SoftID;
                log_.message('\tThe ID is '+value+' (0x'+value.toString(16)+')');
                return interface_.SoftID;
            }
            
            return undefined;
        }
        
        token.setSoftID = function(id)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to set Soft ID of token on slot '+slot_);
            
            var result = interface_.UT_SetSoftID(handle_, id);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.setLed = function(mode)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to set LED mode of token on slot '+slot_);
            
            var result = interface_.UT_LED(handle_, mode);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.getAttemptCount = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get attempt count of token on slot '+slot_);
            
            var result = interface_.UT_GetAttemptCount(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.UserAttempt;
                log_.message('\tAttempt count is at '+value);
                return value;
            }
            
            return undefined;
        }
        
        token.setAttemptCount = function(count)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to set attempt count of token on slot '+slot_);
            
            var result = interface_.UT_SetAttemptCount(handle_, count);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.format = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to format token on slot '+slot_);
            
            var result = interface_.UT_Format(handle_);
            
            log_.code(result);
            return result>>>0;
        }
        
        token.getDetails = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get details of token on slot '+slot_);
            
            return {
                'slot': token.getSlot(),
                'type': token.getType(),
                'firmware_version': token.getFirmwareVersion(),
                'id': token.getID(),
                'hid': token.getHID(),
                'soft_id': token.getSoftID(),
                'attempt_count': token.getAttemptCount(),
                'user_level': token.getCurrentUserLevel(),
                'token': this
            };
        }

        
        
        /*
         Password, keys and hash
        */
        token.getRandomData = function(length)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get random data from token on slot '+slot_);
            
            var result = interface_.UT_Rand(handle_, length);
            
            log_.code(result);
            
            if(result == UT_OK)
            {
				var value = interface_.OutBuf;
                log_.message('\tData: '+value);
                return value;
            }

            return result>>>0;
        }
        
        token.generateDESKey = function(){ return generateKey(UT_KEY_DES);}
        token.generateDES3Key = function(){ return generateKey(UT_KEY_DES3);}
        token.generateAES16Key = function(){ return generateKey(UT_KEY_AES,16);}
        token.generateAES24Key = function(){ return generateKey(UT_KEY_AES,24);}
        token.generateRSA128KeyPair = function(){ return generateKey(UT_KEY_RSA,128);}
        token.generateRSA256KeyPair = function(){ return generateKey(UT_KEY_RSA,256);}
        token.generateMD5HMACKey = function(length){ return generateKey(UT_KEY_MD5HMAC,length);}
        token.generateSHA1HMACKey = function(length){ return generateKey(UT_KEY_SHA1HMAC,length);}
        var generateKey = function(type, length)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get generate a 0x'+type.toString(16)+' key with token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case UT_KEY_DES:
                    result = interface_.UT_DESGenerateKey(handle_);
                    break;
                case UT_KEY_DES3:
                    result = interface_.UT_DES3GenerateKey(handle_);
                    break;
                case UT_KEY_AES:
                    result = interface_.UT_AESGenerateKey(handle_, length);
                    break;
                case UT_KEY_RSA:
                    result = interface_.UT_RSAGenerateKeyPair(handle_, length, 65537);
                    break;
                case UT_KEY_MD5HMAC:
                    result = interface_.UT_MD5HMACGenerateKey(handle_, length);
                    break;
                case UT_KEY_SHA1HMAC:
                    result = interface_.UT_SHA1HMACGenerateKey(handle_, length);
                    break;
                default:
                    result = UT_KEY_BAD_TYPE;
                    break;
            };
            
            log_.code(result);
            
            if(result == UT_OK)
			{
				var value = interface_.KeyHandle;
                log_.message('\tKey handle is 0x'+value.toString(16));
                return value;
			}
            return result>>>0;
        }
        
        token.encryptDES = function(key, data, data_length){ return encrypt(UT_KEY_DES, key, data, data_length);}
        token.encryptDES3 = function(key, data, data_length){ return encrypt(UT_KEY_DES3, key, data, data_length);}
        token.encryptAES = function(key, data, data_length){ return encrypt(UT_KEY_AES, key, data, data_length);}
        token.encryptRSAPublicKey = function(key, data, data_length){ return encrypt(UT_KEY_RSA_PUBLIC, key, data, data_length);}
        token.encryptRSAPublicKey = function(key, data, data_length){ return encrypt(UT_KEY_RSA_PRIVATE, key, data, data_length);}
        token.MD5HMAC = function(key, data, data_length){ return encrypt(UT_KEY_MD5HMAC, key, data, data_length);}
        token.MD5 = function(data, data_length){ return encrypt(UT_KEY_MD5, data, data_length);}
        token.SHA1HMAC = function(key, data, data_length){ return encrypt(UT_KEY_SHA1HMAC, key, data, data_length);}
        token.SHA1 = function(data, data_length){ return encrypt(UT_KEY_SHA1, data, data_length);}
        var encrypt = function(type,key, data, data_length)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to encrypt data with key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case UT_KEY_DES:
                    result = interface_.UT_DESEncrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_DES3:
                    result = interface_.UT_DES3Encrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_AES:
                    result = interface_.UT_AESEncrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_RSA_PUBLIC:
                    result = interface_.UT_RSAPubKeyEncrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_RSA_PRIVATE:
                    result = interface_.UT_RSAPriKeyEncrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_MD5HMAC:
                    result = interface_.UT_MD5HMAC(handle_, key, data, data_length);
                    break;
                case UT_KEY_MD5:
                    result = interface_.UT_MD5(handle_, data, data_length);
                    break;
                case UT_KEY_SHA1HMAC:
                    result = interface_.UT_SHA1HMAC(handle_, key, data, data_length);
                    break;
                case UT_KEY_SHA1:
                    result = interface_.UT_SHA1(handle_, data, data_length);
                    break;
                default:
                    result = UT_KEY_BAD_TYPE;
                    break;
            };
            
            log_.code(result);
            
            if(result == UT_OK)
            {
                if(type == UT_KEY_MD5HMAC || type == UT_KEY_MD5 || type == UT_KEY_SHA1HMAC || type == UT_KEY_SHA1)
                    return {data: interface_.Degist, length: interface_.Degist.length};
                return {
                    data: interface_.Encrypt,
                    length: interface_.EncryptLength
                };
            }
            return result>>>0;
        }
        
        token.decryptDES = function(key, data, data_length){ return decrypt(UT_KEY_DES, key, data, data_length);}
        token.decryptDES3 = function(key, data, data_length){ return decrypt(UT_KEY_DES3, key, data, data_length);}
        token.decryptAES = function(key, data, data_length){ return decrypt(UT_KEY_AES, key, data, data_length);}
        token.decryptRSAPublicKey = function(key, data, data_length){ return decrypt(UT_KEY_RSA_PUBLIC, key, data, data_length);}
        token.decryptRSArivateKey = function(key, data, data_length){ return decrypt(UT_KEY_RSA_PRIVATE, key, data, data_length);}
        var decrypt = function(type,key, data, data_length)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to decrypt data with key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case UT_KEY_DES:
                    result = interface_.UT_DESDecrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_DES3:
                    result = interface_.UT_DES3Decrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_AES:
                    result = interface_.UT_AESDecrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_RSA_PRIVATE:
                    result = interface_.UT_RSAPriKeyDecrypt(handle_, key, data, data_length);
                    break;
                case UT_KEY_RSA_PUBLIC:
                    result = interface_.UT_RSAPubKeyDecrypt(handle_, key, data, data_length);
                    break;
                default:
                    result = UT_KEY_BAD_TYPE;
                    break;
            };
            
            log_.code(result);
            
            if(result == UT_OK)
                return {
                    data: interface_.OutBuf,
                    length: interface_.OutBufLength
                };
            return result>>>0;
        }
        
        token.deleteDESKey = function(key){ return deleteKey(UT_KEY_DES, key);}
        token.deleteDES3Key = function(key){ return deleteKey(UT_KEY_DES3, key);}
        token.deleteAESKey = function(key){ return deleteKey(UT_KEY_AES, key);}
        token.deleteMD5HMACKey = function(key){ return deleteKey(UT_KEY_MD5HMAC, key);}
        token.deleteSHA1HMACKey = function(key){ return deleteKey(UT_KEY_SHA1HMAC, key);}
        var deleteKey = function(type, key)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to delete key 0x'+key.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case UT_KEY_DES:
                    result = interface_.UT_DESDeleteKey(handle_, key);
                    break;
                case UT_KEY_DES3:
                    result = interface_.UT_DES3DeleteKey(handle_, key);
                    break;
                case UT_KEY_AES:
                    result = interface_.UT_AESDeleteKey(handle_, key);
                    break;
                case UT_KEY_MD5HMAC:
                    result = interface_.UT_MD5DeleteKey(handle_, key);
                    break;
                case UT_KEY_SHA1HMAC:
                    result = interface_.UT_SHA1DeleteKey(handle_, key);
                    break;
                default:
                    result = UT_KEY_BAD_TYPE;
                    break;
            };
            
            log_.code(result);
            return result>>>0;
        }
        
        token.countDESKeys = function(){ return countKeys(UT_KEY_DES);}
        token.countDES3Keys = function(){ return countKeys(UT_KEY_DES3);}
        token.countAESKeys = function(){ return countKeys(UT_KEY_AES);}
        token.countRSAKeys = function(){ return countKeys(UT_KEY_RSA);}
        token.countMD5HMACKeys = function(){ return countKeys(UT_KEY_MD5HMAC);}
        token.countSHA1HMACKeys = function(){ return countKeys(UT_KEY_SHA1HMAC);}
        var countKeys = function(type)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to count keys 0x'+type.toString(16)+' of token on slot '+slot_);
            
            var result = undefined;
            
            switch(type)
            {
                case UT_KEY_DES:
                    result = interface_.UT_DESGetKeyCount(handle_);
                    break;
                case UT_KEY_DES3:
                    result = interface_.UT_DES3GetKeyCount(handle_);
                    break;
                case UT_KEY_AES:
                    result = interface_.UT_AESGetKeyCount(handle_);
                    break;
                case UT_KEY_RSA:
                    result = interface_.UT_RSAGetKeyPairCount(handle_);
                    break;
                case UT_KEY_MD5HMAC:
                    result = interface_.UT_MD5GetKeyCount(handle_);
                    break;
                case UT_KEY_SHA1HMAC:
                    result = interface_.UT_SHA1GetKeyCount(handle_);
                    break;
                default:
                    result = UT_KEY_BAD_TYPE;
                    break;
            };
            
            log_.code(result);
            
            if(result == UT_OK)
                return interface_.KeyCount;
            if(result == UT_NO_KEY)
                return 0;
            return result>>>0;
        }
        
        token.getDESKeys = function(){ return getKeys(UT_KEY_DES);}
        token.getDES3Keys = function(){ return getKeys(UT_KEY_DES3);}
        token.getAESKeys = function(){ return getKeys(UT_KEY_AES);}
        token.getRSAKeys = function(){ return getKeys(UT_KEY_RSA);}
        token.getMD5HMACKeys = function(){ return getKeys(UT_KEY_MD5HMAC);}
        token.getSHA1HMACKeys = function(){ return getKeys(UT_KEY_SHA1HMAC);}
        var getKeys = function(type)
        {
            if( handle_ == undefined )
                return undefined;
            
            log_.message('Trying to get first key 0x'+type.toString(16)+' of token on slot '+slot_);
            
            var list = [];
            var result = getKey(type, true);
            
            log_.code(result);
			
            if ( result == UT_OK)
            {
				log_.message('Will try to add the key');
                list = createKeysResponse(type, list);
            }
            else
            {
                return list;
            }
            
            log_.message('Trying to get next keys 0x'+type.toString(16)+' of token on slot '+slot_);
			
            result = getKey(type, false);
            
            log_.code(result);
			
            while( result == UT_OK )
            {
				log_.message('Will try to add the key');
                list = createKeysResponse(type, list);
                result = getKey(type, false);
            }
            return list;
        }

        var createKeysResponse = function(type, list){

            var k_h = interface_.KeyHandle;
			
            if( type == UT_KEY_RSA )
                list.push({pub_key:interface_.PubKeyHandle, priv_key:interface_.PriKeyHandle});
            else if( type == UT_KEY_AES )
            {
                var result = interface_.UT_AESGetKeyLen(handle_, k_h);
                if(result == UT_OK)
                    list.push({handle:k_h, length:interface_.KeyLength});
                else
                    list.push(k_h);
            }
            else if( type == UT_KEY_MD5HMAC )
            {
                var result = interface_.UT_MD5GetKeyLen(handle_, k_h);
                if(result == UT_OK)
                    list.push({handle:k_h, length:interface_.KeyLength});
                else
                    list.push(k_h);
            }
            else if( type == UT_KEY_SHA1HMAC )
            {
                var result = interface_.UT_SHA1GetKeyLen(handle_, k_h);
                if(result == UT_OK)
                    list.push({handle:k_h, length:interface_.KeyLength});
                else
                    list.push(k_h);
            }
            else
                list.push(k_h);
            return list;
        }
        
        var getKey = function(type, first)
        {
            var result = undefined;
            if(first)
            {
                switch(type)
                {
                    case UT_KEY_DES:
                        result = interface_.UT_DESGetFirstKeyHandle(handle_);
                        break;
                    case UT_KEY_DES3:
                        result = interface_.UT_DES3GetFirstKeyHandle(handle_);
                        break;
                    case UT_KEY_AES:
                        result = interface_.UT_AESGetFirstKeyHandle(handle_);
                        break;
                    case UT_KEY_RSA:
                        result = interface_.UT_RSAGetFirstKeyPairHandle(handle_);
                        break;
                    case UT_KEY_MD5HMAC:
                        result = interface_.UT_MD5GetFirstKeyHandle(handle_);
                        break;
                    case UT_KEY_SHA1HMAC:
                        result = interface_.UT_SHA1GetFirstKeyHandle(handle_);
                        break;
                    default:
                        result = UT_KEY_BAD_TYPE;
                        break;
                };
            }
            else
            {
                switch(type)
                {
                    case UT_KEY_DES:
                        result = interface_.UT_DESGetNextKeyHandle(handle_);
                        break;
                    case UT_KEY_DES3:
                        result = interface_.UT_DES3GetNextKeyHandle(handle_);
                        break;
                    case UT_KEY_AES:
                        result = interface_.UT_AESGetNextKeyHandle(handle_);
                        break;
                    case UT_KEY_RSA:
                        result = interface_.UT_RSAGetNextKeyPairHandle(handle_);
                        break;
                    case UT_KEY_MD5HMAC:
                        result = interface_.UT_MD5GetNextKeyHandle(handle_);
                        break;
                    case UT_KEY_SHA1HMAC:
                        result = interface_.UT_SHA1GetNextKeyHandle(handle_);
                        break;
                    default:
                        result = UT_KEY_BAD_TYPE;
                        break;
                };
            }
            return result>>>0;
        }

        /*
            Filesystem
        */
        token.getSpace = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            var result = interface_.UT_FS_GetSpace(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
                return {used:interface_.UsedSpace, free: interface_.FreeSpace, total:interface_.UsedSpace+interface_.FreeSpace};
            return result>>>0;
        }

        token.countFiles = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            var result = interface_.UT_FS_GetFileCount(handle_);
            
            log_.code(result);
            
            if(result == UT_OK)
                return interface_.FileCount;
            return result>>>0;
        }

        token.getFiles = function()
        {
            if( handle_ == undefined )
                return undefined;
            
            var list = [];
            
            var result = interface_.UT_FS_GetFirstFileName(handle_);
            if ( result == UT_OK)
            {
                var file = new $.File(interface_, handle_, interface_.FileName, settings_);
                list.push({details:file.details(), file: file});
            }
            else
            {
                return list;
            }
            
            result = interface_.UT_FS_GetNextFileName(handle_);
            while( result == UT_OK )
            {
                var file = new $.File(interface_, handle_, interface_.FileName, settings_);
                list.push({details:file.details(), file: file});
                result = interface_.UT_FS_GetNextFileName(handle_);
            }
            return list;
        }

        
        init();
        open();
    }
    
    $.Interface = function(element, options) {
        var defaults = {
            debug: false
        };
        var interface_ = this;
        var log_ = undefined;
        var settings = {};
        var element_ = $(element)[0];
        
        var init = function()
        {
            settings = $.extend({}, defaults, options);
            log_ = new $.Log(settings.debug);
			
            log_.message('New interface created');
            log_.message('Trying to initialize it');
			
            var result = element_.UT_Initialize();
			
			log_.code(result);
        }
        
        var close = function()
        {
            element_.UT_Finalize();
            log_.message('Interface is finalized.');
        }
        
        interface_.getTokens = function()
        {
            log_.message('Trying to get first token');
            var list = [];
            var result = element_.UT_GetFirstToken();
			log_.code(result);

            if (result == UT_OK)
            {
                list = updateTokenList(list);
            }
            else
            {
                return list;
            }
            
            log_.message('Trying to get next token');
            result = element_.UT_GetNextToken();
			log_.code(result);
			
            while(result == UT_OK)
            {
                list = updateTokenList(list);
                result = element_.UT_GetNextToken();
            }
            return list;
        }
		
		var updateTokenList = function(list)
		{
			log_.message('Will add the token to the list');
			var details = getTokenDetails(element_.SlotID);
			if( details != undefined)
				list.push( details );
			return list;
		}
        
        interface_.getToken = function(slot)
        {
            return new $.Token(element_, slot, options);
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
            if( result == UT_OK )
                return element_.Version;
            return undefined;
        }
        
        init();
    }
    
    var tokens = undefined;

    $.fn.unitoken = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('unitoken'))
            {
                if( $(this).attr("type") !== "application/mozilla-npsecuunitoken-scriptable-plugin" )
                {
                    console.log("Selected element is not an embed UniToken scriptable plugin." );
                    return;
                }
                
                var plugin = new $.Interface(this, options);
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
        return UT_PLUGIN_VERSION;
    }
})(jQuery);

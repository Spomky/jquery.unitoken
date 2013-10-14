$(function(){
    var interface_ = $('#interface').unitoken({
        //debug: true
    });
    
    var updateTokenList = function()
    {
        var tokens = interface_.refreshTokens().getTokens();
		
        var $token_list = $('#token_list');
        
        $("#update_tokens").html('');
        updateTokenInformations();
        
        if( tokens.length )
        {
            var result = '<option value="-1">--Select a token--</option>';
            for(var i = 0; i<tokens.length;i++)
                result += '<option value="'+tokens[i].slot+'">'+tokens[i].id+'</option>';
            $token_list.html( result );
        }
        else
        {
            $token_list.html('<option value="-1">--No token found--</option>');
        }
        updateTokenInformations();
    }
    
    var updateTokenFiles = function()
    {
        var dest = $("#file_list");
        var value = eval($("#token_list").val());
        
        dest.html('');
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            if( token )
            {
                var files = token.getFiles();
                var result ='';
                
                if(files.length == 0)
                {
                    result = '<tr><td colspan="4">No file found</td></tr>';
                    return;
                }
                for(var i = 0;i<files.length;i++)
                {
                    result += '<tr>';
                    result += '<td>'+files[i].details.filename+'</td>';
                    result += '<td>'+files[i].details.size+'</td>';
                    result += '<td>'+(files[i].details.permission==0?"guest":(files[i].details.permission==1?"user":"admin"))+'</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                dest.html(result);
            }
        }
    }
    
    var updateTokenKeys = function()
    {
        var dest = $("#key_list");
        var value = eval($("#token_list").val());
        
        dest.html('');
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            if( token )
            {
                var des_keys = token.getDESKeys();
                var des3_keys = token.getDES3Keys();
                var aes_keys = token.getAESKeys();
                var md5_keys = token.getMD5HMACKeys();
                var sha1_keys = token.getSHA1HMACKeys();
                var rsa_keys = token.getRSAKeys();
                var result ='';
                
                if(des_keys.length+des3_keys.length+aes_keys.length+md5_keys.length+sha1_keys.length+rsa_keys.length == 0)
                {
                    result = '<tr><td colspan="3">No file found</td></tr>';
                    return;
                }
                for(var i = 0;i<des_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>0x'+des_keys[i].toString(16)+'</td>';
                    result += '<td>DES</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                for(var i = 0;i<des3_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>0x'+des3_keys[i].toString(16)+'</td>';
                    result += '<td>DES3</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                for(var i = 0;i<aes_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>0x'+aes_keys[i].handle.toString(16)+'</td>';
                    result += '<td>AES'+aes_keys[i].length+'</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                for(var i = 0;i<md5_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>0x'+md5_keys[i].handle.toString(16)+'</td>';
                    result += '<td>MD5 ('+md5_keys[i].length+')</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                for(var i = 0;i<sha1_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>0x'+sha1_keys[i].handle.toString(16)+'</td>';
                    result += '<td>SHA1 ('+sha1_keys[i].length+')</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                for(var i = 0;i<rsa_keys.length;i++)
                {
                    result += '<tr>';
                    result += '<td>Pub: 0x'+rsa_keys[i].pub_key.toString(16)+'<br/>Priv: 0x'+rsa_keys[i].priv_key.toString(16)+'</td>';
                    result += '<td>RSA</td>';
                    result += '<td></td>';
                    result += '</tr>';
                }
                dest.html(result);
            }
        }
    }
    
    /*var changeTokenPin = function()
    {
        var value = eval($("#token_list").val());
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            if( token )
            {
				var old_pin = $("#old_pin").val();
				var new_pin = $("#new_pin").val();
				var new_pin_repeat = $("#new_pin_repeat").val();
				if(old_pin =="" || new_pin =="" || new_pin_repeat =="")
				{
					alert("Please set old and new PIN!");
					return;
				}
				if(new_pin !=new_pin_repeat)
				{
					alert("New PIN has not been repeated twice!");
					return;
				}
				token.changePin()
			}
		}
        else
        {
            alert("Select a token first!");
        }
    }*/
    
    var updateTokenInformations = function()
    {
        var value = eval($("#token_list").val());
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            if( token )
            {
                var details = token.getDetails();
                var tags = '';
                tags += 'Slot: '+details.slot+'<br/>';
                tags += 'Type: '+details.type+'<br/>';
                tags += 'Firmware: '+(details.firmware_version).toString(16)+'<br/>';
                tags += 'ID: '+details.id+'<br/>';
                tags += 'HID: 0x'+(details.hid).toString(16)+'<br/>';
                tags += 'Soft ID: x0'+(details.soft_id).toString(16)+'<br/>';
                tags += 'Attempt count: '+details.attempt_count+'<br/>';
                tags += 'User level: '+(details.user_level==0?'guest':(details.user_level==1?'user':'admin'))+'<br/>';
                $("#token_informations").html(tags);

                /*token.generateDESKey();
                token.generateDES3Key();
                token.generateAES16Key();
                token.generateAES24Key();
                token.generateRSA128KeyPair();
                token.generateRSA256KeyPair();
                token.generateMD5HMACKey(50);
                token.generateSHA1HMACKey(40);*/
            }
        }
        else
        {
            $("#token_informations").html('');
        }

        updateTokenFiles();
        updateTokenKeys();
    }
    
    //var tokens = interface_.getTokens();
    
    $("#update_tokens").click(function(){
        updateTokenList();
    });
    
    $("#token_list").change(function(){
        updateTokenInformations();
    });
    
    $("#connect").click(function(){
        var value = eval($("#token_list").val());
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var password = $("#pin").val();
            var user_level = eval($("#user_level").val());

            if( password == "")
            {
                alert("You must enter yout PIN code!");
                return false;
            }
            
            token.logon( user_level, password );
            
            var t = interface_.getToken(0);
            var text = "Ceci est un message qui va être chiffré avec ma clef DES3. Pour tester si ça marche, je vais la décrypter ensuite.";
        }
        else
        {
            alert("Select a token first!");
        }
        
        updateTokenInformations();
    });
    
    $("#disconnect").click(function(){
        var value = eval($("#token_list").val());
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            token.logoff();
        }
        else
        {
            alert("Select a token first!");
        }
        
        updateTokenInformations();
    });
    
    $("#get_random").click(function(){
        var value = eval($("#token_list").val());
        var random_length = eval($("#get_random_length").val());
        var dest = $("#random_data");
        
        dest.html('');
        
        if( !random_length )
        {
            alert("Length is not set!");
            return;
        }
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var result = token.getRandomData(random_length);
            dest.html(result);
        }
        else
        {
            alert("Select a token first!");
        }
    });
    
    $("#set_id").click(function(){
        var value = eval($("#token_list").val());
        var new_id = $("#new_id").val();
        
        if( !new_id )
        {
            alert("New ID is not set!");
            return;
        }
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var result = token.setID(new_id);
            if( result != UT_OK )
                alert("Une erreur est survenue. Vérifiez que la clé est bien branchée et que vous êtes connecté.");
            updateTokenInformations();
        }
        else
        {
            alert("Select a token first!");
        }
    });
    
    $("#set_sid").click(function(){
        var value = eval($("#token_list").val());
        var new_sid = eval($("#new_sid").val());
        
        if( new_sid<0 || new_sid>4294967295 )
        {
            alert("New Soft ID must be an integer between 0 and 4294967295!");
            return;
        }
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var result = token.setSoftID(new_sid);
            if( result != UT_OK )
                alert("Une erreur est survenue. Vérifiez que la clé est bien branchée et que vous êtes connecté en mode Admin.");
            updateTokenInformations();
        }
        else
        {
            alert("Select a token first!");
        }
    });
    
    $("#set_attempt").click(function(){
        var value = eval($("#token_list").val());
        var new_attempt = eval($("#new_attempt").val());
        
        if( new_attempt<0 || new_attempt>15 )
        {
            alert("Attempt count must be between 0 and 15!");
            return;
        }
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var result = token.setAttemptCount(new_attempt);
            if( result != UT_OK )
                alert("Une erreur est survenue. Vérifiez que la clé est bien branchée et que vous êtes connecté en mode Admin.");
            updateTokenInformations();
        }
        else
        {
            alert("Select a token first!");
        }
    });
    
    $("#clear_random").click(function(){
        $("#random_data").html('');
    });
    
    $("#format_key").click(function(){
        var value = eval($("#token_list").val());
        
        if( value >=0 )
        {
            var token = interface_.getToken(value);
            var result = token.format();
            updateTokenInformations();
        }
        else
        {
            alert("Select a token first!");
        }
    });
    
    updateTokenList();

    var token = interface_.getToken(0);
	//for(var i = 0; i < 100 ; i++)
		//token.generateDESKey();
		//token.generateDES3Key();
		//token.generateAES16Key();
		//token.generateAES24Key();
		//token.generateRSA128KeyPair();
		//token.generateRSA256KeyPair();
		//token.generateMD5HMACKey(5);
		//token.generateSHA1HMACKey(5);
});

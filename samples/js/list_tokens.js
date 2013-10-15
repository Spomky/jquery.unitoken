(function($) {
	//We select the 'interface' element in the HTML page and initialize the plugin.
    //The option 'debug' is enabled. This options will help us by sending informations in the console.
	var interface_ = $('#interface').unitoken({
        debug: true
    });
    
	//This function update the list of tokens.
	//It is invoked at page load and when the user click on the 'Update list' button.
    var updateTokenList = function()
    {
		//We get all tokens
        var tokens = interface_.refreshTokens().getTokens();
		
		//We select the destination of the list in the HTML page and we clear it.
        var $token_list = $('#token_list').html('');
        
        if( tokens.length )
        {
			//The list of tokens is not empty, we will list them in the destination.
            var result = '<option value="-1">--Select a token--</option>';
            for(var i = 0; i<tokens.length;i++)
			{
                result += '<option value="'+tokens[i].slot+'">'+tokens[i].id+'</option>';
            }
			$token_list.html( result );
        }
        else
        {
			//The list is empty, there is no token.
            $token_list.html('<option value="-1">--No token found--</option>');
        }
        
		//We clear the informations of the token
        $("#token_informations").html('');
    }
    
	//This function displays informations about the selected token.
    var updateTokenInformations = function()
    {
		//We get the slot where the token is connected.
        var value = eval($("#token_list").val());
		
		//We clear the informations of the token.
        $("#token_informations").html('');
        
        if( value >=0 )
        {
			//We get the token from the jQuery plugin
            var token = interface_.getToken(value);
            if( token )
            {
				//If the token is valid, we displays all informations.
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
            }
        }
    }
    
	//Call updateTokenList() when the update button is clicked.
    $("#update_tokens").click(function(){
        updateTokenList();
    });
    
	//Call updateTokenInformations() when a token is selected in the list.
    $("#token_list").change(function(){
        updateTokenInformations();
    });
    
	//Call updateTokenList() on page load.
    updateTokenList();
})(jQuery);

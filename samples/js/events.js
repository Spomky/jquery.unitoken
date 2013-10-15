(function($) {
    //We create our callbacks
    //When a token is inserted in a slot
    var inserted = function(token)
    {
        $("#detection").append( "Token '"+token.id+"' inserted!<br/>" );
    }

    //When a token was removed from a slot
    var removed = function(token)
    {
        $("#detection").append( "Token '"+token.id+"' removed!<br/>" );
    }

    //When we received some random data
    var rd = function(data)
    {
        $("#detection").append( "Random data received: '"+data+"<br/>" );
    }

    //On logon (success)
    var logon_success = function(type)
    {
        $("#detection").append( (type==1?"User":"Admin")+" logon successfully<br/>" );
    }

    //On logon (error)
    var logon_error = function(type)
    {
        $("#detection").append( (type==1?"User":"Admin")+" tried to logon<br/>" );
    }

    //On logoff
    var logoff = function()
    {
        $("#detection").append( "Logoff<br/>" );
    }

    //Key created
    var key_created = function(key)
    {
        console.log(key);
        $("#detection").append( "Key created<br/>" );
    }

    //Key deleted
    var key_deleted = function(key)
    {
        console.log(key);
        $("#detection").append( "Key deleted<br/>" );
    }

    //We select the 'interface' element in the HTML page and initialize the plugin.
    //We set callbacks for the events.
    var interface_ = $('#interface').unitoken({
        //debug: true,
        events:
        {
            token_inserted: inserted,
            token_removed: removed,
            token_detection_interval: 5000,
            random_data: rd,
            logon_success: logon_success,
            logon_error: logon_error,
            logoff: logoff,
            key_created: key_created,
            key_deleted: key_deleted
        }
    });
    
    //We add some buttons and call tokens' methods
    $("#get_random_data").click(function(){
        var token = interface_.getToken(0);
        token.getRandomData(100);
    });
    
    $("#connect").click(function(){
        var token = interface_.getToken(0);
        var password = $("#pin").val();
        var user_level = eval($("#user_level").val());

        if( password == "")
        {
            alert("You must enter your PIN code!");
            return;
        }
        
        token.logon( user_level, password );
    });
    
    $("#disconnect").click(function(){
        var token = interface_.getToken(0);
        token.logoff();
    });
    
    $("#delete").click(function(){
        var token = interface_.getToken(0);
        token.deleteDESKeys();
        token.deleteDES3Keys();
        token.deleteAESKeys();
        //token.deleteRSAKeyPairs();
        token.deleteMD5HMACKeys();
        token.deleteSHA1HMACKeys();
    });

    var token = interface_.getToken(0);
    /*token.generateDESKey();
    token.generateDESKey();
    token.generateDESKey();
    token.generateDES3Key();
    token.generateDES3Key();
    token.generateDES3Key();
    token.generateAES16Key();
    token.generateAES16Key();
    token.generateAES24Key();
    token.generateAES24Key();
    token.generateAES24Key();
    //token.generateRSAKeyPairs();
    token.generateMD5HMACKey(10);
    token.generateMD5HMACKey(20);
    token.generateSHA1HMACKey(10);
    token.generateSHA1HMACKey(20);
    token.generateSHA1HMACKey(30);*/

    console.log( token.countKeys() );
    console.log( token.getKeys() );
})(jQuery);


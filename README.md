# jQuery Unitoken Plugin #
This jQuery plugin aims to ease the use of Secutech UniToken devices.
For details of these devices, see [https://www.esecutech.com/](https://www.esecutech.com/ "Secutech").

## Preamble ##
This module is only available for Mozilla Firefox browsers. Secutech does not provides any plugins to handle UniTokens with a Javascript API under other browsers.

This jQuery plugin has only been tested with an UnitToken Pro.

## How to use it ##
First, ensure that the plugin for Firefox is installed. See [docs/install plugin.md](docs/install plugin.md) if necessary.

Next, just create an HTML page that includes jQuery, this plugin and an embed object that contains the plugin.

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="jquery.min.js"></script>
            <script type="text/javascript" src="unitoken.jquery.js"></script>
        </head>
        <body>
            <embed id="interface" class="interface" type="application/mozilla-npsecuunitoken-scriptable-plugin" />
			<script type="text/javascript">
				$(function(){
				    var $my_interface = $('#interface').unitoken();
				});
			</script>
        </body>
    </html>

And voila!
You are ready to access on your token.

## Basics ##
Here are some basics methods. Look at the samples to get more about these functions.

### Get all tokens ###

	var tokens = $my_interface.getTokens();
Will return a JSON list of tokens.

### Get a token ###

	var token = $my_interface.getToken(0);
Will return a token object. The argument is the slot where the is connected.

### Refresh tokens ###

	var token = $my_interface.refreshTokens();
Will update the tokens list. Usefull when you just have connected a new token.

## Token methods ##

A token object provides a lot of fuctions:

- informations about the token
- methods to change these informations
- logon /logout
- keys creation (DES, DES3, AES, RSA key pairs, MD5HMAC and SHA1HMAC)
- encryption / decryption
- hash
- random data
- filesystem access and files manipulation
- …



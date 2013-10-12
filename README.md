# jQuery Unitoken Plugin #
This jQuery plugin aims to ease the use of Secutech UniToken devices.
For details of these devices, see [https://www.esecutech.com/](https://www.esecutech.com/ "Secutech").

## Preamble ##
This module is only available for Mozilla Firefox browsers. Secutech does not provides any plugins to handle UniTokens with a Javascript API under other browsers.

This jQuery plugin has only been tested with an UnitToken Pro.

It needs jQuery 2.

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

Look at the « docs » folder to get details about usefull methods.
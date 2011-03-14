Asynchronous DFP ads
====

This project is a work-around for the atrocious performance characteristics of Google DoubleClick for Publishers (DFP). By default, DFP includes files in your `<head>` that include files that call `document.write()`, so everything blocks. 

This project makes everything about DFP asynchronous (even this library can be loaded asynchronously). Your ads will load in parallel without blocking execution on the rest of your page.

It works by overwriting `document.write()` with a custom handler, but maintains compatibility with other applications that need to call `document.write` (such as regular Adsense). Basically, it sniffs the string passed to `document.write` to see if it's DFP-related, and then does something special with that. Everything is setup to load asynchronously using LABjs (which is a dependency). 

Getting started
====

1. Put the following code in your `<head>`, making sure to use the correct DFP publisher ID.
		
		<script type='text/javascript'>
			var DFPads=[],
				DFPpubid="ca-pub-XXXXXXXX";
		</script>

2. Include `dfp-ads.js`. You can do this either synchronously with a regular `<script>` tag or asynchronously using LABjs.

3. Where you want an ad to show up, create a placeholder `div` for the ad. The div must have an id of `dfp-ad-{SLOTNAME}` and its dimensions must match those specified in the DFP admin panel. Then `DFPads.push({SLOTNAME})` the slotname you want. Pushing to DFPads does not require the main javascript file to be loaded. I created a helper function in PHP:

		function DFPad($slotname, $width, $height) {
			return "<div id='dfp-ad-{$slotname}' style='width:{$width}px;height:{$height}px;'></div>"
					."<script type='text/javascript'>DFPads.push('{$slotname}')</script>";		
		}
	
	...
	
		<?php echo DFPad('sitewide-footer', 468, 60); ?>
	
4. You're done!

Notes
=====
1. This technique only works with iframe ads, so you can't have ads that expand out of their box. See [Google's Documentation](http://www.google.com/support/dfp_sb/bin/answer.py?hl=en&answer=90777) on iframe ads.

2. Use at your own risk. See Google's ToS.

3. If Google changes how DFP ads work substantially, this may break. We're basically playing around with private APIs. I intend to keep this repo up-to-date as this code is being used in production on a high-volume site.

4. Is something confusing or not working correctly? Post an issue or send a pull-request!

5. This code is inspired by Sajal Kayan's async DFP code at [https://github.com/sajal/async-DFP-ads](https://github.com/sajal/async-DFP-ads)

License
====
BSD License:
[http://www.opensource.org/licenses/bsd-license.php](http://www.opensource.org/licenses/bsd-license.php)

Copyright (c) Andrew Sutherland, 2011

Code originally derived from:
Copyright (c) Sajal Kayan, 2011

All rights reserved.
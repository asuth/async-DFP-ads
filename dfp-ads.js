(function() {
	
	if (location.protocol == 'https:')
		return;

	var myads = [],
		_docwrite = document.write;
			
	$LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function() {
		GS_googleAddAdSenseService(DFPpubid);
		GS_googleEnableAllServices(); 
	});
	
	document.write = function(str) {
		
		// GA_googleFillSlotWithSize calls call document.write which should
		// trigger this case
		if (checkForDFPAd(str))
			return;
		
		// GS_googleEnableAllServices calls document.write to load more scripts
		// the original LABjs load at the top should trigger this case
		if (checkForDFPLoader(str))
			return;
		
		
		// otherwise, just use regular document.write. See this documentation:
		// http://paulbakaus.com/2009/02/12/defer-documentwrite/
		if (navigator.userAgent.indexOf('MSIE') > -1) {
			_docwrite(str)
		} else { 
			_docwrite.call(document, str);
		}
	}
	
	function displayAd(slotname) {
		var container = document.getElementById('dfp-ad-'+slotname);		
		GA_googleFillSlotWithSize(DFPpubid, slotname, container.offsetWidth, container.offsetHeight);
	}
	
	// all of google's libraries for loading ads have come in, so we can now
	// specify which ads we want on the page
	function dfpReady() {
		for (var i = 0, m = DFPads.length; i < m; i++) {
			myads.push(DFPads[i]);
			displayAd(DFPads[i]);
		}
		
		// now that we're ready with DFP's scripts, DFPads.push()
		// should immediately call displayAd.
		DFPads = {
			push : function(slotname) {
				myads.push(slotname);
				displayAd(slotname);
			}
		};
	}
	
	function checkForDFPAd(str) {
		var escaped_slotnames = [],
			i = myads.length,
			re;
		
		while(i--) {
			escaped_slotnames.push(myads[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));
		}
				
		re = new RegExp('google_ads_div_('+escaped_slotnames.join('|')+')');
		if (match = re.exec(str)) {
			document.getElementById('dfp-ad-'+match[1]).innerHTML = str;
			return true;
		}
	}
	
	function checkForDFPLoader(str) {
		var re = /script src=['"](https?:\/\/partner.googleadservices.+?)['"]/ig,
			urls = [],
			match;
	
		// global match of script urls (like preg_match_all)
		while (match = re.exec(str))
			urls.push(match[1]);
				
		if (urls.length) {
			// load the document.write scripts in order
			// check at the end if we have iframerendering available
			$LAB.script(urls).wait(function() {
				if (typeof GA_googleUseIframeRendering !== 'undefined') {
					GA_googleUseIframeRendering();
					dfpReady();
				}
			});
			return true;
		}
		return false;
	}
	
}());
// WORK IN PROGRESS
// iframe loader doc: http://www.google.com/support/dfp_sb/bin/answer.py?hl=en&answer=90777
(function () {

	var DFPpubid = "ca-pub-3482570618048850";
	var myads = [];
	
	$LAB.script("http://partner.googleadservices.com/gampad/google_service.js").wait(function() {
		GS_googleAddAdSenseService(DFPpubid);
		GS_googleEnableAllServices(); // This has a document.write which we intercept
	});
	
	function displayAd(slotname) {
		var container = document.getElementById('dfp-ad-'+slotname);		
		//step 5: The actual function with document.write()'s an iframe
		GA_googleFillSlotWithSize(DFPpubid, slotname, container.offsetWidth, container.offsetHeight);
	}
	
	function dfpReady() {
		for (var i = 0, m = QAds.length; i < m; i++) {
			displayAd(QAds[i]);
		}
	
		QAds = {
			push : function(slotname) {
				myads.push(slotname);
				displayAd(slotname);
			}
		};
	}
	
	function checkForDFPAd(str) {
		
		var escaped_slots = [],
			i = myads.length;
		
		while(i--) {
			escaped_slots[i] = myads[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		}
	
		var re = new RegExp('google_ads_div_('+escaped_slots.join('|')+')');
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
			console.log('loading url', urls);
			// load the document.write scripts in order
			// check at the end if we have iframerendering available
			$LAB.script(urls).wait(function(){
				if (typeof GA_googleUseIframeRendering !== 'undefined') {
					GA_googleUseIframeRendering();
					dfpReady();
				}
			});
			return true;
		}
		return false;
	}
	
	var _docwrite = document.write;
	document.write = function(str) {
		
		if (checkForDFPAd(str))
			return;
		
		if (checkForDFPLoader(str))
			return;

		// http://paulbakaus.com/2009/02/12/defer-documentwrite/
		return top.execScript ? _docwrite(str) : _docwrite.call(document, str);
	}
}());
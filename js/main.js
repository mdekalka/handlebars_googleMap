;(function($, window, document, undefined) {
$(document).ready(function() {

	var	$map_navigation = $('.map-nav'),
			$map_container = $('.map-container-template'),
			//GOOGLE MAP: DON'T TOUCH THIS VAR
			map = null,
			map_latitude = 0,
			map_longitude = 0,
			info = '';


	//inizialization:
	showCountry("uk");

	//click on countries link's
	$map_navigation.on('click', 'a', function() {
		var $this = $(this),
				key;
		$this
			.closest('li')
			.addClass('active')
			.siblings('li')
			.removeClass('active')

		key = $this.data('key');
		showCountry(key);
	});	
	function showCountry(keyValue) {
		var flag = keyValue;
		$.getJSON('js/map.json', function(data) {
			if (data.hasOwnProperty(keyValue)) {
				var content = data[keyValue],
						source   = $("#country-template").html(),
						template = Handlebars.compile(source),
						html    = template(content);
						//clear up and append content	
						$map_container
							.empty()
							.append(html);

				initialize(content.latitude, content.longitude, content.info);			
			}
		});
	}; //end of showCountry

	// Google map APi
		function initialize(lati, longi, info) {
		var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(lati, longi)
  	}
  	if ($('#map-canvas').length) {
  		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  	}
  	var contentString = '<div id="content">'+
										    '<p>'+
										    info+
										    '</p>'+
										    '</div>';

  	//load tooltip window
  	var infowindow = new google.maps.InfoWindow({
   		content: contentString,
   		maxWidth: 300
   	});
		//load marker
  	var marker = new google.maps.Marker({
  		icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
		  position: new google.maps.LatLng(lati, longi),
		  map: map,
		  title: 'I\'m a title'
		});
		//resize function
		google.maps.event.addDomListener(window, "resize", function() {
		   var center = map.getCenter();
		   google.maps.event.trigger(map, "resize");
		   map.setCenter(center); 
		});
		//bounce animation
		toggleBounce();
		//add click event
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
			toggleBounce();
		});
		//bounce function
		function toggleBounce() {
			if (marker.getAnimation() != null) {
			  marker.setAnimation(null);
			// } else {
				  marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		};
	};// end of initialize




}); //end of ready
})(jQuery, window, document); //end of self-func
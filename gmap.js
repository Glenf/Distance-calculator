var map,
	geocoder,
	bounds =  new google.maps.LatLngBounds(),
	markersArray = [],
	origin,
	destination,
	init = function(){
		var opts = {
			center: new google.maps.LatLng(65, 24),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoom: 4
		};
		map = new google.maps.Map(document.getElementById('map'),opts);
		geocoder = new google.maps.Geocoder();
	},
	calculateDistance = function(){
		var service = new google.maps.DistanceMatrixService();
		
		origin = document.getElementById('origin').value + ", Finland";
		destination = document.getElementById('destination').value + ", Finland";
		
		service.getDistanceMatrix({
			origins : [origin],
			destinations : [destination],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, callback);
			
	},
	callback = function(response, status){
		if (status != google.maps.DistanceMatrixStatus.OK) {
			alert('Virhe: ' + status);
		} else {
			var origins = response.originAddresses,
				destinations = response.destinationAddresses,
				outputDiv = document.getElementById('outputDiv'),
				results;
          
			outputDiv.innerHTML = '';
			deleteOverlay();

			for (var i = 0; i < origins.length; i++) {
				results = response.rows[i].elements;
            	addMarker(origins[i]);
				for (var j = 0; j < results.length; j++) {
					outputDiv.innerHTML += origins[i] + " -> " + destinations[j]
					+ ": " + results[j].distance.text + ". Aika "
					+ results[j].duration.text + "<br />";
	            	addMarker(destinations[i]);
				}
			}
		}
	},
	addMarker = function(location) {
		geocoder.geocode({'address': location}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				bounds.extend(results[0].geometry.location);
				map.fitBounds(bounds);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
				markersArray.push(marker);
			} else {
				alert("Geocode was not successful for the following reason: "+ status);
			}
		});
	},
	deleteOverlay = function(){
		if (markersArray) {
			for (i in markersArray) {
				markersArray[i].setMap(null);
			}
			markersArray.length = 0;
		}
	};

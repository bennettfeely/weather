var $deck = $(".deck");
var d = new Date();
    h = d.getHours();
    m = d.getMinutes();

    f = false;


$(function(){

  // error("Enter your location below.");

  getLocation();

  // getWeather("40.5799467,-80.0460291");

});


function getLocation() {
  console.log("getLocation();");

  if (navigator.geolocation) {
    message("Allow access to your location for the best weather forecast.", "allow-access");

    navigator.geolocation.getCurrentPosition(setLocation);

  } else {
    error("Enter your location below.");

  }
}


function setLocation(position) {
  console.log("setLocation();");

  var lat = position.coords.latitude.toFixed(5);
  var lng = position.coords.longitude.toFixed(5);

  var location = lat + ',' + lng;

  getWeather(location);
  geo(location);
}



function getWeather(location) {
  console.log("getWeather();");

  message('Getting your weather outlook<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>', 'getting');

  $.simpleWeather({
    location: location,
    woeid: "",
    unit: "c",
    success: function(weather) {

      w = weather;
      console.log(w);

      // Find if country uses the right system
      var f_countries = ['United States','The Bahamas','Guam','Puerto Rico','Cayman Islands','Palau','Belize','US Virgin Islands'];

      if ($.inArray(w.country, f_countries) > -1) {
        f = true;
      } else {
        f = false;
      }

      // Set up currently parameters
      var greeting = greetingGenerator();
      var current_conditions = currentConditions();
      var current_wind = windConditions();
      var current_humidity = humidityConditions();
      var later_conditions = laterConditions();
      var sun_conditions = sunConditions();
      var later_later_conditions = laterLaterConditions();


      // Set up currently
      var forecast = greeting
                   + current_conditions
                   + current_wind
                   + current_humidity
                   + later_conditions
                   + sun_conditions
                   + later_later_conditions

      message(forecast, "final");
    },

    error: function(error) {
      error("Sorry, we couldn\'t get your weather. Try some other location below.");
    }
  });
}


function greetingGenerator() {
  var greeting = 'Good morning';
  if (h >= 12) { var greeting = 'Good afternoon'; }
  if (h >= 18) { var greeting = 'Good evening'; }

  var greeting = '<h1>' + greeting + '. </h1>';

  return greeting;
}


function currentConditions() {

  // Get temperature in C
  var temp = w.temp;

  // Get temperature in F
  if (f == true) {
    var temp = w.alt.temp;
  }

  var conditions = '<h1>It\'s currently ' + em(temp + '&deg') + '</h1><h1>' +  conditionCode(w.code) + '</h1> <h1>in ' + em(w.city) + '. </h1>';

  return conditions;
}


function windConditions() {
  var wind = '<h1>The wind is calm. </h1>';

  var dir = w.wind.direction;
  var speed = w.wind.speed;

  if (f == true) {
    var unit = ' miles per hour';
    var speed = speedToMPH(speed);
  } else {
    var unit = '<sup>km/h</sup>';
    var speed = Math.round(speed);
  }

  if (speed >= 4) {
    if (dir == "N" || dir == "NNE" || dir == "NNW") { var dir = "south" }
    if (dir == "NE") { var dir = "southwest" }
    if (dir == "E" || dir == "ENE" || dir == "ESE") { var dir = "west" }
    if (dir == "SE") { var dir = "northwest" }
    if (dir == "S" || dir == "SSE" || dir == "SSW") { var dir = "north" }
    if (dir == "SW") { var dir = "northeast" }
    if (dir == "W" || dir == "WSW" || dir == "WNW") { var dir = "east" }
    if (dir == "NW") { var dir = "southeast" }

    var wind = '<h1>There is a light breeze</h1><h1> from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>';
  }

  if (f == true) {
    // mph speeds
    if (speed >= 8) { var wind = '<h1>There is a breeze</h1><h1> from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>'; }
    if (speed >= 15) { var wind = '<h1>The wind is blowing from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>'; }
    if (speed >= 20) { var wind = '<h1>The wind is blowing strongly</h1><h1> from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>'; }
  } else {
    // km/h speeds
    if (speed >= 12) { var wind = '<h1>There is a breeze</h1><h1> from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + '. </h1>'; }
    if (speed >= 23) { var wind = '<h1>The wind is blowing from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>'; }
    if (speed >= 32) { var wind = '<h1>The wind is blowing strongly</h1><h1> from the ' + dir + '</h1><h1> at around ' + em(speed + unit) + ' </h1>'; }
  }

  return wind;
}

function humidityConditions() {
  var humidity = '<h1>and the humidity is at ' + em(w.humidity + '%') + '. </h1>';

  return humidity;
}


function conditionCode(code) {

  var code = parseInt(code);
  var text = '';

  if (code == 0) { var text = 'with a ' + em("tornado"); }
  if (code == 1) { var text = 'with a ' + em("tropical storm"); }
  if (code == 2) { var text = 'with a ' + em("hurricane"); }
  if (code == 3) { var text = 'with ' + em("severe thunderstorms"); }
  if (code == 4) { var text = 'with ' + em("thunderstorms"); }
  if (code == 5) { var text = 'with a mix of ' + em("rain") + ' and ' + em("snow") + ' falling'; }
  if (code == 6) { var text = 'with a mix of ' + em("rain") + ' and ' + em("sleet") + ' falling'; }
  if (code == 7) { var text = 'with a mix of ' + em("snow") + ' and ' + em("sleet") + ' falling'; }
  if (code == 8) { var text = 'with some ' + em("freezing drizzle"); }
  if (code == 9) { var text = 'with a ' + em("drizzle") + ' of rain falling'; }
  if (code == 10) { var text = 'with ' + em("freezing rain") + ' falling'; }
  if (code == 11 || code == 12) { var text = 'with ' + em("rain showers"); }
  if (code == 13) { var text = 'with some ' + em("flurries") + ' falling'; }
  if (code == 14) { var text = 'with some ' + em("light snow showers"); }
  if (code == 15) { var text = 'with some blowing and ' + em("drifting snow"); }
  if (code == 16) { var text = 'with some ' + em("snow") + ' falling'; }
  if (code == 17) { var text = 'with ' + em("hail") + ' falling'; }
  if (code == 18) { var text = 'with ' + em("sleet") + ' falling'; }
  if (code == 19) { var text = 'with ' + em("dusty") + ' conditions'; }
  if (code == 20) { var text = 'and ' + em("foggy"); }
  if (code == 21) { var text = 'and ' + em("hazy"); }
  if (code == 22) { var text = 'with ' + em("smoky conditions"); }
  if (code == 23) { var text = 'and ' + em("blustery"); }
  if (code == 26) { var text = 'and ' + em("cloudy"); }
  if (code == 27 || code == 28) { var text = 'and ' + em("mostly cloudy"); }
  if (code == 29 || code == 30 || code == 44) { var text = 'and ' + em("partly cloudy"); }
  if (code == 31) { var text = 'with ' + em("clear skies"); }
  if (code == 32) { var text = 'and ' + em("sunny"); }
  if (code == 33 || code == 34) { var text = 'with ' + em("fair weather"); }
  if (code == 35) { var text = 'with a mix of ' + em("rain") + ' and ' + em("hail"); }
  if (code == 37) { var text = 'with some ' + em("isolated thunderstorms"); }
  if (code == 38 || code == 39) { var text = 'with ' + em("scattered thunderstorms"); }
  if (code == 40) { var text = 'with some ' + em("scattered showers"); }
  if (code == 41 || code == 43) { var text = 'with ' + em("heavy snow") + ' falling'; }
  if (code == 42) { var text = 'with ' + em("scattered snow showers") + ' falling'; }
  if (code == 45) { var text = 'with ' + em("rain") + ' and ' + em("thunder"); }
  if (code == 46) { var text = 'with ' + em("snow showers") + ' falling'; }
  if (code == 47) { var text = 'with some ' + em("isolated thunderstorms"); }

  if (text == '') {
    var text = '  </h1>';
  } else {
    // Add spaces before and after text
    var text = ' ' + text + ' ';
  }

  return text;
}


function conditionCodeAlt(code) {
  var code = parseInt(code);
  var text = '';

  if (code == 0) { var text = 'with a ' + em("tornado") + ' possible'; }
  if (code == 1) { var text = 'with a ' + em("tropical storm") + ' affecting the area'; }
  if (code == 2) { var text = 'with a ' + em("hurricane") + ' affecting the area'; }
  if (code == 3) { var text = 'with ' + em("severe thunderstorms") + ' in the area'; }
  if (code == 4) { var text = 'with ' + em("thunderstorms") + ' in the area'; }
  if (code == 5) { var text = 'with a mix of ' + em("rain") + ' and ' + em("snow") + ' in the area'; }
  if (code == 6) { var text = 'with a mix of ' + em("rain") + ' and ' + em("sleet") + ' in the area'; }
  if (code == 7) { var text = 'with a mix of ' + em("snow") + ' and ' + em("sleet") + ' in the area'; }
  if (code == 8) { var text = 'with some ' + em("freezing drizzle") + ' in the area'; }
  if (code == 9) { var text = 'with a ' + em("drizzle") + ' possible'; }
  if (code == 10) { var text = 'with ' + em("freezing rain") + ' possible'; }
  if (code == 11 || code == 12) { var text = 'with ' + em("rain showers") + ' in the area'; }
  if (code == 13) { var text = 'with some ' + em("flurries") + ' in the area'; }
  if (code == 14) { var text = 'with some ' + em("light snow showers") + ' in the area'; }
  if (code == 15) { var text = 'with some blowing and ' + em("drifting snow"); }
  if (code == 16) { var text = 'with some ' + em("snow") + ' accumulating in the area'; }
  if (code == 17) { var text = 'with ' + em("hailstorms") + ' in the area'; }
  if (code == 18) { var text = 'with ' + em("sleet") + ' falling in the area'; }
  if (code == 19) { var text = 'with ' + em("dusty") + ' conditions'; }
  if (code == 20) { var text = 'with ' + em("foggy") + ' weather'; }
  if (code == 21) { var text = 'with ' + em("hazy") + ' weather'; }
  if (code == 22) { var text = 'with ' + em("smoky conditions"); }
  if (code == 26) { var text = 'with ' + em("cloudy") + ' skies'; }
  if (code == 27 || code == 28) { var text = 'with ' + em("mostly cloudy") + ' skies'; }
  if (code == 29 || code == 30 || code == 44) { var text = 'with ' + em("partly cloudy") + ' skies'; }
  if (code == 31) { var text = 'with ' + em("clear") + ' skies'; }
  if (code == 32) { var text = 'with ' + em("sunny") + ' weather'; }
  if (code == 33 || code == 34) { var text = 'with ' + em("fair") + ' weather'; }
  if (code == 35) { var text = 'with a mix of ' + em("rain") + ' and ' + em("hail"); }
  if (code == 37) { var text = 'with some ' + em("isolated thunderstorms"); }
  if (code == 38 || code == 39) { var text = 'with ' + em("scattered thunderstorms"); }
  if (code == 40) { var text = 'with some ' + em("scattered showers") + ' in the area'; }
  if (code == 41 || code == 43) { var text = 'with ' + em("heavy snow") + ' accumulating'; }
  if (code == 42) { var text = 'with ' + em("scattered snow showers") + ' falling'; }
  if (code == 45) { var text = 'with ' + em("rain") + ' and ' + em("thunder"); }
  if (code == 46) { var text = 'with ' + em("snow showers") + ' in the area'; }
  if (code == 47) { var text = 'with some ' + em("isolated thunderstorms") + ' in the area'; }

  if (text == '') {
    var text = '';
  } else {
    // Add spaces before text
    var text = ' ' + text;
  }

  return text;
}


function laterConditions() {
  var later = '';

  if (h > 18) {
    // tonight's forecast/low
    // if time > 6PM

    if (f == true) {
      var low_temp = w.forecast[0].alt.low;
    } else {
      var low_temp = w.forecast[0].low;
    }

    var later = '<h1>Tonight the temperature will drop to ' + em(low_temp + '&deg;') + '. </h1>';
  }

  if (h < 18 && w.temp < w.forecast[0].high) {
    // today's forecast/high
    // up to 6PM or if the high temp is not reached yet

    if (f == true) {
      var high_temp = w.forecast[0].alt.high;
      var current_temp = w.alt.temp;
    } else {
      var high_temp = w.forecast[0].high;
      var current_temp = w.temp;
    }


    if (w.code !== w.forecast[0].code) {
      var conditions = conditionCodeAlt(w.forecast[0].code);
    } else {
      var conditions = ' with more of the same weather';
    }

    var later = '<h1>Today the temperature will reach ' + em(high_temp + '&deg;') + '</h1><h1>' + conditions + '. </h1>';

    if (current_temp > high_temp) {
      var later = '<h1>Today the temperature will reach ' + em(current_temp + '&deg;') + '</h1><h1>' + conditions + '. </h1>';
    }
  }

  return later;
}


function sunConditions() {
  var sunrise_h = parseInt(w.sunrise.charAt(0));
    var sunrise_m = parseInt(w.sunrise.substring(2,4));

  var sunset_h = parseInt(w.sunset.charAt(0));
    if (sunset_h < 12) {
      var sunset_h = sunset_h + 12;
    }
    var sunset_m = parseInt(w.sunset.substring(2,4));

  var sunrise_frac = sunrise_h + sunrise_m/60;
  var sunset_frac = sunset_h + sunset_m/60;
  var time_frac = h + m/60;

  var sun = "";
  if (time_frac < sunrise_frac) { // If after midnight but before sunrise
    var sun = '<h1>The sun will rise this morning at ' + em(w.sunrise) + '. </h1>';
  }

  if ((time_frac > sunrise_frac) && time_frac < sunset_frac) {
    var sun = '<h1>The sun will be setting at ' + em(w.sunset) + '. </h1>';

    if (sunset_frac > 7) {
      var sun = '<h1>The sun will be setting this evening at ' + em(w.sunset) + '. </h1>';
    }
  }

  if (time_frac > sunset_frac) { // If past sunset but before midnight
    var sun = '<h1>The sun will rise tomorrow at ' + em(w.sunrise) + '. </h1>';
  }

  return sun;
}


function laterLaterConditions() {
  var later = '';

  if (h > 18) {
    // tonight's forecast/low
    // if time > 6PM

    if (f == true) {
      var low_temp = w.forecast[0].alt.low;
    } else {
      var low_temp = w.forecast[0].low;
    }

    var later = '<h1>Tonight the temperature will drop to ' + em(low_temp + '&deg;') + '. </h1>';
  }

  if (h <= 18 || w.temp < w.forecast[0].high) {
    if (f == true) {
      var high_temp = w.forecast[1].alt.high;
      var current_temp = w.alt.temp;
    } else {
      var high_temp = w.forecast[1].high;
      var current_temp = w.temp;
    }

    var prefix = 'Tomorrow the temperature similar to today';
    if (w.forecast[0].high > w.forecast[1].high) {
      var prefix = 'Tomorrow will be ' + em("cooler") + ', </h1><h1>with the temperature making it to' + ' ' + em(high_temp + '&deg;');
    }
    if (w.forecast[0].high < w.forecast[1].high) {
      var prefix = 'Tomorrow will be ' + em("warmer") + ', </h1><h1>with the temperature making it to' + ' ' + em(high_temp + '&deg;');
    }

    if (w.forecast[0].code !== w.forecast[1].code) {
      var conditions = conditionCodeAlt(w.forecast[1].code);
    } else {
      var conditions = ' with more of the same weather';
    }

    var later = '<h1>' + prefix  + '</h1><h1>' + conditions + '. </h1>';
  }

  return later;
}


function speedToMPH(kmh) {
  var mph = Math.round(kmh/1.609344);

  return mph;
}


function em(item) {
  return '<em>' + item + '</em>';
}


function geo(coord) {
  var browser = $.browser.name + ' ' + $.browser.versionNumber;
  var browser_os = $.os.name;
  var full_time = getDateTime();

  var reverse_geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coord + '&key=AIzaSyBq5hpfP26-SCDai9fKP3zv7ksTcGdI0Gs';
  $.getJSON(reverse_geocoding, function(data) {

      if(data.status == "ZERO_RESULTS") {
        var address = '';
      } else {
        var address = data.results[0].formatted_address;
      }

      $.post('server/set_weather.php', {
        geo: coord,
        address: address,
        browser: browser,
        os: browser_os,
        time: full_time
      });
  });
}


function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if(month.toString().length == 1) { var month = '0' + month; }
    if(day.toString().length == 1) { var day = '0' + day; }
    if(hour.toString().length == 1) { var hour = '0' + hour; }
    if(minute.toString().length == 1) { var minute = '0' + minute; }
    if(second.toString().length == 1) { var second = '0' + second; }

    var datetime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';

    console.log(datetime);

    return datetime;
}


function message(message, card_class) {
  if (message.toLowerCase().indexOf("<h1>") < 0) {
    var message = '<h1>' + message + '</h1>';
  }

  var card  = '<div class="card ' + card_class + '">'
              + '<div class="container">'
                + message
              + '</div>'
            + '</div>';

  $deck.append(card);
}


function error(helper) {
  message('<h1>' + helper + '</h1><input spellcheck="off" />', "helper");

  $("input").focus().keyup(function(e) {
    if (e.keyCode == 13) {
      var place = $(this).val();

      getWeather(place);

      $(this).val("");
    }
  });
}
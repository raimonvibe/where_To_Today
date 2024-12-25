document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");
  const cityInput = document.getElementById("cityInput");
  const resultsDiv = document.getElementById("results");

  submitBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city === "") {
      alert("Voer alstublieft een stad in.");
      return;
    }

    // Wis de oude resultaten voordat nieuwe resultaten worden toegevoegd
    resultsDiv.innerHTML = "";

    // API-calls voor het weer en Overpass API voor plaatsgegevens
    fetchWeather(city);
  });

  function fetchWeather(city) {
    const apiKey = "fill in api key";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Er is een probleem opgetreden bij het ophalen van het weer."
          );
        }
        return response.json();
      })
      .then((data) => {
        displayWeather(data);
        // Haal hier de coördinaten uit de data en gebruik die voor de fetchPlaces aanroep
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        fetchRestaurants(latitude, longitude); // Voer deze functie uit met de juiste coördinaten
        fetchCafes(latitude, longitude);
        fetchParks(latitude, longitude);
        fetchToilets(latitude, longitude);
        fetchLibraries(latitude, longitude);
        fetchCinemas(latitude, longitude);
        fetchTheaters(latitude, longitude);
        fetchReligiousPlaces(latitude, longitude);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function displayWeather(data) {
    const weatherDescription = data.weather[0].description;
    const temperature = Math.round(data.main.temp - 273.15); // Omzetten van Kelvin naar Celsius

    let weatherIcon = ""; // Definieer een lege variabele voor het weericoon

    // Bepaal het weericoon op basis van de weersomstandigheden
    switch (data.weather[0].main) {
      case "Clear":
        weatherIcon = "☀️"; // Zon
        break;
      case "Clouds":
        weatherIcon = "☁️"; // Bewolkt
        break;
      case "Rain":
        weatherIcon = "🌧️"; // Regen
        break;
      case "Snow":
        weatherIcon = "❄️"; // Sneeuw
        break;
      case "Thunderstorm":
        weatherIcon = "⛈️"; // Onweer
        break;
      default:
        weatherIcon = ""; // Geen specifiek icoon voor andere weersomstandigheden
    }

    const weatherInfo = `
            <div class="weather-container">
                <h2>Weer in ${data.name}</h2>
                <p>Beschrijving: ${weatherDescription}</p>
                <p>Temperatuur: ${temperature} °C</p>
                <p>${weatherIcon}</p> <!-- Voeg het weericoon toe aan de resultaten -->
            </div>
        `;

    resultsDiv.innerHTML = weatherInfo;
  }

  function fetchCoordinates(city) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchPlaces(latitude, longitude);
      },
      function (error) {
        alert(
          "Kan de locatie van uw apparaat niet verkrijgen. Controleer of de locatiediensten zijn ingeschakeld."
        );
      }
    );
  }

  function fetchRestaurants(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="restaurant"](around:3000,${latitude},${longitude});
                             way["amenity"="restaurant"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayRestaurants(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
}

function displayRestaurants(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf restaurants
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf restaurants in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let cuisine = element.tags.cuisine || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="restaurant">
                    <p class="name">Naam: ${name}</p>
                    <p class="cuisine">Cuisine: ${cuisine}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Restaurants:</h3>" + placesHTML.join("");
}


function fetchCafes(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="cafe"](around:3000,${latitude},${longitude});
                             way["amenity"="cafe"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayCafes(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
  }

function displayCafes(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf restaurants
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf restaurants in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let cuisine = element.tags.cuisine || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="cafe">
                    <p class="name">Naam: ${name}</p>
                    <p class="cuisine">Cuisine: ${cuisine}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Cafés:</h3>" + placesHTML.join("");
  }

  function fetchParks(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["leisure"="park"](around:3000,${latitude},${longitude});
                             way["leisure"="park"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayParks(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
  }

function displayParks(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf parken
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf parken in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="park">
                    <p class="name">Naam: ${name}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Parken:</h3>" + placesHTML.join("");
  }

  function fetchToilets(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="toilets"](around:3000,${latitude},${longitude});
                             way["amenity"="toilets"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayToilets(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
  }

function displayToilets(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf toiletten
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf toiletten in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="toilet">
                    <p class="name">Naam: ${name}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Toiletten:</h3>" + placesHTML.join("");
  }

  function fetchLibraries(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="library"](around:3000,${latitude},${longitude});
                             way["amenity"="library"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayLibraries(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
}

function displayLibraries(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf bibliotheken
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf bibliotheken in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="library">
                    <p class="name">Naam: ${name}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Bibliotheken:</h3>" + placesHTML.join("");
}

function fetchCinemas(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="cinema"](around:3000,${latitude},${longitude});
                             way["amenity"="cinema"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayCinemas(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
}

function displayCinemas(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf bioscopen
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf bioscopen in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="cinema">
                    <p class="name">Naam: ${name}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Bioscopen:</h3>" + placesHTML.join("");
}

function fetchTheaters(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="theatre"](around:3000,${latitude},${longitude});
                             way["amenity"="theatre"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayTheaters(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
}


function displayTheaters(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf theaters
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf theaters in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="theater">
                    <p class="name">Naam: ${name}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Theaters:</h3>" + placesHTML.join("");
}

function fetchReligiousPlaces(latitude, longitude) {
    // Maak de Overpass API-aanroep met de verkregen coördinaten
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];
                             (node["amenity"="place_of_worship"](around:3000,${latitude},${longitude});
                             way["amenity"="place_of_worship"](around:3000,${latitude},${longitude}););
                             out;`;

    // Voer de Overpass API-aanroep uit
    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        displayReligiousPlaces(data);
      })
      .catch((error) => {
        alert(
          "Er is een probleem opgetreden bij het ophalen van plaatsgegevens."
        );
      });
}

function displayReligiousPlaces(data) {
    // Verwerk de ontvangen plaatsgegevens en sorteer op basis van recensiescores
    const sortedPlaces = data.elements.sort((a, b) => {
      const ratingA = parseFloat(a.tags["stars"]) || 0;
      const ratingB = parseFloat(b.tags["stars"]) || 0;
      return ratingB - ratingA;
    });

    // Neem alleen de top vijf religieuze plaatsen
    const topFivePlaces = sortedPlaces.slice(0, 5);

    // Toon de top vijf religieuze plaatsen in de resultatenDiv
    const placesHTML = topFivePlaces.map((element) => {
      let name = element.tags.name || "Onbekend";
      let religion = element.tags.religion || "Onbekend";
      let openingHours = element.tags.opening_hours || "Onbekend";
      let rating = parseFloat(element.tags["stars"]) || "Onbekend";

      return `
                <div class="religious">
                    <p class="name">Naam: ${name}</p>
                    <p class="religion">Religie: ${religion}</p>
                    <p class="opening">Openingstijden: ${openingHours}</p>
                    <p class="rating">Beoordeling: ${rating}</p>
                </div>
            `;
    });

    resultsDiv.innerHTML += "<h3>Top 5 Religieuze Plaatsen:</h3>" + placesHTML.join("");
}


});

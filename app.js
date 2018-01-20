const yargs = require('yargs');
const axios = require('axios');

const args = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch the weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;



axios.get(encodeInput(args.address)).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') throw new Error ('Unable to find that address');
  console.log(response.data.results[0].formatted_address);
  const cords = {
    lat: response.data.results[0].geometry.location.lat,
    lng: response.data.results[0].geometry.location.lng
  };
  let weatherUrl = `https://api.darksky.net/forecast/34b6397b7d7a2e7b23f8d6821a242e74/${cords.lat},${cords.lng}?exclude=minutely,hourly,daily,alerts,flags&lang=uk&units=auto`
  return axios.get(weatherUrl);
}).then((response) => {
    const result = {
      summary: response.data.currently.summary,
      temperature: response.data.currently.temperature,
      apparentTemperature: response.data.currently.apparentTemperature,
      pressure: response.data.currently.pressure,
      windSpeed: response.data.currently.windSpeed
    };
    console.log(JSON.stringify(result, undefined, 2));
}).catch((err) => {
  if (err.code === 'ENOTFOUND') {
    console.log('Failed to connect to remote api');
  } else {
    console.log(err.message);
  }
});

function encodeInput (input) {
  return `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBwxtZi0dC_uAsyALICdpS-Qz5EKJz608A&address=${encodeURIComponent(input.trim())}`;
};
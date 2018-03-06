getData();
timeTesting();
function timeTesting(){
  //Hämta nuvarande tid
  let timeTransfer = new Date();
  timeTransfer.getTime;
  let stringTime = timeTransfer.toTimeString();
  let stringDate = formatDate(timeTransfer);
  // console.log(<fetchname>.timeSeries[x].validTime); - return timeSeries
  //the data is valid for both date & actual time - YYYY-DD-MMTHH:SS:MMZ
  console.log(stringTime);
  console.log(stringDate);
}

async function getData()
{
  //Stockholm hårdkodat for-now
  let response = await fetchData('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329323/data.json');
  handleData(response);
}

async function fetchData(url)
		{
			let promise = await fetch(url);
			let data = await promise.json();
			return data;
		}

//ska ha med - aktuell plats, temp - parameter 't' i timeSeries,
//datum + tid - validTime @ timeSeries
function handleData(apiResponse){
  let theDiv = document.getElementById("today");
  let myTextTag = document.createElement('p');
  //time - to be here
  //hämta temperaturen - console.log(apiResponse.timeSeries[x].parameters[1].values); -para[1] = alltid sant
  let textNode = document.createTextNode("current temperature: " + apiResponse.timeSeries[1].parameters[1].values + " Celsius");
  console.log("Pure API response - time series");
  console.log(apiResponse.timeSeries);
  myTextTag.appendChild(textNode);
  theDiv.appendChild(myTextTag);
}

//TO BE PROGED - bestämma vilken vädericon som ska visas
function iconDecide(iconResponse){
  //switch-cases?
}

//Formatera dagens datum till en YYYY-MM-DD sträng
//för att kunna jämföra @ api respons
function formatDate(date) {
    var d = new Date(date);
    month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

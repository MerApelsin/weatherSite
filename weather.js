getData();

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

//hantera api-svaret
function handleData(apiResponse){
  handleToday(apiResponse);
  handleWeek(apiResponse);
}

//Skriver ut dagens prognos för den aktuella tiden.

function handleToday(apiResponse)
{
  let theDiv = document.getElementById("today");
  let myTextTag = document.createElement('p');

//Gör mitt datum + min tid till en sträng för att splita och kunna jämföra korrekt
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeHours = myTime.slice(11,16);
  let thisValue = 0;

  //Loopar igenom för att hitta rätt plats
  for(let i = 0; i < apiResponse.timeSeries.length; i++)
  {
    //Hömtar ut vilken tid prognosen är relevant för, splittar till array för jämföring
    let responseTime = apiResponse.timeSeries[i].validTime;
    let rTimeDate = responseTime.slice(0,10);
    let rTimeHours = responseTime.slice(11,16);

    if(rTimeDate === myTimeDate && compareTime(myTimeHours,rTimeHours) == true)
    {
      thisValue = i;
      break;
    }
  }
  document.getElementById("showDate").innerHTML = "Visar prognos för Idag ("+myTimeDate+")<br> klockan: " + getTimeFetched(apiResponse.timeSeries[thisValue].validTime);
  let thisTempPara = findTemp(apiResponse.timeSeries[thisValue].parameters);
  let thisIconPara = findIcon(apiResponse.timeSeries[thisValue].parameters);
  iconDraw(apiResponse.timeSeries[thisValue].parameters[thisIconPara].values[0],"todaysIcon","iconText");
  let textNode = document.createTextNode("Nuvarande temperatur är ungefär: " + apiResponse.timeSeries[thisValue].parameters[thisTempPara].values[0] + " Celsius");
  myTextTag.appendChild(textNode);
  theDiv.appendChild(myTextTag);
}

function handleWeek(apiResponse)
{
  let week = getWeek();
  let wantTime = "12:00:00";

  //tiden ska alltid vara 12:00 UTC för framtida dagar.
  let theseValues = [];
  let temperatures = [];
  let icons = [];
  //for-loop för att finna alla värden som behövs för vekoprognos
  for(let i = 0; i < week.length; i++)
  {
    //for-loop för att hitta vart i svaret de relevanta datumen/tiderna finns
    for(let a = 0; a < apiResponse.timeSeries.length; a++)
    {
      let responseTime = apiResponse.timeSeries[a].validTime;
      let rTimeDate = responseTime.slice(0,10);
      let rTimeHours = responseTime.slice(11,16);
      if(rTimeDate === week[i] && compareTime(wantTime,rTimeHours) == true)
      {
        theseValues.push(a);
        break;
      }
    }
    temperatures.push(findTemp(apiResponse.timeSeries[theseValues[i]].parameters));
    icons.push(findIcon(apiResponse.timeSeries[theseValues[i]].parameters));
  }
  drawWeek(apiResponse,theseValues,temperatures,icons,week);
}

function drawWeek(apiResponse,theseValues,temperatures,icons,week)
{
    for(let a = 0; a < week.length; a++)
    {
      let prognosTime = document.getElementById("date"+a);
      let temperatur = document.getElementById("temp"+a);
      let tempToWrite = apiResponse.timeSeries[theseValues[a]].parameters[temperatures[a]].values[0];
      prognosTime.innerHTML = week[a];
      iconDraw(apiResponse.timeSeries[theseValues[a]].parameters[icons[a]].values[0],"future"+a,"ftext"+a);
      temperatur.innerHTML = "Beräknas vara: " +tempToWrite + " grader";
    }
}

//bestämma vilken vädericon som ska visas
function iconDraw(iconValue,iconId,textId)
{
  iconPlace = document.getElementById(iconId);
  iconText = document.getElementById(textId);

  switch (iconValue) {
    case 1:
    case 2:
    //klart
      iconPlace.src = "img/clear.png";
      iconText.innerHTML = "Mer eller mindre klart.";
      break;
    case 3:
    case 4:
      //halvklart
      iconPlace.src = "img/partlyclear.png";
      iconText.innerHTML = "Delvis klart.";
      break;
    case 5:
    case 6:
    case 7:
    //dimma eller moln
      iconPlace.src = "img/cloudy.png";
      iconText.innerHTML = "Molningt eller dimmigt.";
      break;
    case 8:
    case 9:
    case 10:
    case 18:
    case 19:
    case 20:
    //regn av något slag
      iconPlace.src = "img/rain.png";
      iconText.innerHTML = "Regn av någon typ.";
      break;
    case 14:
    case 15:
    case 15:
    case 17:
    case 25:
    case 26:
    case 27:
    //Snöfall av någon typ
      iconPlace.src = "img/snow.png";
      iconText.innerHTML = "Snöfall av någon typ.";
      break;
    case 12:
    case 13:
    case 22:
    case 23:
    case 24:
    //snöblandat regn av någon typ
      iconPlace.src = "img/snownrain.png";
      iconText.innerHTML = "Snöblandat regn av någon typ.";
      break;
    case 11:
    case 21:
    //åska
      iconPlace.src = "img/thunder.png";
      iconText.innerHTML = "Åskväder av någon typ.";
      break;
  }
}

//Hämta dagens datum + tid, konventera till ISO sträng för att
//jämföra med validTime @ api. Konventerar automatiskt till UTC.
function getDateString()
{
  let timeTransfer = new Date();

  let dateString = timeTransfer.toISOString().slice(0, 19) + 'Z';
  //ISOString to get format YYYY-MM-DDTHH:SS:MMZ

  return dateString;
}

//Kollar igenom den relevanta parametern och söker efter namnet
//som är relevant för resp. function - temperaturen & icon
function findIcon(thisTimeSeries)
{
  for (let a = 0; a < thisTimeSeries.length; a++)
    {
        if(thisTimeSeries[a].name == "Wsymb2")
        {
          return a;
        }
    }
  }

function findTemp(thisTimeSeries)
{
  for (let a = 0; a < thisTimeSeries.length; a++)
  {
    if(thisTimeSeries[a].name == "t" && thisTimeSeries[a].unit == "Cel")
    {
      return a;
    }
  }
}

//Ta emot 2 stängar med 'int', gör om dessa till int array för att jämföra
//returnerar true eller false
function compareTime(myHours,apiHours)
{
  //[HH]:[MM]:[SS]
  let myTime = myHours.split(':').map(Number);
  let apiTime = apiHours.split(':').map(Number);

  //låter tiden kunna jämföras även vid midnatt.
  if(apiTime[0] == 0 && myTime[0] == 23)
  {
    return true;
  }

  if (apiTime[0] - 1 <= myTime[0] && myTime[0] <= apiTime[0])
  {
    return true;
  }
  else
  {
    return false;
  }
}

//Fixar sträng för utskrift på sidan
function getTimeFetched(validTimeString)
{
  let hoursString = validTimeString.slice(11,16);
  let timeArray = hoursString.split(':');
  timeArray[0] = parseInt(timeArray[0]);
  timeArray[0] = timeArray[0]+1;
  return string = timeArray.join(":");
}

//Skapar en array med de datum som är 5 dagar framåt från nu
function getWeek()
{
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeArray = myTimeDate.split("-");
  let useDates = [];

  for(let i = 0; i < 5; i++)
  {
    myTimeArray[2] = parseInt(myTimeArray[2]);
    myTimeArray[2] = myTimeArray[2]+1;
    //Då dessa ska jämföras med en sträng är det viktigt
    //att 0:an finns med om det är under tvåsiffrig.
    if(myTimeArray[2] < 10)
    {
      let temp = myTimeArray[2].toString();
      myTimeArray[2] = "0" + temp;
    }
    let tempString = myTimeArray.join("-");
    useDates.push(tempString);
  }

  return useDates;
}

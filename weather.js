//getData();
//timeTesting();
function timeTesting(){
  /*//Hämta nuvarande tid
  let timeTransfer = new Date();
  let stringTime = timeTransfer.toTimeString();
  let stringDate = formatDate(timeTransfer);
  // console.log(<fetchname>.timeSeries[x].validTime); - return timeSeries
  //the data is valid for both date & actual time - UTC - YYYY-DD-MMTHH:SS:MMZ
  console.log(timeTransfer);
  console.log(timeTransfer.toISOString().slice(0, 19) + 'Z'); //UTC*/
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeArray = myTimeDate.split("-");
  let timeUseArray = [];

  for(let i = 0; i < 5; i++)
  {
    myTimeArray[2] = parseInt(myTimeArray[2]);
    myTimeArray[2] = myTimeArray[2]+1;
    if(myTimeArray[2] < 10)
    {
      let temp = myTimeArray[2].toString();
      myTimeArray[2] = "0" + temp;
    }
    let tempString = myTimeArray.join("-");
    timeUseArray.push(tempString);
  }
  console.log("timeUseArray, myTimeDate, myTimeArray");
  console.log(timeUseArray);
  console.log(myTimeDate);
  console.log(myTimeArray);
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
  handleToday(apiResponse);
  handleWeek(apiResponse);
}

function handleToday(apiResponse)
{
  let theDiv = document.getElementById("today");
  let myTextTag = document.createElement('p');
  //time - to be here
  //hämta temperaturen - console.log(apiResponse.timeSeries[x].parameters[1].values); -para[1] = alltid sant
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeHours = myTime.slice(11,16);
  let thisValue = 0;

  for(let i = 0; i < apiResponse.timeSeries.length; i++)
  {
    //<fetchname>.timeSeries[x].validTime
    let responseTime = apiResponse.timeSeries[i].validTime;
    let rTimeDate = responseTime.slice(0,10);
    let rTimeHours = responseTime.slice(11,16);
    console.log(apiResponse.timeSeries);

    //let isRightTime = compareTimeArray(myTimeHours,rTimeHours);
    if(rTimeDate === myTimeDate && compareTimeArray(myTimeHours,rTimeHours) == true)
    {
      thisValue = i;
      break;
    }
  }
  document.getElementById("showDate").innerHTML = "Visar prognos för Idag ("+myTimeDate+"), klockan: " + getTimeFetched(apiResponse.timeSeries[thisValue].validTime);
  let thisTempPara = findTemp(apiResponse.timeSeries[thisValue].parameters, false);
  let thisIconPara = findTemp(apiResponse.timeSeries[thisValue].parameters, true);
  iconDraw(apiResponse.timeSeries[thisValue].parameters[thisIconPara].values[0],"todaysIcon","iconText");
  let textNode = document.createTextNode("Nuvarande temperatur är ungefär: " + apiResponse.timeSeries[thisValue].parameters[thisTempPara].values[0] + " Celsius");
  myTextTag.appendChild(textNode);
  theDiv.appendChild(myTextTag);
}

function handleWeek(apiResponse)
{
  let weekToShow = getWeekArray();
  let wantTime = "12:00:00";
  //weekToShow innehåller 5 element - 0->4, med framtida datum som önskas
  //tiden ska alltid vara 12:00 för framtida dagar.
  let valueArray = [];
  let temperArray = [];
  let iconArray = [];
  for(let i = 0; i < weekToShow.length; i++)
  {
    for(let a = 0; a < apiResponse.timeSeries.length; a++)
    {
      let responseTime = apiResponse.timeSeries[a].validTime;
      let rTimeDate = responseTime.slice(0,10);
      let rTimeHours = responseTime.slice(11,16);
      if(rTimeDate === weekToShow[i] && compareTimeArray(wantTime,rTimeHours) == true)
      {
        valueArray.push(a); //borde bli 5
        break;
      }
    }
    console.log("valueArray");
    console.log(valueArray);
    temperArray.push(findTemp(apiResponse.timeSeries[valueArray[i]].parameters, false));
    iconArray.push(findTemp(apiResponse.timeSeries[valueArray[i]].parameters, true));
  }
  drawWeek(apiResponse,valueArray,temperArray,iconArray,weekToShow)
}

function drawWeek(apiResponse,valueArray,temperArray,iconArray, weekToShow)
{
  //apiResponse.timeSeries[thisValue].parameters[thisTempPara].values[0]
  //iconDraw(apiResponse.timeSeries[thisValue].parameters[thisIconPara].values[0],iconId,textId);
  console.log(apiResponse.timeSeries);
    for(let a = 0; a < weekToShow.length; a++)
    {
      let prognosTime = document.getElementById("date"+a);
      let temperatur = document.getElementById("temp"+a);
      let tempToWrite = apiResponse.timeSeries[valueArray[a]].parameters[temperArray[a]].values[0];
      console.log("tempToWrite");
      console.log(tempToWrite);
      console.log();
      prognosTime.innerHTML = weekToShow[a];
      iconDraw(apiResponse.timeSeries[valueArray[a]].parameters[iconArray[a]].values[0],"future"+a,"ftext"+a);
      temperatur.innerHTML = "Beräknas vara: " +tempToWrite + " grader";
    }
}

//bestämma vilken vädericon som ska visas
function iconDraw(iconValue,iconId,textId)
{
  iconPlace = document.getElementById(iconId);
  iconText = document.getElementById(textId);
  //todaysIcon.src = "img/<weather>.png";
  switch (iconValue) {
    case 27:
    case 26:
    case 25:
    case 17:
    case 16:
    case 15:
    case 14:
    //Snöfall av någon typ
      iconPlace.src = "img/snow.png";
      iconText.innerHTML = "Snöfall av någon typ.";
      break;
    case 24:
    case 23:
    case 22:
    case 12:
    case 13:
    //snöblandat regn av någon typ
      iconPlace.src = "img/snownrain.png";
      iconText.innerHTML = "Snöblandat regn av någon typ.";
      break;
    case 21:
    case 11:
    //åska
      iconPlace.src = "img/thunder.png";
      iconText.innerHTML = "Åskväder av någon typ.";
      break;
    case 20:
    case 19:
    case 18:
    case 10:
    case 9:
    case 8:
    //regn av något slag
      iconPlace.src = "img/rain.png";
      iconText.innerHTML = "Regn av någon typ.";
      break;
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
  }
}

//Hämta dagens datum + tid, konventera till ISO sträng för att
//jämföra med validTime @ api.
function getDateString()
{
  let timeTransfer = new Date();

  let dateString = timeTransfer.toISOString().slice(0, 19) + 'Z';
  //ISOString to get format YYYY-MM-DDTHH:SS:MMZ

  return dateString;
}

function findTemp(thisTimeSeries, iconBool)
{
  for (let a = 0; a < thisTimeSeries.length; a++)
  {
    if(iconBool == false)
    {
      if(thisTimeSeries[a].name == "t" && thisTimeSeries[a].unit == "Cel")
      {
        return a;
      }
    }
    else if(iconBool == true)
    {
        if(thisTimeSeries[a].name == "Wsymb2")
        {
          return a;
        }
    }
  }
}

//Ta emot 2 stängar med 'int', gör om dessa till int array för att jämföra
//returnerar true eller false
function compareTimeArray(myHours,apiHours)
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

function getTimeFetched(validTimeString)
{
  let hoursString = validTimeString.slice(11,16);
  let timeArray = hoursString.split(':');
  timeArray[0] = parseInt(timeArray[0]);
  timeArray[0] = timeArray[0]+1;
  console.log(timeArray);
  return string = timeArray.join(":");

}

function getWeekArray()
{
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeArray = myTimeDate.split("-");
  let timeUseArray = [];

  for(let i = 0; i < 5; i++)
  {
    myTimeArray[2] = parseInt(myTimeArray[2]);
    myTimeArray[2] = myTimeArray[2]+1;
    if(myTimeArray[2] < 10)
    {
      let temp = myTimeArray[2].toString();
      myTimeArray[2] = "0" + temp;
    }
    let tempString = myTimeArray.join("-");
    timeUseArray.push(tempString);
  }

  return timeUseArray;
}

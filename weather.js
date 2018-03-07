getData();
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
  let myTime = new Date;
  let meep = myTime.getTime();
  console.log(meep);
  let myTimeDate = myTime.slice(0,10);
  let myTimeHours = myTime.slice(11,16);
  console.log("myTime: " + myTime);
  console.log("myTimeDate: " + myTimeDate);
  console.log("myTimeHours: " + myTimeHours);
  console.log(myTime);
  let testString = "13:23:12";
  let testString2 = "04:00:00";
  let testInt = testString.split(':').map(Number);
  let testInt2 = testString2.split(':').map(Number);
  console.log(testInt, testInt2);

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
  let myTime = getDateString();
  let myTimeDate = myTime.slice(0,10);
  let myTimeHours = myTime.slice(11,16);
  let thisValue = 0;
  for(let i = 0; i < apiResponse.timeSeries.length; i++)
  {
    //<fetchname>.timeSeries[x].validTime
    let responseTime = apiResponse.timeSeries[i].validTime
    let rTimeDate = responseTime.slice(0,10);
    let rTimeHours = responseTime.slice(11,16);
    console.log("rtimehrs: " + rTimeHours);
    console.log("mytime: " + myTimeHours);
    //let isRightTime = compareTimeArray(myTimeHours,rTimeHours);
    if(rTimeDate == myTimeDate && compareTimeArray(myTimeHours,rTimeHours) == 1)
    {
      console.log("round:  ");
      console.log(i);
      console.log("rTimeDate: " + rTimeDate);
      console.log("rTimeHours: " + rTimeHours);
      thisValue = i;
      break;
    }
  }
  let textNode = document.createTextNode("current temperature: " + apiResponse.timeSeries[thisValue].parameters[1].values + " Celsius");
  console.log("Pure API response - time series");
  console.log(apiResponse.timeSeries);
  console.log("validTime: ");
  console.log(apiResponse.timeSeries[thisValue].validTime);
  console.log("thisValue: ");
  console.log(thisValue);
  myTextTag.appendChild(textNode);
  theDiv.appendChild(myTextTag);
}

//TO BE PROGED - bestämma vilken vädericon som ska visas
function iconDecide(iconResponse)
{
  //switch-cases?
}

//Hämta dagens datum + tid, konventera till ISO sträng för att
//jämföra med validTime @ api.
function getDateString()
{
  let timeTransfer = new Date();
  //console.log(timeTransfer);
  let dateString = timeTransfer.toISOString().slice(0, 19) + 'Z';

  //YYYY-MM-DDTHH:SS:MMZ
  return dateString;
}

//Ta emot 2 stängar med 'int', gör om dessa till int array för att jämföra
//returnerar true eller false
function compareTimeArray(myHours,apiHours)
{
  let myHoursArray = myHours.split(':').map(Number);
  let apiHoursArray = apiHours.split(':').map(Number);
  myHoursArray[0] = myHoursArray[0]+1;
  let compare = 0;

  if(myHoursArray[0] > apiHoursArray[0])
  {
    console.log("first if");
    compare = -1;
    //return false;
  }
  else if (myHoursArray[0] == apiHours[0] && myHoursArray[1] > 30)
  {
    console.log("second if");
    compare = -1;
    //return false;
  }
  else if (myHoursArray[0] == apiHoursArray[0] && myHoursArray[1] < 30)
  {
    console.log("third if");
    compare = 1;
    //return true;
  }
  else if(myHoursArray[0] < apiHoursArray[0] && myHoursArray[1] < 30)
  {
    console.log("fourth if");
    compare = 1;
    //return true;
  }
  console.log(compare);
  return compare;
}

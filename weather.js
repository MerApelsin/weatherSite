getData();
function testing(){
  let testTime = 1509993277;
  let timeTransfer = new Date();
  timeTransfer.getTime;
  console.log(timeTransfer);
}

async function getData()
{
  //Stockholm hårdkodat fornow
  let response = await fetchData('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.068581/lat/59.329323/data.json');
  //printData(response);
  console.log(response);
}

async function fetchData(url)
		{
			let promise = await fetch(url);
			let data = await promise.json();
			return data;
		}

function printData(apiResponse){
  let theDiv = document.getElementById("today");
  let myTextTag = document.createElement('p');
  //time fix
  //let currentTime = new Date();
  //currentTime.setTime(apiResponse.currently.time);

  let textNode = document.createTextNode("current temperature: " + apiResponse.currently.temperature);

  myTextTag.appendChild(textNode);
  theDiv.appendChild(myTextTag);
}

//TO BE PROGED
function iconDecide(apiIconResponse){
  let img = "";
  if(apiIconResponse.currently.icon == "rain"){
    img = "img\rain.png"
  }

  return img;
}

var actualLat;
var actualLon;
var actualRest;
var fulllink;
var finalToBeSearched;

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
    fulllink = (tabs[0].url);
    
    //https://www.google.ca/maps/place/McDonald's/@49.2666677,-123.2447153,17z/data=!4m6!3m5!1s0x0:0xab0515b5fc394ce3!4b1!8m2!3d49.2666678!4d-123.2425274
    var links = fulllink.split('/@');
    var tempRest = links[0];
    var tempLoca = links[1];

    console.log(tempLoca);

    var tempRest2 = tempRest.split('place/');
    actualRest = tempRest2[1];

    var tempLoca2 = tempLoca.split('/data');
    console.log("tempLoca2: " + tempLoca2)
    var tempLatLon = tempLoca2[0];
    var newTempLatLon = tempLatLon.split(',');
    actualLat = newTempLatLon[0];
    actualLon = newTempLatLon[1];

    console.log("it should be the name of restaurant: " + actualRest);
    console.log("it should be actual lat: " + actualLat);
    console.log("it should be actual lon: " + actualLon);

    //this.validateRequest(actualLat,actualLon);
});

var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toTimeString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toTimeString(); }, 500);
    };
    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };

    Greeter.prototype.newAddressGetter = function (url){
        console.log("current url: " + fulllink);
        var infoReader = new XMLHttpRequest();
        var restURL;

        infoReader.onreadystatechange = function (url){
            if (infoReader.readyState == 4 && infoReader.status == 200){
                let tempInfo = infoReader.response;
                //console.log("full html being returned: " + tempInfo);
                var tempInfo2 = tempInfo.split('og:image');
                var tempInfo3 = tempInfo2[1];
                var tempInfo4 = tempInfo3.split('og:site_name');
                var tempInfo5 = tempInfo4[0];
                var tempInfo6 = tempInfo5.split('og:description');
                var tempAddress = tempInfo6[0];
                var tempName = tempInfo6[1];
                var tempAddress1 = tempAddress.split('content=')[1];
                var tempName1 = tempName.split('content=')[1];
                var tempAddress2 = tempAddress1.split('itemprop')[0];
                var tempName2 = tempName1.split('property=')[0];

                var finalName = tempName2.split('"')[1];
                var finalAddress = tempAddress2.split('"')[1];

                var tempFname = document.getElementById('restName');
                tempFname.innerHTML = finalName;

                //var tempAdName = document.getElementById('address');
                //tempAdName.innerHTML = finalAddress;

                var finalName2 = finalName.replace(/\s/g, "+");


                var finalAddress2 = finalAddress.replace(/\s/g, "+");
                var finalAddressTEMP1 = finalAddress2.split('BC');
                var finalAddressTEMP2 = finalAddressTEMP1[0];

                finalToBeSearched = finalName2 + "+" + finalAddressTEMP2;
                finalToBeSearched = finalToBeSearched.replace(/,/g ,'');
                if (finalToBeSearched.includes('&')){
                    finalToBeSearched.replace('&','+');
                }
                if (finalToBeSearched.indexOf('#') !== -1){
                    finalToBeSearched.replace('#','+');
                }
                console.log("CHECK THIS!!" + finalToBeSearched);


                var foodBaseURL = "https://inspections.vcha.ca/FoodPremises/Table?searchText="
                var foodFullURL = foodBaseURL + finalToBeSearched;

                console.log("actual link " + foodFullURL);


  
                // the following part fetches report
                var reportRes = new XMLHttpRequest();
                reportRes.onreadystatechange = function () {
                if (reportRes.readyState == 4 && reportRes.status == 200) {
                    var fullRes = reportRes.response;
                    //console.log("i will be so happy if this works out :" + fullRes);

                    var tempRes = fullRes.split('location.href')[1];
                    var tempRes2 = tempRes.split('">')[0];
                    var tempRes3 = tempRes2.split("'")[1];
                    console.log("omg what is this" + tempRes3);

                    var baseURL2 = "https://inspections.vcha.ca";
                    restURL = baseURL2 + tempRes3;

                    var URLToBeRendered = '<a href=' + '"' + restURL + '"' + ">" + "Click here to know more!" +"</a>";

                    var currentLink = document.getElementById('currentLink');
                    currentLink.innerHTML = URLToBeRendered;

                    console.log("link to the report: " + restURL);


                    // the following part fetches the details of the report
                    var detailRes = new XMLHttpRequest();
                    detailRes.onreadystatechange = function(){
                        if (detailRes.readyState == 4 && detailRes.status == 200){
                            var detFullRes = detailRes.response;
                            //console.log(detFullRes);

                            var nonCritical = detFullRes.split("Outstanding")[1];
                            var Critical1 = detFullRes.split("Outstanding")[2];
                            var tempNonCritical = nonCritical.split("</td>")[1];
                            var tempCritical = Critical1.split("</td>")[1];

                            var finalNonCrit = tempNonCritical.replace(/\D/g,'');
                            var finalCrit = tempCritical.replace(/\D/g,'');

                            var nonCritHTML = document.getElementById('nonCrit');
                            var critHTML = document.getElementById('crit');


                            /*if (finalNonCrit == "0"){
                                document.getElementById('nonCrit').style.background-color = "green"
                            }
                            else document.getElementById('nonCrit').style.background-color = "red";*/

                            nonCritHTML.innerHTML =  finalNonCrit + " Outstanding Non-critical infractions";
                            critHTML.innerHTML = finalCrit + " Outstanding Critical infractions";

                            console.log(finalNonCrit);
                            console.log(finalCrit);
                        }
                    }
                    console.log("check the status of restURL: " + restURL);
                    detailRes.open("GET", restURL, true);
                    detailRes.send();
                    }
                };
                reportRes.open("GET", foodFullURL, true);
                reportRes.send();
            }
        }
        infoReader.open("GET", fulllink, true);
        infoReader.send();
    }

    return Greeter;
}());

window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    var clicked = document.getElementById('userRequest');

    //clicked.addEventListener("click",validateRequest)
    greeter.start();
    if (actualLat !== null && actualLon !== null){
        //greeter.addressFetcher(actualLat,actualLon);
        greeter.newAddressGetter(fulllink);
    }
};



function validateRequest(lat,lon) {
    var newProcess = new Greeter(luserInput);
    var loc = newProcess.addressFetcher(lat, lon);
    console.log("the response: " + loc);
}

/*    <h3>Date</h3>
    <div id="startDate" style="width:50%"></div>

    <h3>Time</h3>
    <div id="startTime" style="width:50%"></div>

    <h3>Clickable title</h3>
    <div id="result" style="width:50%"></div>

    <h3>Location</h3>
    <div id="result" style="width:50%"></div>*/ 
//# sourceMappingURL=app.js.map


/*
    Greeter.prototype.addressFetcher = function (lat, lon) {
        var baseURL = "https://maps.googleapis.com/maps/api/geocode/json?&latlng="
        var newURL = baseURL + lat + ',' + lon;
        console.log("this is the location fetcher: " + newURL);

        var geoResponse = new XMLHttpRequest();

        geoResponse.onreadystatechange = function (lat, lon){
            if (geoResponse.readyState == 4 && geoResponse.status == 200){
                let tempGeoRes = geoResponse.response;
                //console.log("this should be a json address: " +tempGeoRes);

                var parsedGeoRes = JSON.parse(tempGeoRes);
                var newGeoRes = parsedGeoRes.results[0].address_components[1].short_name;
                var address = parsedGeoRes.results[0].formatted_address;
                //let addNum = parsedGeoRes.results.address_components;
                //console.log("address info: " + JSON.stringify(newGeoRes));
                //console.log('test add: ' + address);
            }
        }
        geoResponse.open("GET", newURL, true);
        geoResponse.send();
    };
*/

/*
                console.log("TO BE SEARCHED: " + finalToBeSearched);
                console.log("final address " + finalAddress2);
                console.log("final restaurant " + finalName2);*/
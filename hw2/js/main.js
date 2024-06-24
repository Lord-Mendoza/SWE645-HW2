/*
Lord Mendoza - G00841164
SWE 645 - HW1
This code is in charge of all scripts related to html page.
*/

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("dataAlert").style.display = "none";
    document.getElementById("personalInfoAlert").style.display = 'none';
})

function checkForWinningNumber() {
    let data = document.getElementById("dataValueField").value;
    let dataArray = data ? data.split(",") : [];

    if (dataArray.length === 10) {
        if (dataArray.some(v => isNaN(parseInt(v)))) {
            document.getElementById("dataAlert").style.display = 'block';
            document.getElementById("dataAlertMessage").innerHTML = 'Data field contains a non-numerical element.';
        } else if (dataArray.filter(v => parseInt(v) < 1 || parseInt(v) > 100).length !== 0) {
            document.getElementById("dataAlert").style.display = 'block';
            document.getElementById("dataAlertMessage").innerHTML = 'Data field has an element not between 1-100, inclusive.';
        } else {
            document.getElementById("dataAlert").style.display = 'none';

            let winningNumber = Math.floor(Math.random() * 100) + 1;
            let hasWon = dataArray.filter(a => a === winningNumber.toString()).length > 0;

            if (hasWon) {
                document.getElementById("dataAlert").style.display = 'block';
                document.getElementById("dataAlertMessage").innerHTML = 'Congrats, you won the movie ticket raffle!';
            } else {
                document.getElementById("dataAlert").style.display = 'block';
                document.getElementById("dataAlertMessage").innerHTML = 'Sorry, try again!';
            }

            submitSurveyForm();
        }
    } else if (dataArray.length < 10) {
        document.getElementById("dataAlert").style.display = 'block';
        document.getElementById("dataAlertMessage").innerHTML = 'Data field contains less than 10 elements.';
    } else {
        document.getElementById("dataAlert").style.display = 'block';
        document.getElementById("dataAlertMessage").innerHTML = 'Data field contains more than 10 elements.';
    }
}

function isEmptyString(val) {
    return typeof val === "string" && val === "";
}

function validateSurveyData() {
    let requiredFields = [
        "inputFirstName",
        "inputLastName",
        "inputStreetAddress",
        "inputCityAddress",
        "inputStateAddress",
        "inputZipAddress",
        "inputTelephone",
        "inputEmail",
        "inputDate"
    ]

    let firstName = document.getElementById("inputFirstName").value;
    let lastName = document.getElementById("inputLastName").value;

    let addressIDsArray = [
        "inputStreetAddress",
        "inputCityAddress",
        "inputStateAddress",
        "inputZipAddress"
    ]

    // First round checks for required fields being filled in
    if (requiredFields.filter(field => isEmptyString(document.getElementById(field).value)).length > 0) {
        document.getElementById("personalInfoAlert").style.display = 'block';
        document.getElementById("personalInfoAlertMessage").innerHTML = 'Please fill in all required fields.';
    } else {
        //Second round is checking if First/Last Name fields have non-alphabetical values (only space allowed), then show alert message.
        if (isEmptyString(firstName) || /[^a-zA-Z\s]/.test(firstName) || isEmptyString(lastName) || /[^a-zA-Z\s]/.test(lastName)) {
            document.getElementById("personalInfoAlert").style.display = 'block';
            document.getElementById("personalInfoAlertMessage").innerHTML = 'First/Last name should only contain alphabetical values.';

            document.getElementById("firstName").value = '';
            document.getElementById("lastName").value = '';
        } else {
            let hasInvalidAddress = false, hasInvalidZip = false, hasInvalidStreetAddress = false,
                invalidAddressFieldID = '';
            for (let i = 0; i < addressIDsArray.length; i++) {
                let currentAddressFieldID = addressIDsArray[i];
                let currentAddressFieldValue = document.getElementById(currentAddressFieldID).value;

                if (currentAddressFieldID === "inputZipAddress") {
                    if (isEmptyString(currentAddressFieldValue) || /[^0-9]/.test(currentAddressFieldValue)) {
                        hasInvalidAddress = true;
                        hasInvalidZip = true;
                    }
                } else if (currentAddressFieldID === "inputStreetAddress") {
                    if (isEmptyString(currentAddressFieldValue) || /[^a-zA-Z0-9\s]/.test(currentAddressFieldValue)) {
                        hasInvalidAddress = true;
                        hasInvalidStreetAddress = true;
                    }
                } else {
                    if (isEmptyString(currentAddressFieldValue) || /[^a-zA-Z]/.test(currentAddressFieldValue)) {
                        hasInvalidAddress = true;
                    }
                }

                if (hasInvalidAddress) {
                    invalidAddressFieldID = currentAddressFieldID;
                    break;
                }
            }

            //Third round is checking if address fields has non-alphanumeric values, then show alert message.
            if (hasInvalidAddress) {
                document.getElementById("personalInfoAlert").style.display = 'block';
                document.getElementById("personalInfoAlertMessage").innerHTML = hasInvalidZip ? 'Zip code should only be numbers.'
                    : hasInvalidStreetAddress ? 'Street Address should only contain alphanumeric values.'
                        : 'City/State fields should only contain alphabetical values.';

                document.getElementById(invalidAddressFieldID).value = '';
            } else {
                let emailValue = document.getElementById("inputEmail").value;

                //Last round checks if email is of a valid format; otherwise, show alert message.
                // Regex from: https://stackoverflow.com/a/8897615
                if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(emailValue)) {
                    document.getElementById("personalInfoAlert").style.display = 'block';
                    document.getElementById("personalInfoAlertMessage").innerHTML = 'Email format is invalid, please try again.';

                    document.getElementById("inputEmail").value = '';
                } else {
                    document.getElementById("personalInfoAlert").style.display = 'none';
                    checkForWinningNumber();
                }
            }
        }
    }
}

function submitSurveyForm() {
    alert("Submitted!");
}

function resetSurveyForm() {
    document.getElementById("personalInfoAlert").style.display = 'none';
    document.getElementById("surveyForm").reset();
    document.getElementById("dataAlert").style.display = 'none';
    document.getElementById("dataValueField").value = "";
}

function getCityStateFromZip() {
    let zipValue = document.getElementById("inputZipAddress").value;

    if (zipValue && zipValue.length === 5 && /^\d+$/.test(zipValue)) {
        let xmlData = '<CityStateLookupRequest USERID="|USER_ID|"><ZipCode ID="0"><Zip5>|ZIP_CODE|</Zip5></ZipCode></CityStateLookupRequest>'
            .replace("|USER_ID|", "0GEORG5470T13")
            .replace("|ZIP_CODE|", parseInt(zipValue));

        let apiUrl = "https://secure.shippingapis.com/ShippingAPI.dll?API= CityStateLookup&XML=" + xmlData;

        document.getElementById("inputZipAddress").className = 'form-control';

        axios.get(apiUrl)
            .then(response => {
                let data = xmlToJSON.parseString(response.data);
                let city = data["CityStateLookupResponse"][0]['ZipCode'][0]['City'][0]['_text'];
                let state = data["CityStateLookupResponse"][0]['ZipCode'][0]['State'][0]['_text'];

                document.getElementById("inputCityAddress").value = city;
                document.getElementById("inputStateAddress").value = state;

                document.getElementById("inputZipAddress").disabled = false;
            })
    } else {
        document.getElementById("inputZipAddress").className = 'form-control is-invalid';

        document.getElementById("inputCityAddress").value = '';
        document.getElementById("inputStateAddress").value = '';
    }
}
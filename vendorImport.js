//Google App Script for taking a csv file and import it into a master list

function onOpen(){
	var ui = SpreadsheetApp.getUi();
	ui.createMenu('Script')
		.addItem('Import Vendors', 'importCSV')
		.addToUi();
}


function importCSV(){ //NOTE: home of the LOOP and the function to call all other fuctions
	var csvrange = getCSV(); //NOTE: calls getCSV and returns the range assigning it to csvrange
	var csvrows = csvrange.getNumRows();
	var values = csvrange.getValues();
	var newrows = checkRows(csvrows);

	for (var i = 1; i < newrows; i++) { //TODO:test loop
		var row = i
		var vendorinfo = buildArray(values,row);
		var fullName = vendorinfo[0];
		var email = vendorinfo[1];
		var phone = vendorinfo[2];
		var address = vendorinfo[3];
		var state = vendorinfo[4];
		var zip = vendorinfo[5];
		var zone = zoneFinder(zip);

		importVendor(fullName,email,phone,address,zone,state);
	};
}

function getCSV(){ //NOTE: gets the csv and creates and object out of that shit
	var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1TfPQzfaMRbf5kgKbeS-PDnvJs12Pxa1uTHUdhahK7t0/edit');//TODO: Url of CSV.  Add a variable that is set by user input.
	var sheet = spreadsheet.getSheets()[0];
	var range = sheet.getDataRange();//NOTE: sets range to where data is present

	return(range); //NOTE: returns range to importCSV
}

function importVendor(fullName,email,phone,address,zone,state){ //NOTE: function for writing new row
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = ss.getSheetByName(state); //NOTE: Uses state to select the associated sheet

	sheet.appendRow([fullName,email,phone,address,zone]); //NOTE: writes variables to next empty row
	//TODO: reserved for calling autoReply(fullName,email)
}

function autoReply(fullName, email){ //NOTE: emails the applicant with a predefined email that uses variables from the csv to customize that shit
	var template = HtmlService.createTemplateFromFile("replyTemplate"); //NOTE: assigns the html template as the variable template
	//TODO: write replyTemplate html
	MailApp.sendEmail(email,
										"Sentry Field Services: Initial Vendor Packet",
										"",
										{
											htmlBody: template.evaluate().getContent(), //NOTE: calls the html template as the body of the email
											//TODO: this space is reserved for attachments
										});

}

function buildArray(values,row){ //NOTE: takes the current row and turns it into variables and returns the values
	var firstName = values[row][0];
	var lastName = values[row][1];
	var fullName = firstName + " " + lastName;
	var email = values[row][10];
	var phone = values[row][9];
	var address = values[row][3] + " " + values[row][4] + " " + values[row][5];
	var state = values[row][6];
	var zip = values[row][7];

	state = abbreviateState(state)
	address = address + ", " + state + " " + zip;
	return[fullName,email,phone,address,state,zip];
}

function abbreviateState(state){ //NOTE: converts state to abbriviation and returns the value
	switch(state) {
		case 'Alabama':
			abState = 'AL';
			break;
		case 'Alaska':
			abState = 'AK';
			break;
		case 'Arizona':
			abState = 'AZ';
			break;
		case 'Arkansas':
			abState = 'AR';
			break;
		case 'California':
			abState = 'CA';
			break;
		case 'Colorado':
			abState = 'CO';
			break;
		case 'Connecticut':
			abState = 'CT';
			break;
		case 'Delaware':
			abState = 'DE';
			break;
		case 'Florida':
			abState = 'FL';
			break;
		case 'Georgia':
			abState = 'GA';
			break;
		case 'Hawaii':
			abState = 'HI';
			break;
		case 'Idaho':
			abState = 'ID';
			break;
		case 'Illinois':
			abState = 'IL';
			break;
		case 'Indiana':
			abState = 'IN';
			break;
		case 'Iowa':
			abState = 'IA';
			break;
		case 'Kansas':
			abState = 'KS';
			break;
		case 'Kentucky':
			abState = 'KY';
			break;
		case 'Louisiana':
			abState = 'LA';
			break;
		case 'Maine':
			abState = 'ME';
			break;
		case 'Maryland':
			abState = 'MD';
			break;
		case 'Massachusetts':
			abState = 'MA';
			break;
		case 'Michigan':
			abState = 'MI';
			break;
		case 'Minnesota':
			abState = 'MN';
			break;
		case 'Mississippi':
			abState = 'MS';
			break;
		case 'Missouri':
			abState = 'MO';
			break;
		case 'Montana':
			abState = 'MT';
			break;
		case 'Nebraska':
			abState = 'NE';
			break;
		case 'Nevada':
			abState = 'NV';
			break;
		case 'New Hampshire':
			abState = 'NH';
			break;
		case 'New Jersey':
			abState = 'NJ';
			break;
		case 'New Mexico':
			abState = 'NM';
			break;
		case 'New York':
			abState = 'NY';
			break;
		case 'North Carolina':
			abState = 'NC';
			break;
		case 'North Dakota':
			abState = 'ND';
			break;
		case 'Ohio':
			abState = 'OH';
			break;
		case 'Oklahoma':
			abState = 'OK';
			break;
		case 'Oregon':
			abState = 'OR';
			break;
		case 'Pennsylvania':
			abState = 'PA';
			break;
		case 'Rhode Island':
			abState = 'RI';
			break;
		case 'South Carolina':
			abState = 'SC';
			break;
		case 'South Dakota':
			abState = 'SD';
			break;
		case 'Tennessee':
			abState = 'TN';
			break;
		case 'Texas':
			abState = 'TX';
			break;
		case 'Utah':
			abState = 'UT';
			break;
		case 'Vermont':
			abState = 'VT';
			break;
		case 'Virginia':
			abState = 'VA';
			break;
		case 'Washington':
			abState = 'WA';
			break;
		case 'West Virginia':
			abState = 'WV';
			break;
		case 'Wisconsin':
			abState = 'WI';
			break;
		case 'Wyoming':
			abState = 'WY';
			break;
		case 'District of Columbia':
			abState = 'DC';
			break;
	};
	return(abState);
}

function checkRows(csvrows){ //NOTE: checks history to only pull rows added since the last import
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = ss.getSheetByName("history");
	var range = sheet.getRange("A1");
	var oldrows = range.getValue();
	var newrows = csvrows - oldrows;

	range.setValue(csvrows - 1);//NOTE: -1 accounts for possition in the array
	return(newrows); //NOTE: returns newrows to importCSV
}

function zoneFinder(zip){ //FIXME: NOT WORKING JUST GIVING THE ZIP CODE???
	var ss = SpreadsheetApp.getActiveSpreadsheet();
	var sheet = ss.getSheetByName("regions");
	var range = sheet.getDataRange();
	var rows = range.getNumRows();
	var regionvalues = range.getValues();

	for (var i = 0; i < rows; i++){
		var row = i;
		var code = regionvalues[row][0]; //FIXME: need to check for null values
		var zone = regionvalues[row][1];

		if (zip == code){
			return(zone);
		};
	};
	return(zip);
}

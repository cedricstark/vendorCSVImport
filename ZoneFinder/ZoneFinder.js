function onEdit(e){
  var range = e.range;
  var cell = range.getA1Notation();
  var thisCol = range.getColumn();
	var cellvalue = e.value;

  //Browser.msgBox("The value of cell " + cell + " is " + cellvalue); //this line is just for testing variables
  if (typeof cellvalue !== "undefined"){
		if (thisCol == 1){ //NOTE: 1 MUST BE THE ZONE COLUMN
			range.setFormula("=DGET(region!A1:B3707,\"Area\",{\"zip code\";" + cellvalue + "})");
		};
	};
};

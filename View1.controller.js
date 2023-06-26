sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/IconPool",
	
	"sap/ui/table/library",
	'sap/m/library',
	
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	
	
], function (MessageToast, Controller, JSONModel, Fragment, IconPool, library, mobileLibrary, Filter, FilterOperator, FilterType, MessageBox) {
	"use strict";
	 var checkedIns = [];
	 var calendarCounts = 0;
	 var f1Pernr = 0;
	 var f2Pernr = 0;
	 var f3Pernr = 0;
	 var f1Name ="name1";
	 var f2Name ="name2";
	 var f3Name ="name3";
	 var avoRowCount = 0;
	 var draggedObjectNo = "0";
	 var draggedObject;
	 var viewId = "";
	 var droppedOrNot = false;
	 var selectedColumn = "none";
	 var SortOrder = library.SortOrder;
	 var URLHelper = mobileLibrary.URLHelper;
	 var sSearchField = "none";
	 var selectedCancelReason = "";
	 var isSortColumnDescending = "true";
	 //calendar slots:
	 var calSlot1, calSlot2, calSlot3;

	return Controller.extend("deneme.deneme.controller.View1", {
		onInit: function () {
			
			this.fillCalendar();
			this.fillInspector();
			this.fillAVO();
			this.addBusinessSuiteicons(); // adding BusinessSuiteicons for invisible icons 
			
		},
		
		onAfterRendering: function () {
						//filling global inspector Array;
						
			debugger;			
/*			var tb = this.getView().byId("table");
			//getting row counts for Inspectors;
			var rowCount = tb._getRowCounts();
			
			for (let i = 0; i < rowCount.count; i++) {
				
				var newInsp = {
					    name: tb.getRows()[i].getCells()[1].getText(),
					    pernr: tb.getRows()[i].getCells()[0].getText(),
					    checked: false
					};

				checkedIns.push(newInsp);
				
			}*/
			
			avoRowCount = this.getView().byId("Table1")._getRowCounts();
			
			// Avo is not load datas if we dont create popup 
			this.createPopUpListView();
			this.createPopUpCancelTask();
			
		},
		
		// That method adds icons 
		addBusinessSuiteicons: function(){
			
			var b = [];
			var c = {};
			//Fiori Theme font family and URI
			var t = {
				fontFamily: "SAP-icons-TNT",
				fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
			};
			//Registering to the icon pool
			IconPool.registerFont(t);
			b.push(IconPool.fontLoaded("SAP-icons-TNT"));
			c["SAP-icons-TNT"] = t;
			//SAP Business Suite Theme font family and URI
			var B = {
				fontFamily: "BusinessSuiteInAppSymbols",
				fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
			};
			//Registering to the icon pool
			IconPool.registerFont(B);
			b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
			c["BusinessSuiteInAppSymbols"] = B;
			
		},
		
		fillCalendar: function() {
			
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			var cal4 = this.getView().byId("PC1");
			
			var f1 = this.getView().byId("field1");
			var f2 = this.getView().byId("field2");
			var f3 = this.getView().byId("field3");
			 
			f1.setVisible(false);
			f2.setVisible(false);
			f3.setVisible(false);
			cal4.setVisible(false);

		},
		
		fillInspector: function() {
			
			// get the path to the JSON file
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/InspectorSet.json"); 
			
			// initialize the model with the JSON file
			var oModel = new JSONModel(sPath);
			      
			// set the model to the view
			this.getView().setModel(oModel, "jsonFile");
			
			this.byId("table").setModel(oModel);
			
			
		},
		
		fillInspectorArray: function() {
			
/*			debugger;
			
			var tb = this.getView().byId("table");
			//getting row counts for Inspectors;
			var rowCount = tb._getRowCounts();
			
						//filling global inspector Array;
			for (let i = 0; i < rowCount.count; i++) {
				
				var newInsp = {
					    name: tb.getRows()[i].getCells()[0].getText(),
					    pernr: tb.getRows()[i].getCells()[1].getText(),
					    checked: false
					};

				checkedIns.push(newInsp);
				
			}*/
			
		},
		
		fillAVO: function() {
			
			// get the path to the JSON file
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/AVO.json"); 
			
			// initialize the model with the JSON file
			var oModel = new JSONModel(sPath);
			      
			// set the model to the view
			this.getView().setModel(oModel, "jsonFile");

			console.log(JSON.stringify(oModel.getData()));
			
			this.byId("Table1").setModel(oModel);
			
			
		},
		
		
		onPressed: function(oEvent) {
			

			MessageToast.show(oEvent.getSource().getId() + " Pressed");

		},
		
		// Checkbox controlls 
		handleChangeInspektor: function(oEvent) {
			
			console.log("handleChange event started");
			var tb = this.getView().byId("table");
			var selectedRowCounts = tb.getSelectedIndices();
			//getting row counts for Inspectors;
			//var rowCount = tb._getRowCounts();
			calendarCounts = selectedRowCounts.length-1;
			
			//Calendars and its fields to add:
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			
			var f1 = this.getView().byId("field1");
			var f2 = this.getView().byId("field2");
			var f3 = this.getView().byId("field3");
			
			// Which row has been clicked??? get index and cell texts
			var lastAddedIdx = oEvent.getParameters().rowIndex;
			var obj1 = tb.getRows()[lastAddedIdx].getCells()[0].getText();
			var obj2 = tb.getRows()[lastAddedIdx].getCells()[1].getText();
			
			// Clicked check box is same or not?
			var isSameRecord = false;
			for (let i = 0; i < checkedIns.length; i++) {
    				if(checkedIns[i].pernr == obj2){
    					isSameRecord = true;
    					break;
    			}
			}

			if(isSameRecord == false){
				var newInsp1 = {
				    name: obj1,
				    pernr: obj2,
				    checked: false
					};

				checkedIns.push(newInsp1);
			}
			
			var calSlotCount = 0;
			
			//defining calSlots if they are undefined;
			if(calSlot1 === undefined){ calSlot1 = [];} 
			if(calSlot2 === undefined){	calSlot2 = [];} 
			if(calSlot3 === undefined){	calSlot3 = [];}
			
			debugger;
			// defining how much calSlot are there?:
			if(calSlot1.length == 0 && calSlot2.length == 0 && calSlot3.length == 0){
				calSlotCount = calSlotCount;
			}else {
				if (calSlot1.length == !0){ calSlotCount++;} 
				if (calSlot2.length == !0){	calSlotCount++;} 
				if (calSlot3.length == !0){	calSlotCount++;}
			}
			
			
				
			debugger;
			// Maximum inspektor selection is 3 setting this value;
			if(calSlotCount === 3) {
				oEvent.getSource().removeSelectionInterval((lastAddedIdx),(lastAddedIdx));
				if (isSameRecord == false){MessageToast.show("Es darf max. 3 Prüfer ausgewählt werden. ( " + obj1 + obj2 + " )" );} 
				
			} else {
				if(isSameRecord == false){
					// calSlotCount is not max and thats not the same box
					calSlotCount++;
					switch(calSlotCount) {
						case 1:
						   f1.setVisible(true);
						   f1Pernr=obj1;
						   f1Name=obj2;
						   this.settingsCal1();
						   var newInsp = {
					    		name: obj1,
					    		pernr: obj2,
					    		checked: true
						   };
						   calSlot1.push(newInsp);
						   break;
						case 2:
						   f2.setVisible(true);
						   f2Pernr=obj1;
						   f2Name=obj2;
						   this.settingsCal2();
						   var newInsp = {
					    		name: obj1,
					    		pernr: obj2,
					    		checked: true
						   };
						   calSlot2.push(newInsp);
						   break;
						case 3:
						   f3.setVisible(true);
						   f3Pernr=obj1;
						   f3Name=obj2;
						   this.settingsCal3();
						   var newInsp = {
					    		name: obj1,
					    		pernr: obj2,
					    		checked: true
						   };
						   calSlot3.push(newInsp);
					}
				
				} 
					
			}	
				
			// We are clicking the same box:
			if(isSameRecord == true){
				// delete record from checkedIns if they are same records, uncheck box;
				for (let i = 0; i < checkedIns.length; i++) {
	    			if(checkedIns[i].pernr == obj2){
	    				debugger;
	    				checkedIns[i].checked = false;
	    				checkedIns.splice(i,1);
	    					
	    			}
				}
					
				if(calSlotCount === 3)
					{//Unassign calanders ; 
					switch(obj1) {
						  case f1Pernr:
						  	f1Pernr=f2Pernr;
						  	f2Pernr=f3Pernr;
						  	f3Pernr=0;
						  	
						  	f1Name=f2Name;
						  	f2Name=f3Name;
						  	f3Name="";
						  	
						  	this.settingsCal1();
						  	this.settingsCal2();
						  	this.settingsCal3();
						  	
						    f1.setVisible(true);
						    f2.setVisible(true);
						    f3.setVisible(false);

						    calSlot1 = [];
						    calSlot1 = calSlot2;
						    calSlot2 = calSlot3;
						    calSlot3 = [];
						    
						    break;
						  case f2Pernr:
						  	
						  	f2Pernr=f3Pernr;
						  	f3Pernr=0;
						  	
						  	f2Name=f3Name;
						  	f3Name="";
						  	
						  	this.settingsCal2();
						  	this.settingsCal3();
						  	
						  	f2.setVisible(true);
						    f3.setVisible(false);
						  	
						    calSlot2 = calSlot3;
						    calSlot3 = [];
						    break;
						  case f3Pernr:
						  	f3.setVisible(false);
						  	f3Pernr=0;
						  	f3Name="";
						  	calSlot3 = [];
					}
					} else if (calSlotCount === 2){
						//TODO 2 ve 1 duzeltilecek
						//Unassign calanders ; 
							switch(obj1) {
								  case f1Pernr:
								  	f1Pernr=f2Pernr;
								  	f2Pernr=0;
								  	
								  	f1Name=f2Name;
								  	f2Name="";
								  	
								  	this.settingsCal1();
								  	this.settingsCal2();
								  	
								    f1.setVisible(true);
								    f2.setVisible(false);
		
								    calSlot1 = [];
								    calSlot1 = calSlot2;
								    calSlot2 = [];
								    
								    break;
								  case f2Pernr:
								  	
								  	f2Pernr=0;
									f2Name="";
									this.settingsCal2();
									f2.setVisible(false);
									calSlot2 = [];

							}
					} else if (calSlotCount === 1){
						
						f1Pernr=0;
						f1Name="";
						this.settingsCal1();
						f1.setVisible(false);
						calSlot1 = [];
						
					}
			}		
					
					
			debugger;
			



			console.log("handleChange event ended");
			
		},
		
		settingsCal1: function(){
			
			var cal1 = this.getView().byId("SPC1");
			var f1 = this.getView().byId("field1");
			
/*			// get the path to the JSON file
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/ins1.json"); 
			// initialize the model with the JSON file
			var oModel = new JSONModel(sPath);
			// set the model to the view
			this.getView().setModel(oModel, "jsonFile");*/
			
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel1 = this.getAppointmentsForModel(f1Pernr);
			// 2) Load or Set the data to model
			this.byId("SPC1").setModel(oModel1);
			cal1.setTitle(f1Name);
			
		},
		
		settingsCal2: function(){
			
			var cal2 = this.getView().byId("SPC2");
			var f2 = this.getView().byId("field2");
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel2 = this.getAppointmentsForModel(f2Pernr);
			// 2) Load or Set the data to model
			this.byId("SPC2").setModel(oModel2);
			cal2.setTitle(f2Name);

		},
		
		settingsCal3: function(){
			debugger;
			var cal3 = this.getView().byId("SPC3");
			var f3 = this.getView().byId("field3");
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getAppointmentsForModel(f3Pernr);
			// 2) Load or Set the data to model
			this.byId("SPC3").setModel(oModel);
			cal3.setTitle(f3Name);

		},
		
		settingsCal4: function(){
			debugger;
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getAppointmentsForPlantafel();
			// 2) Load or Set the data to model
			this.byId("PC1").setModel(oModel);

		},
		
		
		// deleting empty rows from inspector side
		onBindingChange: function(oEvent) {
    		this.getView().byId("table").setVisibleRowCount(oEvent.getSource().getLength());
		},
		
		onBindingChange2: function(oEvent) {
    		this.getView().byId("Table1").setVisibleRowCount(oEvent.getSource().getLength());
		},
		
		getAppointmentsForModel: function(pernr){
			debugger;
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel = new JSONModel();
			// 2) Load or Set the data to model
			switch(pernr) {
				case "00000331":
					debugger;
				oModel.setData({
					startDate: new Date("2023", "8", "14", "12", "0"),
					Pernr: "00000331",
					Vkorg: "0097",
					Lastname: "Holländer",
					Firstname: "Antje",
					pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
					role: "team member",
					appointments: [
						{
									Terminnr: "Büro",
									start: new Date("2023", "8", "14", "08", "30"),
									end: new Date("2023", "8", "14", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 2",
									start: new Date("2023", "8", "14", "10", "0"),
									end: new Date("2023", "8", "14", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type09",
									pic: "sap-icon://flight",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 3",
									start: new Date("2023", "0", "12", "11", "30"),
									end: new Date("2023", "0", "12", "13", "30"),
									title: "Auftrag",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "08", "30"),
									end: new Date("2023", "0", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "10", "0"),
									end: new Date("2023", "0", "15", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "11", "30"),
									end: new Date("2023", "0", "15", "13", "30"),
									title: "Betriebsrat",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "13", "30"),
									end: new Date("2023", "0", "15", "17", "30"),
									title: "Auftrag",
									info: "online meeting",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "16", "04", "00"),
									end: new Date("2023", "0", "16", "22", "30"),
									title: "Auftrag",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "08", "30"),
									end: new Date("2023", "0", "18", "09", "30"),
									title: "Abwesenheit",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "11", "30"),
									end: new Date("2023", "0", "18", "13", "30"),
									title: "Büro",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "1", "0"),
									end: new Date("2023", "0", "18", "22", "0"),
									title: "Betriebsrat",
									info: "regular",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "21", "00", "30"),
									end: new Date("2023", "0", "21", "23", "30"),
									title: "Auftrag",
									info: "room 105",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "25", "11", "30"),
									end: new Date("2023", "0", "25", "13", "30"),
									title: "Betriebsrat",
									type: "Type01",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "29", "10", "0"),
									end: new Date("2023", "0", "29", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "08", "30"),
									end: new Date("2023", "0", "30", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "10", "0"),
									end: new Date("2023", "0", "30", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "11", "30"),
									end: new Date("2023", "0", "30", "13", "30"),
									title: "Büro",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "13", "30"),
									end: new Date("2023", "0", "30", "17", "30"),
									title: "Büro",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "31", "10", "00"),
									end: new Date("2023", "0", "31", "11", "30"),
									title: "Betriebsrat",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "3", "08", "30"),
									end: new Date("2023", "1", "13", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "4", "10", "0"),
									end: new Date("2023", "1", "4", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "2", "30", "10", "0"),
									end: new Date("2023", "4", "33", "12", "0"),
									title: "Auftrag",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2023", "0", "15", "8", "0"),
									end: new Date("2023", "0", "15", "10", "0"),
									title: "Deneme 03",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "15", "13", "0"),
									end: new Date("2023", "0", "15", "14", "0"),
									title: "Deneme 01",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "14", "10", "0"),
									end: new Date("2023", "0", "14", "11", "0"),
									title: "Deneme 02",
									type: "Type10",
									tentative: false
								},
								{
									start: new Date("2023", "1", "1", "0", "0"),
									end: new Date("2023", "1", "30", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false
								}
							]
					});
				break;
				case "90007601":
				oModel.setData({
					startDate: new Date("2023", "4", "15", "12", "0"),
					Pernr: "00000331",
					Vkorg: "0097",
					Lastname: "Holländer",
					Firstname: "Antje",
					pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
					role: "team member",
					appointments: [
						{
									Terminnr: "Büro",
									start: new Date("2023", "4", "15", "08", "30"),
									end: new Date("2023", "4", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 2",
									start: new Date("2023", "4", "15", "10", "0"),
									end: new Date("2023", "4", "15", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type09",
									pic: "sap-icon://flight",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 3",
									start: new Date("2023", "0", "12", "11", "30"),
									end: new Date("2023", "0", "12", "13", "30"),
									title: "Auftrag",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "08", "30"),
									end: new Date("2023", "0", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "10", "0"),
									end: new Date("2023", "0", "15", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "11", "30"),
									end: new Date("2023", "0", "15", "13", "30"),
									title: "Betriebsrat",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "13", "30"),
									end: new Date("2023", "0", "15", "17", "30"),
									title: "Auftrag",
									info: "online meeting",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "16", "04", "00"),
									end: new Date("2023", "0", "16", "22", "30"),
									title: "Auftrag",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "08", "30"),
									end: new Date("2023", "0", "18", "09", "30"),
									title: "Abwesenheit",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "11", "30"),
									end: new Date("2023", "0", "18", "13", "30"),
									title: "Büro",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "1", "0"),
									end: new Date("2023", "0", "18", "22", "0"),
									title: "Betriebsrat",
									info: "regular",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "21", "00", "30"),
									end: new Date("2023", "0", "21", "23", "30"),
									title: "Auftrag",
									info: "room 105",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "25", "11", "30"),
									end: new Date("2023", "0", "25", "13", "30"),
									title: "Betriebsrat",
									type: "Type01",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "29", "10", "0"),
									end: new Date("2023", "0", "29", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "08", "30"),
									end: new Date("2023", "0", "30", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "10", "0"),
									end: new Date("2023", "0", "30", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "11", "30"),
									end: new Date("2023", "0", "30", "13", "30"),
									title: "Büro",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "13", "30"),
									end: new Date("2023", "0", "30", "17", "30"),
									title: "Büro",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "31", "10", "00"),
									end: new Date("2023", "0", "31", "11", "30"),
									title: "Betriebsrat",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "3", "08", "30"),
									end: new Date("2023", "1", "13", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "4", "10", "0"),
									end: new Date("2023", "1", "4", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "2", "30", "10", "0"),
									end: new Date("2023", "4", "33", "12", "0"),
									title: "Auftrag",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2023", "0", "15", "8", "0"),
									end: new Date("2023", "0", "15", "10", "0"),
									title: "Deneme 03",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "15", "13", "0"),
									end: new Date("2023", "0", "15", "14", "0"),
									title: "Deneme 01",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "14", "10", "0"),
									end: new Date("2023", "0", "14", "11", "0"),
									title: "Deneme 02",
									type: "Type10",
									tentative: false
								},
								{
									start: new Date("2023", "1", "1", "0", "0"),
									end: new Date("2023", "1", "30", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false
								}
							]
					});
				break;
				case "90007602":
				oModel.setData({
					startDate: new Date("2023", "8", "14", "12", "0"),
					Pernr: "00000331",
					Vkorg: "0097",
					Lastname: "Holländer",
					Firstname: "Antje",
					pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
					role: "team member",
					appointments: [
						{
									Terminnr: "Büro",
									start: new Date("2023", "8", "14", "08", "30"),
									end: new Date("2023", "8", "14", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 2",
									start: new Date("2023", "8", "14", "10", "0"),
									end: new Date("2023", "8", "14", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type09",
									pic: "sap-icon://flight",
									tentative: false,
									place: ""
								},
								{
									Terminnr: "Terminnr 3",
									start: new Date("2023", "0", "12", "11", "30"),
									end: new Date("2023", "0", "12", "13", "30"),
									title: "Auftrag",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "08", "30"),
									end: new Date("2023", "0", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "10", "0"),
									end: new Date("2023", "0", "15", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "11", "30"),
									end: new Date("2023", "0", "15", "13", "30"),
									title: "Betriebsrat",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "15", "13", "30"),
									end: new Date("2023", "0", "15", "17", "30"),
									title: "Auftrag",
									info: "online meeting",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "16", "04", "00"),
									end: new Date("2023", "0", "16", "22", "30"),
									title: "Auftrag",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "08", "30"),
									end: new Date("2023", "0", "18", "09", "30"),
									title: "Abwesenheit",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "11", "30"),
									end: new Date("2023", "0", "18", "13", "30"),
									title: "Büro",
									info: "canteen",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "18", "1", "0"),
									end: new Date("2023", "0", "18", "22", "0"),
									title: "Betriebsrat",
									info: "regular",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "21", "00", "30"),
									end: new Date("2023", "0", "21", "23", "30"),
									title: "Auftrag",
									info: "room 105",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "25", "11", "30"),
									end: new Date("2023", "0", "25", "13", "30"),
									title: "Betriebsrat",
									type: "Type01",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "29", "10", "0"),
									end: new Date("2023", "0", "29", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "08", "30"),
									end: new Date("2023", "0", "30", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "10", "0"),
									end: new Date("2023", "0", "30", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "11", "30"),
									end: new Date("2023", "0", "30", "13", "30"),
									title: "Büro",
									type: "Type03",
									tentative: true,
									place: ""
								},
								{
									start: new Date("2023", "0", "30", "13", "30"),
									end: new Date("2023", "0", "30", "17", "30"),
									title: "Büro",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "0", "31", "10", "00"),
									end: new Date("2023", "0", "31", "11", "30"),
									title: "Betriebsrat",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "3", "08", "30"),
									end: new Date("2023", "1", "13", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "1", "4", "10", "0"),
									end: new Date("2023", "1", "4", "12", "0"),
									title: "Auftrag",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2023", "2", "30", "10", "0"),
									end: new Date("2023", "4", "33", "12", "0"),
									title: "Auftrag",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2023", "0", "15", "8", "0"),
									end: new Date("2023", "0", "15", "10", "0"),
									title: "Deneme 03",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "15", "13", "0"),
									end: new Date("2023", "0", "15", "14", "0"),
									title: "Deneme 01",
									type: "Type06"
								},
								{
									start: new Date("2023", "0", "14", "10", "0"),
									end: new Date("2023", "0", "14", "11", "0"),
									title: "Deneme 02",
									type: "Type10",
									tentative: false
								},
								{
									start: new Date("2023", "1", "1", "0", "0"),
									end: new Date("2023", "1", "30", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false
								}
							]
					});
				break;
				case "90007603":
				oModel.setData({
						startDate: new Date("2023", "8", "14", "12", "0"),
						Pernr: "00000331",
						Vkorg: "0097",
						Lastname: "Holländer",
						Firstname: "Antje",
						pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
						role: "team member",
						appointments: [
							{
										Terminnr: "Büro",
										start: new Date("2023", "8", "14", "08", "30"),
										end: new Date("2023", "8", "14", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										Terminnr: "Terminnr 2",
										start: new Date("2023", "8", "14", "10", "0"),
										end: new Date("2023", "8", "14", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type09",
										pic: "sap-icon://flight",
										tentative: false,
										place: ""
									},
									{
										Terminnr: "Terminnr 3",
										start: new Date("2023", "0", "12", "11", "30"),
										end: new Date("2023", "0", "12", "13", "30"),
										title: "Auftrag",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "08", "30"),
										end: new Date("2023", "0", "15", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "10", "0"),
										end: new Date("2023", "0", "15", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "11", "30"),
										end: new Date("2023", "0", "15", "13", "30"),
										title: "Betriebsrat",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "13", "30"),
										end: new Date("2023", "0", "15", "17", "30"),
										title: "Auftrag",
										info: "online meeting",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "16", "04", "00"),
										end: new Date("2023", "0", "16", "22", "30"),
										title: "Auftrag",
										info: "Online meeting",
										type: "Type04",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "08", "30"),
										end: new Date("2023", "0", "18", "09", "30"),
										title: "Abwesenheit",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "11", "30"),
										end: new Date("2023", "0", "18", "13", "30"),
										title: "Büro",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "1", "0"),
										end: new Date("2023", "0", "18", "22", "0"),
										title: "Betriebsrat",
										info: "regular",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "21", "00", "30"),
										end: new Date("2023", "0", "21", "23", "30"),
										title: "Auftrag",
										info: "room 105",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "25", "11", "30"),
										end: new Date("2023", "0", "25", "13", "30"),
										title: "Betriebsrat",
										type: "Type01",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "29", "10", "0"),
										end: new Date("2023", "0", "29", "12", "0"),
										title: "Büro",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "08", "30"),
										end: new Date("2023", "0", "30", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "10", "0"),
										end: new Date("2023", "0", "30", "12", "0"),
										title: "Büro",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "11", "30"),
										end: new Date("2023", "0", "30", "13", "30"),
										title: "Büro",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "13", "30"),
										end: new Date("2023", "0", "30", "17", "30"),
										title: "Büro",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "31", "10", "00"),
										end: new Date("2023", "0", "31", "11", "30"),
										title: "Betriebsrat",
										info: "Online meeting",
										type: "Type04",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "1", "3", "08", "30"),
										end: new Date("2023", "1", "13", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "1", "4", "10", "0"),
										end: new Date("2023", "1", "4", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "2", "30", "10", "0"),
										end: new Date("2023", "4", "33", "12", "0"),
										title: "Auftrag",
										type: "Type07",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									}
								],
								headers: [
									{
										start: new Date("2023", "0", "15", "8", "0"),
										end: new Date("2023", "0", "15", "10", "0"),
										title: "Deneme 03",
										type: "Type06"
									},
									{
										start: new Date("2023", "0", "15", "13", "0"),
										end: new Date("2023", "0", "15", "14", "0"),
										title: "Deneme 01",
										type: "Type06"
									},
									{
										start: new Date("2023", "0", "14", "10", "0"),
										end: new Date("2023", "0", "14", "11", "0"),
										title: "Deneme 02",
										type: "Type10",
										tentative: false
									},
									{
										start: new Date("2023", "1", "1", "0", "0"),
										end: new Date("2023", "1", "30", "23", "59"),
										title: "Abwesenheit",
										type: "Type10",
										tentative: false
									}
								]
						});
				break;
				case "90007604":
				oModel.setData({
						startDate: new Date("2023", "8", "14", "12", "0"),
						Pernr: "00000331",
						Vkorg: "0097",
						Lastname: "Holländer",
						Firstname: "Antje",
						pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
						role: "team member",
						appointments: [
							{
										Terminnr: "Büro",
										start: new Date("2023", "8", "14", "08", "30"),
										end: new Date("2023", "8", "14", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										Terminnr: "Terminnr 2",
										start: new Date("2023", "8", "14", "10", "0"),
										end: new Date("2023", "8", "14", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type09",
										pic: "sap-icon://flight",
										tentative: false,
										place: ""
									},
									{
										Terminnr: "Terminnr 3",
										start: new Date("2023", "0", "12", "11", "30"),
										end: new Date("2023", "0", "12", "13", "30"),
										title: "Auftrag",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "08", "30"),
										end: new Date("2023", "0", "15", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "10", "0"),
										end: new Date("2023", "0", "15", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "11", "30"),
										end: new Date("2023", "0", "15", "13", "30"),
										title: "Betriebsrat",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "15", "13", "30"),
										end: new Date("2023", "0", "15", "17", "30"),
										title: "Auftrag",
										info: "online meeting",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "16", "04", "00"),
										end: new Date("2023", "0", "16", "22", "30"),
										title: "Auftrag",
										info: "Online meeting",
										type: "Type04",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "08", "30"),
										end: new Date("2023", "0", "18", "09", "30"),
										title: "Abwesenheit",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "11", "30"),
										end: new Date("2023", "0", "18", "13", "30"),
										title: "Büro",
										info: "canteen",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "18", "1", "0"),
										end: new Date("2023", "0", "18", "22", "0"),
										title: "Betriebsrat",
										info: "regular",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "21", "00", "30"),
										end: new Date("2023", "0", "21", "23", "30"),
										title: "Auftrag",
										info: "room 105",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "25", "11", "30"),
										end: new Date("2023", "0", "25", "13", "30"),
										title: "Betriebsrat",
										type: "Type01",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "29", "10", "0"),
										end: new Date("2023", "0", "29", "12", "0"),
										title: "Büro",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "08", "30"),
										end: new Date("2023", "0", "30", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "10", "0"),
										end: new Date("2023", "0", "30", "12", "0"),
										title: "Büro",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "11", "30"),
										end: new Date("2023", "0", "30", "13", "30"),
										title: "Büro",
										type: "Type03",
										tentative: true,
										place: ""
									},
									{
										start: new Date("2023", "0", "30", "13", "30"),
										end: new Date("2023", "0", "30", "17", "30"),
										title: "Büro",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "0", "31", "10", "00"),
										end: new Date("2023", "0", "31", "11", "30"),
										title: "Betriebsrat",
										info: "Online meeting",
										type: "Type04",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "1", "3", "08", "30"),
										end: new Date("2023", "1", "13", "09", "30"),
										title: "Betriebsrat",
										type: "Type02",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "1", "4", "10", "0"),
										end: new Date("2023", "1", "4", "12", "0"),
										title: "Auftrag",
										info: "room 1",
										type: "Type01",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									},
									{
										start: new Date("2023", "2", "30", "10", "0"),
										end: new Date("2023", "4", "33", "12", "0"),
										title: "Auftrag",
										type: "Type07",
										pic: "sap-icon://sap-ui5",
										tentative: false,
										place: ""
									}
								],
								headers: [
									{
										start: new Date("2023", "0", "15", "8", "0"),
										end: new Date("2023", "0", "15", "10", "0"),
										title: "Deneme 03",
										type: "Type06"
									},
									{
										start: new Date("2023", "0", "15", "13", "0"),
										end: new Date("2023", "0", "15", "14", "0"),
										title: "Deneme 01",
										type: "Type06"
									},
									{
										start: new Date("2023", "0", "14", "10", "0"),
										end: new Date("2023", "0", "14", "11", "0"),
										title: "Deneme 02",
										type: "Type10",
										tentative: false
									},
									{
										start: new Date("2023", "1", "1", "0", "0"),
										end: new Date("2023", "1", "30", "23", "59"),
										title: "Abwesenheit",
										type: "Type10",
										tentative: false
									}
								]
						});
				break;
				case "90007605":

				break;
				case "90007620":

				break;
				case "90007621":

				break;
				case "90007622":

				break;
			    case "90007637":

				break;
			}
			
			
			return oModel;
			
		},
		
		getAppointmentsForPlantafel: function(){
			debugger;
			// 1) Create a brand new model object: var oModel = new sap.ui.model.json.JSONModel();
			var oModel = new JSONModel();
			// 2) Load or Set the data to model
			oModel.setData({
					startDate: new Date("2022", "8", "14", "12", "0"),
					people: [{
						
						Pernr: "00000331",
						Vkorg: "0097",
						Lastname: "Holländer",
						Firstname: "Antje",
						pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/Donna_Moore.jpg",
						role: "team member",
						appointments: [
							{
								Terminnr: "Büro",
								start: new Date("2022", "8", "14", "08", "30"),
								end: new Date("2022", "8", "14", "09", "30"),
								title: "Betriebsrat",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								Terminnr: "Terminnr 2",
								start: new Date("2022", "8", "14", "10", "0"),
								end: new Date("2022", "8", "14", "12", "0"),
								title: "Auftrag",
								info: "room 1",
								type: "Type09",
								pic: "sap-icon://flight",
								tentative: false,
								place: ""
							},
							{
								Terminnr: "Terminnr 3",
								start: new Date("2022", "0", "12", "11", "30"),
								end: new Date("2022", "0", "12", "13", "30"),
								title: "Auftrag",
								info: "canteen",
								type: "Type03",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "15", "08", "30"),
								end: new Date("2022", "0", "15", "09", "30"),
								title: "Betriebsrat",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "15", "10", "0"),
								end: new Date("2022", "0", "15", "12", "0"),
								title: "Auftrag",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "15", "11", "30"),
								end: new Date("2022", "0", "15", "13", "30"),
								title: "Betriebsrat",
								info: "canteen",
								type: "Type03",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "15", "13", "30"),
								end: new Date("2022", "0", "15", "17", "30"),
								title: "Auftrag",
								info: "online meeting",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "16", "04", "00"),
								end: new Date("2022", "0", "16", "22", "30"),
								title: "Auftrag",
								info: "Online meeting",
								type: "Type04",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "18", "08", "30"),
								end: new Date("2022", "0", "18", "09", "30"),
								title: "Abwesenheit",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "18", "11", "30"),
								end: new Date("2022", "0", "18", "13", "30"),
								title: "Büro",
								info: "canteen",
								type: "Type03",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "18", "1", "0"),
								end: new Date("2022", "0", "18", "22", "0"),
								title: "Betriebsrat",
								info: "regular",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "21", "00", "30"),
								end: new Date("2022", "0", "21", "23", "30"),
								title: "Auftrag",
								info: "room 105",
								type: "Type03",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "25", "11", "30"),
								end: new Date("2022", "0", "25", "13", "30"),
								title: "Betriebsrat",
								type: "Type01",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "29", "10", "0"),
								end: new Date("2022", "0", "29", "12", "0"),
								title: "Büro",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "30", "08", "30"),
								end: new Date("2022", "0", "30", "09", "30"),
								title: "Betriebsrat",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "30", "10", "0"),
								end: new Date("2022", "0", "30", "12", "0"),
								title: "Büro",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "30", "11", "30"),
								end: new Date("2022", "0", "30", "13", "30"),
								title: "Büro",
								type: "Type03",
								tentative: true,
								place: ""
							},
							{
								start: new Date("2022", "0", "30", "13", "30"),
								end: new Date("2022", "0", "30", "17", "30"),
								title: "Büro",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "0", "31", "10", "00"),
								end: new Date("2022", "0", "31", "11", "30"),
								title: "Betriebsrat",
								info: "Online meeting",
								type: "Type04",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "1", "3", "08", "30"),
								end: new Date("2022", "1", "13", "09", "30"),
								title: "Betriebsrat",
								type: "Type02",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "1", "4", "10", "0"),
								end: new Date("2022", "1", "4", "12", "0"),
								title: "Auftrag",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							},
							{
								start: new Date("2022", "2", "30", "10", "0"),
								end: new Date("2022", "4", "33", "12", "0"),
								title: "Auftrag",
								type: "Type07",
								pic: "sap-icon://sap-ui5",
								tentative: false,
								place: ""
							}
						],
						headers: [
							{
								start: new Date("2022", "0", "15", "8", "0"),
								end: new Date("2022", "0", "15", "10", "0"),
								title: "Deneme 03",
								type: "Type06"
							},
							{
								start: new Date("2022", "0", "15", "13", "0"),
								end: new Date("2022", "0", "15", "14", "0"),
								title: "Deneme 01",
								type: "Type06"
							},
							{
								start: new Date("2022", "0", "14", "10", "0"),
								end: new Date("2022", "0", "14", "11", "0"),
								title: "Deneme 02",
								type: "Type10",
								tentative: false
							},
							{
								start: new Date("2022", "1", "1", "0", "0"),
								end: new Date("2022", "1", "30", "23", "59"),
								title: "Abwesenheit",
								type: "Type10",
								tentative: false
							}
						]
					},
						{
							
							Pernr: "90007601",
							Vkorg: "0097",
							Lastname: "Giannotta",
							Firstname: "",
							pic: "https://images.pexels.com/photos/1181552/pexels-photo-1181552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
							role: "team member",
							appointments: [
								{
									start: new Date("2022", "8", "14", "8", "00"),
									end: new Date("2022", "8", "14", "9", "10"),
									title: "Auftrag",
									info: "Online meeting",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "0", "9", "10", "0"),
									end: new Date("2022", "0", "13", "12", "0"),
									title: "Auftrag",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "7", "1", "0", "0"),
									end: new Date("2022", "7", "31", "23", "59"),
									title: "Urlaub",
									info: "out of office",
									type: "Type04",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "7", "11", "9", "0"),
									end: new Date("2022", "7", "11", "10", "0"),
									title: "Auftrag",
									type: "Type06",
									place: ""
								},
								{
									start: new Date("2022", "7", "15", "16", "30"),
									end: new Date("2022", "7", "15", "18", "00"),
									title: "Private appointment",
									type: "Type06",
									place: ""
								}
							]
						},
						{
							
							Pernr: "90007602",
							Vkorg: "0097",
							Lastname: "Strauss",
							Firstname: "",
							pic: "https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/teamCalendar/webapp/images/John_Miller.png",
							// pic: "sap-icon://employee",
							// name: "Max Mustermann",
							// role: "team member",
							appointments: [
								{
									start: new Date("2022", "8", "15", "08", "30"),
									end: new Date("2022", "8", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "14", "10", "0"),
									end: new Date("2022", "8", "14", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: "Berlin"
								},
								{
									start: new Date("2022", "8", "14", "13", "00"),
									end: new Date("2022", "8", "14", "16", "00"),
									title: "Abwesenheit",
									info: "online",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Vacation",
									info: "out of office",
									type: "Type08",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "0", "17", "1", "0"),
									end: new Date("2022", "0", "18", "22", "0"),
									title: "Büro",
									info: "regular",
									type: "Type08",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "1", "14", "11", "0"),
									end: new Date("2022", "1", "14", "14", "00"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{
							Pernr: "90007603",
							Vkorg: "0097",
							Lastname: "Comer",
							Firstname: "",
							pic: "https://images.squarespace-cdn.com/content/v1/556c353ae4b0c3683a9f96fc/1599564461038-9K469BTCRTIQS04TR74J/anotherme220820_editsfinal_annamarialanger-802.jpg?format=1000w",
							appointments: [
								{
									start: new Date("2022", "0", "15", "08", "30"),
									end: new Date("2022", "0", "15", "09", "30"),
									title: "Büro",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "0", "15", "10", "0"),
									end: new Date("2022", "0", "15", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "0", "15", "13", "00"),
									end: new Date("2022", "0", "15", "16", "00"),
									title: "Büro",
									info: "online",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "07", "1", "0", "0"),
									end: new Date("2022", "07", "31", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{

							Pernr: "90007604",
							Vkorg: "0097",
							Lastname: "Testen",
							Firstname: "",
							pic: "sap-icon://person-placeholder",
							appointments: [
								{
									start: new Date("2022", "8", "14", "10", "00"),
									end: new Date("2022", "8", "14", "11", "00"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "14", "16", "00"),
									end: new Date("2022", "8", "14", "16", "30"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "14", "13", "00"),
									end: new Date("2022", "8", "14", "16", "00"),
									title: "Büro",
									info: "online",
									type: "Type05",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{
					
							Pernr: "90007605",
							Vkorg: "0097",
							Lastname: "Gianotta",
							Firstname: "Paolo",
							pic: "https://i.pinimg.com/originals/c9/7e/7c/c97e7cd921419193a983dc3aac5050ce.jpg",
							appointments: [
								{
									start: new Date("2022", "8", "15", "08", "30"),
									end: new Date("2022", "8", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "15", "10", "0"),
									end: new Date("2022", "8", "15", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{
							
							Pernr: "90007620",
							Vkorg: "0097",
							Lastname: "van Reede",
							Firstname: "Jan",
							pic: "https://images.pexels.com/photos/32976/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
							appointments: [
								{
									start: new Date("2022", "0", "15", "08", "30"),
									end: new Date("2022", "0", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{

							Pernr: "90007621",
							Vkorg: "0097",
							Lastname: "Mobis",
							Firstname: "Mobsi",
							pic: "sap-icon://person-placeholder",
							appointments: [
								{
									start: new Date("2022", "0", "15", "08", "30"),
									end: new Date("2022", "0", "15", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{

							Pernr: "90007622",
							Vkorg: "0097",
							Lastname: "Geburtsname",
							Firstname: "Antje",
							pic: "https://us.123rf.com/450wm/maridav/maridav1108/maridav110800028/10283044-smiling-happy-businesswoman-portrait-vielpunkt-asiatische-caucasian-business-frau-isoliert-auf-wei%C3%9Fe.jpg?ver=6",
							appointments: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Urlaub",
									info: "out of office",
									type: "Type08",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "2", "13", "9", "0"),
									end: new Date("2022", "2", "17", "10", "0"),
									title: "Büro",
									type: "Type08"
								},
								{
									start: new Date("2022", "03", "10", "0", "0"),
									end: new Date("2022", "05", "16", "23", "59"),
									title: "Urlaub",
									info: "out of office",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "09", "1", "0", "0"),
									end: new Date("2022", "09", "10", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "0", "16", "0", "0"),
									end: new Date("2022", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						},
						
						{
							
							Pernr: "90007637",
							Vkorg: "0097",
							Lastname: "Bijsterbosch",
							Firstname: "Ben",
							pic: "https://i.pinimg.com/originals/2a/53/e1/2a53e1ed5d1485c4839f23b75d0235c5.jpg",
							appointments: [
								{
									start: new Date("2022", "8", "14", "08", "30"),
									end: new Date("2022", "8", "14", "09", "30"),
									title: "Betriebsrat",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "14", "10", "0"),
									end: new Date("2022", "8", "14", "12", "0"),
									title: "Büro",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "14", "13", "00"),
									end: new Date("2022", "8", "14", "16", "00"),
									title: "Betriebsrat",
									info: "online",
									type: "Type02",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "8", "16", "0", "0"),
									end: new Date("2022", "8", "16", "23", "59"),
									title: "Urlaub",
									info: "out of office",
									type: "Type08",
									tentative: false
								},
								{
									start: new Date("2022", "8", "13", "9", "0"),
									end: new Date("2022", "8", "13", "10", "0"),
									title: "Betriebsrat",
									type: "Type08"
								},
								{
									start: new Date("2022", "08", "10", "0", "0"),
									end: new Date("2022", "08", "12", "23", "59"),
									title: "Urlaub",
									info: "out of office",
									type: "Type04",
									tentative: false,
									place: ""
								},
								{
									start: new Date("2022", "08", "1", "0", "0"),
									end: new Date("2022", "08", "5", "23", "59"),
									title: "Abwesenheit",
									type: "Type10",
									tentative: false,
									place: ""
								}
							],
							headers: [
								{
									start: new Date("2022", "8", "16", "0", "0"),
									end: new Date("2022", "8", "16", "23", "59"),
									title: "ApHeaders976",
									type: "Type05"
								}
							]
						}
						
					]
				});
			
			
			return oModel;
			
		},
		
		onInnerContainerResize: function (oEvent) {
/*			var aOldSizes = oEvent.getParameter("oldSizes"),
				aNewSizes = oEvent.getParameter("newSizes"),
				sMessage =  "Inner container is resized.";

			if (aOldSizes && aOldSizes.length) {
				sMessage += "\nOld panes sizes = [" + aOldSizes + "]";
			}

			sMessage += "\nNew panes sizes = [" + aNewSizes + "]";

			MessageToast.show(sMessage);
			

			debugger;
			if (aNewSizes[0]<475 && aNewSizes[0]>450 && avoRowCount>2) {
			  this.getView().byId("Table1").setVisibleRowCount(3);
			} else if (aNewSizes[0]<451 && aNewSizes[0]>425 && avoRowCount>3) {
			  this.getView().byId("Table1").setVisibleRowCount(4);
			} else if (aNewSizes[0]<426 && aNewSizes[0]>400 && avoRowCount>4) {
			  this.getView().byId("Table1").setVisibleRowCount(5);
			} else if (aNewSizes[0]<401 && aNewSizes[0]>375 && avoRowCount>5) {
			  this.getView().byId("Table1").setVisibleRowCount(6);
			} else if (aNewSizes[0]<376 && aNewSizes[0]>350 && avoRowCount>6) {
			  this.getView().byId("Table1").setVisibleRowCount(7);
			} else if (aNewSizes[0]<350 && aNewSizes[0]>325 && avoRowCount>7) {
			  this.getView().byId("Table1").setVisibleRowCount(8);
			} else {
				this.getView().byId("Table1").setVisibleRowCount(avoRowCount);
			}*/
			
			
/*			this.getView().byId("Table1").setVisibleRowCount(oEvent.getSource().getLength());*/
			
		},
		
		// Main Buttons
		onAvominimize: function(oEvent) {
			var button = this.getView().byId("button2");
			if(button.getPressed()){
				var zone1 = this.getView().byId("calenderSplitter");
				zone1.setResizable(false);
				zone1.setSize("100%");
				var zone2 = this.getView().byId("avoSplitter");
				zone2.setSize("0%");
			}
			else {
				var zone1 = this.getView().byId("calenderSplitter");
				zone1.setResizable(true);
				zone1.setSize("70%");
				var zone2 = this.getView().byId("avoSplitter");
				zone2.setSize("30%");
			}

		},
		
		onInsMenuMinimize: function(oEvent) {
			var button = this.getView().byId("button1");
			var zone = this.getView().byId("insLayout");
			if(button.getPressed()){
				zone.setResizable(false);
				zone.setSize("100%");
			}
			else {
				zone.setResizable(false);
				zone.setSize("83%");
			}

		},
		
		onCalendarMaximize: function(oEvent) {
			debugger;
			var button1 = this.getView().byId("button1");
			var button2 = this.getView().byId("button2");
			var button = this.getView().byId("button3");
			var zone = this.getView().byId("insLayout");
			var zone1 = this.getView().byId("calenderSplitter");
			var zone2 = this.getView().byId("avoSplitter");
			if(button.getPressed()){
				zone.setResizable(false);
				zone.setSize("100%");
				zone1.setResizable(false);
				zone1.setSize("100%");
				zone2.setSize("0%");
				

			}
			else {
				zone.setResizable(false);
				zone.setSize("83%");
				zone1.setResizable(true);
				zone1.setSize("70%");
				zone2.setSize("30%");
				
				//setting other buttons' situations
				if(button2.getProperty("pressed")){
					button2.setProperty("pressed", false);
				}
				if(button1.getProperty("pressed")){
					button1.setProperty("pressed", false);
				}
				
				
			}

		},
		
		btnPlanTafel: function(oEvent) {
			
			this.settingsCal4();
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			var cal4 = this.getView().byId("PC1");
			var button1 = this.getView().byId("button8");
			if(button1.getPressed()){
				cal1.setVisible(false);
				cal2.setVisible(false);
				cal3.setVisible(false);
				cal4.setVisible(true);
			}
			else {
				cal1.setVisible(true);
				cal2.setVisible(true);
				cal3.setVisible(true);
				cal4.setVisible(false);
			}

		},
		
		onSettings: function(oEvent) {
			/*MessageToast.show(oEvent.getSource().getId() + " Pressed");*/
			
			var oView = this.getView(),
			    sTitle = "Einstellungen";
			
		
			// create dialog lazily
			if (!this.pDialog) {
				this.pDialog = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.Settings"
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});	
			
			
			
			
			// create fragment
/*			if (!this._pNewAppointmentDialog) {
				this._pNewAppointmentDialog = Fragment.load({
					id: oView.getId(),
					name: "deneme.deneme.fragments.Create",
					controller: this
				}).then(function(oModifyDialog){
					oView.addDependent(oModifyDialog);
					return oModifyDialog;
				});
			}

			this._pNewAppointmentDialog.then(function(oModifyDialog){
				this._arrangeDialog(sTitle, oModifyDialog);
			}.bind(this));*/
			
			
			
			
			
			
			
			

/*			if (!this._pNewSettingsDialog) {
				this._pNewSettingsDialog = Fragment.load({
					id: oView.getId(),
					name: "deneme.deneme.fragments.Settings",
					controller: this
				}).then(function(osettingsDialog){
					oView.addDependent(osettingsDialog);
					return osettingsDialog;
				});
			}

			this._pNewSettingsDialog.then(function(osettingsDialog){
				osettingsDialog.setTitle(sTitle);
				osettingsDialog.open();
				debugger;
				
			}.bind(this));*/
			
			
			
			

		},
		
		onSettingsOk: function(oEvent) {
			
			debugger;
			
			var viewChange = "__view";
			
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			
			var settingsItem1 = this.getView().byId("firstDayOfWeek").getSelectedItem();
			var firstDay = settingsItem1.getText();
			
			var settingsItem2 = this.getView().byId("selectView").getSelectedItem();
			/*var settingsItem3 = this.getView().byId("SEL2").getSelectedItem();*/
			/*var settingsItem4 = this.getView().byId("SEL3").getSelectedItem();*/
			var settingsItem5 = this.getView().byId("TP1").getLastValue().substring(0,2);
			var settingsItem6 = this.getView().byId("TP2").getLastValue().substring(0,2);
			
			
			cal1.setFirstDayOfWeek(parseInt(settingsItem1.getKey()));
			viewChange = viewChange + settingsItem2.getKey();
			cal1.setSelectedView(viewChange);
			cal1.setStartHour(parseInt(this.getView().byId("TP1").getLastValue().substring(0,2)));
			cal1.setEndHour(parseInt(this.getView().byId("TP2").getLastValue().substring(0,2)));
			
			debugger;
			
			
			this.handleDialogCancelButton1();
			
		},
		
		onSelectInspectors: function(oEvent) {
			
			debugger;
			
			var oView = this.getView();
		
			
			// create dialog lazily
			if (!this.pDialog2) {
				this.pDialog2 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.InspectorSelect"
				});
			} 
			this.pDialog2.then(function(oDialog2) {
				oDialog2.open();
			});	
			
			
		},
		
		onInspectorSelectOk: function(oEvent) {
			
		},
		
		
		// Normal Calendar Drag Drop
		handleAppointmentDrop: function (oEvent) {
			debugger;
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				bCopy = oEvent.getParameter("copy"),
				sAppointmentTitle = oAppointment.getTitle(),
				oModel = this.getView().getModel(),
				oNewAppointment;

			if (bCopy) {
				oNewAppointment = {
					title: sAppointmentTitle,
					icon: oAppointment.getIcon(),
					text: oAppointment.getText(),
					type: oAppointment.getType(),
					startDate: oStartDate,
					endDate: oEndDate
				};
				oModel.getData().appointments.push(oNewAppointment);
				oModel.updateBindings();
			} else {
				oAppointment.setStartDate(oStartDate);
				oAppointment.setEndDate(oEndDate);
			}

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been " + (bCopy ? "create" : "moved")
			);
		},

		handleAppointmentResize: function (oEvent) {
			var oAppointment = oEvent.getParameter("appointment"),
				oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				sAppointmentTitle = oAppointment.getTitle();

			oAppointment.setStartDate(oStartDate);
			oAppointment.setEndDate(oEndDate);

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been resized"
			);
		},

		handleAppointmentCreateDnD: function(oEvent) {
			var oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				sAppointmentTitle = "New Appointment",
				oModel = this.getView().getModel(),
				oNewAppointment = {
					title: sAppointmentTitle,
					startDate: oStartDate,
					endDate: oEndDate
				};

			oModel.getData().appointments.push(oNewAppointment);
			oModel.updateBindings();

			MessageToast.show("Appointment with title \n'"
				+ sAppointmentTitle
				+ "'\n has been created"
			);
		},
		
		
		
/*		onDragStart: function (oEvent) {
			// overlay magic from sap.m.PlanningCalendar in order to enable the target PlanningCalendar to recognize the dragcontrol as a valid drag source
			var fnHandleAppsOverlay = function () {
					var $CalendarRowAppsOverlay = jQuery(".sapUiCalendarRowAppsOverlay");
		
					setTimeout(function () {
						$CalendarRowAppsOverlay.addClass("sapUiCalendarRowAppsOverlayDragging");
					}, 0);
		
					jQuery(document).one("dragend", function () {
						$CalendarRowAppsOverlay.removeClass("sapUiCalendarRowAppsOverlayDragging");
					});
				};
			fnHandleAppsOverlay();
			
			
				// provide the dragged control with start and end data along with getter functions
	var oDragSession = oEvent.getParameter("dragSession");
	var oPseudoAppointment = oDragSession.getDragControl();
	var oStartDate = new Date();
	var oEndDate = new Date(oStartDate);
	debugger;
	oEndDate.setHours(oStartDate.getHours() + oPseudoAppointment.getBindingContext().getProperty("duration"));
	oPseudoAppointment.startDate = oStartDate;
	oPseudoAppointment.endDate = oEndDate;
	oPseudoAppointment.title= oPseudoAppointment.getBindingContext().getProperty("name");
	oPseudoAppointment.getStartDate = function() {
		return oPseudoAppointment.startDate;
		};
	oPseudoAppointment.getEndDate = function() {
		return oPseudoAppointment.endDate;
		};
	oPseudoAppointment.getTitle = function() {
		return oPseudoAppointment.title;
		};
			
			
			

		},*/
		
/*		
		onListPlanningCalendarDrop: function(oEvent) {
						debugger;
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
			var oBindingContext = pcRow.getBindingContext("calendarModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");
			

		},
	
		onListPlanningCalendardragStart: function(oEvent) {
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRow = oEvent.getParameter("target");
			debugger;
			var oContextBinding = oDraggedRow.getBindingContext("listModel").getObject();
			oDragSession.setComplexData("onListDragContext", oDraggedRow);
		},*/
		
		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
			console.log("Drag Started");
			
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			
			
/*			oEvent.getParameter("target").getBindingContext(); // Path = sPath : "/Tasks/2"
			oEvent.getParameter("target").getBindingContext().getObject(); // object*/
			console.log(oEvent.getParameter("target").getBindingContext().getObject());
			
			draggedObject = oEvent.getParameter("target").getBindingContext().getObject();
			draggedObjectNo = oEvent.getParameter("target").getBindingContext().getObject("Meldungen"); // Meldungen no : '001000038709'
			
			
		},
		
		onDropTable2: function(oEvent) {
			console.log("Drag End");
			
			
			var cal1 = this.getView().byId("SPC1");
			var cal2 = this.getView().byId("SPC2");
			var cal3 = this.getView().byId("SPC3");
			
			debugger;
			
			
			var oDraggable = oEvent.getParameter("draggedControl");
			var oDroppable = oEvent.getParameter("droppedControl");
			
		},
		
		onDropTable1: function(oEvent) {
			debugger;
			console.log("Drop Started");
			
			var oDroppedControl = oEvent.getParameter("droppedControl");
			var oDragSession = oEvent.getParameter("dragSession");
			var cliId = oDroppedControl.getId();
			var rowId = cliId.replace("-CLI", "");
			var pcRow = sap.ui.getCore().byId(rowId);
/*			var oBindingContext = pcRow.getBindingContext("calendarModel");
			var resourceObj = oBindingContext.getObject();
			var oDraggedRowContext = oDragSession.getComplexData("onListDragContext");*/
			
			var resourceObj = draggedObject;
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			
			var cal1111 = this.getView().byId("SPC1");
			var app1111 = this.getView().byId("asdqwe");
			
			viewId = rowId.slice(-4);
			
			
			var oStartDate = oEvent.getParameter("startDate"),
				oEndDate = oEvent.getParameter("endDate"),
				sAppointmentTitle = "New Appointment",
				oModel = this.getView().getModel(),
				oNewAppointment = {
					title: sAppointmentTitle,
					startDate: oStartDate,
					endDate: oEndDate
				};
			
			
			
			
			debugger;
			this.handleDropAppCreate();
			
		},
		
		
		handleAppointmentCreate: function (oEvent) {

			debugger;
			var idTxt = oEvent.getSource().getParent().getParent().getId();
			viewId = "";
			debugger;
			if (idTxt.includes("SPC1")) {
			  viewId = "SPC1";
			} else if (idTxt.includes("SPC2")) {
			  viewId = "SPC2";
			} else if (idTxt.includes("SPC3")) {
			  viewId = "SPC3";
			} else {
			  viewId = "PC1";
			}

			// viewId come 4 char but general Planing Clander is 3 TODO
			droppedOrNot = false;

			this._createInitialDialogValues(this.getView().byId(viewId).getStartDate());
		},
		
		handleDropAppCreate: function () {
			
			droppedOrNot = true;
			
			this._createInitialDialogValues(this.getView().byId(viewId).getStartDate());
		},
		
		
		
		_createInitialDialogValues: function (oDate) {
			var oStartDate = new Date(oDate),
				oEndDate = new Date(oStartDate);

			oStartDate.setHours(this._getDefaultAppointmentStartHour());
			oEndDate.setHours(this._getDefaultAppointmentEndHour());
			this.sPath = null;

			this._arrangeDialogFragment("[PFW] Neuer Termin Anlagen"); // Title = Create Appointment 
		},
		
		// default Appointment start and end hours 
		_getDefaultAppointmentStartHour: function() {
			return 9;
		},

		_getDefaultAppointmentEndHour: function() {
			return 10;
		},
		
		_arrangeDialogFragment: function (sTitle) {
			var oView = this.getView();

			if (!this._pNewAppointmentDialog) {
				this._pNewAppointmentDialog = Fragment.load({
					id: oView.getId(),
					name: "deneme.deneme.fragments.Create",
					controller: this
				}).then(function(oModifyDialog){
					oView.addDependent(oModifyDialog);
					return oModifyDialog;
				});
			}

			this._pNewAppointmentDialog.then(function(oModifyDialog){
				this._arrangeDialog(sTitle, oModifyDialog);
			}.bind(this));
		},
	
		_arrangeDialog: function (sTitle, oModifyDialog) {
			this._setValuesToDialogContent();
			oModifyDialog.setTitle(sTitle);
			
			oModifyDialog.open();
			
			debugger;

			if(droppedOrNot == false) {
			var oModel = new JSONModel("localService/mockdata/mockJson1.json");
//var oModel = new JSONModel("test-resources/sap/ui/table/demokit/sample/TreeTable/HierarchyMaintenanceJSONTreeBinding/Clothing.json");
			this.getView().setModel(oModel);
			this._aClipboardData = [];
			} else if (droppedOrNot == true) {
			var oModel2 = new JSONModel("localService/mockdata/mockJson2.json");
			this.getView().setModel(oModel2);
			this._aClipboardData = [];
			}
			
			
			
			//setting model for new appointment details
			// get the path to the JSON file
//			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/mockJson1.json"); 
			// initialize the model with the JSON file
//			var oModel = new JSONModel(sPath);
			// set the model to the view
//			this.getView().setModel(oModel, "jsonFile");
			//this.byId("TreeTableBasic").setModel(oModel, "jsonFile");
			
			debugger;

			

		},
		
		_setValuesToDialogContent: function () {
			/*var bAllDayAppointment = (this.byId("allDay")).getSelected(),
				sStartDatePickerID = bAllDayAppointment ? "DPStartDate" : "DTPStartDate",
				sEndDatePickerID = bAllDayAppointment ? "DPEndDate" : "DTPEndDate",
				oTitleControl = this.byId("appTitle"),
				oTextControl = this.byId("moreInfo"),
				oTypeControl = this.byId("appType"),
				oStartDateControl = this.byId(sStartDatePickerID),
				oEndDateControl = this.byId(sEndDatePickerID),
				oContext,
				oContextObject,
				oSPCStartDate,
				sTitle,
				sText,
				oStartDate,
				oEndDate,
				sType;


			if (this.sPath) {
				oContext = this.byId("detailsPopover").getBindingContext();
				oContextObject = oContext.getObject();
				sTitle = oContextObject.title;
				sText = oContextObject.text;
				oStartDate = oContextObject.startDate;
				oEndDate = oContextObject.endDate;
				sType = oContextObject.type;
			} else {
				sTitle = "";
				sText = "";
				oSPCStartDate = this.getView().byId("SPC1").getStartDate();
				oStartDate = new Date(oSPCStartDate);
				oStartDate.setHours(this._getDefaultAppointmentStartHour());
				oEndDate = new Date(oSPCStartDate);
				oEndDate.setHours(this._getDefaultAppointmentEndHour());
				sType = "Type01";
			}

			oTitleControl.setValue(sTitle);
			oTextControl.setValue(sText);
			oStartDateControl.setDateValue(oStartDate);
			oEndDateControl.setDateValue(oEndDate);
			oTypeControl.setSelectedKey(sType);*/
		},
		
		//Fragment's Cancel Buttons;
		handleDialogCancelButton: function (oEvent) {
			debugger;
			this.byId("modifyDialog").close();
			
		},
		
		handleDialogCancelButton1: function (oEvent) {
			debugger;
			this.byId("settingsDialog").close();
			
		},
		
		handleDialogCancelButton2: function (oEvent) {
			debugger;
			this.byId("inspectorsDialog").close();
			
		},
		
		
		onCollapseAll: function (oEvent) {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},

		toggleFullDay: function (oEvent) {
			
			debugger;
			var idTxt = oEvent.getSource().getParent().getParent().getId();
			var viewId2 = "";
			debugger;
			if (idTxt.includes("SPC1")) {
			  viewId2 = "SPC1";
			} else if (idTxt.includes("SPC2")) {
			  viewId2 = "SPC2";
			} else if (idTxt.includes("SPC3")) {
			  viewId2 = "SPC3";
			} else {
			  viewId2 = "PC1";
			}
			
			var oSPC = this.getView().byId(viewId2);
			oSPC.setFullDay(!oSPC.getFullDay());
		},
		
		// Button events for AVO
		
		onSort : function(oColumn) {
			
			debugger;
			
			
		    var oTable = oColumn.getSource();
		    var oColumn = oColumn.getParameter("column");
		
		    var oSorter = new sap.ui.model.Sorter(oColumn.getSortProperty(), false);
		    
		    oTable.getBinding("rows").sort(oSorter);
		
		    for ( var i = 0; i < oTable.getColumns().length; i++) {
		        oTable.getColumns()[i].setSorted(false);
		    }
		    oColumn.setSorted(true);
		                
		    // run custom code
		},
		
		onColumnSelect: function(oEvent) {
			var oCurrentColumn = oEvent.getParameter("column");
			
			//var oImageColumn = this.byId("image");
			//if (oCurrentColumn === oImageColumn) {
			//	MessageToast.show("Column header " + oCurrentColumn.getLabel().getText() + " pressed.");
			//}
			
			debugger;
			
			console.log("Column header " + oCurrentColumn.getLabel().getText() + " pressed.");
			
				selectedColumn = oCurrentColumn.getSortProperty();
			
		},
		
		onSelectAll: function(oEvent) {
			this.byId("Table1").selectAll();
		},
		
		clearSelection: function(oEvent) {
			this.byId("Table1").clearSelection();
		},
		
		onSort1: function(oEvent) {

			debugger;
			var oView = this.getView();
			var oTable = oView.byId("Table1");
			var oListBinding = oTable.getBinding();
			
/*			var sortedCols = oTable.getSortedColumns();
			for (var i = 0, l = sortedCols.length; i < l; i++) {
		      if (!(sortedCols[i].getProperty("sortProperty") == selectedColumn)) {
		        
		        oListBinding.aSorters = null;
				oListBinding.sSortParams = null;
		        
		        
		        
		        oTable.getSortedColumns().slice(0, sortedCols.length);
		      	oTable.getBinding().sort(null);
		       //var allSorts = oTable.getBinding("rows").aSorters;
		        //oTable.getBinding("rows").aSorters.splice(0, allSorts.length);
		        oTable.getSortedColumns()[i].setSorted(false);
		      }
		    }*/
		    

				var oCategoriesColumn = oView.byId(selectedColumn);
				oTable.sort(null);
				oTable.sort(oCategoriesColumn, this._bSortColumnDescending ? SortOrder.Descending : SortOrder.Ascending, /*extend existing sorting*/true);
				this._bSortColumnDescending = !this._bSortColumnDescending;	

			//oTable.sort(oView.byId(selectedColumn), SortOrder.Descending);
			
		},

		
		onAVOSearch: function(oEvent) {

			debugger;
			
			var oView = this.getView();

			// create dialog lazily
			if (!this.pDialog3) {
				this.pDialog3 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.AVOSearch"
				});
			} 
			this.pDialog3.then(function(oDialog3) {
				oDialog3.open();
			});	

		},
		
		searchFieldColumnSelect: function(oEvent) {
			sSearchField = oEvent.getParameters().selectedItem.getText();;
		},
		
		onAVOSearchOk: function(oEvent) {
			
			debugger;
			var oView = this.getView(),
			sValue = oView.byId("searchField").getValue(),
			// sField = oView.byId("columnSelect").getValue() = sSearchfield
			
			sField = this.getSField();
			var oFilter = new Filter(sField, FilterOperator.Contains, sValue);
			
			oView.byId("Table1").getBinding("rows").filter(oFilter, FilterType.Application);
			
/*			oFilter = new Filter("LastName", FilterOperator.Contains, sValue);
			oView.byId("peopleList").getBinding("items").filter(oFilter, FilterType.Application);*/
			
			this.handleDialogCancelButton3();
			
		},
		
		getSField: function() {
		
			var clomnName;
			
			switch (sSearchField) {
			  case "Service Pos.":
			    clomnName = "Service Pos.";
			    break;
			  case "Beschreibung":
			    clomnName = "Beschreibung";
			    break;
			  case "Langtext":
			     clomnName = "Langtext";
			    break;
			  case "Equipment":
			    clomnName = "Equipment";
			    break;
			  case "Equipment Bezeichnung":
			    clomnName = "Equipment Bezeichnung";
			    break;
			  case "Objectart":
			    clomnName = "Objectart";
			    break;
			  case "Material":
			    clomnName = "Material";
			    break;
			  case "Material Bezeichnung":
			    clomnName = "Material Bezeichnung";
			    break;
			  case "Meldungstatus":
			    clomnName = "Meldungstatus";
			    break;
			  case "Absagegrund":
			    clomnName = "Absagegrund";
			    break;
			  case "Extratime":
			    clomnName = "Extratime";
			    break;
			  case "Stdtime":
			    clomnName = "Stdtime";
			    break;
			  case "Vormerkung":
			    clomnName = "Vormerkung";
			    break;
			  case "Vorgemerkt":
			    clomnName = "Vorgemerkt";
			}
			
			return clomnName;
			
		},
		

		handleDialogCancelButton3: function (oEvent) {
			debugger;
			this.byId("AVOSearch").close();
		},
		
		onRoute: function (evt) {
			URLHelper.redirect("https://www.google.com/maps/", true);
		},
		
		onRefreshTableAVO: function (oEvent){
			debugger;
			var asd = this.byId("Table1");
			
			this.fillAVO();
			
		},
		
		onListViewAVO: function(oEvent) {
			
			this.openPopUpListView();
			var that = this;
			this.fillTableListView(that);
			
			
/*			$.when(this.openPopUpListView()).then(function() {
				
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/AVO.json"); 
			var oModel2 = new JSONModel(sPath);

			// set the model to the view
			that.getView().setModel(oModel2, "jsonFile");
			debugger;
			//var oTable2 = this.byId("Table2");
			var oTable2 =  that.getView().byId("Table2");
			that.getView().byId("Table2").setModel(oModel2);
				
			});*/
			
			
			//setTimeout(this.fillTableListView(this), 10);
			//setTimeout(this.fillTableListView().bind(this), 1000);
/*			this.fillTable();*/
		},
		
		// this method for filling datas before clicking (Bu method olmaz ve baslangicta cagrilmazsa datalari dolduramiyor!!!)
		createPopUpListView: function (){
			debugger;
			var oView = this.getView();

			// create dialog lazily
			if (!this.pDialog4) {
				this.pDialog4 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.ListViewAVO"
				});
			} 
			this.pDialog4.then(function(oDialog4) {
			});
		},
		
		openPopUpListView: function (){
			
			debugger;
			var oView = this.getView();

			// create dialog lazily
			if (!this.pDialog4) {
				this.pDialog4 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.ListViewAVO"
				});
			} 
			this.pDialog4.then(function(oDialog4) {
				oDialog4.open();
			});	
		},
		
		fillTableListView: function (asdqwe){
			
			debugger;
						//		*************************************************************************
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/AVO.json"); 
			// initialize the model with the JSON file
			
			var oModel2 = new JSONModel(sPath);

			
			// set the model to the view
			asdqwe.getView().setModel(oModel2, "jsonFile");
			debugger;
			var oTable2 = asdqwe.byId("Table2");
			//var oTable2  = sap.ui.getCore().byId("Table2");
			oTable2.setModel(oModel2);
			//var oTable2 =  asdqwe.getView().byId("Table2");
			//asdqwe.getView().byId("Table2").setModel(oModel2);
			//this.byId("Table2").setModel(oModel2);
			//		****************************************************************************
		},
		
		handleDialogCancelButton4: function () {
			debugger;
			this.byId("ListViewAVO").close();
		},
		
		onBook1: function (){

			var tb = this.getView().byId("Table1");
			var rowid = tb.getSelectedIndices();
			
			for (let i = 0; i < rowid.length; i++) {
				var selectedRowProperty = tb.getRows()[rowid[i]].getCells()[11].getProperty("name");
				if (selectedRowProperty == "sap-icon://SAP-icons-TNT/block") {
				    tb.getRows()[rowid[i]].getCells()[11].setProperty("name", "sap-icon://BusinessSuiteInAppSymbols/icon-3d");
					tb.getRows()[rowid[i]].getCells()[12].setText("FASAN");
				} else {
				  	tb.getRows()[rowid[i]].getCells()[11].setProperty("name", "sap-icon://SAP-icons-TNT/block");
					tb.getRows()[rowid[i]].getCells()[12].setText("");
				}
				

			}
			
		},
		
		onBook2: function (oEvent){
			debugger;
			var tb = this.getView().byId("Table1");
			var cellObject = oEvent.getSource().getBindingContext().getObject();
			
			var rowidTxt = oEvent.getSource().getParent().getRowBindingContext().getPath();
			rowidTxt = rowidTxt.slice(7);
			var rowid = parseInt(rowidTxt);
			
			
			var selectedRowProperty = tb.getRows()[rowid].getCells()[11].getProperty("name");
			
			
			if (selectedRowProperty == "sap-icon://SAP-icons-TNT/block") {
				    tb.getRows()[rowid].getCells()[11].setProperty("name", "sap-icon://BusinessSuiteInAppSymbols/icon-3d");
					tb.getRows()[rowid].getCells()[12].setText("FASAN");
				} else {
				  	tb.getRows()[rowid].getCells()[11].setProperty("name", "sap-icon://SAP-icons-TNT/block");
					tb.getRows()[rowid].getCells()[12].setText("");
				}
			
		},
		
		createPopUpCancelTask: function (){
			debugger;
			var oView = this.getView();

			// create dialog lazily
			if (!this.pDialog5) {
				this.pDialog5 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.CancelTask"
				});
			} 
			this.pDialog5.then(function(oDialog5) {
			});
		},
		
		openPopUpCancelTask: function (){
			
			var tb = this.getView().byId("Table1");
			var rowid = tb.getSelectedIndices();
			debugger;
			if(rowid.length == 0) {
				this.onInfoMessageBoxPress();
			}
			else {
			
			var sPath = jQuery.sap.getModulePath("deneme.deneme", "/localService/mockdata/CancelReasons.json"); 
			var oModel3 = new JSONModel(sPath);
			// set the model to the view
			this.getView().setModel(oModel3, "jsonFile");
			debugger;
			var oSelection = this.byId("cancelReasonSelect");
			//var oTable2  = sap.ui.getCore().byId("Table2");
			oSelection.setModel(oModel3);
			
			

			// create dialog lazily
			if (!this.pDialog5) {
				this.pDialog5 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.CancelTask"
				});
			} 
			this.pDialog5.then(function(oDialog5) {
				oDialog5.open();
			});	
			}
		},
		
		handleDialogCancelButton5: function () {
			debugger;
			selectedCancelReason = "";
			this.byId("cancelTaskDialog").close();
		},
		
		onInfoMessageBoxPress: function () {
			/*MessageBox.information("Mindestens eine Zeile auswählen");*/
			
			MessageBox.warning("Mindestens eine Zeile auswählen", {
				actions: [MessageBox.Action.OK],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					//MessageToast.show("Action selected: " + sAction);
				}
			});
			
		},
		
		setCancelReason: function () {
			debugger;
			var oSelection = this.byId("cancelReasonSelect");
			selectedCancelReason = oSelection.getSelectedKey();
		},
		
		onCancelTaskOk: function () {
			var tb = this.getView().byId("Table1");
			var rowid = tb.getSelectedIndices();
			var oldModel = tb.getModel().getData();
			debugger;
    		var sPath = tb.getContextByIndex(rowid).getPath();
    		var oObj = tb.getModel().getObject(sPath);
    		oldModel.Tasks.splice(rowid,1);
    		tb.getModel().refresh();
    		//*****************************************************************************
			// TODO Function is not updating Cancel Reason yet...It should be review  
			//*****************************************************************************
			debugger;
			this.byId("cancelTaskDialog").close();
		},
		
		onRegionSearch: function () {
			// create dialog lazily
			if (!this.pDialog6) {
				this.pDialog6 = this.loadFragment({
					/*id: oView.getId(),*/
					name: "deneme.deneme.fragments.RegionSearch"
				});
			} 
			this.pDialog6.then(function(oDialog6) {
				oDialog6.open();
			});	
			},
		
		handleDialogCancelButton6: function () {
			debugger;
			this.byId("regionSearch").close();
		},
		
		canModifyAppointments: function (){},
		
		
	});
	
});

var _ = Underscore.load();

function onOpen(e) {
  SpreadsheetApp.getUi().createMenu('히스토리 관리')
  .addItem('Checked 히스토리 제거', 'removeCheckedHistory')
  .addToUi();
}

function onEdit(e) {
  var curSheet = e.source.getActiveSheet();  
  ManageSheet = ManageSheet.init(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('manage_sheet'));
  
  var rowObj;
  var sheetConst;
  var dirty = false;
  
  if (curSheet.getName() === CSSheet.sheetName) {
    sheetConst = CSSheet;
  } else if (curSheet.getName() === WorkResultSheet.sheetName) {
    sheetConst = WorkResultSheet;
  } else {
    return;
  }
  
  HistorySheet = HistorySheet.init(sheetConst.historySheetName);
  
  var actRow =  curSheet.getActiveRange().getRow();
  var actCol =  curSheet.getActiveRange().getColumn();
  
  if (actRow <= 2 || actCol === 1) {
    // Header or Example is changed, or No is changed
    return;
  }
  
  // get rowObject
  rowObj = SheetUtils.objectifyRow(curSheet, actRow);
  
  Logger.log("Before process: %s", JSON.stringify(rowObj));
  // check new or already exist one  
  
  // if new
  if (isNew(rowObj)) {
    // validate
    if (validateRow(sheetConst, rowObj)) {
      // update traceability and fill auto field  
      autoComplete(sheetConst, rowObj);
      HistorySheet.addHistory(rowObj, 'New');
      dirty = true;
    }
  } else {
    // else already exist one
    // validate
    if (validateRow(sheetConst, rowObj)) {
      // update traceability
      updateTraceability(rowObj);
      HistorySheet.addHistory(rowObj, 'Modify', e.oldValue, actCol);
      dirty = true;
    }

  }
  Logger.log("After process: %s", JSON.stringify(rowObj));
             
  // write to spreadsheet
  if (dirty) {
    rowObj.range.setValues(SheetUtils.datifyHeadlessObject(rowObj));
  }
}

function autoComplete(sheetConst, rowObj) {
  sheetConst.autoComplete(rowObj);
  updateTraceability(rowObj);
}

function updateTraceability(rowObj) {  
  rowObj['최종수정시각'] = new Date();
  rowObj['최종작성자'] = getCurrentUserEmail();
}

function isEmpty(rowObj, colName) {
  return rowObj[colName] === '' || rowObj[colName] === undefined; 
}

function isNew(rowObj) {
  return _.any(['No', '최종수정시각', '최종작성자'], function(colName) {
    return isEmpty(rowObj, colName);
  });
}

function validateRow(sheetConst, rowObj) {
  return sheetConst.essentialCols.reduce(function(prev, colName) {
    Logger.log("colName: %s, value:%s", colName, rowObj[colName]);
    var range = SheetUtils.getRangeForProperty(rowObj, sheetConst, colName)
    if (isEmpty(rowObj, colName)) {
      range.setNote(colName + ' 작성필요.');
      return false;
    } else {
      range.clearNote();
      return prev;
    }
  }, true);
}

function getCurrentUserEmail() {
  var userEmail = Session.getActiveUser().getEmail();
  if (userEmail === '' || !userEmail || userEmail === undefined) {
    userEmail = PropertiesService.getUserProperties().getProperty('userEmail');
    if (!userEmail) {
      var protection = SpreadsheetApp.getActive().getRange('A3').protect();
      protection.removeEditors(protection.getEditors());
      var editors = protection.getEditors();
      if (editors.length === 2) {
        var owner = SpreadsheetApp.getActive().getOwner();
        editors.splice(editors.indexOf(owner), 1);
      }
      userEmail = editors[0];
      protection.remove();
      PropertiesService.getUserProperties().setProperty('userEmail', userEmail);
    }
  }
  return userEmail;
}

/*******************************************************************************************/
/**
* Unit Tests
**/

function testGetSheetHeader() {
  Logger.log(SheetUtils.getSheetHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('2019_작업내역')));
}

function testGetEditedRowData() {
  Logger.log(SheetUtils.getEditedRowData( SpreadsheetApp.getActiveSpreadsheet().getSheetByName('2019_작업내역'), 4));
}

function testObjectifyData() {
  var headers = SheetUtils.getSheetHeader(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('2019_작업내역'));
  var headerIndexes = SheetUtils.indexifyHeaders(headers);
  var data = SheetUtils.datifyRow( SpreadsheetApp.getActiveSpreadsheet().getSheetByName('2019_작업내역'), 4);
  
  Logger.log(JSON.stringify(SheetUtils.objectifyData(headerIndexes, data)));
}

function testSetNoteOnEssentialField() {
  
  var rowObject = SheetUtils.objectifyRow(CSSheet.sheet, 269);
  var specificColRange = rowObject.range.getCell(1, CSSheet.headerIndexes['표제어'] + 1);
  
  Logger.log(  SheetUtils.getRangeForProperty(rowObject, CSSheet, '표제어').getValue());
  Logger.log(rowObject);
  Logger.log(CSSheet.headerIndexes);
  Logger.log(specificColRange.getValue());
  
  
  // check validate
  var validated = validateRow(CSSheet, rowObject);
  
  Logger.log(validated);
}

function testIsNew() {
  var rowObject = SheetUtils.objectifyRow(CSSheet.sheet, 269);
  Logger.log(isNew(rowObject));
  
}

function testDatifyHeadlessObject() {
  var rowObject = SheetUtils.objectifyRow(CSSheet.sheet, 269);
  updateTraceability(rowObject);
  var data =  SheetUtils.datifyHeadlessObject(rowObject)
  Logger.log(data);
  
  rowObject.range.setValues(data);  
}
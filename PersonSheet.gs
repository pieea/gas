/**
* constants for 인물명 수정검토 sheet
* @namespace
*/
var PersonSheet = (function(ns) {
  ns.sheetName = '인물명 수정검토';
  
  ns.historySheetName = ns.sheetName + '_히스토리';
  
  ns.essentialCols = [];
  
  ns.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ns.sheetName);
  
  ns.headerIndexes = SheetUtils.indexifyHeaders(SheetUtils.getSheetHeader(ns.sheet));
  
  return ns;
  
})(PersonSheet || {});

function testPersonSheet() {
  Logger.log(PersonSheet.sheet.getName());
}
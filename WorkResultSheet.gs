/**
* constants for 작업내역 sheet
* @namespace
*/
var WorkResultSheet = (function(ns) {
  ns.sheetName = '2019_작업내역';
  
  ns.historySheetName = ns.sheetName + '_히스토리';
  
  ns.essentialCols = ['ID', '표제어', '업무구분', '완료일'];
  
  ns.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ns.sheetName);
  
  ns.headerIndexes = SheetUtils.indexifyHeaders(SheetUtils.getSheetHeader(ns.sheet));
  
  
  ns.autoComplete = function(rowObj) {
    var now = new Date();
    // No 자동완성
    rowObj['No'] = ManageSheet.getLastWorkNo() + 1;
    
    if (rowObj['구축월'] === '' || rowObj['구축월'] === undefined) {
      // 구축월 자동입력
      rowObj['구축월'] = now;
    }
    
    // TODO: 관련CS No 입력 시 의뢰일, 마감일 자동입력
  };
  
  return ns;
}) (WorkResultSheet || {});

function testWorkResultSheet() {
  Logger.log(WorkResultSheet.sheet.getName()); 
}
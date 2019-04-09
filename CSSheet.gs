/**
* constants for CS유입건 sheet
* @namespace
*/
var CSSheet = (function(ns) {
  ns.sheetName = 'CS유입건';
  
  ns.historySheetName = ns.sheetName + '_히스토리';
  
  ns.essentialCols = ['docid', '표제어', '사용자의견(@사용자)'];
  
  ns.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ns.sheetName);
  
  ns.headerIndexes = SheetUtils.indexifyHeaders(SheetUtils.getSheetHeader(ns.sheet));
  
  ns.autoComplete = function(rowObj) {
    var now = new Date();
    // No 자동완성
    rowObj['No'] = ManageSheet.getLastCSNo() + 1;
    
    if (rowObj['처리상태'] === '' || rowObj['처리상태'] === undefined) {
      // 처리상태 자동입력
      rowObj['처리상태'] = '검토요청';
    }
    
    // 의뢰일 자동입력
    if (rowObj['의뢰일(CS 유입일)'] === '' || rowObj['의뢰일(CS 유입일)'] === undefined) {      
      rowObj['의뢰일(CS 유입일)'] = now;
    }
    
    // 마감일 자동입력
    if (rowObj['마감일(CS처리 희망일)'] === '' || rowObj['마감일(CS처리 희망일)'] === undefined) {
      var MILLIS_PER_WEEK = 1000 * 60 * 60 * 24 * 7; 
      rowObj['마감일(CS처리 희망일)'] = new Date(now.getTime() + MILLIS_PER_WEEK);
    }
  };  
  
  return ns;
  
})(CSSheet || {});

function testCSSheetSHEET() {
  Logger.log(CSSheet.sheet.getName());
}
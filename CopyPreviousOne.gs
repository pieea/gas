var _ = Underscore.load();
function copyDEditorSheetToThisOne() {
 var prevSpreadSheet =  SpreadsheetApp.openById("1Y593ic0IbfUS4h1kxnjDeK8URPW-cz--EK4JNfYM990");
 WorkSheetConst.sheetNames.forEach(function(sheetName) {
    copyPreviousWorkSheetToThisWorkSheet(prevSpreadSheet, sheetName);
  });
}

function copyPreviousWorkSheetToThisWorkSheet(prevSheet, sheetName) {
  // get the current spreadSheet
  var thisSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // delete any sheets from previous runs
  var thisSheet = thisSpreadsheet.getSheetByName(sheetName);
  if (thisSheet) {
    thisSpreadsheet.deleteSheet(thisSheet);
  }
  
  // copy a workhistory to this one
  thisSheet = prevSheet.getSheetByName(sheetName).copyTo(thisSpreadsheet);
  
  thisSheet.setName(sheetName);
  
  /**
  * 이전 Sheet에 Traceable 인터페이스 추가를 위해 No, 최종수정시각, 최종작성자 3가지 Column 을 추가함.
  **/
  // 헤더 추출 후 No 존재여부 확인 후 없다면 No 헤더 생성 후 값입력
  if (!_.contains(SheetUtils.getSheetHeader(thisSheet), 'No')) {
    // Add No Column at the first column and fill it.
    thisSheet.insertColumnBefore(1);
    var headers = SheetUtils.getSheetHeader(thisSheet);
    // TODO : 기한 관계상 일단 수동으로 추가하도록 함. ㅋㅋ
  }

}
var _ = _ || Underscore.load();
/**
* library for getting values in 히스토리 sheet
* @namespace
**/
var HistorySheet = Object.create(null, {
  init: {
    value:function(sheetName) {
      this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      return this;
    }
  },
  addHistory: {
    value: function(rowObj, status, oldValue, col) {
      var editRow = this.sheet.appendRow([status].concat(SheetUtils.datifyHeadlessObject(rowObj)[0])).getLastRow();
      var allRange = this.sheet.getDataRange();
      var editRange = this.sheet.getRange(editRow, 1, 1, allRange.getNumColumns());
      Logger.log(editRange.getA1Notation());
      if (status === 'New') {
        // 신규 생성된 이슈일 경우 전체 노란색으로 표기
        Logger.log("add history for New");
        SheetUtils.rangeFill(editRange, 'backgrounds', 'yellow');
      } else if (status === 'Modify') {
        // 수정된 이슈는 수정된 부분에 노란색 표기 후 이전내용 Note 로 표기
        Logger.log("add history for Modify");
        var editCell = editRange.offset(0, col, 1, 1);
        editCell.setNote('이전 값 : ' + oldValue);
        SheetUtils.rangeFill(editCell, 'backgrounds', 'yellow');
      }
      return editRange;
    }
  }
});

function removeCheckedHistory() {
  // 일단 두개만, 2019_작업내역 과 CS유입건 히스토리만
  var historySheets = [SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CSSheet.historySheetName),
                       SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WorkResultSheet.historySheetName)];
  
  var deleteRows = historySheets.map(function(sheet) {
    return _.range(sheet.getDataRange().getLastRow(), 1, -1)
    .map(function(row) { return SheetUtils.objectifyRow(sheet, row); })
    .filter(function(rowObj) { return rowObj['Status'] === 'Checked'; })
    .map(function(checkedObj) { return checkedObj.range.getRow(); })
    .map(function(deleteRowIndex) { return sheet.deleteRow(deleteRowIndex);});
  });  
  Logger.log('deleteRows : ' + deleteRows);
}

/**
* Unit Tests
**/
function beforeTestHistorySheet() {
  HistorySheet = HistorySheet.init(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CS유입건_히스토리'));
  Logger.log(HistorySheet.sheet.getName());
}

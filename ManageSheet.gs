var _ = Underscore.load();

/**
* library for getting values in manage_sheet
* @namespace
**/
var ManageSheet = Object.create(null, {
  init: {
    value:function(sheet) {
      this.sheet = sheet;
      this.range = sheet.getDataRange();
      this.manageObj = SheetUtils.objectifyRange(this.range);
      return this;
    }
  },
  
  getLastCSNo: {
    value:function() {
      return this.manageObj[0]['마지막 CS No'];
    }
  },
  
  getLastWorkNo: {
    value:function() {
      return this.manageObj[0]['마지막 작업내역 No'];
    }
  },
  
  getLastModified: {
    value:function() {
      return this.manageObj[0]['최종수정시각']; 
    }
  },
  
  setLastModified: {
    value:function(date) {
      this.manageObj[0]['최종수정시각'] = date;
      SheetUtils.objectsToRange(this.manageObj, range);
    }
  },
  
  getDefaultWatchers: {
    value:function() {
      return _.pluck(this.manageObj, '기본 Watcher').filter(function(watcher) { return watcher !== ''});
    }
  }  
});



/**
* Unit Tests
**/
function beforeTestManageSheet() {
  ManageSheet = ManageSheet.init(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('manage_sheet')); 
}

function testManageSheetGetLastCSNo() {
  beforeTestManageSheet();
  Logger.log(ManageSheet.getLastCSNo());  
}

function testManageSheetGetDefaultWatchers() {
  beforeTestManageSheet();
  Logger.log(ManageSheet.getDefaultWatchers());  
}

function testManageSheetGetLastModified() {
  beforeTestManageSheet();
  Logger.log(ManageSheet.getLastModified());
}
// LINE Developerのアクセストークン
var access_token = " "
// リプライ先を特定するためのログ管理スプレッドシートID
var spreadsheet_id = " "
// 修行リストのスプレッドシートID
var shugyo_spreadsheet_id = " "
 
/**
 reply
 */
function reply(data) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };
  var text = "";
  var text2 = "";
  
  if (data.events[0].message.text === "修行") {
    // 修行リストスプレッドシートを取得
    var shugyo = SpreadsheetApp.openById(shugyo_spreadsheet_id).getSheetByName("修行リスト");
    // A1セルから入力されている最終行まで一気に取得
    var shugyoData = shugyo.getRange(1, 1, shugyo.getLastRow());
    var shugyoData2 = shugyo.getRange(1, 2, shugyo.getLastRow());
    // ランダムで候補を選ぶ
    // shugyoDataで修行名、shugyoData2で修行の説明
    var intRandomNum = Math.round(Math.random()*shugyo.getLastRow());
    
    text = shugyoData.getValues()[intRandomNum][0];
    text2 = shugyoData2.getValues()[intRandomNum][0];

    var postData = {
      "replyToken" : data.events[0].replyToken,
      "messages" : [
        {
          'type':'text',
          'text':text,
        },
        {
          'type':'text',
          'text':text2,
        }
      ]
    };  
  }
  else {
    text = "「修行」って聞いてみてね。"

    var postData = {
      "replyToken" : data.events[0].replyToken,
      "messages" : [
        {
          'type':'text',
          'text':text,
        },
      ]
    };
  }
 
  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
 
  return UrlFetchApp.fetch(url, options);
}
 
/**
 LINEからのPOST受け取り
 */
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var data = SpreadsheetApp.openById(spreadsheet_id).getSheetByName('log').getRange(1, 1).setValue(json.events);
 
  reply(json);
}

'use strict';


function converSpecialStringInList(inputs) {
  let resultGoodsList = [];
  for(let item of inputs) {
    let obj = splitCharacter(item);
    resultGoodsList.push(obj);
  }
  return resultGoodsList;
}

function splitCharacter(str) {
  let obj = {};
  if(str.indexOf("-") >= 0) {
    obj.barcode = str.split("-")[0];
    obj.num = isFloat(str.split("-")[1]);
  }else {
    obj.barcode = str;
    obj.num = 1;
  }
  return obj;
}

function isFloat(numStr) {
  if(numStr.indexOf(".") >= 0) {
    return parseFloat(numStr);
  }else {
    return parseInt(numStr);
  }
}

function countGoodsList(resultGoodsList) {
  let goodsNumList = [];
  for(let item of resultGoodsList) {
    let sameItemNum = 0;
    resultGoodsList.filter( goods => {
      if(item.barcode === goods.barcode) {
        sameItemNum = sameItemNum + goods.num;
      }
    });
    let obj = Object.assign({},item,{promotions: judgeAttendDiscount(item)});
    obj.num = sameItemNum;
    if(thisArrayContainsThisObj(goodsNumList,obj) === false) {
      goodsNumList.push(obj);
    }
  }
  return goodsNumList;
}

function judgeAttendDiscount(item) {
  let promotionsArray = loadPromotions();
  for(let promotion of promotionsArray) {
    if(promotion.type === "BUY_TWO_GET_ONE_FREE") {
      return promotion.barcodes.includes(item.barcode);
    }
  }
  return false;
}

function receiptList(goodsNumList) {

  return goodsNumList.map(goods => {
    for(let item of loadAllItems()) {
      if(item.barcode === goods.barcode) {
        goods = Object.assign({},item,{num:goods.num},{promotions:goods.promotions});
      }
    }
    if(goods.promotions === true){
      goods.subtotal = (goods.num - (goods.num - goods.num % 3) / 3) * goods.price;
    }else {
      goods.subtotal = goods.num * goods.price;
    }
    goods.freePrice = goods.num * goods.price - goods.subtotal;
    return goods;
  });

}

function totalPriceAndFreePrice(result) {
  let totalPrice = 0;
  let freePrice = 0;
  for (let item of result) {
    totalPrice = item.subtotal + totalPrice;
    freePrice = item.freePrice + freePrice;
  }
  return {totalPrice: totalPrice, freePrice: freePrice};
}

function printReceipt(inputs) {
  let receiptArray = receiptList(countGoodsList(converSpecialStringInList(inputs)));
  let obj = totalPriceAndFreePrice(receiptArray);
  let receiptText = "***<没钱赚商店>收据***\n";
  for(let item of receiptArray) {
    receiptText = receiptText+`名称：${item.name}，数量：${item.num}${item.unit}，单价：${parseFloat(item.price).toFixed(2)}(元)，`
      +`小计：${parseFloat(item.subtotal).toFixed(2)}(元)`+"\n";
  }
  receiptText = receiptText + `----------------------\n总计：${parseFloat(obj.totalPrice).toFixed(2)}(元)\n`
    +`节省：${parseFloat(obj.freePrice).toFixed(2)}(元)\n**********************`;
  console.log(receiptText);
}

function thisArrayContainsThisObj(inputArray,obj) {
  for(let item of inputArray) {
    if(item.barcode === obj.barcode) {
      return true;
    }
  }
  return false;
}

'use strict';

function printReceipt(inputs) {
  let receipt = statisticalPurchaseList(inputs);
  let allPrice = 0;
  let receiptText = "***<没钱赚商店>收据***\n";
  for(let i in receipt) {
    receiptText = receiptText+"名称："+receipt[i].name+"，数量："+receipt[i].count+receipt[i].unit+"，单价："
      +receipt[i].price+"(元)，小计："+parseFloat(receipt[i].subtotal).toFixed(2)+"(元)\n";
    allPrice = allPrice + receipt[i].subtotal;
  }
  receiptText = receiptText + "----------------------\n"+"总计："+parseFloat(allPrice).toFixed(2)+"(元)\n**********************";
  console.log(receiptText);

}

function statisticalPurchaseList(inputs) {
  let result = [];
  for(let i in inputs) {
    let subArray = inputs.filter(function (item) {
        return inputs[i].barcode === item.barcode;
    });
    let obj = {};
    obj.name = inputs[i].name;
    obj.count = subArray.length;
    obj.price = parseFloat(inputs[i].price).toFixed(2) ;
    obj.subtotal = subArray.length * inputs[i].price;
    obj.unit = inputs[i].unit;

    if(contains(result,obj) === false) {
      result.push(obj);
    }
  }
  return result;
}

function contains(inputArray,obj) {
  for(let i = 0; i < inputArray.length; i++) {
    if(inputArray[i].name === obj.name) {
      return true;
    }
  }
  return false;
}

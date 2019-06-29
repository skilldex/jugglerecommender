import {action, configure} from "mobx"

configure({ enforceActions: "always" })
class Utilities{
  @action isEmptyOrSpaces=(str)=>{
    str = str.toString()
    let strEmpty = false
    if (str === null){
      strEmpty = true
    }else if(!str.replace(/\s/g, '').length){
      strEmpty = true
    }
    return strEmpty
  }

  @action isNotOnlyDigits=(str)=>{
      return str.match(/^[0-9]+$/) === null;
  }

  @action isValidTime=(str)=>{
    let isValid = false
    str = str.toString()
    if (str.match(/^[0-9]+$/) === null){
      if (str.match(/^.+:\d+$/)){
        isValid = true
      }
    }else{
      isValid = true
    }
    return isValid
  }

  @action formatSeconds=(str)=>{
    str = str.toString()
    let toReturn
    if (str.includes(":")){
      toReturn = (parseInt(str.split(":")[0])*60)+(parseInt(str.split(":")[1]))
    }else{
      toReturn = parseInt(str)
    }
    if (toReturn === 0){
      toReturn = 1
    }
    return toReturn
  }

  @action sortNumber(a, b) {
    return a - b;
  }

  @action sortObjectByAttribute(data, attr) {
    var arr = [];
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            var obj = {};
            obj[prop] = data[prop];
            if (attr === "random"){
              obj.tempSortName = Math.floor((Math.random() * 1000000));
            }else{
              obj.tempSortName = data[prop][attr];
            }
            arr.push(obj);
        }
    }
    if(attr === "catches"){//If time sorts start acting weird, they should probably be put with catches
      arr.sort(function(a, b) {
          var at = parseInt(a.tempSortName),
              bt = parseInt(b.tempSortName);
          return at > bt ? 1 : ( at < bt ? -1 : 0 );
      });
    }else{
      arr.sort(function(a, b) {
          var at = a.tempSortName,
              bt = b.tempSortName;
          return at > bt ? 1 : ( at < bt ? -1 : 0 );
      });
    }
    return arr;
  }

}

const utilites = new Utilities()

export default utilites
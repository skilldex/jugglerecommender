import {action, configure} from "mobx"

configure({ enforceActions: "always" })
class Utilities{
  @action isEmptyOrSpaces=(str)=>{
      str = toString(str)
      return str === null || str.match(/^ *$/) !== null;
  }

  @action isNotOnlyDigits=(str)=>{
      return str.match(/^[0-9]+$/) === null;
  }

  @action sortObjectByAttribute(data, attr) {
    var arr = [];
    for (var prop in data) {

        if (data.hasOwnProperty(prop)) {
            var obj = {};
            obj[prop] = data[prop];
            obj.tempSortName = data[prop][attr];
            arr.push(obj);
        }
    }

    arr.sort(function(a, b) {
        var at = a.tempSortName,
            bt = b.tempSortName;
        return at > bt ? 1 : ( at < bt ? -1 : 0 );
    });
    return arr;
  }

}

const utilites = new Utilities()

export default utilites
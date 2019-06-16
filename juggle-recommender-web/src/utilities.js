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

}

const utilites = new Utilities()

export default utilites
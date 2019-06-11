import { action, configure, computed, observable, toJS} from "mobx"

configure({ enforceActions: "always" })
class Utilities{
    @action getUsableVideoURL=(userProvidedURL)=>{
      let videoURLtoUse = "notValid"
      if (userProvidedURL.includes("instagram.com")){
          const usefulPart = userProvidedURL.match(new RegExp("(?:/p/)(.*?)(?:/)", "ig"))
          videoURLtoUse = "https://www.instagram.com"+usefulPart+"embed"                                  
      }
      else if(userProvidedURL.includes("youtu")){
        let usefulPart
        if (userProvidedURL.includes("youtube.com/watch")){
          usefulPart = userProvidedURL.split('youtube.com/watch?v=')
          usefulPart = usefulPart[usefulPart.length-1]
          if (usefulPart.includes("&feature=youtu.be")){
            usefulPart = usefulPart.replace("&feature=youtu.be","")
          }
          //https://www.youtube.com/watch?v=Kr8LhLGjyiY            
        }else if (userProvidedURL.includes("youtu.be/")){
          //https://youtu.be/Kr8LhLGjyiY
          usefulPart = userProvidedURL.split('youtu.be/')
          usefulPart = usefulPart[usefulPart.length-1]            
        }
        videoURLtoUse ="https://www.youtube.com/embed/"+usefulPart+
                       "?rel=0&autoplay=1&mute=1&loop=1&playlist="+usefulPart
      }
      return videoURLtoUse
    }
  }


const utilites = new Utilities()

export default utilites
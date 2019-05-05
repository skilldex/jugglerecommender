import React,{Component} from 'react'
import cytoscape from 'cytoscape'
import jugglingLibrary from './jugglingLibrary.js'
class TrickGraph extends React.Component {

 render() {
      

      return <div
        id    = "cy"
        style = {{

          height : '500px',
          width  : '1000px',
          border: '1px solid black',
          textAlign : "left"
        }}
      />
    }

}

export default TrickGraph
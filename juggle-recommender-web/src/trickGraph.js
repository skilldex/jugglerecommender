import React,{Component} from 'react'
import cytoscape from 'cytoscape'
import jugglingLibrary from './jugglingLibrary.js'

class TrickGraph extends React.Component {

    componentDidMount() {
      this.TrickGraphToGraph()
    }

    componentDidUpdate() {
      this.TrickGraphToGraph()
    }

    TrickGraphToGraph = () => {
      const numChecked = Object.keys(this.props.selectedTricks).length
      let edges = []
      let tempNodes = {}
      let trickNamesToKeys = {}
      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
          trickNamesToKeys[jugglingLibrary[trickKey].name] = trickKey
      })
      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
        trick.name = trick.name.replace("-"," ")

        let checkedTrick = this.props.selectedTricks[trickKey]
          || this.props.myTricks.includes(trickKey) && this.selectedList == "myTricks"  
          ? 100 : 0
        if(!tempNodes[trickKey]){
          tempNodes[trickKey]={
            id    : trickKey,
            name : trick.name,
            checked : 0
          }
        }
        if(tempNodes[trickKey].checked != 100 && checkedTrick > 0){
          tempNodes[trickKey].checked = checkedTrick
        }

        if(trick.prereqs){
          trick.prereqs.forEach((prereq, j)=>{
            prereq = prereq.replace("-"," ")
            let prereqKey = trickNamesToKeys[prereq]
            if(!prereqKey){
              prereqKey = prereq
            }
            let checkedPrereq = this.props.selectedTricks[prereqKey]  
              || this.props.myTricks.includes(trickKey) && this.selectedList == "myTricks" 
              ? 100 : 0
            if(checkedPrereq == 100 && tempNodes[trickKey].checked == 0){
              tempNodes[trickKey].checked = 75
            }
            if(!tempNodes[prereqKey]){
              tempNodes[prereqKey]={
                id    : prereqKey,
                name : prereq,
                checked : 0
              }
            }
            if(tempNodes[prereqKey].checked != 100 && checkedPrereq > 0){
              tempNodes[prereqKey].checked = checkedPrereq
            }
            
            if(tempNodes[trickKey].checked  == 100 && !tempNodes[prereqKey].checked){
              tempNodes[prereqKey].checked = 25
            }

            //if((tempNodes[prereqKey].checked && tempNodes[trickKey].checked)||numChecked == 0){
              edges.push({ data: { source: trickKey, target: prereqKey } })
            //}
          })
        }
      })
      const nodes = []
      Object.keys(tempNodes).forEach((trickKey)=>{
        /*if(!tempNodes[trickKey].checked && numChecked > 0){
          return
        }*/
        nodes.push({data:{...tempNodes[trickKey]}})
      })
      this.renderCytoscapeElement({ edges, nodes })
    }

    renderCytoscapeElement = (elements) => {

      this.cy = cytoscape(
      {
        container: document.getElementById('cy'),
        boxSelectionEnabled: false,
        autounselectify: true,
        elements: elements,
        layout: {
          name     : 'cose',
          directed : true,
          nodeRepulsion: function( node ){ return 10048; },
           nodeOverlap: 20,
            // Gravity force (constant)
          gravity: .0005,

          // Maximum number of iterations to perform
          numIter: 1500,
        },
        style: cytoscape.stylesheet()
          .selector('node')
          .css({
            'background-fit'   : 'cover',
            'border-opacity'   : 1,
            'content'          : 'data(name)',
            'text-valign'      : 'center',
            'label'            : 'data(id)',
            'background-color' : 'mapData(checked, 0, 100, cyan, yellow)',
            'font-size'        : 40,
            'width'            : 200,
            'height'            : 200,
            'border'          : 'black'
          })
          .selector('edge')
          .css({
            'width'                   : 8,
            'target-arrow-shape'      : 'triangle',
            'curve-style'             : 'bezier',
            'control-point-step-size' : 0,
            'opacity'                 : 1,
            'arrow-scale'             : 3,
            'color' : 'black'
          }),
      })
      this.cy.on('click', 'node', function(evt) {
        const url = jugglingLibrary[this.id()].url
        if(url){
          window.open(url)
        }
      })
      
      this.cy.maxZoom(1)
      this.cy.minZoom(0.15)

    }

    render() {
      

      return <div
        id    = "cy"
        className = "graphDiv"
      />
    }

}

export default TrickGraph
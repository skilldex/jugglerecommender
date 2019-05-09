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
      console.log("loading graph", this.props.selectedTricks, this.props.myTricks)
      const numChecked = this.props.selectedTricks.length
      const initializeChecked = 
        this.props.selectedTricks.length == 0 && 
        this.props.selectedList == "allTricks" ? 1 : 0
      let edges = []
      let tempNodes = {}
      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
        let checkedTrick = this.props.selectedTricks.includes(trickKey) || 
          this.props.myTricks.includes(trickKey) ? 100 : 0
        if(!tempNodes[trickKey]){
          tempNodes[trickKey]={
            id    : trickKey,
            name : trick.name,
            checked : initializeChecked
          }
        }
        if(tempNodes[trickKey].checked != 100 && checkedTrick > 0){
          tempNodes[trickKey].checked = checkedTrick
        }

        if(trick.prereqs){
          trick.prereqs.forEach((prereqKey, j)=>{
            let checkedPrereq = this.props.selectedTricks.includes(prereqKey) || 
              this.props.myTricks.includes(prereqKey) ? 100 : 0
            if(checkedPrereq == 100 && tempNodes[trickKey].checked <=1){
              tempNodes[trickKey].checked = 75
            }
            if(!tempNodes[prereqKey]){
              tempNodes[prereqKey]={
                id    : prereqKey,
                name : prereqKey,
                checked : initializeChecked
              }
            }
            if(tempNodes[prereqKey].checked != 100 && checkedPrereq > 1){
              tempNodes[prereqKey].checked = checkedPrereq
            }
            
            if(tempNodes[trickKey].checked  == 100 && !tempNodes[prereqKey].checked){
              tempNodes[prereqKey].checked = 25
            }
            if(
              (tempNodes[prereqKey].checked && tempNodes[trickKey].checked)
                ){
              if(trickKey == prereqKey){
                console.log("nodes " ,tempNodes[trickKey],tempNodes[prereqKey])
              }
              edges.push({ data: { source: trickKey, target: prereqKey } })
            }
          })
        }
      })
      const nodes = []
      Object.keys(tempNodes).forEach((trickKey)=>{
        if(!tempNodes[trickKey].checked){
          return
        }
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
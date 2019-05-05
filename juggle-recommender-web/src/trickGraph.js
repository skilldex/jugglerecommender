import React,{Component} from 'react'
import cytoscape from 'cytoscape'
import jugglingLibrary from './jugglingLibrary.js'
class TrickGraph extends React.Component {

    componentDidMount() {
      this.TrickGraphToGraph()
    }

    componentDidUpdate() {
      console.log("update graph")
      this.TrickGraphToGraph()
    }

    TrickGraphToGraph = () => {
      console.log("graph checked ",this.props.checkedTricks)
      let edges = []
      let tempNodes = {}
      let trickNamesToKeys = {}
      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
        if(this.props.filters.includes(trick.num)){
          trickNamesToKeys[jugglingLibrary[trickKey].name] = trickKey
        }   
      })
      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
        if(!this.props.filters.includes(trick.num)){
          return
        }
        trick.name = trick.name.replace("-"," ")

        let checkedTrick = this.props.checkedTricks[trickKey] ? 10 : 0
        let visibleTrick = this.props.search && trickKey.includes(this.props.search) ? 1 : 0
        tempNodes[trickKey]={
          checked : checkedTrick,
          id    : trickKey,
          name : trick.name,
          visible : visibleTrick
        }
        if(trick.prereqs){
          trick.prereqs.forEach((prereq, j)=>{
            prereq = prereq.replace("-"," ")

            let checkedPrereq = this.props.checkedTricks[prereq] ? 10 : 0
            if(!trickNamesToKeys[prereq]){
              trickNamesToKeys[prereq] = prereq
              tempNodes[prereq] ={
                id    : prereq,
                name : prereq,
                checked : checkedPrereq,
                visible : visibleTrick
              }
            }

            if(!tempNodes[trickNamesToKeys[prereq]]){
              tempNodes[trickNamesToKeys[prereq]]={
                checked : checkedPrereq,
                id    : trickNamesToKeys[prereq],
                name : prereq,
                visible : visibleTrick
              }
            }
            if(checkedPrereq && tempNodes[trickKey].checked == 0){
              tempNodes[trickKey].checked = 8
            }
            if(checkedTrick > 0 && !tempNodes[trickNamesToKeys[prereq]].checked){
              tempNodes[trickNamesToKeys[prereq]].checked = 3
            }
            console.log("search ", this.props.search, visibleTrick)
            if(this.props.search && !visibleTrick) {
              console.log("skip")
              return
            }
            edges.push({ data: { source: trickKey, target: trickNamesToKeys[prereq] } })

          })
        }
      })
      const nodes = []
      Object.keys(tempNodes).forEach((trickKey)=>{
        if(this.props.search && !tempNodes[trickKey].visible){
          return
        }
        nodes.push({data:{...tempNodes[trickKey]}})
      })
      console.log(tempNodes)
      this.renderCytoscapeElement({ edges, nodes })
    }

    renderCytoscapeElement = (elements) => {
      console.log("elements " ,elements)

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
           nodeOverlap: 100,
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
            'background-color' : 'mapData(checked, 0, 10, cyan, yellow)',
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
            'opacity'                 : .5,
            'color' : 'black'
          }),
      })
      this.cy.on('click', 'node', function(evt) {
        console.log(jugglingLibrary)
        console.log("cliekd", jugglingLibrary[this.id()])
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
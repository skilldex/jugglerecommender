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
      let edges = []
      let nodes = []

      Object.keys(jugglingLibrary).forEach((trickKey, i) => {
        const trick = jugglingLibrary[trickKey]
                console.log(trick)
        trick.name = trick.name.replace("-"," ")
        nodes.push({ data: {
          id    : trick.name,
          name : trick.name
        }})
        if(trick.prereqs){
         
          trick.prereqs.forEach((prereq, j)=>{
            console.log(trick.name, prereq)
            prereq = prereq.replace("-"," ")
            if(!jugglingLibrary[prereq]){
              jugglingLibrary[prereq] = { name : prereq}
              nodes.push({ data: {
                id    : prereq,
                name : prereq
              }})
            }
            edges.push({ data: { source: trick.name, target: prereq } })
          })
        }
      })
      console.log("length" ,Object.keys(jugglingLibrary).length)
      this.renderCytoscapeElement({ edges, nodes })
    }

    renderCytoscapeElement = (elements) => {
      console.log(elements)
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
           nodeOverlap: 50,
            // Gravity force (constant)
          gravity: .001,

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
            'font-size'        : 40,
            'opacity'          : '1',
            'width'            : 200,
            'height'            : 200,
            'background-color'           : 'cyan'
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
      })
      
      this.cy.maxZoom(1)
      this.cy.minZoom(0.3)

    }

    render() {
      

      return <div
        id    = "cy"
        style = {{

          height : '1000px',
          width  : '2000px',
          border: '1px solid black',
          textAlign : "left"
        }}
      />
    }

}

export default TrickGraph
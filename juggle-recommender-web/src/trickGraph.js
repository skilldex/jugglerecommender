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

      console.log(jugglingLibrary)
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
            'width'            : 100,
            'height'            : 100
          })
          .selector('edge')
          .css({
            'width'                   : 5,
            'target-arrow-shape'      : 'triangle',
            'curve-style'             : 'bezier',
            'control-point-step-size' : 0,
            'opacity'                 : .3,
          }),
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
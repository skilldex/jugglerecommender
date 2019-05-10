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
      const nodes = this.props.nodes
      const edges = this.props.edges
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
            'background-color' : 'mapData(involved, 0, 100, cyan, yellow)',
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
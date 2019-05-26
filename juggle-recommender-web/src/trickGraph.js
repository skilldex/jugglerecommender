import React,{Component} from 'react'
import store from './store'
import uiStore from './uiStore'
import Graph from 'vis-react'
import './trickGraph.css';

class TrickGraph extends Component {
    componentDidUpdate(){
      console.log("VIS",this.graph)
    }
    render() {
      const nodes = JSON.parse(JSON.stringify(uiStore.nodes))
      const edges = JSON.parse(JSON.stringify(uiStore.edges))
      const data = {
        nodes: nodes,
        edges: edges
      }
      const options = {
        autoResize: true,
        interaction: {hover: true},
      }
      const events = {
        select: function(event) {
            if (store.isMobile){uiStore.setListExpanded(false)}
            uiStore.setPopupTrick({
              'id': event.nodes[0],
              'x' : event.pointer.DOM.x,
              'y' : event.pointer.DOM.y+140})
        } 
      } 
      return (
        <div className="graphDiv" id="graphDiv">
          <Graph
            graph={data}
            options={options}
            events={events}
            getNetwork={this.getNetwork}
            getEdges={this.getEdges}
            getNodes={this.getNodes}
            vis={vis => (this.vis = vis)}
            ref={ref => this.graph = ref}
          />
        </div>
      )
    }
}

export default TrickGraph
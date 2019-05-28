import React,{Component} from 'react'
import store from './store'
import uiStore from './uiStore'
import graphStore from './graphStore'
import Graph from 'vis-react'
import './trickGraph.css';

class TrickGraph extends Component {
    
    
    render() {
      const that = this
      const nodes = JSON.parse(JSON.stringify(graphStore.nodes))
      const edges = JSON.parse(JSON.stringify(graphStore.edges))
      const data = {
        nodes: nodes,
        edges: edges
      }
      const options = {
        autoResize: true,
        interaction: {hover: true},
        edges:{ color: 'black'},
        physics:{
          barnesHut : {
            centralGravity : .5,
            damping : .15,
            springLength : 120,
            springConstant : .06,
          }
        }
      }
      const events = {
        select: function(event) {
            if (store.isMobile){uiStore.setListExpanded(false)}
            uiStore.setPopupTrick({
              'id': event.nodes[0],
              'x' : event.pointer.DOM.x,
              'y' : event.pointer.DOM.y+140})
        }, 
        afterDrawing: function(event) {
          if(that.graph){
            that.graph.Network.fit()
          }
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
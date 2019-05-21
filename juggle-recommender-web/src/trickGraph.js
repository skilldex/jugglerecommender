import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import Graph from 'vis-react'
import {toJS} from "mobx"
import './trickGraph.css';

class TrickGraph extends React.Component {
    render() {
      store.nodes
      store.edges
      const nodes = JSON.parse(JSON.stringify(store.nodes))
      const edges = JSON.parse(JSON.stringify(store.edges))
    const data = {
      nodes: nodes,
      edges: edges
    }
    const options = {
      autoResize: true,
      interaction: {hover: true},
      //physics: {barnesHut: { avoidOverlap: store.rootTricks.length < 20 ? 1:0} }
    }
    const events = {
    select: function(event) {
        if (store.isMobile){store.setListExpanded(false)}
        var { nodes, edges } = event;
        store.setPopupTrick({
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
          />
        </div>
      )
    }
}

export default TrickGraph
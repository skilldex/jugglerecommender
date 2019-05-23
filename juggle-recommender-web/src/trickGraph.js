import React,{Component} from 'react'
import {jugglingLibrary} from './jugglingLibrary.js'
import store from './store'
import uiStore from './uiStore'
import Graph from 'vis-react'
import {toJS} from "mobx"
import './trickGraph.css';

class TrickGraph extends React.Component {
    render() {
      uiStore.nodes
      uiStore.edges
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
        var { nodes, edges } = event;
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
          />
        </div>
      )
    }
}

export default TrickGraph
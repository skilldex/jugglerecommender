import React,{Component} from 'react'
import store from './stores/store'
import uiStore from './stores/uiStore'
import graphStore from './stores/graphStore'
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
    /*
      -Doing stabilization is orders of magnitude faster than displaying the network
      -Edge type dynamic is more computing intensive than the rest
      -The barnesHut solver is way slower than the other ones
      -reducing 'timestep' in physics stresses out the processor less; it also makes for less nervous networks
    */
      const options = {
        autoResize: true,
        interaction: {hover: true},
        edges:{ color: 'black'},
        physics:{
          barnesHut : {
            centralGravity : .5,
            damping : .20,
            springLength : 120,
            springConstant : .06,
          },
          stabilization : {
            enabled : true,
            iterations : 300,
            updateInterval: 25
          },
          timestep: 0.95,
        }
      }
      const events = {
        select: function(event) {
            if (uiStore.selectedTrick===event.nodes[0]){  
              const detailTrick = {...store.library[event.nodes[0]]}
              detailTrick.x = 400
              detailTrick.y = 400
              detailTrick.id = event.nodes[0]
              uiStore.setDetailTrick(detailTrick)
            }else if(event.nodes[0]!=null){
              uiStore.toggleSelectedTrick(event.nodes[0])
              uiStore.setDetailTrick(null)
              uiStore.updateRootTricks()
            }else{
              const detailTrick = {...store.library[event.nodes[0]]}
              detailTrick.x = 400
              detailTrick.y = 400
              detailTrick.id = event.nodes[0]
              uiStore.setDetailTrick(detailTrick)       
            }
        }, 


        stabilizationIterationsDone: function(event) {
          console.log("iterations" ,event)
          if(that.graph){
            that.graph.Network.fit()
          }
        },
        stabilized: function(event) {
          if(that.graph){
            that.graph.Network.moveTo(
              {
                position: {x:0, y:0},
                scale: 1.0,
                offset: {x:0, y:0}
              }
            )
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
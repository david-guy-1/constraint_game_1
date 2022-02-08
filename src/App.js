import logo from './logo.svg';
import './App.css';
import run_level from './classes/run_level.js';
import dag from "./classes/dag.js";
import Renderer from "./display/renderer.js";
import React from 'react'
import * as g from './classes/generator.js';
import compute_render_locations_total from "./display/compute_render_locations.js"
import Menu from "./display/menu.js";
import load_all_images from "./load_all_images.js";
import Debug from "./display/Debug.js";

class App extends React.Component{
	
	constructor(){
		super();
		this.state = {
			mode : "menu",
		}
		if(window.seed == "a"){
			/*
			var id = "defa"
			var tree = g.generate_tree(id , 20, "tree")
			console.log(JSON.stringify(tree) )
			//console.log(tree.output())
			var critical = [["treeroot", "tree vertex 19", "tree vertex 17", "tree vertex 3", "tree vertex 2"]]
			var forced_index = [3];
			var forced = g.get_forced_nodes(critical, forced_index)[0];
			console.log(forced)
			
			console.log(g.forced_away(tree, forced))
			//console.log(JSON.stringify(g.generate_piece("123", 5, [6, 8], "sample")))
			*/
			/*
			3,2, [3,3] "tiny" // 18
			3,3, [3,4] "small" // 31.5
			4,3, [3,4] "medium" // 42
			5,4, [3,5] "large" // 80
			5,5, [4,6] "giant" // 125
			*/
			var [heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool] = g.generate_level("abcdeafg",5,2, [3,3] )
			

			
			
			console.log(JSON.stringify([heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool]));
			var level_comp = g.compile_level("MUSTHAVE3" , heroes,starts, trees, things_on_vertices, scrolls, keys, items,pool);
			var render_data = compute_render_locations_total(level_comp, "MUSTHAVEseed123")
			//console.log(JSON.stringify(render_data));
			// this.state = {"mode":"game", "level":level_comp, "render_data":render_data, "seed":"adujaosdh", extra_draw_stuff : [{x:100, y:100, scroll:true, type:"text", data:"size : tiny"}]};
			// load tutorial
		}
		load_all_images();
		this.load_level = this.load_level.bind(this);
		this.back_fn = this.back_fn.bind(this);
		this.win_fn = this.win_fn.bind(this);
		
	}
  render(){ 
//	return <Debug />
    console.log("render called" + this.state.mode );
	var mode = this.state.mode;
	if(mode == "game"){
	  var level = this.state.level;
	  var render_data = this.state.render_data
	  var extra_draw_stuff = this.state.extra_draw_stuff;
	  return (
	<Renderer level={level} draw_data={render_data[0]} boundaries={[render_data[1], render_data[2]]} extra_draw_stuff={extra_draw_stuff} back_fn = {this.back_fn} win_fn = {this.win_fn} seed = {this.state.seed}/>
	  );
	} else if (mode == "menu"){
		return <Menu level_fn = {this.load_level} />
	} else if(mode == "win"){
		
		var heroes = [];
		var i=0;
		var hero_locations = [[310,436],[250,446],[370,446],[190,456],[430,456]];
		for(var thing of this.state.heroes){
			// thing.replace("./", "./display/")
			heroes.push(<img src={require("" + thing.replace("./", "./display/")).default} style={{"position":"absolute", "top":hero_locations[i][1], "left":hero_locations[i][0] }} />)
			i++;
		}
		return <div>
		<img src={require("./display/win.png").default} style={{"position":"absolute", "top":0, "left":0 , zIndex : -1}} />
		<h1 style={{"position":"absolute", "top":20, "left":400 }}> You win!</h1>
		<h1 style={{"position":"absolute", "top":100, "left":400 }}> Time : {this.state.time}</h1>
		{heroes}
		<button onClick={this.back_fn} style={{"position":"absolute", "top":200, "left":400 , height:200}}> Back to main menu </button>
		</div>
	}

  }
  
  load_level(level, draw_data, seed, extra_draw_stuff){
	  

	  // draw_data = returned value from compute_render_locations_total
	  this.setState ({"mode":"game", "level":level, "render_data":draw_data, "seed":seed, extra_draw_stuff : extra_draw_stuff })
	  
  }
  back_fn(){
	  this.setState({"mode":"menu"});
  }
  win_fn(hero_images, start_time){
	  this.setState({"mode":"win", heroes : hero_images, time : Math.floor((Date.now() - start_time)/1000) });
  }
  
  
}

export default App;
//		<Renderer run_level={data[0]} draw_data={data[1]} />

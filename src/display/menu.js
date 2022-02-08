import React from 'react'
import tutorial from '../classes/tutorials.js';
import * as g from '../classes/generator.js';
import compute_render_locations_total from "./compute_render_locations.js"
class Menu extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			"mode":"main",
		}
		this.level_fn = props.level_fn;
		this.load_level = this.load_level.bind(this)
		this.load_level_seed = this.load_level_seed.bind(this);
		this.seedBox = React.createRef();
	}
	render(){
	
	var mode = this.state.mode;
	var buttons = [];
	if(mode == "main"){
		buttons.push(<h1 style={{"position":"absolute", "top":200, "left":500, color:"white"}}>Escape from the deadly dungeon </h1> )
		
		for(var i=1; i<=12; i++){
			buttons.push(<button style={{"position":"absolute", "top":300, "left":350  + 60*i, width:50, height:50}} onClick={function(){this[0].load_level(this[1])}.bind([this, i])}> {i} </button>)
		}
		
		
		
		buttons.push(<button style={{"position":"absolute", "top":400, "left":650 , width:100, height:50}} onClick={function(){this.setState({"mode":"chooseLevel"})}.bind(this)}> Random Level </button>)
	}

	if(mode == "chooseLevel"){
		buttons.push(<div style={{"position":"absolute", "top":100, "left":550, width:500, height:150, fontSize:30, color:"white"}} onClick={function(){this[0].load_level(this[1])}.bind([this, i])}> Enter a seed, or leave blank to randomly generate seed </div>)
		buttons.push(<textarea style={{"position":"absolute", "top":200, "left":550, width:300, height:150}}  ref={this.seedBox}></textarea>)
		
		
		buttons.push(<button style={{"position":"absolute", "top":400, "left":450 , width:90, height:50}} onClick={function(){
			var seed = this.seedBox.current.value;
			if(seed == ""){
				seed = Math.random() + "s" + Math.random();
			}
			this.load_level_seed(seed,[3,2,[3,3]], "tiny");
			this.setState({"mode":"main"})}.bind(this)}> Start (tiny) </button>)
		
		buttons.push(<button style={{"position":"absolute", "top":400, "left":550 , width:90, height:50}} onClick={function(){
			var seed = this.seedBox.current.value;
			if(seed == ""){
				seed = Math.random() + "s" + Math.random();
			}
			this.load_level_seed(seed,[3,3, [3,4]], "small");
			this.setState({"mode":"main"})}.bind(this)}> Start (small) </button>)

		buttons.push(<button style={{"position":"absolute", "top":400, "left":650 , width:90, height:50}} onClick={function(){
			var seed = this.seedBox.current.value;
			if(seed == ""){
				seed = Math.random() + "s" + Math.random();
			}
			this.load_level_seed(seed,[4,3, [3,4]], "medium");
			this.setState({"mode":"main"})}.bind(this)}> Start (medium) </button>)

		buttons.push(<button style={{"position":"absolute", "top":400, "left":750 , width:90, height:50}} onClick={function(){
			var seed = this.seedBox.current.value;
			if(seed == ""){
				seed = Math.random() + "s" + Math.random();
			}
			this.load_level_seed(seed,[5,4, [3,5]], "large");
			this.setState({"mode":"main"})}.bind(this)}> Start (large) </button>)

		buttons.push(<button style={{"position":"absolute", "top":400, "left":850 , width:90, height:50}} onClick={function(){
			var seed = this.seedBox.current.value;
			if(seed == ""){
				seed = Math.random() + "s" + Math.random();
			}
			this.load_level_seed(seed,[5,5, [4,6]], "giant");
			this.setState({"mode":"main"})}.bind(this)}> Start (giant) </button>)
			
			
		
		
		
		buttons.push(<button style={{"position":"absolute", "top":600, "left":550 , width:100, height:50}} onClick={function(){this.setState({"mode":"main"})}.bind(this)}> Back </button>)
		
	}
	
	return <div>
	{/*
	
	style={{"position":"absolute", "top":0, "left":0 , width:0, height:0}}
	
	*/}
	
	<img src={require("./menu_bg.png").default} style={{"position":"absolute", "top":0, "left":0 , zIndex : -1}} />
		{buttons}
	</div>
	
	}
	load_level(n){
		
		var [level, draw_data, extra_draw_stuff] = tutorial(n);
		this.level_fn(level, draw_data, "", extra_draw_stuff);
	}
	load_level_seed(seed, size, size_str){
		
		var level = g.generate_and_compile(seed,size[0], size[1], size[2])
		var draw_data = compute_render_locations_total(level, seed); 
		
		
		
	
		var extra_draw_stuff = []
		extra_draw_stuff.push({type:"text", x:30, y:90, scroll:true, data:"size:" + size_str})
		this.level_fn(level, draw_data, seed, extra_draw_stuff);
	}
}
export default Menu;
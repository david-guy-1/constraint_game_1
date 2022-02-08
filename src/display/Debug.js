import React from 'react'
import {draw_tile,draw_equips,draw_grid} from "./draw_stuff.js"
import * as d from "./canvasDrawing.js";
import monster from "../classes/monster.js";
import run_level from "../classes/run_level.js";
import * as c from "./display_constants.js";
import * as m from "../input/mouse_input.js";
import Infobox from "./Infobox.js";
import * as r from "../classes/random.js";
import bg from "./bg.png";
import b1 from "./images/buttons/play.png";
import b2 from "./images/buttons/stop.png";
import b3 from "./images/buttons/pauseresume.png";
import b4 from "./images/buttons/step.png";
import b5 from "./images/buttons/instantrun.png";

var arrow_img = require("./arrow.png");


class Debug extends React.Component{
	constructor(props){
		super(props);
		this.canvasS1 = React.createRef();
		this.outputRef = React.createRef();
		this.inputRef = React.createRef();
		this.state = {
			scroll : {
				x_offset : 0,
				y_offset : 0
			},
			boundaries : [100,100]
		}
	}
	render(){
		return <div>

<div style={{position:"absolute",overflow:"hidden", "width":1000, "height":500 , top:100, left:0,border:"1px solid black"}} >
		<canvas width={this.state.boundaries[0]} height={this.state.boundaries[1]} id="scrollingCanvas" style={{position:"absolute", top:0, left:0, zIndex:-1, }} ref={this.canvasS1} />
		
		</div>
		
		out<textarea ref={this.outputRef}></textarea>
		in<textarea ref={this.inputRef}></textarea>
		<button onClick = {function(){
			var thing = this.inputRef.current.value.split(",");
			var i0 = parseInt(thing[0])
			var i1 = parseInt(thing[1])
			if(!isNaN(i0) && !isNaN(i1)){
				this.scroll_to(i0, i1);
			}
		}.bind(this)}>Scroll </button>
		
		<button onClick = {function(){
			var thing = this.inputRef.current.value.split(",");
			var i0 = parseInt(thing[0])
			var i1 = parseInt(thing[1])
			if(!isNaN(i0) && !isNaN(i1)){
				this.resize(i0, i1);
			}
		}.bind(this)}>Resize </button>
		
		
		<button onClick ={ function(){
			var thing = this.inputRef.current.value;
			var i0 = parseInt(thing)
			if(!isNaN(i0)){
				this.draw_images(i0);
			}
		}.bind(this)}>Draw </button>
		
		
		</div>
	}
	
	scroll_to(x,y){
		this.scroll_(x - this.state.scroll.x_offset,y - this.state.scroll.y_offset)
	}
	scroll_(x,y){	
		if(this.canvasS1.current == null){
			return;
		}
		this.state.scroll.x_offset += x;
		this.state.scroll.y_offset += y;			
		
		this.canvasS1.current.style.transform = `translateX(${-this.state.scroll.x_offset}px) translateY(${-this.state.scroll.y_offset}px)`
	}
	
	
	draw_images(amount){
		// randomly generate X and Y
		
		var Z = Date.now();
		var ctx1 = this.canvasS1.current.getContext("2d");
		ctx1.clearRect(0,0,this.state.boundaries[0],this.state.boundaries[1]);
		
		var draw_list = []
		var things = Object.keys(c.item_table)
		for(var i=0; i<amount ; i++){
			draw_list.push([r.choice(things, Math.random()), r.randint(0, this.state.boundaries[0], Math.random()) , r.randint(0, this.state.boundaries[1], Math.random())])
		}
		var X = Date.now();
		for(var i of draw_list){
			d.drawImageStr(ctx1, c.item_table[i[0]], i[1], i[2])
		}
		var Y = Date.now();
		this.outputRef.current.value += "Drawing " + amount + " things on a " + this.state.boundaries + " canvas took " + (Y-X) + "milliseconds\n";
		this.outputRef.current.value += "Total is " + (Y-Z)+ "milliseconds\n";
	}
	resize(x,y){
		this.setState({
			boundaries : [x,y]
		})
	}
	
	
}

export default Debug
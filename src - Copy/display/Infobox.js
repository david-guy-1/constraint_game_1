import React from 'react'
import * as c from "./display_constants.js";
import monster from "../classes/monster.js";
import item from "../classes/item.js";
import * as d from "./draw_stuff.js";
class Infobox extends React.Component{
	constructor(props){
		super(props)
		this.thing = props.thing;
		// props is either undefined or a "dungeon.stuff" thing.
		this.state={"counter":0};
		
	}
	
	get_image(s){
		// from a dungeon stuff instance, get its image.
		
		// monster, item, locked door, lever, scroll
		
		// 
		if(s instanceof item){
			return d.item_image(s);
		}
		if(s instanceof monster){
			return d.monster_image(s);
		}
		if(typeof(s) == "string"){
			if(s.indexOf("scroll_") != -1){
				return d.scroll_image(s);
			}
			if(s.indexOf("lever_") != -1 ){
				return d.lever_image(s);
			}
			if(s.indexOf("door_") != -1 ){
				return d.door_image(s);
			}
			
		}
		
		
	}
	render(){
		console.log("got here");
		
		return <div style={{position:"absolute", top:c.infobox_top_left[1], left:c.infobox_top_left[0],width:c.infobox_size[0] , height:c.infobox_size[1], zIndex:-3,'white-space': 'pre'}}><div style={{padding:20}}> 
		
		{function(){
			// nothing
			var s = ["Item here is", <br />]
			var t = this.thing;
			console.log(t);
			if(t == "nothing"){
				s.push("nothing")
			}  
			if(t == "exit"){
				s.push("Exit")
			}
			if(t instanceof monster){
				// draw it
				s = s.concat([t.is_egg ? "monster egg" : "monster",<br />,t.name,<br />,<img src = {require("" + this.get_image(t)).default} />, <br />, "weaknesses:", <br />]);
				
				
				for(var w of t.weaknesses){
					s.push(<img src = {require("" + d.monster_weakness_image(w)).default} />)
				}
				s = s.concat(<br />, "drops:" ,<br />)
				for(var w of t.drops){
					s.push(<img src = {require("" + this.get_image(w)).default} />)
				}
			}
			if(t instanceof item){
				s = s.concat(["item", <br/>, item.name])
			}
			if(typeof(t) == "string"){
				if(t.indexOf("scroll_") != -1){
					s = s.concat(["scroll or book", <br />, <img src = {require("" + d.scroll_image(t)).default} /> , <br /> ,t.slice("scroll_".length)]);
				}
				if(t.indexOf("lever_") != -1 ){
					s = s.concat(["key", <br />, <img src = {require("" + d.lever_image(t)).default} /> , <br /> ,t.slice("lever_".length)]);
				}
				if(t.indexOf("door_") != -1 ){
					s = s.concat(["door", <br />, <img src = {require("" + d.door_image(t)).default} />, <br /> ,"opened by: "+  t.slice("door_".length),<br />, <img src = {require("" + d.lever_image(t.replace("door_","lever_"))).default} />  ]);
				}
				
			}
			return s
		}.bind(this)()}
		
		
		</div></div>;
		
		
	}
	shouldComponentUpdate (props,state){
		//this.thing =  props.thing;
		return true;
	}
	set_state(item){
		this.thing = item;
		this.setState({"counter":this.state.counter +1});
	}
}
export default Infobox;
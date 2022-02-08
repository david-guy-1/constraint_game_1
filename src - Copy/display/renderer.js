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

//renders a run_level
// keep consistent with compute_render_locationss


class Renderer extends React.Component{
	constructor(props){
		super(props);
		var level = this.props.run_level == undefined ? this.props.level : this.props.run_level.level
		this.state = {
			run_level : this.props.run_level, // undefined = not running. not undefined = running
			level : level,
			solution : this.props.run_level == undefined ? this.props.level.make_standard_solution() : this.props.run_level.solution,
			draw_data : this.props.draw_data,
			boundaries : this.props.boundaries,
			scroll : {
			x_offset : 0,
			y_offset : 0, // these two are for scrolling!
			},
			draw_mode : { 
				mode : "dungeon",
			},// mode = dungeon , equips, etc.
			
			// type (text/image), x, y, scroll (true, false), data (text or image link)
			extra_draw_stuff : this.props.extra_draw_stuff,
		
			
			selected_thing : undefined,
			// equips : hero -> name of hero, item : currently selected item (item instance) or undefined
		}
		this.start_time = Date.now();
		this.back_fn = props.back_fn;
		this.win_fn = props.win_fn;
		this.seed = props.seed;
		this.scrollPart = React.createRef(); // ANYTHING THAT SCROLLS
		
		this.canvasNS = React.createRef(); // EQUIPS, DOES NOT scroll
		
		this.canvasS1 = React.createRef(); // DUNGEON STUFF (monsters ,items, green lines) only , SCROLLS
		this.canvasS2 = React.createRef(); // DUNGEON BACKGROUND SQUARES only , SCROLLS
		
		this.canvasNS2 = React.createRef(); // DUNGEON BACKGROUND only , DOES NOT SCROLL
		
		this.go_to_hero = this.go_to_hero.bind(this);
		
		this.canvasDiv = React.createRef();
		this.runningDiv = React.createRef();
		this.messageRef = React.createRef();
		this.infobox = React.createRef();
		this.canvasClicked = this.canvasClicked.bind(this);
		this.canvasMouseMove = this.canvasMouseMove.bind(this);
		this.canvasMouseOut = this.canvasMouseOut.bind(this);
		this.scrollInterval = undefined;
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)
		this.pause_resume = this.pause_resume.bind(this)
		this.step = this.step.bind(this)
		this.skip_to_end = this.skip_to_end.bind(this)
		this.reset_scroll = this.reset_scroll.bind(this)
		this.nArrows = 6;
		this.arrows = {
			
		}
		for(var vertex of level.dag.get_vertices()){
			if(level.dag.get_vertex_by_name(vertex).next.size != 0){
				for(var i=0; i<this.nArrows; i++){
					this.arrows[vertex + " " + i] = React.createRef();
				}
			}
		}
		this.keysDown = new Set(); // keys that are pressed
		
		this.minimap = React.createRef();
		this.minimapTop = React.createRef();
		
		this.scrollDirection = undefined;
		this.hero_map = { // which heroes get which icons
			
		}
		var hero_icons = r.shuffle(c.hero_table, Math.random())
		var i=0;
		this.hero_ordering = []
		var theme_shuffled = r.shuffle([1,2,3,4,5], Math.random());
		this.theme = {};
		for(var start of level.starts){
			this.hero_map[start] = hero_icons[i]; 
			this.theme[start] = theme_shuffled[i];
			this.hero_ordering.push(start)
			i++;
		}
		console.log(this.hero_map);
		d.loadImage("./invBG.png");
		this.exit_time = 0;
	}
	// display  a message to the user for the given time
	message_user(message, time=1000){
		if(this.messageRef.current != null){
			this.messageRef.current.textContent = message;
		}
		if(this.messageTimer != undefined){
			clearTimeout(this.messageTimer);
		}
		this.messageTimer = setTimeout(function(){
			if(this.messageRef.current != null){
				this.messageRef.current.textContent = ""; this.messageTimer = undefined
			}
		}.bind(this), time) 			

	}
	
	set_infobox(dungeon, number){
		//return
		var item = this.state.level.dungeon_table[dungeon].stuff[number];
		if(this.state.level.dungeon_table[dungeon].stuff.length -1 == number && this.state.level.dungeon_table[dungeon].next == "exit"){
			this.infobox.current.set_state("exit");
		} else {
			this.infobox.current.set_state(item);
		}
					
	}
	render(){
		//console.log("render called")
		
		return <div tabIndex={"1"} onKeyDown={ function(e){
				e.persist();
				if(["KeyW","KeyA","KeyS","KeyD","ArrowDown","ArrowLeft","ArrowRight","ArrowUp"].indexOf(e.code) != -1  ){
					this.keysDown.add(e.code);
				}
				switch(e.code){
					case "KeyW":
					case "ArrowUp":
						this.scrollIntervalFn("up");
					break
					case "KeyS":
					case "ArrowDown":
						this.scrollIntervalFn("down");
					break
					case "KeyA":
					case "ArrowLeft":
						this.scrollIntervalFn("left");
					break
					case "KeyD":
					case "ArrowRight":
						this.scrollIntervalFn("right");
					break
				}
			}.bind(this)}
			
			onKeyUp={
				function(e){
					e.persist();
					this.keysDown.delete(e.code);
					if(this.keysDown.size == 0){
						this.scrollIntervalFn();
					}
				}.bind(this)
			}
			style={{backgroundImage : `url(${bg})` ,"position":"absolute", "top":0, "left":0, "width":1400,"height":730,zIndex:-10,border:"1px solid red"}}>
			

		
		{/* buttons*/}
		<button style={{border:"none", outline:"none", color:"white",position:"absolute", top:c.left_buttons_top_left[1], left:c.left_buttons_top_left[0], width:c.left_buttons_size[0], height:c.left_buttons_size[1], backgroundImage:`url(${b1})` }} onClick={function(){this.start()}.bind(this)}> </button>
		<button style={{border:"none", outline:"none", color:"white",position:"absolute", top:c.left_buttons_top_left[1] + 1 * (c.left_buttons_size[1] + c.left_buttons_gap), left:c.left_buttons_top_left[0], width:c.left_buttons_size[0], height:c.left_buttons_size[1] ,backgroundImage:`url(${b2})` }} onClick={this.stop}> </button>
		<button style={{border:"none", outline:"none", color:"white",position:"absolute", top:c.left_buttons_top_left[1] + 2* (c.left_buttons_size[1] + c.left_buttons_gap), left:c.left_buttons_top_left[0], width:c.left_buttons_size[0], height:c.left_buttons_size[1] ,backgroundImage:`url(${b3})`}}onClick={this.pause_resume}></button>
		<button style={{border:"none", outline:"none", color:"white",position:"absolute", top:c.left_buttons_top_left[1] + 3* (c.left_buttons_size[1] + c.left_buttons_gap), left:c.left_buttons_top_left[0], width:c.left_buttons_size[0], height:c.left_buttons_size[1],backgroundImage:`url(${b4})`}}onClick={this.step}> </button>
		<button style={{border:"none", outline:"none", color:"white",position:"absolute", top:c.left_buttons_top_left[1] + 4* (c.left_buttons_size[1] + c.left_buttons_gap), left:c.left_buttons_top_left[0], width:c.left_buttons_size[0], height:c.left_buttons_size[1],backgroundImage:`url(${b5})`}}onClick={this.skip_to_end}></button>
		{/* div to indicate starting*/}
		
		<div style={{"backgroundColor":"green",position:"absolute","width":70, "height":50 , top:c.canvas_top, left:c.canvas_left, visibility:"hidden", zIndex:1 }} ref={this.runningDiv}>Running solution </div>
		
		{/* color code*/}
		<img src={require("" + "./color_code.png").default} style={{position:"absolute", top:c.color_code_top_left[1], left:c.color_code_top_left[0]}}/>
		
		{/* canvas div*/}
		
		<div width={c.canvas_width} height={c.canvas_height} onClick={this.canvasClicked} onMouseMove={this.canvasMouseMove} onMouseOut={this.canvasMouseOut} style={{position:"absolute",overflow:"hidden", "width":c.canvas_width, "height":c.canvas_height , top:c.canvas_top, left:c.canvas_left,}} ref={this.canvasDiv}>
		
		{/*message user (msut be placed inside canvas div , since canvas div has event listeners, and this is on top of canvas div*/}
		<div style={{"position":"absolute", "top":200, "left":200, "width":400,"height":200,zIndex:10, fontSize: 45, color : "white"}} ref={this.messageRef}></div>

		
		{/* scrolling canvas div*/}
		<div width={this.state.boundaries[0]} height={this.state.boundaries[1]} id="scrollingPart" style={{position:"absolute", top:0, left:0}} ref={this.scrollPart} >
		
		
		{/* arrows*/}
		
		{function(){
					var level = this.state.level;
		var lst = [];	
		
		for(var vertex of level.dag.get_vertices()){
			if(level.dag.get_vertex_by_name(vertex).next.size != 0){
				for(var i=0; i<this.nArrows; i++){
					lst.push(<img src={require("./arrow.png").default} style={{"user-select": "none","position":"absolute", "top":0, "left":0}} ref={this.arrows[vertex + " " + i]} />);
				}
			}
		}
		

		
			return lst;
		}.bind(this)()
		}

		{/* canvases*/}

		
		
		<canvas width={this.state.boundaries[0]} height={this.state.boundaries[1]} id="scrollingCanvas" style={{position:"absolute", top:0, left:0, zIndex:-1}} ref={this.canvasS1} />
		<canvas width={this.state.boundaries[0]} height={this.state.boundaries[1]} id="scrollingCanvasUnder" style={{position:"absolute", top:0, left:0, zIndex:-2}} ref={this.canvasS2} />
		
		{/*end of scrolling part */}
		</div>
		
		<canvas width={c.canvas_width} height={c.canvas_height} id="nonScrollingCanvas" style={{position:"absolute", top:0, left:0, zIndex:0}} ref={this.canvasNS} />


		<canvas width={c.canvas_width} height={c.canvas_height} id="scrollingCanvasUnder" style={{position:"absolute", top:0, left:0, zIndex:-4}} ref={this.canvasNS2} />
		

		
		{/*end of main canvas divs part */}
		</div>
		
		{/*minimap */}
		
		<canvas width={c.minimap_size[0]} height={c.minimap_size[1]} id="scrollingCanvasUnder" style={{position:"absolute", top:c.minimap_top_left[1], left:c.minimap_top_left[0], zIndex:-3}} ref={this.minimapTop} onClick={function(e){
			
			var size = this.state.boundaries;
			var coords = [e.pageX - c.minimap_top_left[0], e.pageY - c.minimap_top_left[1]]
			var x_scale_factor = c.minimap_size[0] / size[0];
			var y_scale_factor = c.minimap_size[1] / size[1];
			coords[0] /= x_scale_factor;
			coords[1] /= y_scale_factor;
			this.scroll_to(coords[0]-c.canvas_width/2, coords[1]-c.canvas_height/2)
		}.bind(this)}/>
		
		
		<canvas width={c.minimap_size[0]} height={c.minimap_size[1]} id="scrollingCanvasUnder" style={{position:"absolute", top:c.minimap_top_left[1], left:c.minimap_top_left[0], zIndex:-4}} ref={this.minimap} />
			
		{/*infobox */}
		<Infobox id="infobox"  ref={this.infobox} thing={this.state.selected_thing}/>
		
		{/* buttons at the bottom */}
			{function(){
				var out = [];
				console.log(this.state.level);
				var heroes = this.state.level.starts.length;
				var tl = c.bottom_buttons_top_left;
				var s = c.bottom_buttons_size;
				var g = c.bottom_buttons_gap;
				out.push(<div style={{"position":"absolute", "top":tl[1], "left": tl[0], "width":s[0]*2, "height":s[1] }}> Go to hero</div>)
				out.push(<div style={{"position":"absolute", "top":tl[1] + g + s[1], "left": tl[0], "width":s[0]*2, "height":s[1] }}> Open inventory</div>)
				
				for(var i=0; i < heroes; i++){
					var img_name = this.hero_map[this.hero_ordering[i]]
					out.push(<div style={{"position":"absolute", "top":tl[1] , "left": tl[0] + 3*s[0] + i * (s[0] + g), "width":s[0], "height":s[1], "lineHeight":s[1]+"px" , "backgroundColor":"pink","textAlign":"center" , overflow:"hidden" }} onClick={function(){
						
						this[0].go_to_hero(this[1]);
						
						
					}.bind([this,i])}   ><img src={require("" + img_name).default} style={{position:"absolute", "width" : (s[0] - 6), "height" : 140*0.6, top: 3-40*0.6, left: 3 }} /> </div>)
					
					out.push(<div style={{"position":"absolute", "top":tl[1] + g + s[1], "left": tl[0] + 3*s[0] + i * (s[0] + g), "width":s[0], "height":s[1], "lineHeight":s[1]+"px" , "backgroundColor":"lightBlue","textAlign":"center", overflow:"hidden" }} onClick={ function(){
						if(this[0].state.run_level == undefined){
												this[0].setState({
							draw_mode : {
								mode : "equips",
								hero : this[1],
								item : undefined,
							}
							
						}, function(){this.change_state("dungeon","equips")}.bind(this[0]))
						}
					}.bind([this, this.state.level.starts[i]])
					}><img src={require("" + img_name).default} style={{position:"absolute", "width" : (s[0] - 6), "height" : 140*0.6, top: 3-40*0.6, left: 3 }} /></div>)

				}
				return out;
			}.bind(this)()}
			
			
			{/* instructions */}
			
			<button style={{backgroundColor:"#E26F6F",border:"none", outline:"none", color:"white",position:"absolute", top:c.instructions_top_left[1], left:c.instructions_top_left[0], width:c.instructions_size[0], height:c.instructions_size[1]}} onClick={function(){this.change_state("dungeon", "instructions");}.bind(this)}>Instructions </button>
			
			{/* seed */}
			<div style={{color:"white",position:"absolute", top:c.seed_top_left[1], left:c.seed_top_left[0], width:c.seed_size[0], height:c.seed_size[1]}}>seed : {this.seed}</div>
			
			
			{/* back */}
			
			<button style={{backgroundColor:"#627FEF",border:"none", outline:"none", color:"white",position:"absolute", top:c.back_top_left[1], left:c.back_top_left[0], width:c.back_size[0], height:c.back_size[1]}} onClick={function(){
				if(Date.now() - this.exit_time < 2000){
						clearTimeout(this.messageTimer);
						clearInterval(this.scrollInterval);
						clearInterval(this.moving);
							this.back_fn();
				} else {
					this.exit_time = Date.now()
					this.message_user("Click again to confirm exit");
				}
				
			}.bind(this)}>Exit </button>
			
			
		</div>
	}
	
	scroll_to(x,y){
		this.scroll_(x - this.state.scroll.x_offset,y - this.state.scroll.y_offset)
	}
	scroll_(x,y){
		
		if(this.canvasS1.current == null || this.canvasS2.current == null){
			return;
		}
		
		if(this.state.draw_mode.mode == "dungeon"){
			this.state.scroll.x_offset += x;
			this.state.scroll.y_offset += y;			
		} // check for boundaries
		//this.draw();
		this.scrollPart.current.style.transform = `translateX(${-this.state.scroll.x_offset}px) translateY(${-this.state.scroll.y_offset}px)`
		
		// update the minimap's rectangle
		var size = this.state.boundaries;
		var x_scale_factor = c.minimap_size[0] / size[0];
		var y_scale_factor = c.minimap_size[1] / size[1];
		
		
		var ctx = this.minimap.current.getContext("2d");
		ctx.clearRect(0,0,c.minimap_size[0], c.minimap_size[1]);	
		ctx.fillStyle  = "green";
		ctx.fillRect(this.state.scroll.x_offset * x_scale_factor, this.state.scroll.y_offset * y_scale_factor, c.canvas_width * x_scale_factor,c.canvas_height * y_scale_factor);
		
		
	}
	
	// scrolls to the given hero
	go_to_hero(i){
		var hero_name = this.state.level.starts[i];
		// not running
		if(this.state.run_level == undefined){
			var location_ = this.state.draw_data[hero_name] ;
			 
		} else {
			var location_ = this.state.run_level.locations[hero_name];
			location_ = this.state.draw_data[location_] ;
		}
		
		this.scroll_to(location_[0] - c.canvas_width/2, location_[1] -c.canvas_height/2)
	}
	scrollIntervalFn(direction){

			var scrollAmount = 30;
			var scrollDelay = 30
				if(direction == "up"){
					// scroll up
					if(this.scrollDirection != "up"){
						clearInterval(this.scrollInterval)
						this.scrollInterval = setInterval(function(){this.scroll_(0, -scrollAmount)}.bind(this), scrollDelay)
						this.scrollDirection = "up"
					}
						
				} else if(direction == "down"){
					//scroll down
					if(this.scrollDirection != "down"){
						clearInterval(this.scrollInterval)
						this.scrollInterval = setInterval(function(){this.scroll_(0, scrollAmount)}.bind(this), scrollDelay)
						this.scrollDirection = "down"
					}
					
				} else if(direction == "left"){
					//scroll left
					if(this.scrollDirection != "left"){
						clearInterval(this.scrollInterval)
						this.scrollInterval = setInterval(function(){this.scroll_(-scrollAmount,0)}.bind(this), scrollDelay)
						this.scrollDirection = "left"
					}
				} else if(direction == "right"){
					//scroll right
					if(this.scrollDirection != "right"){
						clearInterval(this.scrollInterval)
						this.scrollInterval = setInterval(function(){this.scroll_(scrollAmount,0)}.bind(this), scrollDelay)
						this.scrollDirection = "right"
					}
				} else {
					clearInterval(this.scrollInterval);
					this.scrollInterval = undefined;
					this.scrollDirection = undefined;
				}	

				
		
	}
	
	
	reset_scroll(){
		this.scroll_(-this.state.scroll.x_offset, -this.state.scroll.y_offset)
	}
	canvasMouseOut(e){
		clearInterval(this.scrollInterval)
		this.scrollInterval = undefined;
		this.scrollDirection = undefined;
	}
	canvasMouseMove(e){
		
		var mode = this.state.draw_mode;
		var en = e.nativeEvent
		var  currentTargetRect = this.canvasDiv.current.getBoundingClientRect();
		var point_clicked_canvas = [en.pageX - c.canvas_left,en.pageY - c.canvas_top]
		var point_clicked_scroll = [point_clicked_canvas[0] + this.state.scroll.x_offset,point_clicked_canvas[1] + this.state.scroll.y_offset] 
		
		
		
		var level = this.state.level;
		var solution = this.state.solution; // this will NEVER be undefined, we always 
		var changed = false;
		if (mode.mode == "equips"){
			var new_item = undefined
			var item_pool_width = Math.floor(c.item_pool_size[0]/c.item_size)
			var hero_pool_width = Math.floor(c.hero_pool_size[0]/c.item_size)
			var coord_item_pool = [point_clicked_canvas[0] - c.item_pool_top_left[0], point_clicked_canvas[1] - c.item_pool_top_left[1]]
			
			// mouse in item pool
			if(coord_item_pool[0] >= 0 && 
			coord_item_pool[0] <=   c.item_pool_size[0] &&
			coord_item_pool[1] >= 0 && 
			coord_item_pool[1] <= c.item_pool_size[1]){
				var item_index = Math.floor(coord_item_pool[0] / c.item_size) + item_pool_width * Math.floor(coord_item_pool[1] / c.item_size)
				// get the ith item from the item pool
				new_item = level.item_pool[item_index] 

			}


			// mouse in equips pool
			var coord_equip_pool = [point_clicked_canvas[0] - c.hero_equip_top_left[0], point_clicked_canvas[1] - c.hero_equip_top_left[1]]
			
			if(coord_equip_pool[0] >= 0 && 
			coord_equip_pool[0] <=   c.hero_pool_size[0] &&
			coord_equip_pool[1] >= 0 && 
			coord_equip_pool[1] <= c.hero_pool_size[1]){
				var item_index = Math.floor(coord_equip_pool[0] / c.item_size)  + Math.floor(coord_equip_pool[1] / c.item_size)* hero_pool_width
				// get the ith item from the item pool
				new_item = solution.get_ith_equip(this.state.draw_mode.hero,item_index) 
				new_item = level.item_pool[new_item];
			}
			if(new_item != this.state.draw_mode.item && new_item != undefined){
				this.state.draw_mode.item = new_item
				changed = true;
			}
			if(changed){
				this.draw_equips();
			}
		} else if(mode.mode == "dungeon"){
			var tile_clicked = this.get_dungeon_tile_clicked(point_clicked_scroll[0], point_clicked_scroll[1]);
			if(tile_clicked != undefined){
				this.set_infobox(tile_clicked[0], tile_clicked[1]);
			}
		}


		
	}
	start(interval=1000){
		if(this.state.run_level == undefined && this.moving == undefined){
			this.setState({run_level : new run_level(this.state.level, this.state.solution)} , function(){
			this.moving = setInterval(function(){ this.move()}.bind(this), interval);
			console.log("created interval" + this.moving)
			this.runningDiv.current.style.visibility = "visible";
			this.move();
			}.bind(this))
			
		}
	}
	stop(){
	this.setState({run_level:undefined}, function(){this.draw_dungeon()}.bind(this));
		clearInterval(this.moving);
		this.moving = undefined;
		this.runningDiv.current.style.visibility = "hidden";
	}
	move(){
		console.log("move called");
		var run_level_ = this.state.run_level;
		var draw_data =this.state.draw_data;
		var level = this.state.level;
		var solution = this.state.solution; 

		if(this.state.run_level != undefined){
			var end_result	 = false;
					var completed = this.state.run_level.completed();
					if(completed){
						end_result = this.check_end();
						var result = false;
					} else {
						var result = this.state.run_level.step();
					}
					if(!result){
							this.message_user("All heroes got stuck. Please press \"reset\"", 1000);
						}
					if(! end_result){
					this.draw_dungeon()
					}
				}
				
		
		
	}
	
	pause_resume(interval = 1000){
		if(this.state.run_level != undefined){
			if(this.moving == undefined){
				this.moving = setInterval(function(){this.move()}.bind(this), interval);
			} else {
				clearInterval(this.moving);
				this.moving = undefined;
			}
		}
	}
	skip_to_end(){
		if(this.moving != undefined){
			clearInterval(this.moving);
			this.moving = undefined;
		}
		// start / reset a solution. 
		this.setState({run_level:new run_level(this.state.level, this.state.solution)}, function(){
			// run_level over and over again until we're done, then draw dungeon
			var result = this.state.run_level.step();
			while(result){
				result =this.state.run_level.step();
			}
			this.move();
			this.draw_dungeon();
			this.check_end();
			this.runningDiv.current.style.visibility = "visible";
			
		}.bind(this))
	}
	// does something if we're done
	check_end(){
		if(this.state.run_level != undefined && this.state.run_level.completed()){
			clearTimeout(this.messageTimer);
			clearInterval(this.scrollInterval);
			clearInterval(this.moving);
			this.done = true;
			this.win_fn(Object.values(this.hero_map), this.start_time);
			return true;
		}
		return false;
	}
	step(){
		if(this.state.run_level != undefined){
			this.move();
		}
	}
	
	get_dungeon_tile_clicked(point_clicked_scroll_x, point_clicked_scroll_y){
		var draw_data =this.state.draw_data;
		var level = this.state.level;
		var tile_clicked = undefined;
		for(var dungeon of Object.keys(draw_data )){
					for(var i=0; i<level.dungeon_table[dungeon].stuff.length ;i++){
						var thing = level.dungeon_table[dungeon].stuff[i];
						var dungeon_start  = draw_data[dungeon];
						var coord_of_box = [dungeon_start[0] + i*c.box_width, dungeon_start[1]];
						if(coord_of_box[0] <=  point_clicked_scroll_x && point_clicked_scroll_x <= coord_of_box[0] + c.box_width && coord_of_box[1] <=  point_clicked_scroll_y && point_clicked_scroll_y <= coord_of_box[1] + c.box_height){
							tile_clicked =[dungeon, i, point_clicked_scroll_x - coord_of_box[0], point_clicked_scroll_y- coord_of_box[1]];
						}					
					}
					if(tile_clicked != undefined){
						return tile_clicked;
					}
				}
		return undefined;
	}
	canvasClicked(e){
		// determine which function in mouse_input to call
		// those functions mutate solution, so if the click has nothing to do with solution, then we might not call any of the functions
		var run_level_ = this.state.run_level;
		var draw_data =this.state.draw_data;
		var level = this.state.level;
		var solution = this.state.solution; // this will NEVER be undefined, we always have a "tentative solution" even if we're not running it
		var mode = this.state.draw_mode;
		var x_offset = mode.mode == "dungeon"? this.state.scroll.x_offset : 0;
		var y_offset = mode.mode == "dungeon"? this.state.scroll.y_offset : 0;
		var en = e.nativeEvent
		var mode = this.state.draw_mode;
		var en = e.nativeEvent
		var  currentTargetRect = this.canvasDiv.current.getBoundingClientRect();
		var point_clicked_canvas = [en.pageX - c.canvas_left,en.pageY - c.canvas_top]
		var point_clicked_scroll = [point_clicked_canvas[0] + this.state.scroll.x_offset,point_clicked_canvas[1] + this.state.scroll.y_offset] 
		////console.log(point_clicked_canvas)
	//	console.log(point_clicked_scroll)
		var tile_clicked = undefined;
		// check if the item is a dungeon.
		if(mode.mode == "dungeon"){
			if(run_level_ == undefined){
				// get which tile is clicked
				var tile_clicked = this.get_dungeon_tile_clicked(point_clicked_scroll[0], point_clicked_scroll[1]);
				
				
				// clicked a tile (still not running a level)
				if(tile_clicked != undefined){
					console.log("clicked tile is " + tile_clicked)
					var out = m.click_dungeon(level, solution, level.dungeon_table[tile_clicked[0]], tile_clicked[1] , tile_clicked[2], tile_clicked[3]);
					// if clicked on hero (not during run), then we need to go to equips
					if(out.to_hero != undefined){
						this.setState({
							draw_mode : {
								mode : "equips",
								hero : out.to_hero,
								item : undefined,
							}
						}, function(){this.change_state("dungeon","equips")}.bind(this))
					}
					
					// changed paths? re-draw them.
					if(out.changed_path){
						this.draw_connections();
					}
					if(out.changed_hatch){
						this.draw_dungeon();
					}
				}
			}
		} else if (mode.mode == "equips"){
			m.click_item(level, solution, mode.hero, point_clicked_canvas[0], point_clicked_canvas[1])
			console.log("equips looking at")
			if(point_clicked_canvas[0] >= c.exit_top_left[0] && point_clicked_canvas[1] >= c.exit_top_left[1] && point_clicked_canvas[0] <= c.exit_top_left[0]  + c.exit_size[0] && point_clicked_canvas[1] <= c.exit_top_left[1] + c.exit_size[1]){
				this.setState({
					draw_mode : {
						mode : "dungeon",
					}
				}, function(){this.change_state("equips","dungeon"); }.bind(this))
			}
			this.draw_equips();
		} else if (mode.mode == "instructions"){
			if(point_clicked_canvas[0] >= c.instructions_back_top_left[0] && point_clicked_canvas[0] <= c.instructions_back_top_left[0] + c.instructions_back_size[0] && point_clicked_canvas[1] >= c.instructions_back_top_left[1] && point_clicked_canvas[1] <= c.instructions_back_top_left[1] + c.instructions_back_size[1]){
				// go back
				this.state.draw_mode.mode = "dungeon";
				this.change_state("instructions", "dungeon");
			}
			if(point_clicked_canvas[0] >= c.instructions_left_top_left[0] && point_clicked_canvas[0] <= c.instructions_left_top_left[0] + c.instructions_left_size[0] && point_clicked_canvas[1] >= c.instructions_left_top_left[1] && point_clicked_canvas[1] <= c.instructions_left_top_left[1] + c.instructions_left_size[1]){
				// go left
				this.instructions_change_page(-1);
			}
			if(point_clicked_canvas[0] >= c.instructions_right_top_left[0] && point_clicked_canvas[0] <= c.instructions_right_top_left[0] + c.instructions_right_size[0] && point_clicked_canvas[1] >= c.instructions_right_top_left[1] && point_clicked_canvas[1] <= c.instructions_right_top_left[1] + c.instructions_right_size[1]){
				// go right
				this.instructions_change_page(1);
			}
		}
		//this.draw();
	}
	
	componentDidMount(){
		this.draw_background();
		this.draw_dungeon();
		this.draw_connections(true);
		this.message_user("Begin!", 1000);
		// minimap stuff
		var draw_data = this.state.draw_data;
		var size = this.state.boundaries;
		var x_scale_factor = c.minimap_size[0] / size[0];
		var y_scale_factor = c.minimap_size[1] / size[1];
		var ctx = this.minimapTop.current.getContext("2d");
		//d.drawRectangle(ctx, 0, 0, 1000, 1000, "black", 1, true)
		for(var item of Object.values(this.state.draw_data)){
			// scale the rectangles and draw them
			//console.log([x_scale_factor*item[0], y_scale_factor*item[1], x_scale_factor*(item[2]-item[0]), y_scale_factor*(item[3]-item[1])])
			ctx.fillStyle="white";
			ctx.fillRect(x_scale_factor*item[0], y_scale_factor*item[1], x_scale_factor*(item[2]-item[0]), y_scale_factor*(item[3]-item[1])*0.7 );
		}
		 
	}
	componentDidUpdate(){
		
	}
	change_state(old_state, new_state){
		if(new_state == "equips"){
			this.draw_equips();
		} else if (new_state == "dungeon"){
			this.canvasNS.current.getContext("2d").clearRect(0,0,1000,1000);
		} else if(new_state == "instructions"){
			this.state.draw_mode.mode = "instructions";
			this.instructions_page = 1;
			this.draw_instructions(1);
		}
	}
	//draws ONLY GREEN arrows
	draw_connections(){
		var level = this.state.level;
		var dag_ = this.state.level.dag;
		var solution = this.state.solution; 
		var mode = this.state.draw_mode;
		if(mode.mode == "dungeon"){
			
			
			for(var vertex of dag_.get_vertices()){
				if(level.dag.get_vertex_by_name(vertex).next.size == 0){
					continue;
				}
				var next_vertex = solution.directions[vertex];
				var next_vertex = level.dungeon_table[vertex].next[next_vertex];	
					// get the coordinates
					var coords=  this.get_connection_coordinates(vertex, next_vertex);
					var angle = Math.atan2(coords[3] - coords[1], coords[2] - coords[0]);
					// rotate the arrows and move them to the right spaces.
					var amounts = [0, 0.2, 0.4, 0.6, 0.8, 1];
					for(var i=0; i<this.nArrows; i++){
						var amount = amounts[i]
						var thisCoord = [amount * coords[0] + (1-amount )*coords[2],amount * coords[1] + (1-amount )*coords[3]]  
//						console.log(vertex + " " + i + " moved to " + thisCoord);
						this.arrows[vertex + " " + i].current.style.transform=  `translateX(${thisCoord[0]-20}px) translateY(${thisCoord[1]-20}px) rotate(${angle}rad)`
				}
			}
			
		}
	}
	// draw the background and all of the "dungeon cells"
	draw_background(){
		var draw_data =this.state.draw_data;
		var level = this.state.level;
		var ctx = this.canvasS2.current.getContext("2d");
		var ctxBG = this.canvasNS2.current.getContext("2d");
		d.drawImageStr(ctxBG, "./dungeon_background.png", 0,0, c.canvas_width, c.canvas_height);
		for(var dungeon_name of Object.keys(draw_data)){
			var point = draw_data[dungeon_name];
			var dungeon_stuff = level.dungeon_table[dungeon_name].stuff;
			var next = level.dungeon_table[dungeon_name].next
			// choose a theme for this dungeon
			// of the form "start, end (non-exit), end (exit), remainder"
			var hero = level.get_start(dungeon_name);
			var theme = this.theme[hero]
			var theme = [`./dungeon_themes/${theme}/dungeon_start.png`,`./dungeon_themes/${theme}/dungeon_end.png`,`./dungeon_themes/${theme}/dungeon_exit.png`,`./dungeon_themes/${theme}/dungeon.png`]
			for(var index = 0; index < dungeon_stuff.length; index ++){
				var location = [point[0] + index*c.box_width, point[1]] // 
				
				// choose an image
				if(index == 0){
					var dungeon_image = theme[0]					
				} else if(index == dungeon_stuff.length-1){
					if(next == "exit"){
						var dungeon_image =  theme[2]	
					} else {
						var dungeon_image =  theme[1]
					}					
				} else {
					var choices = theme.slice(3)
					var dungeon_image = choices[Math.floor(Math.random() * choices.length)]
				}
				
				if(dungeon_image == undefined){
					throw new Error("dungeon image undefined");
				}
				d.drawImageStr(ctx,dungeon_image, location[0], location[1], c.box_width, c.tile_height);
				// if it's an egg, draw the box underneath it
				
				if(dungeon_stuff[index] instanceof monster && dungeon_stuff[index].is_egg == true){
					d.drawRectangle(ctx,location[0] , location[1]+c.tile_height, location[0] +c.box_width, location[1]+c.box_height, "#2a1506", 1, true);
				}
				
				
			}

		}
		// extra draw stuff . ctx = scrolling canvas, ctxBG = non-scrolling canvas
		for(var thing of this.state.extra_draw_stuff){
			var ctxToDraw = thing.scroll ? ctx : ctxBG;
			if(thing.type  == "text"){
				d.drawText(ctxToDraw, thing.data, thing.x, thing.y, undefined, "white");
			} else if(thing.type  == "image"){
				d.drawImageStr(ctxToDraw, thing.data, thing.x, thing.y);
			}
		}
	}
	
	instructions_change_page(index){
		this.instructions_page += index
		if(this.instructions_page < 1 || this.instructions_page > 9){ // number of pages
			this.instructions_page -= index
		}
		this.draw_instructions(this.instructions_page);
	}
	draw_instructions(index){
		
		var ctx2 = this.canvasNS.current.getContext("2d");
		
		d.drawRectangle(ctx2,0, 0, 1000, 1000, "black", 1, true);
		// back button
		d.drawRectangle2(ctx2,c.instructions_back_top_left[0], c.instructions_back_top_left[1], c.instructions_back_size[0], c.instructions_back_size[1], "white", );
		
		d.drawText(ctx2, "Back", c.instructions_back_top_left[0]+30, c.instructions_back_top_left[1]+30, undefined, "white")
		
		// left button
		d.drawRectangle2(ctx2,c.instructions_left_top_left[0], c.instructions_left_top_left[1], c.instructions_left_size[0], c.instructions_left_size[1], "white", );
		
		d.drawText(ctx2, "prev", c.instructions_left_top_left[0]+30, c.instructions_left_top_left[1]+30, undefined, "white")		
		
		// right button
		d.drawRectangle2(ctx2,c.instructions_right_top_left[0], c.instructions_right_top_left[1], c.instructions_right_size[0], c.instructions_right_size[1], "white", );
		
		d.drawText(ctx2, "next", c.instructions_right_top_left[0]+30, c.instructions_right_top_left[1]+30, undefined, "white")		

		
		// text begins here
		
		/*
		1. get heroes to exit, 
		2. scroll with arrow keys or by clicking minimap
		3. explain play/stop/pause/buttons
		4. monsters
		5. items.
		6. branches
		7. scrolls and books
		8. keys
		9. eggs
		*/
		switch(index){
			case 1:
				d.drawText(ctx2, "Get the heroes (people inside circles) to the exit (glowing white tile)", 10, 30, undefined, "white");
				d.drawImageStr(ctx2, `./images/help/${index}.png`, 300, 200);
			break;
			case 2:
				d.drawText(ctx2, "Scroll the screen with arrow keys or by clicking on the minimap", 10, 30, undefined, "white")
				d.drawText(ctx2, "This is the minimap", 813, 463, undefined, "white")
			break;
			case 3:
				d.drawText(ctx2, "Buttons on the left:", 10, 30, undefined, "white");
				d.drawText(ctx2, "Start running your solution", 10, 60, undefined, "white");
				d.drawText(ctx2, "Stop running your solution to make changes", 10, 140, undefined, "white");
				d.drawText(ctx2, "You can only make changes (items, paths, eggs) when you are NOT running a solution", 10, 180, undefined, "white");
				d.drawText(ctx2, "Pause/resume your run", 10, 240, undefined, "white");
				d.drawText(ctx2, "Take one step for all heroes", 10, 340, undefined, "white");
				d.drawText(ctx2, "Run your solution instantly", 10, 440, undefined, "white");
			break;
			case 4:
				d.drawText(ctx2, "Monsters (YELLOW outline) block your heroes", 10, 40, undefined, "white")
				d.drawText(ctx2, "Monster weaknesses are shown on the top, and their drops on the bottom", 10, 80, undefined, "white")
				d.drawImageStr(ctx2, `./images/help/${index}.png`, 300, 140);
			break;
			case 5:
				d.drawText(ctx2, "Click on a hero's icon to access their inventory", 10, 40, undefined, "white")
				d.drawText(ctx2, "There, you can equip items", 10, 80, undefined, "white")
				
				d.drawImageStr(ctx2, `./images/help/${index}.png`, 10, 85);
			break;
			case 6:
				d.drawText(ctx2, "When the dungeon branchs, choose a path by clicking the first tile of the room to go to", 10, 40, undefined, "white")
				d.drawText(ctx2, "Or, click the last tile of the room to cycle through possible destinations", 10, 80, undefined, "white")
				d.drawImageStr(ctx2, `./images/help/${index}.png`, 100, 140);
			break;
			case 7:
				d.drawText(ctx2, "Scrolls (not to be confused with scrolling the map) and books (RED outline) kill all monsters weak to them.", 10, 40, undefined, "white")
				d.drawImageStr(ctx2, `./images/help/${index}.png`, 100, 50);
			break;
			case 8:
			d.drawText(ctx2, "Keys (BLUE outline) open all doors (PURPLE outline) that can be opened by them.", 10, 40, undefined, "white")	
			d.drawImageStr(ctx2, `./images/help/${index}.png`, 100, 50);
			break
			case 9:
			d.drawText(ctx2, "Monster eggs (green outline) are optional monsters.", 10, 40, undefined, "white")
			d.drawText(ctx2, "Click on them to toggle whether or not to hatch and fight them.", 10, 80, undefined, "white")
			d.drawImageStr(ctx2, `./images/help/${index}.png`, 100, 140);
			break;
		}
		
		d.drawText(ctx2, "Page " + index + "/9"  , 10, 550, undefined, "white")
	}
	// returns the x and y coordinates of 
	get_connection_coordinates(d1, d2){
		var dag_ = this.state.level.dag;
		var draw_data =this.state.draw_data;
		var run_level = this.state.run_level; // this can be undefined if we're not running a solution right now
		var level = this.state.level;
		var solution = this.state.solution; // this will NEVER be undefined, we always have a "tentative solution" even if we're not running it
		var mode = this.state.draw_mode;	
		var point = draw_data[d1];
		var dungeon_stuff = level.dungeon_table[d1].stuff
		var this_end = [point[0] + c.box_width*dungeon_stuff.length, point[1] + c.tile_height/2];			
		var next_point = [draw_data[d2][0], draw_data[d2][1]+c.tile_height/2];
		return this_end.concat(next_point);
	}
	
	
	draw_dungeon(){
		// draw the dungeon using draw_data
		// rules for drawing during a run:
		
		/*
		
		if a dungeon is a predecessor for any hero's current location , draw all nothings
		
		if a dungeon has a hero on it, then if index < hero's index, nothing. index = hero's index -> hero, index > hero's index -> usual
		
		otherwise, usual. 
		
		"usual" = draw what's on there. 
		
		*/
		var ctx1 = this.canvasS1.current.getContext("2d");
		ctx1.clearRect(0,0,this.state.boundaries[0],this.state.boundaries[1]);
		
		// ctx is DUNGEON canvas
		var dag_ = this.state.level.dag;
		var draw_data =this.state.draw_data;
		var run_level = this.state.run_level; // this can be undefined if we're not running a solution right now
		var level = this.state.level;
		var solution = this.state.solution; // this will NEVER be undefined, we always have a "tentative solution" even if we're not running it
		var mode = this.state.draw_mode;

		
		if(mode.mode == "dungeon"){
			var a = Date.now();
			//console.log("starting to draw")
			
			//draw connections first
			for(var dungeon_name of Object.keys(draw_data)){
				var dungeon_inst = level.dungeon_table[dungeon_name];
				if(dungeon_inst.next != "exit"){
					for(var next_dungeon of dungeon_inst.next){
						var coords = this.get_connection_coordinates(dungeon_name, next_dungeon);
						var this_end = [coords[0], coords[1]];
						var next_point = [coords[2], coords[3]];
						var color = "#333333";
						d.drawLine(ctx1, this_end[0], this_end[1], next_point[0], next_point[1], color, 20);
					}
				}
			}
			// for every dungeon
			for(var dungeon_name of Object.keys(draw_data)){
				
				var point = draw_data[dungeon_name];
				var dungeon_stuff = level.dungeon_table[dungeon_name].stuff
				var dungeon_inst = level.dungeon_table[dungeon_name];
				var is_pred = false;
				var current_index = undefined;

				// if we are running a solution, we need to check what to draw...

				if(run_level != undefined){
					var current_hero_name = undefined; // name of hero on this dungeon.
					var this_vertex = dag_.get_vertex_by_name(dungeon_name);
					
					// check if this is predecessor of any hero
					for(var hero_location of Object.values(run_level.locations)){
						var hero_vertex = dag_.get_vertex_by_name(hero_location);
						if(hero_vertex.pred.has(this_vertex)){
							is_pred = true;
							break;
						}
					}
					
					// check if there is a hero currently on here
					
					for(var hero_name of Object.keys(run_level.locations)){
						// don't draw exited heroes
						var hero_location =  run_level.locations[hero_name]
						if(hero_location == dungeon_name){
							current_index = run_level.location_index[hero_name];
							current_hero_name = hero_name;
							break;
						}
					}
				} 
				for(var index = 0; index < dungeon_stuff.length; index ++){
					var tile = dungeon_stuff[index];
					// each tile
					
					// is_pred and current_index for what to render
					// point for where to draw it;
					// build a call to draw_tile
					var location = [point[0] + index*c.box_width, point[1]] // location of this tile
					var thing = undefined;
					// is a predecessor
					if(is_pred){
						thing = "nothing";
					} else if(current_index != undefined && index == current_index ){
						// hero on here right now (including exited heroes if a hero exited from here)
						if( !run_level.exited[current_hero_name]){
							thing = "hero_" + current_hero_name;
						}else{
							thing = "nothing"
						}
					} else if(run_level == undefined && index == 0 && level.starts.indexOf(dungeon_name ) != -1){
						// not running a solution, hero starts here
						thing = "hero_" + dungeon_name;
					} else if(current_index != undefined && index < current_index){
						//hero has already passed here
						thing = "nothing";
					} else {
						thing = tile;
					}
					////console.log([dungeon_name, index, is_pred, current_index])
					
					draw_tile(ctx1,location[0], location[1], thing, this.hero_map);
					// we are not running a solution, so we need to draw "hatch buttons". 
					if(run_level == undefined){
						// if it's an egg:
						if(tile instanceof monster && tile.is_egg){
							if(solution.hatches[dungeon_name + " " + index] == true){
								d.drawText(ctx1,"HATCH", location[0]+2, location[1] + c.box_height-5, c.box_width-4, "green", 20)
							} else if(solution.hatches[dungeon_name + " " + index] == false){
								d.drawText(ctx1,"DON'T HATCH", location[0]+2, location[1] + c.box_height-5, c.box_width-4, "red", 20)
							}
						}
					}
				}
				
				//console.log(a -Date.now());
			} // end of for loop over every dungeon
			
			console.log(a -Date.now());
			
		} // end of (if mode = dungeon)
		
	}
	
	draw_equips(){
		console.log("draw equips called");
		var ctx2 = this.canvasNS.current.getContext("2d");
		var canvasObj = this.canvasNS.current;
		canvasObj.style.visibility ="hidden";
		d.drawRectangle(ctx2,0, 0, 1000, 1000, "white", 1, true)
		d.drawImageStr(ctx2,"./invBG.png", 0, 0);
		var dag_ = this.state.level.dag;
		var draw_data =this.state.draw_data;
		var run_level = this.state.run_level; // this can be undefined if we're not running a solution right now
		var level = this.state.level;
		var solution = this.state.solution; // this will NEVER be undefined, we always have a "tentative solution" even if we're not running it
		var mode = this.state.draw_mode;
		var x_offset = this.state.scroll.x_offset;
		var y_offset = this.state.scroll.y_offset;	
		// canvas is 990 x 600
		if(mode.mode == "equips"){

			//draw the rectangles
				//item pool
			d.drawRectangle(ctx2, c.item_pool_top_left[0], c.item_pool_top_left[1], c.item_pool_top_left[0] +  c.item_pool_size[0], c.item_pool_top_left[1] +  c.item_pool_size[1])
				//equips pool
			d.drawRectangle(ctx2, c.hero_equip_top_left[0], c.hero_equip_top_left[1], c.hero_equip_top_left[0] +  c.hero_pool_size[0], c.hero_equip_top_left[1] +  c.hero_pool_size[1])
				// back button
			d.drawRectangle(ctx2, c.exit_top_left[0], c.exit_top_left[1], c.exit_top_left[0] +  c.exit_size[0], c.exit_top_left[1] +  c.exit_size[1])
			d.drawText(ctx2, "Back" , c.exit_top_left[0] +10, c.exit_top_left[1] + c.exit_size[1]-20, undefined, "white")
				// legend
			d.drawText(ctx2, "E", c.legend_top_left[0], c.legend_top_left[1], undefined, "green")
			d.drawText(ctx2, " : equipped by this hero", c.legend_top_left[0]+30, c.legend_top_left[1], undefined, "white")
			
			d.drawText(ctx2, "E", c.legend_top_left[0], c.legend_top_left[1]+30, undefined, "red")
			d.drawText(ctx2, " : equipped by another hero", c.legend_top_left[0]+30, c.legend_top_left[1]+30, undefined, "white")
			// instructions
			d.drawText(ctx2, "Hero's inventory", 10, 220, undefined, "white")
			
			d.drawText(ctx2, "Global inventory", 550, 25, undefined, "white")
			
			d.drawText(ctx2, "Click to equip/unequip item", 100, 120, undefined, "white")
			var statuses = [];
			for(var i=0; i<level.item_pool.length; i++){
				if(solution.starting_items[i] == undefined){
					statuses.push("open");
				} else{
					statuses.push(solution.starting_items[i]);
				}
			}
			//draw_stuff.draw_equips
			draw_equips(ctx2, mode.hero, level.item_pool, statuses, mode.item, this.hero_map);
			canvasObj.style.visibility ="visible";
		}
	}


}
export default Renderer;
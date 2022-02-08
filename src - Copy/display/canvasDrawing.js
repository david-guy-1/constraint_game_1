var imgStrings = {};

export function drawLine(context, x0, y0, x1, y1, color = "black", width = 1) {
    //	////console.log(x0, y0, x1, y1)
    context.strokeStyle = (color == undefined ? "black" : color);
    context.lineWidth = (width == undefined ? 1 : width);
    context.beginPath();
    context.stroke();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}
export function drawImage(context, img, x, y, width=undefined, height=undefined, new_=false) {
	if(img.string == undefined){
		throw new Error("undefined image string")
	}
	//console.log("drawn " + JSON.stringify([img, x, y, width, height, new_]))
	if(width == undefined){
		context.drawImage(img, x, y);
	} else {
		context.drawImage(img, x, y, width, height);
	}
}
export function loadImage(string){
	if(string == undefined){
		throw new Error("loadImage undefined");
	}
	if(imgStrings[string] == undefined){
		var im = new Image();
		im.string = string;
		im.src = require("" + string).default;
		imgStrings[string] = im;		
	}
}

export function drawImageStr(context, string, x, y, width=undefined, height=undefined) {
	if(string == undefined){
		return; 
	}
	if(imgStrings[string] != undefined){
		var im = imgStrings[string]; // already loaded
		drawImage(context, im, x , y, width, height);
	} else {
		//console.log("loading " + string)
		var im = new Image();
		im.dx = x;
		im.dy = y;
		im.w = width;
		im.h = height
		im.context = context
		im.string = string
	//	console.log([x,y]);
		im.src = require("" + string).default;
		
		im.onload = function(){
			imgStrings[string] = this;
			drawImage(this.context, this, this.dx , this.dy, this.w, this.h, true);
		}.bind(im)
	}
	
	


}
//draws a circle with the given coordinates (as center) and color
export function drawCircle(context, x, y, r, color = "black", width = 1, fill=false, transparency=1) {
    //////console.log(x,y,r)
    
    context.lineWidth = (width == undefined ? 1 : width);
    context.beginPath();
    context.arc(x, y, r, 0 * Math.PI, 2 * Math.PI);
    if(fill){
	
		context.globalAlpha = transparency;	
		context.fillStyle = (color == undefined ? "black" : color);
		context.fill();
		context.globalAlpha = 1;
	} else {
		context.strokeStyle = (color == undefined ? "black" : color);
		context.stroke();
	}
}


//draws a rectangle with the given coordinates and color
export function drawRectangle(context, tlx, tly, brx, bry, color = "black", width = 1, fill = false,  transparency=1) {
	if(fill){
		context.globalAlpha = transparency;
		context.fillStyle = (color == undefined ? "black" : color);
    	context.fillRect(tlx, tly, brx - tlx, bry - tly);
		context.globalAlpha = 1;
	}
    else{
		context.lineWidth = (width == undefined ? 1 : width);
		context.strokeStyle = (color == undefined ? "black" : color);
		context.beginPath();
		context.rect(tlx, tly, brx - tlx, bry - tly);
		context.stroke();
	}
}
// uses width and height instead of bottom right coordinates
export function drawRectangle2(context, tlx, tly, width, height, color = "black", widthA = 1, fill = false,  transparency=1){
	drawRectangle(context, tlx, tly, tlx+width, tly+height, color, widthA, fill,  transparency)
	
}

export function drawText(context, text_, x, y, width =undefined, color = "black", size = 20) {
    context.font = size + "px Arial";
	context.fillStyle = color
	if(width == undefined){
		context.fillText(text_, x,y);
	} else{
		context.fillText(text_, x,y,width);
	}
}

// see drawRectangle
export function drawEllipse(context, posx, posy, brx, bry ,color="black", transparency=1){
	drawEllipse2(context, posx, posy, brx-posx, bry-posy ,color, transparency)
}

export function drawEllipse2(context, posx, posy, width, height ,color="black", transparency=1){
	context.beginPath();
	context.fillStyle=color
    context.globalAlpha = transparency;
	context.ellipse(posx, posy, width, height,0, 0, 2 * Math.PI);
	context.fill();
    context.globalAlpha = 1;
}


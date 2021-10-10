const points = [];
const bacteriaArr = [];
let score = 0;
const r = 0.8;	//radius disc
let num = 0;	//number of alive bacteria
let sumTime = 0;	
let lastTime = 0;
let sumTime2 = 0;
let bacteriaWin = 0;
const circle = 37;	//number of circumference points (disc)
class Point{
	constructor(degree){
		this.y = r * Math.sin(toRadians(degree));
		this.x = r * Math.cos(toRadians(degree));
		this.degree = degree;
		this.R = 1.0;
		this.G = 0.0;
		this.B = 0.0;
	}
}

class Bacteria {
    constructor(degree){  //circumference length
		this.r = (Math.random()*5)/100;
        this.y = r * Math.sin(toRadians(degree));
		this.x = r * Math.cos(toRadians(degree));
        this.degree = degree;
		this.R = Math.random();
		this.G = Math.random();
		this.B = Math.random();
		this.bool = false;
		this.arr = [];	//all 9 points on the circumference of the bacteria
		this.arr.push({x: this.x, y: this.y, R: this.R, G: this.G, B: this.B});
		for(let i = 0; i < 9; i++){
			this.arr.push({
				x: this.x + this.r * Math.cos(toRadians(i * 360/8)),
				y: this.y + this.r * Math.sin(toRadians(i * 360/8)),
				R: this.R,
				G: this.G,
				B: this.B,
			});
		}
		
    }
	updateVar(){
		for(let i = 0; i < 9; i++){
			this.arr[i] = {
				x: this.x + this.r * Math.cos(toRadians(i * 360/8)),
				y: this.y + this.r * Math.sin(toRadians(i * 360/8)),
				R: this.R,
				G: this.G,
				B: this.B,
			};
		}
	}
}

var triangleVertices = [
	//X,   Y,     R, G, B
	0.0,  0.0,    1, 0, 0,
	//-0.5,-0.5,    0, 1, 0,
	//0.5, -0.5,    0, 0, 1,
];

for(let i = 0; i < circle; i++){
	points[i] = new Point(i*10);
	triangleVertices.push(points[i].x);
	triangleVertices.push(points[i].y);
	triangleVertices.push(points[i].R);
	triangleVertices.push(points[i].G);
	triangleVertices.push(points[i].B);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

const isInside = (x, y, bacteria) => {
	let r_m = Math.sqrt(Math.pow((x-bacteria.x), 2) + Math.pow((y-bacteria.y),2));
	let M = (1/2)*Math.PI*(Math.pow((r_m),2));
	let B = (1/2)*Math.PI*(Math.pow((bacteria.r),2));
	if (M < B) {
		return true;
	}
	return false;
}

const spawnBacteria = () => {
    let temp = 3 + Math.ceil(Math.random() * 7);
    for(let i = num; i < num + temp; i++){
        bacteriaArr[i] = new Bacteria(Math.floor(Math.random() * 360));
		for(const j of bacteriaArr[i].arr){	
			triangleVertices.push(j.x);
			triangleVertices.push(j.y);
			triangleVertices.push(j.R);
			triangleVertices.push(j.G);
			triangleVertices.push(j.B);
		}
    }
	num += temp;
}

const deleteBacteria = (bacteria, bool) => {
	let index = bacteriaArr.indexOf(bacteria);
	if (bool){
		//explode(bacteriaArr[index]);
	}
    bacteriaArr.splice(index, 1);
	triangleVertices.splice((circle + 1)*5 + index*50, 50);
	num--;
	playerWin();
}

const collide = (bacteria) => {
	try {
		for (let i = 0; i < bacteriaArr.length; i++) {
			let temp = bacteriaArr.indexOf(bacteriaArr[i])
			for(let j = 0; j < bacteriaArr.length; j++){
				if(temp === j){
					continue;
				}
				let dist = Math.sqrt(Math.pow(bacteriaArr[i].x - bacteriaArr[j].x,2) + Math.pow(bacteriaArr[i].y - bacteriaArr[j].y,2))
				if(dist <= bacteriaArr[i].r + bacteriaArr[j].r){
					merge(bacteriaArr[i], bacteriaArr[j]);
				}
			}
		}
	}
	catch(error) {
		console.log('problem')
	}
}

const merge = (bacteria1, bacteria2) => {
	let midX = (bacteria1.x + bacteria2.x)/2;
	let midY = (bacteria1.y + bacteria2.y)/2;
	let midR = Math.sqrt((Math.pow((bacteria1.r + bacteria2.r), 2)))
	bacteriaArr.push(new Bacteria(Math.floor(Math.random() * 360)));
	num++;
	bacteriaArr[num-1].x = midX;
	bacteriaArr[num-1].y = midY;
	bacteriaArr[num-1].r = midR;
	if(bacteria1.r >= bacteria2.r){
		bacteriaArr[num-1].R = bacteria1.R;
		bacteriaArr[num-1].G = bacteria1.G;
		bacteriaArr[num-1].B = bacteria1.B;
	} else {
		bacteriaArr[num-1].R = bacteria2.R;
		bacteriaArr[num-1].G = bacteria2.G;
		bacteriaArr[num-1].B = bacteria2.B;
	}
	bacteriaArr[num-1].updateVar();
	for(const j of bacteriaArr[num-1].arr){
		triangleVertices.push(j.x);
		triangleVertices.push(j.y);
		triangleVertices.push(j.R);
		triangleVertices.push(j.G);
		triangleVertices.push(j.B);
	}
	deleteBacteria(bacteria1, false);
	deleteBacteria(bacteria2, false);

}

const checkStatus = () => {
	for(let i = 0; i < num; i++) {
		if(bacteriaArr[i].r > 0.2 && !bacteriaArr[i].bool){
			bacteriaWin++;
			console.log('Bacteria has reached threshold!');
			bacteriaArr[i].bool = true;
		}
		if(bacteriaWin >= 2 || score > 900){
			alert('You lost! Bacteria took over!');
			location.reload();
			break;
		}
	}
}

const playerWin = () => {
	if (num <= 0) {
		alert('You have won the game!');
		location.reload();
	}
}

const explode = (bacteria) => {
	const effect = new Bacteria(bacteria.degree);
	effect.r = bacteria.r + bacteria.r/2;
	effect.updateVar();
	for(const j of effect.arr){
		triangleVertices.push(j.x);
		triangleVertices.push(j.y);
		triangleVertices.push(j.R);
		triangleVertices.push(j.G);
		triangleVertices.push(j.B);
	}
}

spawnBacteria();

var vertexShaderText = [
'precision mediump float;',

'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',

'varying vec3 fragColor;',

'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = vec4(vertPosition,0.0,1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',

'varying vec3 fragColor;',

'void main()',
'{',
	
'	gl_FragColor = vec4(fragColor,1.0);',
'}',
].join('\n')

var InitDemo = function() {

	//////////////////////////////////
	//       initialize WebGL       //
	//////////////////////////////////
	console.log('this is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');
	

	if (!gl){
		console.log('webgl not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl){
		alert('your browser does not support webgl');
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0,0,canvas.width,canvas.height);

	

	//////////////////////////////////
	// create/compile/link shaders  //
	//////////////////////////////////
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader,vertexShaderText);
	gl.shaderSource(fragmentShader,fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
		return;
	}
	gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		console.error('Error compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);

	gl.linkProgram(program);
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
		console.error('Error linking program!', gl.getProgramInfo(program));
		return;
	}

	//////////////////////////////////
	//    create triangle buffer    //
	//////////////////////////////////

	//all arrays in JS is Float64 by default
	
	
	

	var triangleVertexBufferObject = gl.createBuffer();
	//set the active buffer to the triangle buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	//gl expecting Float32 Array not Float64
	//gl.STATIC_DRAW means we send the data only once (the triangle vertex position
	//will not change over time)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices),gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, //attribute location
		2, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		0*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
	gl.vertexAttribPointer(
		colorAttribLocation, //attribute location
		3, //number of elements per attribute
		gl.FLOAT, 
		gl.FALSE,
		5*Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
		2*Float32Array.BYTES_PER_ELEMENT//offset from the beginning of a single vertex to this attribute
		);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	canvas.onmousedown = function(ev) {
		var mx = ev.clientX, my = ev.clientY;
		mx = mx/canvas.width - 0.5;
		my = my/canvas.height - 0.5;
		mx = mx*2;
		my = my*-2;
		let x = mx;
		let y = my;
		for(let i = 0; i < bacteriaArr.length; i++){
			if(isInside(x, y, bacteriaArr[i])){
				deleteBacteria(bacteriaArr[i], true);
				break;
			}
		}
	}

	//////////////////////////////////
	//            Drawing           //
	//////////////////////////////////
	var loop = function(time = 0){
		sumTime += time - lastTime;
		sumTime2 += time - lastTime;
    	lastTime = time;
		gl.clearColor(0.5,0.8,0.8,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);	
		gl.drawArrays(gl.TRIANGLE_FAN,0,38);
		for(let i = 0; i < num; i++){
			gl.drawArrays(gl.TRIANGLE_FAN,38 + i * 10, 10);
		}
		if(sumTime > 500){
			for(let i = 0; i < num; i++){
				bacteriaArr[i].r += 0.01;
				bacteriaArr[i].updateVar();
				score += Math.round(50 * bacteriaArr[i].r);
				for(let j = 0; j < bacteriaArr[i].arr.length; j++){
					triangleVertices[circle*5 + (i*50) + (j*5) + 5] = bacteriaArr[i].arr[j].x;
					triangleVertices[circle*5 + (i*50) + (j*5 + 1) + 5] = bacteriaArr[i].arr[j].y;
				}
			}
			console.log(`Current score: ${score}`);
			sumTime = 0;
			checkStatus();
		}
		if(sumTime2 > 2300){
			spawnBacteria()
			sumTime2 = 0;
		}
		if(num > 1){
			collide();
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices),gl.STATIC_DRAW);
		requestAnimationFrame(loop);
	}		
	loop();

	
};
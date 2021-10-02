var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'  fragColor = vertColor;',
'  gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.5, 0.8, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var triangleVertices = 
	[ // X, Y,       R, G, B
		0.0, 0.5,    1.0, 1.0, 0.0,
		-0.5, -0.5,  0.0, 1.0, 0.0,
		0.5, -0.5,   0.0, 0.0, 1.0
	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	//
	// Main render loop
	//
    gl.useProgram(program);

    let loop = function(time = 0){
        //console.log(time);
        gl.clearColor(0.5, 0.8, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

};



const canvas = document.getElementById('game-surface');
const context = canvas.getContext('2d');

const x = canvas.width/2;      //initial circle coordinates
const y = canvas.height/2;
const r = 200;
const vel = 2;          //velocity (even for calculations)
let score = 0;

const arr = [];

class Bacteria {
    constructor(id, angle){  //circumference length
        this.id = id;
        this.x = r * Math.cos(toRadians(angle));
        this.y = r * (- Math.sin(toRadians(angle)));
        this.width = 3;
        this.height = 3;
        this.angle = angle;
        this.length = 0;
        this.alive = true;
    }
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

const spawnBacteria = () => {
    const num = Math.floor(Math.random() * 10);
    for(let i = 0; i < num; i++){
        arr[i] = new Bacteria(i, Math.floor(Math.random * 360));
    }
}

const bacteriaMove = (bacteria) => {
    bacteria.length += vel;
}

const isAlive = (bacteria) => {
    if(bacteria.alive){
        return true;
    }
    return false;
}

const deleteBacteria = (bacteria) => {
    if(!isAlive(bacteria)){
        arr.splice(bacteria.id, 1);
    }
}

const isInside = (pos, bacteria) => {
    return pos.x > bacteria.x - bacteria.width && pos.x < rect.pos.x + rect.dia.width && pos.y < rect.pos.y + rect.dia.height && pos.y > rect.pos.y;
}

canvas.addEventListener('click', function(event) {
    let mousePos = getMousePos(canvas, event);
    for(let i = 0; i < arr.length; i++){
        if(isInside(mousePos, arr[i])){
            arr[i].alive = false;
        }
    }
}, false)


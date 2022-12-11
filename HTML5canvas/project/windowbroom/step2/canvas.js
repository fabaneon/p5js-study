const canvas = document.querySelector("#canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let mouse = {
	x: canvas.width/2,
	y: canvas.height/2,
	click: false,
	drag: false,
	
	sponge: false,
	spongeAlpha: 0,
	spongeStartX: 0,
	spongeStartY: 0,
	spongeEndX: 0,
	spongeEndY: 0
	
	
}

window.addEventListener("mousedown",function(){
	mouse.click = true;
})
window.addEventListener("mouseup",function(){
	mouse.drag = false;
	mouse.click = false;
	
})

window.addEventListener("mousemove", function(){
	mouse.x = event.clientX - canvas.offsetLeft + window.scrollX;
    mouse.y = event.clientY - canvas.offsetTop + window.scrollY;
	mouse.spongeStartX = mouse.x-30;
	mouse.spongeStartY = mouse.y-30;
	mouse.spongeEndX = 60;
	mouse.spongeEndY = 60;
	
	if(mouse.click){
		mouse.drag = true;
	}
})


window.addEventListener("resize", function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;	
	contextSetup();
	})




	function createupperWater(x,y,radius,v,t,max,i){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.v = v * ((Math.random() * 1) * -1);
		this.t = t;
		
		console.log(v);
		
		let setRdadius = radius;
		
		this.draw = function (){
			ctx.fillStyle = "rgba(20,0,200,1)"
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
			ctx.fill();
			
		}
		
		this.update = function(){
			if(this.radius < radius/2 || this.radius > radius){
				this.v *= -1;
			}
			
			this.radius += this.v;
			
			
			
			this.draw();
			
		}
	}

	console.log("All EventListener Complete!");

	function createfog(x,y,radius,alpha){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.alpha = alpha;
		this.removeV = 0.5;
		this.recreate = 0.001;	
	
		this.draw = function(){
			ctx.fillStyle = "rgba(50,120,200,"+this.alpha+")";
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
			ctx.strokeStyle =  "rgba(50,120,200,"+this.alpha+")";
			ctx.stroke();
			ctx.fill();

			
		}
		
		this.update = function(){
			if(mouse.sponge){
				
				if(this.x > mouse.x-30 - this.radius && 
				  this.x < mouse.x+30 + this.radius&&
				  this.y > mouse.y-15 - this.radius&&
				  this.y < mouse.y+50 + this.radius){
					if(this.alpha <= 0){
						this.alpha = 0;
					}
					else{
						this.alpha -= this.removeV;
					}
				}
				else{
					if(this.alpha >= 1){
						this.alpha = 1;
					}
					else{
						this.alpha += this.recreate;
					}

				}
			}
			
			else{
					if(this.alpha >= 1){
						this.alpha = 1;
					}
					else{
						this.alpha += this.recreate;
					}
			}
			this.draw();
		}
		
	}



	console.log("All shapeCreateFunc Complete!");



let blankArr = [];
let upperWaterArr = [];
let fogArr = [];

function contextSetup(){
	
	let y = 0;
	const v = (0.1) * 0.5;
	const max = 20;
	var radius = max;
	
	const density = canvas.width/radius;
	const space = canvas.width/density;

	blankArr = [];
	upperWaterArr = [];
	fogArr = [];

	for(var x=0, i=0; x < canvas.width;i++, x+=space){
		var velocity = v;
		var radiussize = (Math.random()*max)+radius;
	
		upperWaterArr.push(new createupperWater(x ,0 , radiussize, velocity,y,radius,max,i));
	}
	
	for(var x=0; x < canvas.width; x+=space){
		for(y=0; y < canvas.height; y+=space){
			fogArr.push(new createfog(x,y,radius,1))
		}
	}
	

	console.log("BackgroundEntity Complete!");
	
	console.log("All Setup Complete!");
}
contextSetup();
console.log(upperWaterArr);



function Contentsdraw(){
	
	for(var i=0; i < fogArr.length; i++){
		fogArr[i].update();		
	}
	upperWaterArr.forEach((water,index)=>{
		water.update();
	})
		
}

function SpongeBox(){
		
		this.draw = function(){
			ctx.fillStyle = "rgba(0,120,50,"+mouse.spongeAlpha+")";
			ctx.beginPath();
			ctx.fillRect(mouse.spongeStartX,mouse.spongeStartY,
						 mouse.spongeEndX,mouse.spongeEndY)
			ctx.fill();

		}
		this.update = function(){
			
			this.x =  mouse.x;
			this.y =  mouse.y;

			if(mouse.click){
				if(mouse.drag){
					mouse.sponge = true;					
				}
				
				if(mouse.spongeAlpha > 1){
					mouse.spongeAlpha = 1;
				}
				else{
					mouse.spongeAlpha += 0.05;
				}	
			}
			else{
				mouse.sponge = false;
				if(mouse.spongeAlpha < 0){
					mouse.spongeAlpha = 0;
				}
				else{
					mouse.spongeAlpha -= 0.05;
				}
			}
			this.draw();
		}
	this.update();
}


function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	Contentsdraw();
	
	SpongeBox();
	
}
animate();
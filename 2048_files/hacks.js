
// To Do - Save Board Size..
 
 //
 
//Init variables for cookies

jSize = 4; 

temp=getCookie("size"); 
temp2=parseInt(temp); 
if (temp2 || temp2==0) {jSize=temp2} //board size

startTileValue=2; temp=getCookie("starttile"); temp2=parseInt(temp); 		if (temp2 || temp2==0) {startTileValue=temp2} 	// first starting tile(s) value(s)
numStartingTiles=2; temp=getCookie("numstarting"); temp2=parseInt(temp); 	if (temp2 || temp2==0) {numStartingTiles=temp2} // as the name suggests
randTileVal1=2; temp=getCookie("randtile1"); temp2=parseInt(temp); 			if (temp2 || temp2==0) {randTileVal1=temp2} 	// the common block spawn value
randTileVal2=4; temp=getCookie("randtile2"); temp2=parseInt(temp); 			if (temp2 || temp2==0) {randTileVal2=temp2} 	// the rare block spawn value
winValue=2048; temp=getCookie("winvalue"); temp2=parseInt(temp); 			if (temp2 || temp2==0) {winValue=temp2}       	// as the name suggests
multFactor=2; temp=getCookie("multFactor"); temp2=parseInt(temp); 			if (temp2 || temp2==0) {multFactor=temp2}    	// every time a block merges it gets multiplied by this
newToGenerateNum=1; temp=getCookie("newtogen"); temp2=parseInt(temp); 		if (temp2 || temp2==0) {newToGenerateNum=temp2} // number of new blocks each turn

//automatically saved cookie values
largeBlockColor="green"; temp=getCookie("blockcolor");		if (isColor(temp)) {largeBlockColor=temp};
boardZoom=1; temp=getCookie("boardzoom"); temp2=parseFloat(temp); if (temp2 || temp2==0) {boardZoom=temp2}; if (Math.abs(boardZoom-1)<.15){boardZoom=1}
letterColor="#776e65"; temp=getCookie("lettercolor"); 		if (temp) {letterColor=temp}; changeFontColor(letterColor);
fakeColorThresh=4096; temp=getCookie("fakecolorthresh"); temp2=parseInt(temp); if (temp2 || temp2==0) {fakeColorThresh=temp2}

//Checkbox variables, temporary variables, no cookie

removeOnClick =		false;
doAutoColoring = 	true;
blocksAreDraggable= false;
diffCanMerge =		false;

temp=getCookie("diff"); temp2=parseInt(temp); if (temp2) {jSize=temp2} //currently not using this, makes the game too boring

resetting=false;

initSize(jSize); //set up the board

generatePlacementStyles(jSize); //dynamically generate the css for the board animations

function setCookie(cname,value,time) //set a single cookie
{
var d = new Date();
if (!time)
{
//console.log("no time");
	time=1000*60*60*24*365; //One year
}
d.setTime(d.getTime()+(time));
var expires = "expires="+d.toGMTString();
if (value){document.cookie = cname + "=" + value + "; "+ expires;}
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++) 
  {
  var c = ca[i].trim();
  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
return "";
}

function deleteCookie(name)
{
	setCookie(name,"deleted",1); //set it to expire in 1 millisecond
}

function deleteAllCookies()  //for clear board
{
	deleteCookie("size");
	deleteCookie("starttile");
	deleteCookie("numstarting");
	deleteCookie("randtile1");
	deleteCookie("randtile2");
	deleteCookie("winvalue");
	deleteCookie("multfactor");
	deleteCookie("newtogen");
	deleteCookie('lettercolor');
	deleteCookie('fakecolorthresh');
	deleteCookie('boardzoom');
	deleteCookie('blockcolor');
	this.location.reload();
}

function setCookies() //serialize the form and set all cookies accordingly
{
	pairs=$("#form").serialize().split("&");
	count=0;
	for (i=0; i<pairs.length; i++)
	{
		vals=pairs[i].split("=");
		if (vals[1]!="") //if the name has a value (e.g that input in the form actually has stuff in it)
		{
			setCookie(vals[0],vals[1])
			count++;
		}
	}
	return count>0;
}

function setValues() //serialize the form and set all values accordingly (note: these are for the temporary hacks)
{
	pairs=$("#form3").serialize().split("&");
	for (i=0; i<pairs.length; i++)
	{
		vals=pairs[i].split("=");
		if (vals[1]!="")
		{
			//console.log("'"+vals[0]+"' '"+vals[1]+"'\n");
			if (vals[0]=="newtogen") { newToGenerateNum=parseInt(vals[1]); }  //manually set these variables if they were entered in the form
			else if (vals[0]=="randtile1") { randTileVal1=vals[1]; }
			else if (vals[0]=="randtile2") { randTileVal2=parseInt(vals[1]); }
			else if (vals[0]=="winvalue") { winValue=parseInt(vals[1]); }
		}
	}
	return false;
}

function calcOffSet()  //offset the board inside its div
{
	var specs=getComputedStyle($(".game-container")[0])
	//additional=1
	//if (specs.zoom>1) {additional=specs.zoom}
	return ((parseFloat(specs.width)*parseFloat(specs.zoom)-500)/2.0)/specs.zoom;
}

function initSize(size)  //dynamically generate the html for the board and splice it in
{
	row='<div class="grid-row">\n';
	cell1='<div class="grid-cell cell-';
	cell2='"></div>\n';
	build="";
	for (r=0; r<size; r++) {
		build+=row;
		for (c=0; c<size; c++) {
			build+=cell1+(r+1)+"-"+(c+1)+cell2;
		}
		build+="</div>\n";
	}
	newWidth=parseInt(size*106.25)+(jSize+1)*15;//+6/size-2*(4-jSize);
	
	$(".grid-container")[0].innerHTML=build;
	
	offSet=calcOffSet();
	
	if (offSet==0) {offSet=(newWidth-500)/2.0;}
	
	//initialize styles for the newly created objects, as well as for the slider
	$(".game-container")[0].setAttribute("style", "width: "+newWidth+"; height: "+newWidth+"; margin-left: -"+offSet);
	$("#zoomSlider")[0].min=.5/Math.max(parseInt(Math.log(jSize)/Math.log(1.5)),0); //a rule I made up, the larger the board, the farther you may zoom
	$("#zoomSlider")[0].step=.1/Math.log(jSize)/Math.log(4);
	$("#zoomSlider")[0].value=boardZoom;
	
	document.getElementsByClassName('game-container')[0].style.zoom=boardZoom;
	$('.game-container')[0].style.marginLeft=-calcOffSet();
	
	/*
	document.getElementById("userColorChoice").placeholder=largeBlockColor;
	$('#fontColorInput')[0].value=letterColor;
	$('#startingAutoColor')[0].placeholder=fakeColorThresh;
	if (jSize>8) { $("#colorCheckBox")[0].checked=false;$("#colorCheckBox")[0].disabled=true;doAutoColoring=false; }
	*/
}

function generatePlacementStyles(jSize) {
	
	//dynamically generates and integrates the css for motion and positioning off the blocks
	//each block should be spread out 121 pixels
	
	build="";
	for (x=1; x<=jSize; x++)
	{
		for (y=1; y<=jSize; y++)
		{
			left=(x-1)*121;
			to=(y-1)*121;
			build+=".tile.tile-position-"+x+"-"+y+"{\nposition:absolute;\nleft:"+left+";\ntop:"+to+";\n}\n";
		}
	}
	st=document.createElement("style");
	st.innerHTML=build;
	st.type="text/css"
	document.head.appendChild(st);
}

//for the check box variable

function deleteOnClick() {

	if (!removeOnClick) {
		$(".tile").removeAttr("onclick");
		console.log("returning");
		return false;
	}
	
	//basically, add a onclick function to every block every turn, not sure where I remove them, but I do need to fix this, it only removes them AFTER the next turn
	
	for (x=1; x<=jSize; x++) {
		for (y=1; y<=jSize; y++) {
			tile=$(".tile-position-"+x+"-"+y);
			if (tile.length>0) {
				for (i=0; i<tile.length; i++) {
					$(".tile-position-"+x+"-"+y)[i].setAttribute('onclick',"manager.removeTile("+x+","+y+")");//[0].setAttribute("onclick","manager.remove")
			}}
		}
	}
}

//for the check box variable

function updateColors() {
	
	//if auto coloring is off
	if (!doAutoColoring) {
		for (x=1; x<=jSize; x++) {
			for (y=1; y<=jSize; y++) {
				tile=$(".tile-position-"+x+"-"+y);
				if (tile.length>0) {
					for (i=0; i<tile.length; i++) {
						if (parseInt(tile[i].innerHTML)>=fakeColorThresh || true) {
						/*getComputedStyle(tile[i]).background.indexOf("rgb(238, 228, 218)")>=0 && */
						//if the block is white and greater than fakeColorThresh
					
							tile[i].style.background="";
						}
					}
				}
			}
		}
		return false;
	}
	highestBlock=0;
	lowestBlock=Math.pow(2,32)
	
	for (x=1; x<=jSize; x++) {
		for (y=1; y<=jSize; y++) {
			tile=$(".tile-position-"+x+"-"+y);
			if (tile.length>0) {
				for (i=0; i<tile.length; i++) {
					if (parseInt(tile[i].innerHTML)>=fakeColorThresh) {
						/*getComputedStyle(tile[i]).background.indexOf("rgb(238, 228, 218)")>=0 && */
						//if the block is white and greater than 2048
						if (parseInt(tile[i].innerHTML)>highestBlock){highestBlock=parseInt(tile[i].innerHTML);}
						if (parseInt(tile[i].innerHTML)<lowestBlock){lowestBlock=parseInt(tile[i].innerHTML);}
					}
				}
			}
		}
	}
	thresh=200/Math.max(1,Math.log(highestBlock)/Math.log(2)-Math.log(lowestBlock)/Math.log(2));
	max=Math.log(highestBlock)/Math.log(2);
	min=Math.log(lowestBlock)/Math.log(2);
	if (!isFinite(max) || !isFinite(min)) { return; }
	for (x=1; x<=jSize; x++) {
		for (y=1; y<=jSize; y++) {
			tile=$(".tile-position-"+x+"-"+y);
			if (tile.length>0) {
				for (i=0; i<tile.length; i++) {
					if (parseInt(tile[i].innerHTML)>=fakeColorThresh) {
						/*getComputedStyle(tile[i]).background.indexOf("rgb(238, 228, 218)")>=0 && */
						//if the block is white and greater than 2048
						temp=/*255-10**/max-Math.log(parseInt(tile[i].innerHTML))/Math.log(2);
						//diff=temp-min+1;
						//temp=255/diff;
						//console.log(temp,thresh,thresh*temp);
						temp=thresh*temp;
						temp=Math.max(0,temp);
						temp=Math.min(200,temp); //make sure temp is between 0 and 255
						temp=parseInt(temp);
						//console.log(temp,tile[i]);
						//temp=parseInt(thresh*Math.round(temp/thresh));
						buildColor="";
						if (largeBlockColor=="purple") { buildColor="255,"+temp+",255"; }
						else if (largeBlockColor=="red") { buildColor="255,"+temp+","+temp; }
						else if (largeBlockColor=="blue") { buildColor=temp+","+temp+",255"; }
						else if (largeBlockColor=="aqua") { buildColor=temp+",255,255"; }
						else if (largeBlockColor=="yellow") { buildColor="255,255,"+temp; }
						else if (largeBlockColor=="black") { buildColor=temp+","+temp+","+temp; }
						else buildColor=temp+",255,"+temp;//green
						tile[i].style.background="rgb("+buildColor+") none repeat scroll 0% 0% / auto padding-box border-box"; //green
						//tile[i].style.background="rgb(255,"+temp+","+temp+") none repeat scroll 0% 0% / auto padding-box border-box"; //red
						//tile[i].style.background="rgb("+temp+","+temp+",255) none repeat scroll 0% 0% / auto padding-box border-box";//blue
						//tile[i].style.background="rgb("+temp+",255,255) none repeat scroll 0% 0% / auto padding-box border-box"; //aqua
						//tile[i].style.background="rgb(255,"+temp+",255) none repeat scroll 0% 0% / auto padding-box border-box"; //purple
						//tile[i].style.background="rgb(255,255,"+temp+") none repeat scroll 0% 0% / auto padding-box border-box"; //yellow
					}
				}
			}
		}
	}
}

function isColor(c) {
	return (c=="green" || c=="blue" || c=="red" || c=="yellow" || c=="aqua" || c=="purple" || c=="black")
}

function valPair(data,s) {
	start=data.indexOf(s)+s.length+1;
	next=data.indexOf("&",start);
	if (next==-1){next=data.length}
	return data.substring(start,next);
}

function spawnInput() {
	
	//basically reads information from the spawn block form and executes accordingly
	
	data=$('#form2').serialize();
	row=parseInt(valPair(data,"row"));
	col=parseInt(valPair(data,"col"));
	randLoc=($("#randLoc")[0].value.length>0);
	val=valPair(data,"spawnVal");
	low=parseInt(valPair(data,"sliderLow"));
	high=parseInt(valPair(data,"sliderHigh"));
	x=Math.floor(Math.random()*jSize)+1;
	y=Math.floor(Math.random()*jSize)+1;
	if (!isNaN(row)){y=row;}
	if (!isNaN(col)){x=col;}
	v=Math.pow(2,Math.floor(Math.random()*(high-low+1))+low);
	if (val.length>0){v=val;}
	manager.addTile(v,y,x);
}

function generatePerfectBoard() {
	start=2
	for (r=0; r<jSize; r++) {
		for (c=0; c<jSize; c++) {
			if (r==0 && c==0) {
				manager.addTile(2,1,1);
			} else {
				newC=c+1
				if (r%2==1) { newC=jSize-c} //if we are on a second row, add the next things backwards
				manager.addTile(start,newC,r+1);
				start*=multFactor;
			}
		}
	}
	winValue=start;
}

function doAi() {

	var aiVal=setInterval(function(){manager.run()},minSearchTime*2);
	var winCheckVal=setInterval(function(){if (manager.over){ window.clearInterval(aiVal);window.clearInterval(winCheckVal); } },250);
}

function checkColor(c) {
	if ($('#startingAutoColor')[0].value){fakeColorThresh=$('#startingAutoColor')[0].value;};
		c=document.getElementById("userColorChoice").value.toLowerCase();
		//d=isColor(document.getElementById("userColorChoice").placeholder.toLowerCase())
		if (isColor(c)) {
			if (c){ largeBlockColor=c; }
			$('#startingAutoColor').blur();
			$("#userColorChoice").blur(); //if it is a legal color, set the variable to it, and focus the game again
			$(".game-container").click();
		} else {
			alert("Possible colors include:\ngreen\nred\nblue\nyellow\npurple\naqua\nblack");
			document.getElementById("userColorChoice").value="";//"green";//set input value
    }
    updateColors();
}

window.onbeforeunload=function() {
	if (document.cookie.length>0 || !resetting){ //i.e we haven't tried to reset all values
	setCookie("boardzoom",document.getElementById("zoomSlider").value);
	setCookie("blockcolor",largeBlockColor);
	setCookie('lettercolor',letterColor);
	setCookie('fakecolorthresh',fakeColorThresh);}
}

function changeFontColor(val) {
	letterColor=val;
	document.getElementById("fontColor").innerHTML=".tile {color: "+val+" !important;}"
}

function snap(x,y) {
	//leftExtra=$(".cell-1-1").offset().left;
	//topExtra=$(".cell-1-1").offset().top;
	//console.log(x-leftExtra,y=topExtra);
	xVal=121*Math.round(parseInt(x/*-leftExtra*/)/121.0);
	yVal=121*Math.round(parseInt(y/*-topExtra*/)/121.0);
	if (xVal<=0){xVal=0}else if(xVal>(jSize-1)*121){xVal=(jSize-1)*121};
	if (yVal<=0){yVal=0}else if(yVal>(jSize-1)*121){yVal=(jSize-1)*121};
	return {x:xVal,y:yVal};
}

tilePicked=false;cellPicked=false;
function toggleDraggable() {
	blocksAreDraggable=!blocksAreDraggable;
	if (!blocksAreDraggable){
		$(".grid-cell, .tile").removeClass('selected');
		$(".tile").removeClass('draggable');
		initDragging();
	} else {
		$(".tile").addClass('draggable');
		$(".grid-cell, .tile").hover(function(){$(this).animate({webkitFilter:"brightness(120%)"},100)});
		initDragging();
	}
}

//this part here is for .draggable blocks
function initDragging() {
	//if (!blocksAreDraggable) {return;}
	$('.draggable').mousedown(function(){
	div=this;
	offsetX=event.offsetX;
	offsetY=event.offsetY;
	extraX=$(".cell-1-1").offset().left; //these two are because cells are placed absolutely within an absolute div
	extraY=$(".cell-1-1").offset().top;  //and therefore are relative to its parents.
	document.onmousemove=function(event){
		//console.log(event);
		x=event.pageX;
		y=event.pageY;
		//console.log(x,y,offsetX,offsetY);
		div.style.left=x-offsetX-extraX;
		div.style.top=y-offsetY-extraY;
	}
});

$('.draggable').mouseup(function(){
	var pos=snap(this.style.left, this.style.top);
	div.style.top=pos.y;
	div.style.left=pos.x;
	document.onmousemove=function(){};
});
}

// eof //////////
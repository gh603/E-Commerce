function openSideNav() {
    document.getElementById('mySideNav').style.width = "200px";
    document.getElementById('main').style.marginLeft = "200px";
}

function closeSideNav() {
    document.getElementById('mySideNav').style.width = "0";
    document.getElementById('main').style.marginLeft = "0";
}


function hide_phone() {
    var items = document.getElementsByClassName('phone'), i;

	for (var i = 0; i < items.length; i ++) {
  
    
    if (items[i].style.display === "none") {
        items[i].style.display = "block";
    } else {
        items[i].style.display = "none";
    }
    
    
}
}


function hide_Camera_Lens() {
    var items = document.getElementsByClassName('Camera Lens'), i;

	for (var i = 0; i < items.length; i ++) {
  
    
    if (items[i].style.display === "none") {
        items[i].style.display = "block";
    } else {
        items[i].style.display = "none";
    }
    
    
}
}


function hide_Headphone() {
    var items = document.getElementsByClassName('Headphone'), i;

	for (var i = 0; i < items.length; i ++) {
  
    
    if (items[i].style.display === "none") {
        items[i].style.display = "block";
    } else {
        items[i].style.display = "none";
    }
    
    
}
}


function hide_Shoes() {
    var items = document.getElementsByClassName('Shoes'), i;

	for (var i = 0; i < items.length; i ++) {
  
    
    if (items[i].style.display === "none") {
        items[i].style.display = "block";
    } else {
        items[i].style.display = "none";
    }
    
    
}
}




function filt_Headphone(){
	hide_Shoes();
	hide_Camera_Lens();
	hide_phone();
}


function filt_Shoes(){
	hide_Headphone();
	hide_Camera_Lens();
	hide_phone();
}


function filt_Camera_Lens(){
	hide_Headphone();
	hide_Shoes();
	hide_phone();
}

function filt_phone(){
	hide_Headphone();
	hide_Shoes();
	hide_Camera_Lens();
}
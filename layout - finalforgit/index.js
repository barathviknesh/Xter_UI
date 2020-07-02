// layconwidth = 600;
// layconheight = 800;
// function layercontainer(layconwidth, layconheight) {
//   layoutc = document.getElementById("lay");
// }
// console.log(config, "hello");
// console.log(config.pageColumnDetails.LAYOUT1.columnDetails[0].width);
// function generate_table() {
//   console.log("hii");
//   var body = document.getElementById("layoutHead");
//   var divColumnOne = document.createElement("div");
//   divColumnOne.setAttribute("class", "divColOne");
//   divColumnOne.style.cssFloat = "left";
//   divColumnOne.style.height = "600px";
//   divColumnOne.style.width =
//     config.pageColumnDetails.LAYOUT1.columnDetails[0].width;

//   var divColumnTwo = document.createElement("div");
//   divColumnTwo.setAttribute("class", "divColTwo");
//   divColumnTwo.style.cssFloat = "left";
//   divColumnTwo.style.height = "600px";
//   divColumnTwo.style.width =
//     config.pageColumnDetails.LAYOUT1.columnDetails[0].width;
//   body.appendChild(divColumnOne);
//   body.appendChild(divColumnTwo);
// }
// generate_table();

// console.log(config, "hello");
// console.log(config.pageColumnDetails.LAYOUT1.columnDetails[0].width);
// function generate_table() {
//   console.log("hii");
//   var masterbody = document.getElementById("layoutHead");
//   masterBody.setAttribute("class", "masterBody");
//   masterbody.style.width = "260px";
//   masterbody.style.height = "610px";
//   masterbody.style.border = "thick solid";

//   masterbody.appendChild(box);

//   var box = document.getElementById("layoutHead");
//   var divColumnOne = document.createElement("div");
//   divColumnOne.setAttribute("class", "divColOne");
//   divColumnOne.style.border = "thick solid";
//   divColumnOne.style.cssFloat = "left";
//   divColumnOne.style.height = "600px";
//   divColumnOne.style.width =
//     config.pageColumnDetails.LAYOUT1.columnDetails[0].width;

//   var divColumnTwo = document.createElement("div");
//   divColumnTwo.setAttribute("class", "divColTwo");
//   divColumnTwo.style.border = "thick solid";
//   divColumnTwo.style.cssFloat = "left";
//   divColumnTwo.style.height = "600px";
//   divColumnTwo.style.width =
//     config.pageColumnDetails.LAYOUT1.columnDetails[0].width;
//   box.appendChild(divColumnOne);
//   box.appendChild(divColumnTwo);
// }
// generate_table();
function generate_table() {
  console.log("divclearedfromsinglecolumn");
  document.getElementById("layoutHead").innerHTML = "";
  console.log("fromgentable");
  var parentbox = document.getElementById("layoutHead");
  var chilboxone = document.createElement("div");
  chilboxone.setAttribute("class", "ChildBoxOne");
  chilboxone.style.width = "541px";
  chilboxone.style.height = "960px";
  chilboxone.style.border = "1px solid";
  chilboxone.style.marginLeft = "200px";
  // chilboxone.style.marginTop = "20px";

  var chilboxtwo = document.createElement("div");
  chilboxtwo.setAttribute("class", "childBoxTwo");
  chilboxtwo.style.width = "240px";
  chilboxtwo.style.height = "900px";
  chilboxtwo.style.border = "1px solid";
  chilboxtwo.style.cssFloat = "left";
  chilboxtwo.style.marginLeft = "15px";
  chilboxtwo.style.marginTop = "15px";

  var chilboxthree = document.createElement("div");
  chilboxthree.setAttribute("class", "childBoxThree");
  chilboxthree.style.width = "240px";
  chilboxthree.style.height = "900px";
  chilboxthree.style.border = "1px solid";
  chilboxthree.style.cssFloat = "left";
  chilboxthree.style.marginLeft = "15px";
  chilboxthree.style.marginTop = "15px";

  chilboxone.appendChild(chilboxtwo);
  chilboxone.appendChild(chilboxthree);
  parentbox.appendChild(chilboxone);
}
// generate_table();

// doublecolumn

function doubleColumn() {
  console.log("divclearedfromdoublecolumn");
  document.getElementById("layoutHead").innerHTML = "";
  console.log("formdoublecolumfunction");
  var Dparentbox = document.getElementById("layoutHead");
  var dchilboxone = document.createElement("div");
  dchilboxone.setAttribute("class", "dChildBoxOne");
  dchilboxone.style.width = "541px";
  dchilboxone.style.height = "960px";
  dchilboxone.style.border = "1px solid";
  dchilboxone.style.marginLeft = "200px";
  // dchilboxone.style.marginRight = "100px";
  // chilboxone.style.marginTop = "20px";

  var dchilboxtwo = document.createElement("div");
  dchilboxtwo.setAttribute("class", "childBoxTwo");
  dchilboxtwo.style.width = "240px";
  dchilboxtwo.style.height = "900px";
  dchilboxtwo.style.border = "1px solid";
  dchilboxtwo.style.cssFloat = "left";
  dchilboxtwo.style.marginLeft = "15px";
  dchilboxtwo.style.marginTop = "15px";

  var dchilboxthree = document.createElement("div");
  dchilboxthree.setAttribute("class", "childBoxThree");
  dchilboxthree.style.width = "240px";
  dchilboxthree.style.height = "900px";
  dchilboxthree.style.border = "1px solid";
  dchilboxthree.style.cssFloat = "left";
  dchilboxthree.style.marginLeft = "15px";
  dchilboxthree.style.marginTop = "15px";
  // dchilboxthree.style.marginRight = "15px";

  dchilboxone.appendChild(dchilboxtwo);
  dchilboxone.appendChild(dchilboxthree);
  Dparentbox.appendChild(dchilboxone);

  // secound double column#########################################################################################################

  var d2chilboxone = document.createElement("div");
  d2chilboxone.setAttribute("class", "d2ChildBoxOne");
  d2chilboxone.style.width = "541px";
  d2chilboxone.style.height = "960px";
  d2chilboxone.style.border = "1px solid";
  d2chilboxone.style.marginLeft = "750px";
  d2chilboxone.style.cssFloat = "left";
  d2chilboxone.style.marginTop = "-960px";
  d2chilboxone.style.marginRight = "150px";

  var d2chilboxtwo = document.createElement("div");
  d2chilboxtwo.setAttribute("class", "d2childBoxTwo");
  d2chilboxtwo.style.width = "240px";
  d2chilboxtwo.style.height = "900px";
  d2chilboxtwo.style.border = "1px solid";
  d2chilboxtwo.style.cssFloat = "left";
  d2chilboxtwo.style.marginLeft = "15px";
  d2chilboxtwo.style.marginTop = "15px";

  var d2chilboxthree = document.createElement("div");
  d2chilboxthree.setAttribute("class", "d2childBoxThree");
  d2chilboxthree.style.width = "240px";
  d2chilboxthree.style.height = "900px";
  d2chilboxthree.style.border = "1px solid";
  d2chilboxthree.style.cssFloat = "left";
  d2chilboxthree.style.marginLeft = "15px";
  d2chilboxthree.style.marginTop = "15px";

  d2chilboxone.appendChild(d2chilboxtwo);
  d2chilboxone.appendChild(d2chilboxthree);
  Dparentbox.appendChild(d2chilboxone);
}
// doubleColumn();

// function generate_table2() {
//   console.log("fromgentable2");
//   var parentbox = document.getElementById("layoutHead");
//   var chilboxone = document.createElement("div");
//   chilboxone.setAttribute("class", "ChildBoxOne");
//   chilboxone.style.width = "541px";
//   chilboxone.style.height = "960px";
//   chilboxone.style.border = "1px solid";
//   chilboxone.style.marginLeft = "200px";
//   // chilboxone.style.marginTop = "20px";

//   var chilboxtwo = document.createElement("div");
//   chilboxtwo.setAttribute("class", "childBoxTwo");
//   chilboxtwo.style.width = "240px";
//   chilboxtwo.style.height = "900px";
//   chilboxtwo.style.border = "1px solid";
//   chilboxtwo.style.cssFloat = "left";
//   chilboxtwo.style.marginLeft = "15px";
//   chilboxtwo.style.marginTop = "15px";

//   var chilboxthree = document.createElement("div");
//   chilboxthree.setAttribute("class", "childBoxThree");
//   chilboxthree.style.width = "240px";
//   chilboxthree.style.height = "900px";
//   chilboxthree.style.border = "1px solid";
//   chilboxthree.style.cssFloat = "left";
//   chilboxthree.style.marginLeft = "15px";
//   chilboxthree.style.marginTop = "15px";

//   chilboxone.appendChild(chilboxtwo);
//   chilboxone.appendChild(chilboxthree);
//   parentbox.appendChild(chilboxone);
// }
// generate_table2();

// function generate_tableTwo() {
//   console.log("fromgentable");
//   var parentbox = document.getElementById("layoutHead2");
//   var chilboxone = document.createElement("div");
//   chilboxone.setAttribute("class", "ChildBoxOne");
//   chilboxone.style.width = "541px";
//   chilboxone.style.height = "960px";
//   chilboxone.style.border = "thick solid";
//   chilboxone.style.marginLeft = "280px";

//   var chilboxtwo = document.createElement("div");
//   chilboxtwo.setAttribute("class", "childBoxTwo");
//   chilboxtwo.style.width = "240px";
//   chilboxtwo.style.height = "900px";
//   chilboxtwo.style.border = "thick solid";
//   chilboxtwo.style.cssFloat = "left";
//   chilboxtwo.style.marginLeft = "15px";
//   chilboxtwo.style.marginTop = "15px";

//   var chilboxthree = document.createElement("div");
//   chilboxthree.setAttribute("class", "childBoxThree");
//   chilboxthree.style.width = "240px";
//   chilboxthree.style.height = "900px";
//   chilboxthree.style.border = "thick solid";
//   chilboxthree.style.cssFloat = "left";
//   chilboxthree.style.marginLeft = "15px";
//   chilboxthree.style.marginTop = "15px";

//   chilboxone.appendChild(chilboxtwo);
//   chilboxone.appendChild(chilboxthree);
//   parentbox.appendChild(chilboxone);
// }
// generate_tableTwo();

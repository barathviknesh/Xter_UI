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
  console.log("fromgentable");
  var parentbox = document.getElementById("layoutHead");
  var chilboxone = document.createElement("div");
  chilboxone.setAttribute("class", "ChildBoxOne");
  chilboxone.style.width = "541px";
  chilboxone.style.height = "960px";
  chilboxone.style.border = "thick solid";
  chilboxone.style.marginLeft = "280px";
  // chilboxone.style.marginTop = "20px";

  var chilboxtwo = document.createElement("div");
  chilboxtwo.setAttribute("class", "childBoxTwo");
  chilboxtwo.style.width = "240px";
  chilboxtwo.style.height = "900px";
  chilboxtwo.style.border = "thick solid";
  chilboxtwo.style.cssFloat = "left";
  chilboxtwo.style.marginLeft = "15px";
  chilboxtwo.style.marginTop = "15px";

  var chilboxthree = document.createElement("div");
  chilboxthree.setAttribute("class", "childBoxThree");
  chilboxthree.style.width = "240px";
  chilboxthree.style.height = "900px";
  chilboxthree.style.border = "thick solid";
  chilboxthree.style.cssFloat = "left";
  chilboxthree.style.marginLeft = "15px";
  chilboxthree.style.marginTop = "15px";

  chilboxone.appendChild(chilboxtwo);
  chilboxone.appendChild(chilboxthree);
  parentbox.appendChild(chilboxone);
}
generate_table();

var kriya = opener ? opener.kriya : null;
var ts = {
  tableSettings: {
    specialChar: {
      endash: "u2013",
      plusorminus: "u00B1",
      minus: "u2212",
    },
    columnNames: {
      "1": {
        layout: "singleColumn",
        name: "Single Column",
        color: "#00bcd470",
      },
      "2": {
        layout: "doubleColumn",
        name: "Double Column",
        color: "#00bcd4d4",
      },
      "3": {
        layout: "threeColumn",
        name: "Three Column",
        color: "#00bcd4d4",
      },
      "4": {
        layout: "fourColumn",
        name: "Four Column",
        color: "#00bcd4d4",
      },
      landScape: {
        name: "Landscape",
        color: "#04a3b7",
      },
      spreadColumn: {
        name: "Spread Column",
        color: "#0294a7",
      },
    },
  },
  rotateTextDeg: {
    vertical: "-90",
    diagonal: "-45",
  },
  autoTypesetTable: false,
  ini: function (callbackfn) {
    ts.initTable();
    //Trigger initialize fiunction all fonts are loaded
    var everythingLoaded = setInterval(function () {
      if (/loaded|complete/.test(document.fonts.status)) {
        clearInterval(everythingLoaded);
        console.log(document.fonts.status);
        if (ts.checkTableFont()) {
          ts.initLayoutBorder();

          if (
            $("#tableContainer table").attr("data-stub-column") == "true" &&
            $("#stub-column:visible").length > 0
          ) {
            $("#stub-column")[0].checked = true;
            ts.layoutWithStub(false);
          } else if ($("#stub-column:visible").length > 0) {
            ts.layoutWithStub(true);
          }

          ts.initStyle();
          ts.autoAdjustColumn();
        }
        if (callbackfn) {
          callbackfn();
        }
      }
    }, 10);
  },
  initConfig: function () {
    var proofPrefix = $("body").attr("data-proof-prefix");
    var layoutName = config.articleTypeDetails[proofPrefix];
    layoutName = config.pageColumnDetails[layoutName] ? layoutName : "LAYOUT1";

    var configCSS = "";
    var fontFamily = "";
    //Constructing css for table
    if (config && config.tableSetter && config.tableSetter.table) {
      configCSS = "table { border: 1px dotted !important;";
      if (config.tableSetter.table.css) {
        var objKeys = Object.keys(config.tableSetter.table.css);
        for (var o = 0; o < objKeys.length; o++) {
          if (objKeys[o] != "font-family") {
            var objVal = config.tableSetter.table.css[objKeys[o]];
            configCSS = configCSS + objKeys[o] + ": " + objVal + ";";
          }
        }
      }
      configCSS = configCSS + "}";

      if (config.tableSetter.table.boldFontPath) {
        fontFamily =
          fontFamily +
          '@font-face {font-family: tableBoldFont;src: url("/fonts/' +
          config.tableSetter.table.boldFontPath +
          '");}';
        configCSS =
          configCSS + "table b,table strong { font-family:tableBoldFont; }";
      }

      if (config.tableSetter.table.italicFontPath) {
        fontFamily =
          fontFamily +
          '@font-face {font-family: tableItalicFont;src: url("/fonts/' +
          config.tableSetter.table.italicFontPath +
          '");}';
        configCSS =
          configCSS + "table i, table em { font-family:tableItalicFont; }";
      }

      if (config.tableSetter.table.boldItalicFontPath) {
        fontFamily =
          fontFamily +
          '@font-face {font-family: tableItalicFont;src: url("/fonts/' +
          config.tableSetter.table.boldItalicFontPath +
          '");}';
        configCSS =
          configCSS +
          "table b i, table i b, table strong i, table i strong, table b em, table em b { font-family:tableItalicFont; }";
      }
    }

    //Constructing css for table head
    if (
      config &&
      config.tableSetter &&
      config.tableSetter.thead &&
      config.tableSetter.thead.css
    ) {
      configCSS = configCSS + "table thead td,table thead th {";
      var objKeys = Object.keys(config.tableSetter.thead.css);
      for (var o = 0; o < objKeys.length; o++) {
        if (objKeys[o] != "font-family") {
          var objVal = config.tableSetter.thead.css[objKeys[o]];
          configCSS = configCSS + objKeys[o] + ": " + objVal + ";";
        }
      }
      if (config.tableSetter.thead.fontPath) {
        fontFamily =
          fontFamily +
          '@font-face {font-family: tableHeadFont;src: url("/fonts/' +
          config.tableSetter.thead.fontPath +
          '");}';
        configCSS = configCSS + "font-family:tableHeadFont;";
      }
      configCSS = configCSS + "border: 1px dotted !important; }";
    }

    //Constructing css for table body
    if (
      config &&
      config.tableSetter &&
      config.tableSetter.tbody &&
      config.tableSetter.tbody.css
    ) {
      configCSS = configCSS + "table tbody td, table tbody th {";
      var objKeys = Object.keys(config.tableSetter.tbody.css);
      for (var o = 0; o < objKeys.length; o++) {
        if (objKeys[o] != "font-family") {
          var objVal = config.tableSetter.tbody.css[objKeys[o]];
          configCSS = configCSS + objKeys[o] + ": " + objVal + ";";
        }
      }
      if (config.tableSetter.tbody.fontPath) {
        fontFamily =
          fontFamily +
          '@font-face {font-family: tableBodyFont;src: url("/fonts/' +
          config.tableSetter.tbody.fontPath +
          '");}';
        configCSS = configCSS + "font-family:tableBodyFont;";
      }
      configCSS = configCSS + "border: 1px dotted !important; }";
    }

    if (
      config.pageColumnDetails[layoutName] &&
      config.pageColumnDetails[layoutName].columnDetails
    ) {
      var maxLength = config.pageColumnDetails[layoutName].columnDetails.length;
      var tableWidth = 0;
      var a = 0;
      for (var l = 0; l < maxLength; l++) {
        var columnObj = config.pageColumnDetails[layoutName].columnDetails[l];
        if (!columnObj.imaginary) {
          var laoutConf = ts.tableSettings.columnNames[a + 1];
          var layoutType = laoutConf.layout;

          if (columnObj.width) {
            tableWidth = tableWidth + columnObj.width;
          }
          if (columnObj.gutter) {
            tableWidth = tableWidth + columnObj.gutter;
          }

          a++;
          configCSS =
            configCSS +
            'table[data-table-type="' +
            layoutType +
            '"] {width: ' +
            tableWidth +
            "px !important;max-width: " +
            tableWidth +
            "px !important;min-width: " +
            tableWidth +
            "px !important;}";
        } else {
          configCSS =
            configCSS +
            'table[data-table-type="stubColumn"] {width: ' +
            columnObj.width +
            "px !important;max-width: " +
            columnObj.width +
            "px !important;min-width: " +
            columnObj.width +
            "px !important;}";
        }
      }

      var height = config.pageColumnDetails[layoutName].columnDetails[0].height;
      configCSS =
        configCSS +
        'table[data-table-type="landScape"] {width: ' +
        height +
        "px !important;max-width: " +
        height +
        "px !important;min-width: " +
        height +
        "px !important;}";
      configCSS =
        configCSS +
        'table[data-table-type="spreadColumn"] {width: ' +
        tableWidth * 2 +
        "px !important;max-width: " +
        tableWidth * 2 +
        "px !important;min-width: " +
        tableWidth * 2 +
        "px !important;}";
    }

    $("head #tableConfig").remove();
    $("head").append(
      '<style id="tableConfig">' + fontFamily + configCSS + "</style>"
    );
  },
  initTable: function () {
    $("#tableContainer").html("");
    var tableData = this.getTableHTML();
    if (tableData) {
      $("#tableContainer").html(
        '<div class="tableWrapper">' + tableData + "</div>"
      );

      //Add ZERO WIDTH SPACE in exeternal link text
      $("#tableContainer a").each(function () {
        var linkText = $(this).text();
        linkText = ts.addLogicalBreaksToLinks(linkText);
        $(this).text(linkText);
      });

      $("#tableContainer table")
        .find("[data-text-color]")
        .each(function () {
          $(this).css("color", $(this).attr("data-text-color"));
        });
      $("#tableContainer table")
        .find("[data-background-color]")
        .each(function () {
          $(this).css(
            "background-color",
            $(this).attr("data-background-color")
          );
        });
    } else {
      return false;
    }

    //set the index value of cell
    ts.setColIndex();
  },
  /**
   * Function to initialize the cell style
   * Load the css file for the table configueation
   * Trigger the character align if already exist the char align
   * Handling the hang align for the cell
   * Set the column for the table
   */
  initStyle: function () {
    var tableLayout = ts.getTableLayout();
    if (tableLayout) {
      $("#tableContainer table").attr("data-table-type", tableLayout);
      var layoutName = $(
        '#layoutType [layout-name="' + tableLayout + '"]'
      ).text();
      $('[data-activates="layoutType"] .layoutType').text(layoutName);
    }

    //Add the emspace for indent
    /*$("#tableContainer table [data-emspace] p").each(function(){
				$(this).prepend("&emsp;".repeat($(this).closest('[data-emspace]').attr('data-emspace')));
			});*/

    //handle the equation inside the editor
    $("#tableContainer table .kriyaFormula").each(function () {
      var eqWidth = $(this).attr("data-eq-width");
      $(this).css("width", eqWidth);
    });

    ts.textWrapForNonIndent();
    ts.setColumnWidth();

    //initialize the char align
    var colLength = $("#tableContainer table colgroup col").length;
    for (var i = 1; i <= colLength; i++) {
      ts.iniCharAlign(i, true);
      ts.iniRotateText(i);
    }

    //Set the default vertical align for table cell
    if (
      config &&
      config.tableSetter &&
      config.tableSetter.thead &&
      config.tableSetter.thead.valign
    ) {
      $("#tableContainer table thead")
        .find("td:not([valign]), th:not([valign])")
        .attr("valign", config.tableSetter.thead.valign);
    }

    if (
      config &&
      config.tableSetter &&
      config.tableSetter.tbody &&
      config.tableSetter.tbody.valign
    ) {
      $("#tableContainer table tbody")
        .find("td:not([valign])")
        .attr("valign", config.tableSetter.tbody.valign);
    }

    //Initialize the font size
    var tableEle = $("#tableContainer table");
    var actualFontSize = ts.getActualFontSize(tableLayout);
    if (tableEle.find("[data-font-size]").length > 0) {
      var headFontSize = tableEle
        .find("thead[data-font-size]")
        .attr("data-font-size");
      if (headFontSize) {
        tableEle.find("thead td, thead th").css("font-size", headFontSize);
      }
      var bodyFontSize = tableEle
        .find("tbody[data-font-size]")
        .attr("data-font-size");
      if (bodyFontSize) {
        tableEle.find("tbody td, tbody th").css("font-size", bodyFontSize);
        if (actualFontSize) {
          actualFontSize = parseFloat(actualFontSize.tbody);
          bodyFontSize = parseFloat(bodyFontSize);
          var diff = actualFontSize - bodyFontSize;
          if (diff) {
            $("#fontSize").val("-" + diff);
          }
        }
      }
    }
  },
  iniCharAlign: function (column, autoAlign = false) {
    if (
      $('#tableContainer table [data-align][data-col-index="' + column + '"]')
        .length > 0
    ) {
      ts.charAlign(
        $(
          '#tableContainer [data-align="."][data-col-index="' + column + '"] p '
        ),
        "."
      );
      ts.charAlign(
        $(
          '#tableContainer [data-align=","][data-col-index="' + column + '"] p '
        ),
        ","
      );
      ts.charAlign(
        $(
          '#tableContainer [data-align="+"][data-col-index="' + column + '"] p '
        ),
        "+"
      );
      ts.charAlign(
        $(
          '#tableContainer [data-align="("][data-col-index="' + column + '"] p '
        ),
        "("
      );

      $.each(ts.tableSettings.specialChar, function (key, val) {
        var spChar = ts.getChar(val);
        ts.charAlign(
          $(
            '#tableContainer [data-align="' +
              spChar +
              '"][data-col-index="' +
              column +
              '"] p '
          ),
          spChar
        );
      });
    }
    if (autoAlign) {
      $(
        '#tableContainer [data-auto-align][data-col-index="' + column + '"]'
      ).each(function () {
        $(this).css("padding-left", "+=" + $(this).attr("data-left-indent"));
      });
    }
  },
  iniValign: function (column) {
    $(
      '#tableContainer table [data-align][data-col-index="' +
        column +
        '"][data-valign]'
    ).each(function () {
      ts.verticalAlign(this, $(this).attr("data-valign"));
    });
  },
  iniRotateText: function (column) {
    $(
      '#tableContainer table [data-col-index="' + column + '"][data-rotate]'
    ).each(function () {
      ts.rotateText(this, $(this).attr("data-rotate"));
    });
  },
  initResize: function () {
    var thElm;
    var startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll(
        "#tableContainer table th, #tableContainer table td"
      ),
      function (th) {
        th.style.position = "relative";

        var grip = document.createElement("div");
        grip.innerHTML = "&nbsp;";
        grip.style.top = 0;
        grip.style.right = "-4px";
        grip.style.bottom = 0;
        grip.style.width = "6px";
        grip.style.zIndex = "1";
        grip.style.position = "absolute";
        grip.style.cursor = "col-resize";
        grip.addEventListener("mousedown", function (e) {
          thElm = th;
          startOffset = th.offsetWidth - e.pageX;
        });

        th.appendChild(grip);
      }
    );

    document.addEventListener("mousemove", function (e) {
      if (thElm) {
        //var width = startOffset + e.pageX;
        var colPos = thElm.getAttribute("data-col-index");
        colPos = parseInt(colPos);
        if (colPos) {
          var changeWidth = startOffset + e.pageX;
          //If the cell has colspan then adjust the colspaned column
          //else adjust the selected column
          if (thElm.getAttribute("colspan")) {
            var colspan = parseInt(thElm.getAttribute("colspan"));
            var colspanWidth = $(thElm).outerWidth(true);
            for (var c = 0; c < colspan; c++) {
              var cell = $("#tableContainer table")
                .find('[data-col-index="' + (colPos + c) + '"]')
                .not(thElm)
                .first();
              var thisColPos = cell.attr("data-col-index");
              thisColPos = thisColPos ? parseInt(thisColPos) - 1 : "";
              //get the proportionate width
              var colWidth = $(cell).outerWidth(true);
              var colWidthPercentage = (colWidth / colspanWidth) * 100;
              var expectedColWidth = (changeWidth * colWidthPercentage) / 100;

              var minVal = $(
                "#tableContainer table colgroup col:eq(" + thisColPos + ")"
              ).attr("data-min-width");
              if (parseFloat(minVal) > expectedColWidth) {
                expectedColWidth = parseFloat(minVal);
              }
              //Add width to column
              ts.addWidthToCol(thisColPos, expectedColWidth);
            }
          } else {
            colPos = colPos ? colPos - 1 : "";
            var minVal = $(
              "#tableContainer table colgroup col:eq(" + colPos + ")"
            ).attr("data-min-width");
            if (parseFloat(minVal) > changeWidth) {
              changeWidth = parseFloat(minVal);
            }
            ts.addWidthToCol(colPos, changeWidth);
          }
          //$('#tableContainer table colgroup col:eq('+ (colPos) +')').attr('width', startOffset + e.pageX);
        }
        //thElm.style.width = startOffset + e.pageX + 'px';
      }
    });

    document.addEventListener("mouseup", function () {
      thElm = undefined;
    });
  },
  //Functon to intialize the layout border
  initLayoutBorder: function () {
    var proofPrefix = $("body").attr("data-proof-prefix");
    var layoutName = config.articleTypeDetails[proofPrefix];
    layoutName = config.pageColumnDetails[layoutName] ? layoutName : "LAYOUT1";
    var layoutObj = config.pageColumnDetails[layoutName].columnDetails;
    var MaxLength = $.map(layoutObj, function (value, index) {
      if (!value.imaginary) {
        return value;
      } else {
        $(".withStubTool").removeClass("hide");
      }
    }).length;

    if (config && MaxLength) {
      $("#layoutType").html("");
      for (var c = 1; c <= MaxLength; c++) {
        var laoutConf = ts.tableSettings.columnNames[c];
        $("#layoutType").append(
          '<li layout-name="' +
            laoutConf.layout +
            '" data-color="' +
            laoutConf.color +
            '"><a>' +
            laoutConf.name +
            "</a></li>"
        );
      }
      $("#layoutType").append(
        '<li layout-name="landScape" data-color="' +
          ts.tableSettings.columnNames["landScape"].color +
          '"><a>' +
          ts.tableSettings.columnNames["landScape"].name +
          "</a></li>"
      );
      $("#layoutType").append(
        '<li layout-name="spreadColumn" data-color="' +
          ts.tableSettings.columnNames["spreadColumn"].color +
          '"><a>' +
          ts.tableSettings.columnNames["spreadColumn"].name +
          "</a></li>"
      );
    }

    $("#tableContainer .layoutContainer").remove();
    var layOutContainer = $('<div class="layoutContainer" />');
    var totalWidth = 0;
    $("#layoutType li")
      .reverse()
      .each(function (i) {
        var liName = $(this).attr("layout-name");
        var layoutColor = $(this).attr("data-color");
        var width = ts.getLayoutWidth(liName);
        var layout = $(
          '<div class="layout" data-class="' +
            liName +
            '" style="border-right:2px solid ' +
            layoutColor +
            ";border-bottom:2px solid " +
            layoutColor +
            '"/>'
        );
        width = parseFloat(width);
        layout.attr("data-width", width);

        layout.css("width", width);
        var laoutText = $(
          '<p class="layoutName" style="background-color:' +
            layoutColor +
            '">' +
            $(this).text() +
            "</p>"
        );

        width = width - totalWidth;
        //laoutText.css('width', width);

        layout.append(laoutText);

        layOutContainer.append(layout);
        totalWidth += width;
      });

    layOutContainer.css("width", totalWidth);
    $("#tableContainer").prepend(layOutContainer);

    var theight = 0;
    $(".layoutContainer .layout").each(function () {
      var he = $(this).find("p").height();
      $(this).css("margin-top", theight + "px");
      $(this).css("max-height", 500 - theight + "px");
      theight = theight + he;
    });
    $("#tableContainer .layoutContainer").css("height", theight);
  },
  /**
   * Function to get the character for the unicode value
   * @param unicode - unicode value for the caracter
   * @return character for the unicode value
   */
  getChar: function (unicode) {
    var spChar = "";
    unicode.match(/u/i)
      ? ((unicode = "\\" + unicode),
        (spChar = unescape(JSON.parse('"' + unicode + '"')))) //if charcter has unicode value convert that to character
      : (spChar = unicode);
    return spChar;
  },
  /**
   * Function to create the colgroup for column width
   */
  setColumnWidth: function () {
    var tableElement = $("#tableContainer table");
    tableElement.find("colgroup").remove();
    var tableWidth = tableElement.outerWidth(true);
    var layoutName = tableElement.attr("data-table-type");
    var expectedWidth = ts.getLayoutWidth(layoutName);
    if ($("#stub-column:checked").length > 0) {
      var stubWidth = ts.getLayoutWidth("stubColumn");
      stubWidth = parseFloat(stubWidth);
      expectedWidth = expectedWidth + stubWidth;
    }
    if (!expectedWidth) {
      ERROR("ERROR:Table width not found in config.Please contact support!.");
    }

    var columnWidths = tableElement.attr("data-col-widths-px");
    var incVal = null;
    if (!columnWidths) {
      columnWidths = "";
      var totalWidth = 0;
      var cellLength = tableElement.find("tbody tr:first td,tbody tr:first th ")
        .length;
      tableElement
        .find("tbody tr:first td,tbody tr:first th ")
        .each(function (i) {
          var colWidth = $(this).outerWidth(true);
          if (i == 0 && $(this).css("border-width")) {
            var border = parseFloat($(this).css("border-width"));
            colWidth = colWidth + border;
          }
          var colWidthPercentage = (colWidth / tableWidth) * 100;
          var expectedColWidth = (expectedWidth * colWidthPercentage) / 100;
          expectedColWidth = Math.floor(expectedColWidth);
          totalWidth = totalWidth + expectedColWidth;

          if ($(this).attr("colspan")) {
            var colspan = parseFloat($(this).attr("colspan"));
            expectedColWidth = expectedColWidth / colspan + ",";
            columnWidths += expectedColWidth.repeat(colspan);
          } else {
            columnWidths += expectedColWidth + ",";
          }
        });

      if (totalWidth < expectedWidth) {
        incVal = expectedWidth - totalWidth;
      }

      //console.log('Total Table width:' + tableElement.outerWidth());
      //console.log('Total column width:' + totalWidth);

      columnWidths = columnWidths.replace(/,$/, "");
    } else {
      tableElement.removeAttr("data-col-widths-px");
    }
    //split the column values
    columnWidths = columnWidths ? columnWidths.split(",") : [];

    var columnWidthsLen = columnWidths.length;
    var colGroup = "<colgroup>";
    for (var c = 0; c < columnWidthsLen; c++) {
      if (incVal && c == 0) {
        columnWidths[c] = parseFloat(columnWidths[c]) + incVal;
      }
      colGroup += '<col width="' + columnWidths[c] + '" />';
    }
    colGroup += "</colgroup>";
    $("#tableContainer table").prepend(colGroup);
  },
  /**
   * Function to get the actual layout width from config css
   * return value integer or false
   */
  getLayoutWidth: function (layoutType) {
    console.log(document.readyState);
    var proofPrefix = $("body").attr("data-proof-prefix");
    var layoutName = config.articleTypeDetails[proofPrefix];
    layoutName = config.pageColumnDetails[layoutName] ? layoutName : "LAYOUT1";
    if (
      config.pageColumnDetails[layoutName] &&
      config.pageColumnDetails[layoutName].columnDetails
    ) {
      if (layoutType == "landScape") {
        var tmpTableWidth =
          config.pageColumnDetails[layoutName].columnDetails[0].height;
      } else {
        var maxLength =
          config.pageColumnDetails[layoutName].columnDetails.length;
        var tmpTableWidth = 0;
        var layoutNum = $.map(ts.tableSettings.columnNames, function (val, k) {
          if (val.layout == layoutType) {
            return k;
          }
        })[0];

        var a = 0;
        for (var l = 0; l < maxLength; l++) {
          var columnObj = config.pageColumnDetails[layoutName].columnDetails[l];
          var nextColumnObj =
            config.pageColumnDetails[layoutName].columnDetails[l + 1];
          if (!columnObj.imaginary) {
            if (columnObj.width) {
              tmpTableWidth = tmpTableWidth + columnObj.width;
            }
            a++;

            if (
              nextColumnObj &&
              nextColumnObj.gutter &&
              !nextColumnObj.imaginary &&
              a != layoutNum
            ) {
              tmpTableWidth = tmpTableWidth + nextColumnObj.gutter;
            }
          } else if (layoutType == "stubColumn" && columnObj.imaginary) {
            if (columnObj.width) {
              tmpTableWidth = tmpTableWidth + columnObj.width;
              if (nextColumnObj && nextColumnObj.gutter) {
                tmpTableWidth = tmpTableWidth + nextColumnObj.gutter;
              }
              break;
            }
          }
          if (a == layoutNum) {
            break;
          }
        }
      }

      if (layoutType == "spreadColumn") {
        tmpTableWidth = tmpTableWidth * 2;
      }
      tmpTableWidth = Math.round(tmpTableWidth * 1000) / 1000;
      return tmpTableWidth;
    } else {
      return false;
    }
  },
  getTableLayout: function () {
    if (!$("#tableContainer table").attr("data-table-type")) {
      var tableWidth = $("#tableContainer table").width();
      var sc = ts.getLayoutWidth("singleColumn");
      var dc = ts.getLayoutWidth("doubleColumn");
      var lc = ts.getLayoutWidth("landScape");
      //$("#tableContainer table").attr('data-table-type', 'doubleColumn');
      if (tableWidth > sc && tableWidth > dc) {
        return "landScape";
      } else if (tableWidth > dc && tableWidth > lc) {
        return "doubleColumn";
      } else {
        return "singleColumn";
      }
    } else {
      return $("#tableContainer table").attr("data-table-type");
    }
  },
  /**
   * Function to get the actual actual font size from indesign config
   * return value integer or false
   */
  getActualFontSize: function (layoutName) {
    var returnVal = {};
    var tableFont =
      config.tableSetter &&
      config.tableSetter.table &&
      config.tableSetter.table.css
        ? config.tableSetter.table.css["font-size"]
        : "";
    var tableBody =
      config.tableSetter &&
      config.tableSetter.tbody &&
      config.tableSetter.tbody.css
        ? config.tableSetter.tbody.css["font-size"]
        : "";
    var tableHead =
      config.tableSetter &&
      config.tableSetter.thead &&
      config.tableSetter.thead.css
        ? config.tableSetter.thead.css["font-size"]
        : "";

    tableFont = !tableFont && tableBody ? tableBody : tableFont;
    tableFont = !tableFont && tableHead ? tableHead : tableFont;

    tableBody = !tableBody && tableFont ? tableFont : tableBody;
    tableHead = !tableHead && tableFont ? tableFont : tableHead;

    returnVal.table = tableFont ? parseFloat(tableFont) : "";
    returnVal.thead = tableHead ? parseFloat(tableHead) : "";
    returnVal.tbody = tableBody ? parseFloat(tableBody) : "";
    return returnVal;
  },
  /**
   * Fucntion to get the table html
   */
  getTableHTML: function () {
    var currSelectionNode = kriya.selection.startContainer;
    if (
      kriya &&
      currSelectionNode &&
      $(currSelectionNode).closest("table").length > 0
    ) {
      var clonedTable = $(currSelectionNode)
        .closest("table")[0]
        .cloneNode(true);
      $(clonedTable).find("[style]").removeAttr("style");
      $(clonedTable).find("[nowrap]").removeAttr("nowrap");
      $(clonedTable).find("[width]").removeAttr("width");
      $(clonedTable)
        .find('.del,[data-track="del"],.hidden, .headerRow, .leftHeader')
        .remove();
      $(clonedTable)
        .find('.ins,[data-track="ins"],.jrnlPatterns,span')
        .not(kriya.config.citationSelector + ", .jrnlTblFNRef")
        .contents()
        .unwrap();
      $(clonedTable)
        .find(kriya.config.citationSelector + ", .jrnlTblFNRef")
        .removeAttr("data-track");

      $(clonedTable).find("[contenteditable]").removeAttr("contenteditable");
      $(clonedTable).find("[data-mce-style]").removeAttr("data-mce-style");

      return clonedTable.outerHTML;
    } else {
      ERROR("Table not found ...");
      return false;
    }
  },
  setColIndex: function () {
    var tableObj = $("#tableContainer table:first");
    tableObj.find("th, td").each(function (r, item) {
      ts.getCellLocation($(this));
    });
  },
  getCellLocation: function (cell) {
    var cols = cell[0].cellIndex;
    var rows = cell
      .closest("tbody, thead")
      .children("tr")
      .index(cell.closest("tr"));
    var cellOffset = cell[0].getBoundingClientRect();

    cell.prevAll("td,th").each(function () {
      cols += $(this).attr("colspan")
        ? parseInt($(this).attr("colspan")) - 1
        : 0;
    });

    cell
      .parent("tr")
      .prevAll("tr")
      .each(function () {
        //get row index for search cells
        var rowindex = cell
          .closest("tbody, thead")
          .children("tr")
          .index($(this));
        // assign the row to a variable for later use
        var row = $(this);
        row.children("td,th").each(function () {
          //check if this cell comes before our cell
          if (cellOffset.left > this.getBoundingClientRect().left) {
            // check if it has both rowspan and colspan, because the single ones are handled before
            var colspn = parseInt($(this).attr("colspan"));
            var rowspn = parseInt($(this).attr("rowspan"));
            if (colspn && rowspn) {
              if (rowindex + rowspn > rows) cols += colspn - 1;
            }
            if (rowspn && rowindex + rowspn > rows) cols += 1;
          }
        });
      });
    var indexClass = $.grep(cell[0].className.split(" "), function (v, i) {
      return v.indexOf("col") === 0;
    }).join();

    /* var indexClass = cell[0].className.match(/(^| )col[^\s]/g);
			indexClass = indexClass? indexClass.join():''; */
    cell.removeClass(indexClass);
    cell.attr("data-col-index", cols + 1);
  },
  /**
   * Function to adjust the column width
   * When adjust the cell will be validate
   * Handle the text align center if the cell is align by chatacter
   * @param columnIndex - index of the column
   * @param columnWidth - selected column width
   */
  adjustColumn: function (columnIndex, columnWidth) {
    var colLength = $("#tableContainer table:first colgroup col").length;
    var selectedColumnWidth = parseFloat(
      $("#tableContainer table colgroup col:eq(" + columnIndex + ")").attr(
        "width"
      )
    );

    var diffWidth = Math.abs(selectedColumnWidth - columnWidth);
    var avgDiffWidthToInc = diffWidth / (colLength - 1);
    var avgDiffWidthToDec =
      diffWidth /
      $(
        '#tableContainer table col:not([valid="false"]):not(:eq(' +
          columnIndex +
          "))"
      ).length;

    //gte length of decrease column
    var decNodes = $(
      '#tableContainer table col:not([valid="false"]):not(:eq(' +
        columnIndex +
        "))"
    ).filter(function () {
      var adjustColumnWidth = parseFloat($(this).attr("width"));
      return (
        adjustColumnWidth - avgDiffWidthToDec >= $(this).attr("data-min-width")
      );
    });

    //If the decrease column length is 0 then get next column as decrease column
    var nextColIndex =
      colLength == columnIndex + 1 ? columnIndex - 1 : columnIndex + 1;
    var nextColumn = $(
      "#tableContainer table colgroup col:eq(" + nextColIndex + ")"
    );

    decNodes = decNodes.length > 0 ? decNodes : nextColumn;

    var avgDiffWidthToDec = diffWidth / decNodes.length;

    //If the user decrease the value then add average value ro all other fields
    if (selectedColumnWidth > columnWidth) {
      $("table colgroup col").each(function (i) {
        //var minWidth  = $(this).attr('data-min-width');
        if (columnIndex == i) {
          $(this).attr("width", columnWidth);
          return;
        }
        var adjustColumnWidth = parseFloat($(this).attr("width"));
        if (selectedColumnWidth > columnWidth) {
          $(this).attr("width", adjustColumnWidth + avgDiffWidthToInc);
        }
      });
    } else {
      //Else if the user increase the column width then  decrease from possible columns
      decNodes.each(function (i) {
        var adjustColumnWidth = parseFloat($(this).attr("width"));
        $(this).attr("width", adjustColumnWidth - avgDiffWidthToDec);
      });
      $("#tableContainer table colgroup col:eq(" + columnIndex + ")").attr(
        "width",
        columnWidth
      );
    }
    //validate all the cell
    $("table colgroup col").each(function (i) {
      var colDetails = ts.validateColumn(i + 1);
      //  ts.iniCharAlign(i+1);
      ts.iniValign(i + 1);
    });
  },
  adjustNeighbourColumn: function (columnIndex, columnWidth) {
    var colLength = $("#tableContainer table:first colgroup col").length;
    var selectedColumnWidth = parseFloat(
      $("#tableContainer table colgroup col:eq(" + columnIndex + ")").attr(
        "width"
      )
    );
    var diffWidth = Math.abs(selectedColumnWidth - columnWidth);

    var adjustColIndex =
      colLength == columnIndex + 1 ? columnIndex - 1 : columnIndex + 1;
    var adjustColumn = $(
      "#tableContainer table colgroup col:eq(" + adjustColIndex + ")"
    );
    var adjustColumnWidth = parseFloat(adjustColumn.attr("width"));

    //if selected column width is greater than given column width then add the diff column with to adjustment column
    selectedColumnWidth > columnWidth
      ? (adjustColumnWidth = adjustColumnWidth + diffWidth)
      : (adjustColumnWidth = adjustColumnWidth - diffWidth);

    adjustColumn.attr("width", adjustColumnWidth);

    $("#tableContainer table colgroup col:eq(" + columnIndex + ")").attr(
      "width",
      columnWidth + "px"
    );

    //   ts.iniCharAlign(adjustColIndex+1);
    //   ts.iniCharAlign(columnIndex+1);
    //center align the char align cell
    $(
      '[data-col-index="' +
        (adjustColIndex + 1) +
        '"],[data-col-index="' +
        (columnIndex + 1) +
        '"]'
    ).each(function () {
      ts.validateCell($(this));
    });
  },
  /**
   * Function to add given width to column
   */
  addWidthToCol: function (columnIndex, columnWidth) {
    if (columnWidth) {
      var minVal = $(
        "#tableContainer table colgroup col:eq(" + columnIndex + ")"
      ).attr("data-min-width");
      var currWidth = $(
        "#tableContainer table colgroup col:eq(" + columnIndex + ")"
      ).attr("width");
      if (
        parseFloat(minVal) > columnWidth &&
        parseFloat(currWidth) > columnWidth
      ) {
        $(".errMsg").text("Selected column minimum width is " + minVal + "px");
        return false;
      }

      $("#tableContainer table colgroup col:eq(" + columnIndex + ")").attr(
        "width",
        columnWidth + "px"
      );
      $("#columnAlign").val(columnWidth);
      // ts.iniCharAlign(columnIndex+1);
      $('[data-col-index="' + (columnIndex + 1) + '"]').each(function () {
        if (
          config.tableSetter.charAlignCenter &&
          !$(this).attr("data-auto-align")
        ) {
          $(this).removeAttr("data-left-indent");
        }
        ts.validateCell($(this));
      });
      ts.updateWidthStatus();
      if (
        parseFloat(minVal) >= columnWidth &&
        parseFloat(currWidth) >= columnWidth
      ) {
        $(".errMsg").text("Selected column minimum width is " + minVal + "px");
      }
    } else {
      return false;
    }
  },
  /**
   * Function to auto adjust table cell
   */
  autoAdjustColumn: function () {
    $("table colgroup col").each(function (i) {
      var colDetails = ts.validateColumn(i + 1);
      if (!colDetails.possible) {
        //ts.adjustColumn(i,colDetails.max);
        ts.adjustNeighbourColumn(i, colDetails.min);
      }
    });
  },
  /**
   * Function to get the possible column to update te width
   * @param - minimum width
   */
  validateColumn: function (col) {
    if (!col) {
      return false;
    }
    var actualWidthArray = [];
    $('#tableContainer table [data-col-index="' + col + '"]').each(function () {
      var actualWidth = ts.validateCell($(this), col);
      if (!$(this).attr("colspan") && $(this).text() != "") {
        actualWidthArray.push(actualWidth);
      }
    });
    var sortedArray = actualWidthArray.sort(function (a, b) {
      return b - a;
    });
    var minVal = Math.ceil(sortedArray[0]);
    var maxVal = Math.ceil(sortedArray.pop());

    /* var minVal = actualWidthArray.sort(function(a, b) { return b - a })[0];
			minVal = Math.ceil(minVal);
			var maxVal = actualWidthArray.sort(function(a, b) { return a - b })[0];
			maxVal = Math.ceil(maxVal); */

    if (
      $('#tableContainer table [data-col-index="' + col + '"][valid="false"]')
        .length > 0
    ) {
      $("#tableContainer table colgroup col:eq(" + (col - 1) + ")").attr(
        "valid",
        "false"
      );
    } else {
      $("#tableContainer table colgroup col:eq(" + (col - 1) + ")").removeAttr(
        "valid"
      );
    }
    $("#tableContainer table colgroup col:eq(" + (col - 1) + ")").attr(
      "data-min-width",
      Math.ceil(minVal)
    );

    return {
      min: minVal,
      max: maxVal,
      possible:
        $('#tableContainer table [data-col-index="' + col + '"][valid="false"]')
          .length > 0
          ? false
          : true,
    };
  },
  /**
   * Function to validate the cell width
   * @return minimum width of the cell
   */
  validateCell: function (ele, col) {
    if (!ele.is("td") && !ele.is("th")) {
      return -1;
    }
    var actualWidthArray = [];
    var elePadLeft = parseFloat(ele.css("padding-left"));
    var elePadRight = parseFloat(ele.css("padding-right"));
    var textIndent = parseFloat(ele.css("text-indent"));
    ele.removeAttr("valid");

    //var eleWidth    = ele.width();
    elePadLeft = elePadLeft + textIndent;

    //outerWidth true also calculate the margin value
    var eleIndex = parseInt(col);
    var eleColspan = ele.attr("colspan");

    var eleTotWidth = parseFloat(
      $("#tableContainer table colgroup col:eq(" + (eleIndex - 1) + ")").attr(
        "width"
      )
    );
    if (eleColspan && eleColspan != "") {
      var eleTotWidth = ele.outerWidth(true);
    }

    ele
      .find("p:not(:has(.spanWrap))")
      .wrapInner("<span class='spanWrap'></span>");
    ele.find("p .spanWrap").each(function (i) {
      var spanWrapWidth = undefined;
      if ($(this).find(".alignClass").length == 0 && !ele.attr("data-rotate")) {
        var cellText = $(this).text();
        cellText = cellText.split(/[\s\-\u200B]/g).sort(function (a, b) {
          return b.length - a.length;
        });
        ele
          .find("p:last")
          .append('<span class="tmpTxtWrap">' + cellText[0] + "</span>");
        spanWrapWidth = ele.find(".tmpTxtWrap").width();
        ele.find(".tmpTxtWrap").remove();
      } else {
        spanWrapWidth = this.getBoundingClientRect().width;
      }

      if ($(".zoomTable").attr("data-zoom")) {
        spanWrapWidth =
          spanWrapWidth / parseFloat($(".zoomTable").attr("data-zoom"));
      }

      if ($(this).find(".alignClass").length > 0) {
        var charAlignEmptySpace =
          parseFloat($(this).find(".alignClass:first").css("margin-left")) +
          parseFloat($(this).find(".alignClass:last").css("margin-right"));
        spanWrapWidth = spanWrapWidth - charAlignEmptySpace;
      }

      var actualWidth = spanWrapWidth + elePadLeft + elePadRight;
      if (actualWidth > eleTotWidth) {
        ele.attr("valid", "false");
      }
      actualWidthArray.push(actualWidth);

      //validate text wrap
      if ($(this).find("br").length < 1) {
        var paraHTML =
          '<span class="validateNode" style="display:none;">' +
          $(this).html() +
          "</span>";
        $(this).closest("table").append(paraHTML);
        if ($(".validateNode").width() > spanWrapWidth) {
          $(this).closest("td").removeAttr("non-indent");
        } else {
          $(this).closest("td").attr("non-indent", "true");
        }
        $(".validateNode").remove();
      }
    });

    var actualCellWidth = actualWidthArray.sort(function (a, b) {
      return b - a;
    })[0];

    if (!ele.attr("valid")) {
      ele.removeAttr("title");
      ele.find("p .spanWrap").contents().unwrap();
    } else if (ele.attr("valid") == "false") {
      ele.attr("title", "Minimum Width : " + actualCellWidth);
    }

    //if any invalid cell is found then disable the update button
    if ($("table td[valid=false], table th[valid=false]").length > 0) {
      $(".updateTable").addClass("disabled");
    } else {
      $(".updateTable").removeClass("disabled");
    }

    return actualCellWidth;
  },
  layoutWithStub: function (addStub) {
    var stubWidth = ts.getLayoutWidth("stubColumn");
    var tableHeight = $("#tableContainer table").height();
    var layout = $(
      '<div class="layout" data-class="stubColumn" style="border-right:2px solid #00bcd447;"/>'
    );
    stubWidth = parseFloat(stubWidth);
    layout.attr("data-width", stubWidth);

    layout.css("width", stubWidth);
    layout.css("height", tableHeight);
    var br = "<br>".repeat($("#layoutType li").length);
    var layoutText = $(
      br +
        '<p class="layoutName" style="background-color:#00bcd447;">Stub Column</p>'
    );
    layout.append(layoutText);

    if (addStub) {
      $('.layoutContainer .layout:not([data-class="stubColumn"])').css(
        "margin-left",
        stubWidth
      );
      $('.layoutContainer .layout:not([data-class="stubColumn"])').each(
        function () {
          var cWidth = ts.getLayoutWidth($(this).attr("data-class"));
          $(this).attr("data-width", cWidth);
          $(this).css("width", cWidth);
        }
      );

      var stubNode = $('<div class="stubNode"/>');
      stubNode.css("width", stubWidth);
      stubNode.css("height", tableHeight);
      stubNode.insertBefore("#tableContainer table");

      if ($('[data-class="stubColumn"]').length == 0) {
        $(".layoutContainer").append(layout);
      }
      $("#tableContainer table").removeAttr("data-stub-column");
    } else {
      $(".stubNode").remove();
      $('.layoutContainer [data-class="stubColumn"]').remove();
      $(".layoutContainer").append(layout);
      $('.layoutContainer .layout:not([data-class="stubColumn"])').css(
        "margin-left",
        ""
      );
      $('.layoutContainer .layout:not([data-class="stubColumn"])').each(
        function () {
          var cWidth = ts.getLayoutWidth($(this).attr("data-class"));
          cWidth = parseInt(cWidth) + stubWidth;
          $(this).attr("data-width", cWidth);
          $(this).css("width", cWidth);
        }
      );
      $("#tableContainer table").attr("data-stub-column", "true");
    }

    var theight = 0;
    $(".layoutContainer .layout").each(function () {
      var he = $(this).find("p").height();
      theight = theight + he;
    });
    $("#tableContainer .layoutContainer").css("height", theight);
  },
  /**
   * Function to align text for character align columns
   */
  charAlignCenterText: function (
    element,
    maxSpaceLeft,
    maxSpaceRight,
    character
  ) {
    if (element.find(".alignClass").length > 0) {
      var left = element.find(".leftAlign");
      var right = element.find(".rightAlign");

      var leftCtWidth = left.attr("data-content-width");
      var rightCtWidth = right.attr("data-content-width");

      var cell = left.closest("td");
      var padLeft = parseFloat(cell.css("padding-left"));
      var padRight = parseFloat(cell.css("padding-right"));
      var textIndent = parseFloat(cell.css("text-indent"));
      padLeft = padLeft + textIndent;

      var borderLeft = cell.css("border-left");
      if (borderLeft) {
        borderLeft = borderLeft.match(/(\d+)px/);
        borderLeft = borderLeft && borderLeft[1] ? parseInt(borderLeft[1]) : 0;
      } else {
        borderLeft = 0;
      }

      var borderRight = cell.css("border-right");
      if (borderRight) {
        borderRight = borderRight.match(/(\d+)px/);
        borderRight =
          borderRight && borderRight[1] ? parseInt(borderRight[1]) : 0;
      } else {
        borderRight = 0;
      }

      var leftWidth = left.outerWidth(true);
      var rightWidth = right.outerWidth(true);

      if ($(this).find(".leftSpace").length > 0) {
        leftWidth = leftWidth + maxSpaceLeft;
      }

      if ($(this).find(".rightSpace").length > 0) {
        rightWidth = rightWidth + maxSpaceRight;
      }

      var contentWidth = leftWidth + rightWidth;

      var leftAlignWidth = leftWidth;
      var rightAlignWidth = rightWidth;

      var emptySpace = cell.width() + (borderLeft + borderRight) - contentWidth;
      var halfEmptySpace = 0;
      if (emptySpace > 0) {
        halfEmptySpace = emptySpace / 2;
      }

      if (
        typeof config != "undefined" &&
        config.tableSetter &&
        config.tableSetter.charAlignCenter == true
      ) {
        left.css("margin-left", halfEmptySpace);
        right.css("margin-right", halfEmptySpace);
        leftAlignWidth = leftAlignWidth + halfEmptySpace;
        rightAlignWidth = rightAlignWidth + halfEmptySpace;
      }

      leftCtWidth = parseFloat(leftCtWidth);
      var emptySPace = leftAlignWidth - leftCtWidth;
      cell.attr("data-left-space", emptySPace);
      cell.attr("data-left-indent-space", emptySPace);

      cell.attr("data-align-left-width", leftAlignWidth);
      cell.attr("data-align-right-width", rightAlignWidth);
    } else {
      return false;
    }
  },
  /**
   * Function for element character align
   */
  charAlign: function (node, string) {
    var items = node,
      maxLeft = 0,
      maxRight = 0,
      maxRightSpace = 0,
      maxLeftSpace = 0;

    if (
      string === "start" ||
      string === "end" ||
      string === "left" ||
      string === "right" ||
      string === "justify" ||
      string === "center"
    ) {
      return items.css({ textAlign: string });
    } else if (string.length === 1) {
      items.each(function () {
        var that = $(this),
          str = that.text(),
          left,
          right,
          strIndex;

        that.find(".alignClass").contents().unwrap();
        that.find(".alignClass:empty").remove();
        //Comnime all text nodes
        that.html(that.html());

        var textNodes = ts.textNodesUnder(this);
        if (textNodes.length > 0) {
          var characterNode = null;
          for (var t = 0; t < textNodes.length; t++) {
            var textNode = textNodes[t];
            var nodeVal = textNode.nodeValue;

            if (string.match(/^\,/) && nodeVal.indexOf(string) >= 0) {
              characterNode = textNode;
            } else if (nodeVal.indexOf(string) >= 0) {
              characterNode = textNode;
              break;
            } else if (nodeVal.match(/\s?\(/)) {
              characterNode = textNode;
              break;
            } else if (
              textNode.parentNode &&
              $(textNode.parentNode).is(
                kriya.config.citationSelector + ", .jrnlTblFNRef"
              ) &&
              t + 1 == textNodes.length
            ) {
              characterNode = textNodes[t];
              break;
            }
          }

          var startTag = "";
          var endTag = "";
          if (characterNode) {
            var parent = characterNode.parentElement;
            var nodeVal = characterNode.nodeValue;
            if (string.match(/^\,/)) {
              strIndex = nodeVal.lastIndexOf(string);
            } else if (nodeVal.indexOf(string) >= 0) {
              strIndex = nodeVal.indexOf(string);

              //If string index is inside the parantheses then skip the parantheses and get the index
              if (nodeVal.match(/\s?\(/)) {
                var match = nodeVal.match(/\s?\(/)[0];
                var parenIndex = nodeVal.indexOf(match);
                if (strIndex > parenIndex) {
                  strIndex = parenIndex;
                }
              }
            } else if (nodeVal.match(/\s?\(/)) {
              var match = nodeVal.match(/\s?\(/)[0];
              strIndex = nodeVal.indexOf(match);
            } else if (
              textNode.parentNode &&
              $(textNode.parentNode).is(
                kriya.config.citationSelector + ", .jrnlTblFNRef"
              )
            ) {
              strIndex = 0;
            }

            var leftTextNode = document.createTextNode(
              nodeVal.slice(0, strIndex)
            );
            var rightTextNode = document.createTextNode(
              nodeVal.slice(strIndex)
            );
            var pointerNode = document.createElement("span");
            pointerNode.classList.add("pointer-node");

            parent.insertBefore(rightTextNode, characterNode);
            parent.insertBefore(pointerNode, rightTextNode);
            parent.insertBefore(leftTextNode, pointerNode);
            parent.removeChild(characterNode);

            var ancesters = $(pointerNode).parentsUntil("p");
            ancesters.each(function () {
              var nodeName = this.nodeName.toLowerCase();
              startTag = startTag + "<" + nodeName + ">";
              endTag = endTag + "</" + nodeName + ">";
            });
          }

          var thatHtml = that.html();
          if (thatHtml.match('<span class="pointer-node"></span>')) {
            thatHtml = thatHtml.replace(
              '<span class="pointer-node"></span>',
              endTag + '</span><span class="alignClass rightAlign">' + startTag
            );
            thatHtml =
              '<span class="alignClass leftAlign">' + thatHtml + "</span>";
          } else {
            thatHtml =
              '<span class="alignClass leftAlign">' +
              thatHtml +
              '</span><span class="alignClass rightAlign" />';
          }

          that.html(thatHtml);
        }

        var left = that.find(".leftAlign");
        var right = that.find(".rightAlign");
        if (left.length == 0 && right.length == 0) {
          return;
        }

        /*return;

					(string.match(/^\,/))?(
						strIndex = str.lastIndexOf(string)
					):(
						strIndex = str.indexOf(string)
					);
					
					
					if(strIndex !== -1) {
						left  = $('<span class="alignClass leftAlign">' + str.slice(0, strIndex) + '</span>');
						right = $('<span class="alignClass rightAlign">' + str.slice(strIndex) + '</span>');
	                }else{
	                	if(str.match(/\s?\(.*\)/)){
	                		var leftText  = str.replace(/\s?\(.*\)/, '');
	                		var rightText = str.replace(leftText, '');
	                		
	                		left  = $('<span class="alignClass leftAlign">' + leftText + '</span>');
	                		right = $('<span class="alignClass rightAlign">' + rightText + '</span>');
	                	}else{
	                		var strLen = str.length;
	                		left   = $('<span class="alignClass leftAlign">' + str.slice(0, strLen) + '</span>');
	                		right  = $('<span class="alignClass rightAlign"></span>');	
	                	}
					}*/

        var leftTextNodes = ts.textNodesUnder(left[0]);
        var leftLen = leftTextNodes.length;
        var rightTextNodes = ts.textNodesUnder(right[0]);
        var rightLen = rightTextNodes.length;

        if (leftLen > 0) {
          var lastLeft = leftTextNodes[leftLen - 1];
          var lastLeftVal = lastLeft.nodeValue;

          if (
            lastLeftVal.match(/([\s]+)$/) &&
            !lastLeftVal.match(/^([\s]+)$/)
          ) {
            var matchLeft = lastLeftVal.match(/([\s]+)$/);
            lastLeftVal = lastLeftVal.replace(/([\s]+)$/, "");
            lastLeft.nodeValue = lastLeftVal;
            var spaceLeft = $(
              '<span class="alignClass leftSpace">' + matchLeft[1] + "</span>"
            );
          }
        }

        if (rightLen > 0) {
          var firstRight = rightTextNodes[0];
          var firstRightVal = firstRight.nodeValue;
          if (
            firstRightVal.match(/^([\s]+)/) &&
            !firstRightVal.match(/^([\s]+)$/)
          ) {
            var matchRight = firstRightVal.match(/^([\s]+)/);
            firstRightVal = firstRightVal.replace(/^([\s]+)/, "");
            firstRight.nodeValue = firstRightVal;
            var spaceRight = $(
              '<span class="alignClass rightSpace">' + matchRight[1] + "</span>"
            );
          }
        }

        /*var leftVal  = left.html();
	                var rightVal = right.html();
	                if(leftVal.match(/([\s]+)$/)){
	                	var matchLeft = leftVal.match(/([\s]+)$/);
	                	leftVal = leftVal.replace(/([\s]+)$/,'');
	                	left.html(leftVal);
	                	var spaceLeft  = $('<span class="alignClass leftSpace">'+ matchLeft[1] +'</span>');
	                }
	                if(rightVal.match(/^([\s]+)/)){
	                	var matchRight = rightVal.match(/^([\s]+)/);
	                	rightVal = rightVal.replace(/^([\s]+)/,'');
	                	right.html(rightVal);
	                	var spaceRight  = $('<span class="alignClass rightSpace">'+ matchRight[1] +'</span>');
					}*/

        left.css({ display: "inline-block", textAlign: "right" });
        right.css({ display: "inline-block", textAlign: "left" });

        //that.empty().append(left).append(right);

        var leftWidth = left.outerWidth(true);
        var rightWidth = right.outerWidth(true);

        if (spaceLeft) {
          spaceLeft.insertAfter(that.find(".alignClass.leftAlign"));
          maxLeftSpace = Math.max(maxLeftSpace, spaceLeft.outerWidth(true));
        }

        if (spaceRight) {
          spaceRight.insertBefore(that.find(".alignClass.rightAlign"));
          maxRightSpace = Math.max(maxRightSpace, spaceRight.outerWidth(true));
        }

        maxLeft = Math.max(maxLeft, leftWidth);
        maxRight = Math.max(maxRight, rightWidth);
        left.closest("td,th").css("white-space", "nowrap");
      });
      items.each(function () {
        var left = $(this).find(".leftAlign"),
          right = $(this).find(".rightAlign");

        var leftCtWidth = left.outerWidth(true);
        var rightCtWidth = right.outerWidth(true);

        //Set the content left width and right width
        left.attr("data-content-width", leftCtWidth);
        right.attr("data-content-width", rightCtWidth);

        var cell = left.closest("td,th");
        var columnIndex = parseFloat(cell.attr("data-col-index"));
        var cellOuterWidth = cell.outerWidth(true);

        var padLeft = parseFloat(cell.css("padding-left"));
        var padRight = parseFloat(cell.css("padding-right"));
        var textIndent = parseFloat(cell.css("text-indent"));

        padLeft = padLeft + textIndent;

        if ($(this).find(".leftSpace").length < 1) {
          left.css("width", maxLeft + maxLeftSpace);
        } else {
          left.css("width", maxLeft);
        }

        if ($(this).find(".rightSpace").length < 1) {
          right.css("width", maxRight + maxRightSpace);
        } else {
          right.css("width", maxRight);
        }

        ts.charAlignCenterText($(this), maxLeftSpace, maxRightSpace, string);

        var expectedCellWidth = maxLeft + maxRight + padRight + padLeft;
        if (expectedCellWidth > cellOuterWidth && columnIndex) {
          ts.validateCell(cell);
        }
      });
    }
    return items;
  },
  /**
   * Function to remove the caharacter align in the cell
   */
  removeCharAlign: function (element) {
    //remove the char align
    element.find(".alignClass").contents().unwrap();
    if (element.find(".alignClass:empty")) {
      element.find(".alignClass:empty").remove();
    }
    element.css("white-space", "");
    element.removeAttr("data-align");
    element.removeAttr("data-align-left-width");
    element.removeAttr("data-align-right-width");
    element.removeAttr("data-left-space");
    element.removeAttr("data-left-indent-space");
  },
  //get the modified columnStyles for selected column
  getSelectedColumnStyle: function () {
    var returnObj = {};
    var styleAttr = [
      "data-col-index",
      "align",
      "data-emspace",
      "data-align",
      "valign",
      "colspan",
      "data-rotate",
      "data-auto-align",
    ];
    var styleAttrLen = styleAttr.length;
    var firstSelection = $("[currentSelection=true]")
      .filter(function () {
        return $(this).text().trim() != "";
      })
      .first();
    $("[currentSelection=true]").each(function (i) {
      for (var a = 0; a < styleAttrLen; a++) {
        var attr = styleAttr[a];
        if ($(this).text().trim() == "") continue;
        //if the element has the attribute then check the firt elemt attr is equal to other
        $(this).attr(attr) && firstSelection.attr(attr)
          ? //when selecting multiple cells if the style not common return obj attr add false
            firstSelection.attr(attr) != $(this).attr(attr)
            ? (returnObj[attr] = false)
            : (returnObj[attr] = true)
          : (returnObj[attr] = false);
      }
    });
    for (var a = 0; a < styleAttrLen; a++) {
      var attr = styleAttr[a];
      returnObj[attr] != false
        ? (returnObj[attr] = firstSelection.attr(attr))
        : (returnObj[attr] = false);
    }
    return returnObj;
  },
  /**
   * Function to handle the hang align to cell
   */
  textWrapForNonIndent: function () {
    $("table td p, table th p").each(function () {
      var brEle = $(this).find("br[nonindent]");
      if (brEle.length > 0) {
        var cellHTML = $(this).html();
        cellHTML = '<span class="nonIndentText">' + cellHTML + "</span>";
        cellHTML = cellHTML.replace(
          /(<br non-indent="true"[^>]*>)/g,
          '</span>$1<span class="nonIndentText">'
        );
        cellHTML = cellHTML.replace(
          /(<br>)/g,
          '</span>$1<span class="indentText">'
        );
        if (cellHTML != "") {
          $(this).html(cellHTML);
          $(this).closest("td, th").attr("non-indent", "true");
        }
      } else if ($(this).find("br").length < 1) {
        $(this).closest("td, th").attr("non-indent", "true");
      }
    });
  },
  checkTableFont: function () {
    var returnVal = true;
    $("table,thead,tbody,td:first,th:first").each(function () {
      var fontFamily = $(this).css("font-family");
      fontFamily = fontFamily.replace(/[\,\s]+?(serif|sanserif)/, "");
      if (fontFamily) {
        if (!document.fonts.check("1rem " + fontFamily)) {
          ERROR("Font not loaded...");
          return (returnVal = false);
        }
      }
    });
    return returnVal;
  },
  updateTable: function () {
    var tableObj = $("#tableContainer table:first");

    kriya.general.updateTableData(tableObj, ts.autoTypesetTable);
    window.close();
    return;
  },
  resetTable: function () {
    // $('.la-container').fadeIn();
    // ts.ini(function(){
    // 	ts.initResize();
    // 	ts.updateWidthStatus();
    // 	$('.la-container').fadeOut();
    // });
    ts.formatTableFromCS(false); // false set to not to fix to a layoutType
  },
  equalDistributeWidth: function () {
    $(".la-container").show();
    setTimeout(function () {
      var colIndex = ts.getIndexVal();
      var sumWidth = 0;
      $.each(colIndex, function (i, val) {
        var colWidth = parseFloat(
          $("colgroup col:eq(" + (val - 1) + ")").attr("width")
        );
        sumWidth += colWidth;
      });

      var equalWidth = Math.floor(sumWidth / colIndex.length);
      var totalWidth = equalWidth * colIndex.length;
      $.each(colIndex, function (i, val) {
        if (i == 0 && totalWidth < sumWidth) {
          var diff = sumWidth - totalWidth;
          ts.adjustNeighbourColumn(val - 1, equalWidth + diff);
        } else {
          ts.adjustNeighbourColumn(val - 1, equalWidth);
        }
      });

      $(".la-container").hide();
    }, 0);
  },
  getIndexVal: function () {
    var returnVal = [];
    $("[currentSelection=true]").each(function () {
      var index = $(this).attr("data-col-index");
      if ($.inArray(index, returnVal) < 0) {
        returnVal.push(index);
      }
    });
    return returnVal;
  },
  borderCell: function (type) {
    $("[currentSelection=true]").each(function () {
      if (type == "left") {
        if ($(this).attr("data-border-left") == "true") {
          $(this).removeAttr("data-border-left");
        } else {
          $(this).attr("data-border-left", "true");
        }
      } else if (type == "right") {
        if ($(this).attr("data-border-right") == "true") {
          $(this).removeAttr("data-border-right");
        } else {
          $(this).attr("data-border-right", "true");
        }
      } else if (type == "top") {
        if ($(this).attr("data-border-top") == "true") {
          $(this).removeAttr("data-border-top");
        } else {
          $(this).attr("data-border-top", "true");
        }
      } else if (type == "bottom") {
        if ($(this).attr("data-border-bottom") == "true") {
          $(this).removeAttr("data-border-bottom");
        } else {
          $(this).attr("data-border-bottom", "true");
        }
      } else if (type == "all") {
        if (
          $(this).attr("data-border-bottom") == "true" &&
          $(this).attr("data-border-top") == "true" &&
          $(this).attr("data-border-left") == "true" &&
          $(this).attr("data-border-right") == "true"
        ) {
          $(this)
            .removeAttr("data-border-bottom")
            .removeAttr("data-border-top")
            .removeAttr("data-border-left")
            .removeAttr("data-border-right");
        } else {
          $(this)
            .attr("data-border-bottom", "true")
            .attr("data-border-top", "true")
            .attr("data-border-left", "true")
            .attr("data-border-right", "true");
        }
      } else if (type == "clearAll") {
        $(this)
          .removeAttr("data-border-bottom")
          .removeAttr("data-border-top")
          .removeAttr("data-border-left")
          .removeAttr("data-border-right");
      }
    });
  },
  verticalAlign: function (cellElement, type) {
    $(cellElement).css("padding-top", "");
    $(cellElement).css("padding-bottom", "");
    $(cellElement).removeAttr("valign");

    if ($(cellElement).attr("data-rotate")) {
      var cellBoundingObj = $(cellElement)[0].getBoundingClientRect();
      var blockParaBoundingObj = $(cellElement)
        .find("p")[0]
        .getBoundingClientRect();

      $(cellElement).find("p").css("display", "inline-block");
      var paraBoundingObj = $(cellElement).find("p")[0].getBoundingClientRect();
      $(cellElement).find("p").css("display", "");

      if (type) {
        var padTop = Math.abs(
          cellBoundingObj.height - blockParaBoundingObj.height
        );
        $(cellElement).css("padding-bottom", padTop);
        var emptyHeightSpace = Math.abs(
          cellBoundingObj.height - paraBoundingObj.height
        );
      }
      if (type == "center") {
        $(cellElement).css(
          "padding-bottom",
          Math.abs(padTop - emptyHeightSpace)
        );
      } else if (type == "top") {
        $(cellElement).css("padding-top", "");
        var cellBottom = Math.abs(
          emptyHeightSpace - blockParaBoundingObj.height
        );
        $(cellElement).css("padding-bottom", padTop);
      }
      $(cellElement).attr("data-valign", type);
    } else {
      $(cellElement).attr("valign", type);
    }
  },
  rotateText: function (cellElement, type) {
    if (type) {
      var angle = ts.rotateTextDeg[type];

      if (!$(cellElement).attr("data-rotate")) {
        var padTop = parseFloat($(cellElement).css("padding-top"));
        padTop = padTop ? padTop : 0;
        var padBottom = parseFloat($(cellElement).css("padding-bottom"));
        padBottom = padBottom ? padBottom : 0;
      }

      $(cellElement).attr("data-rotate", type);
      $(cellElement)
        .find("p")
        .css("transform", "rotate(" + angle + "deg)");
      $(cellElement).find("p").css("display", "inline-block");
      //$('[currentSelection=true]').attr('valign', 'center');

      var boundingVal = $(cellElement).find("p")[0].getBoundingClientRect();
      var cellHeight = boundingVal.height + padTop + padBottom;
      $(cellElement).css("height", cellHeight);

      $(cellElement).find("p").css("display", "");
      ts.verticalAlign($(cellElement), "center");
    } else {
      $(cellElement).removeAttr("data-rotate");
      $(cellElement).find("p").css("transform", "");

      $(cellElement).css("height", "");
      ts.verticalAlign($(cellElement), "");
    }

    var index = parseInt($(cellElement).attr("data-col-index"));
    /*var boundingVal = $(cellElement).find('p')[0].getBoundingClientRect();
			ts.adjustColumn(index-1, boundingVal.width);*/
    ts.validateColumn(index);
  },
  updateWidthStatus: function () {
    var tableWidth = 0;
    $("#tableContainer table colgroup col").each(function () {
      tableWidth += parseFloat($(this).attr("width"));
    });
    tableWidth = Math.round(tableWidth * 1000) / 1000;
    var curLayout = $("#tableContainer .layoutContainer .layout:last").attr(
      "data-class"
    );
    $("#tableContainer .layoutContainer .layout").each(function () {
      if ($(this).attr("data-width") <= tableWidth) {
        $(".layoutType").html($(this).text());
        curLayout = $(this).attr("data-class");
        return false;
      }
    });
    var disableUpdate = false;

    $("#tableContainer  table").attr("data-table-type", curLayout);

    if (
      $(
        '#tableContainer .layoutContainer .layout[data-width="' +
          tableWidth +
          '"]'
      ).length == 0
    ) {
      var curLayoutNode = $(
        '#tableContainer .layoutContainer .layout[data-class="' +
          curLayout +
          '"]'
      );
      var prevLayoutNode = curLayoutNode.prev();
      var errMsg = "";
      if (curLayoutNode.length > 0 && prevLayoutNode.length == 0) {
        var layoutWidth = curLayoutNode.attr("data-width");
        var diff = Math.abs(layoutWidth - tableWidth);
        diff = Math.round(diff * 1000) / 1000;
        if (layoutWidth < tableWidth) {
          errMsg =
            diff + "px width needs to decrease for " + curLayoutNode.text();
        } else if (layoutWidth > tableWidth) {
          errMsg =
            diff + "px width needs to increase for " + curLayoutNode.text();
        }
      } else if (curLayoutNode.length > 0 && prevLayoutNode.length > 0) {
        var layoutWidth = parseFloat(curLayoutNode.attr("data-width"));
        var prevLayoutWidth = parseFloat(prevLayoutNode.attr("data-width"));
        var siblingsDiff = Math.abs(layoutWidth - prevLayoutWidth);
        var halfDiff = siblingsDiff / 2;
        var currDiff = Math.abs(layoutWidth - tableWidth);
        currDiff = Math.round(currDiff * 1000) / 1000;
        if (tableWidth > layoutWidth + halfDiff && tableWidth > layoutWidth) {
          errMsg =
            Math.round(Math.abs(prevLayoutWidth - tableWidth) * 1000) / 1000 +
            "px width needs to increase for " +
            prevLayoutNode.text();
        } else if (
          tableWidth < layoutWidth + halfDiff &&
          tableWidth > layoutWidth
        ) {
          errMsg =
            currDiff + "px width needs to decrease for " + curLayoutNode.text();
        } else {
          if (layoutWidth < tableWidth) {
            errMsg =
              currDiff +
              "px width needs to decrease for " +
              curLayoutNode.text();
          } else if (layoutWidth > tableWidth) {
            errMsg =
              currDiff +
              "px width needs to increase for " +
              curLayoutNode.text();
          } else {
            errMsg = currDiff + "px width is different for actual width.";
          }
        }
      }

      $(".errMsg").text(errMsg);
      disableUpdate = true;
    } else {
      $(".errMsg").text("");
    }

    $("#tableContainer table").removeAttr("data-spread-index");
    if (curLayout == "spreadColumn") {
      var doubleColumnWidth = $(
        '.layoutContainer .layout[data-class="doubleColumn"]'
      ).attr("data-width");
      doubleColumnWidth = parseFloat(doubleColumnWidth);
      var totWidth = 0;
      var errMsg = "";
      var prevTot = 0;
      $("#tableContainer table colgroup col").each(function (i) {
        var width = $(this).attr("width");
        width = parseFloat(width);

        totWidth = totWidth + width;
        if (totWidth == doubleColumnWidth) {
          $("#tableContainer table").attr("data-spread-index", i);
          return false;
        } else if (totWidth > doubleColumnWidth) {
          var diff = totWidth - doubleColumnWidth;
          var halfWidth = width / 2;
          if (halfWidth <= diff) {
            if (i - 1 > 1) {
              errMsg =
                doubleColumnWidth -
                prevTot +
                "px width needs to increase in columns 1-" +
                i;
            } else if (i - 1 == 1) {
              errMsg =
                doubleColumnWidth -
                prevTot +
                "px width needs to increase in columns 1, " +
                i;
            } else if (i - 1 == 0) {
              errMsg =
                doubleColumnWidth -
                prevTot +
                "px width needs to increase in column 1";
            }
          } else if (halfWidth >= diff) {
            if (i > 1) {
              errMsg =
                diff + "px width needs to decrease in columns 1-" + (i + 1);
            } else if (i == 1) {
              errMsg =
                diff + "px width needs to decrease in columns 1, " + (i + 1);
            } else {
              errMsg = diff + "px width needs to decrease in column " + (i + 1);
            }
          }

          if ($(".errMsg").text() != "") {
            $(".errMsg").append("<br>" + errMsg);
          } else {
            $(".errMsg").text(errMsg);
          }
          disableUpdate = true;
          return false;
        }
        prevTot = totWidth;
      });
    }

    if (disableUpdate == true) {
      $(".updateTable").addClass("disabled");
    } else {
      $(".updateTable").removeClass("disabled");
    }

    $("#tableContainer table")[0].style.setProperty(
      "width",
      tableWidth + "px",
      "important"
    );
    $("#tableContainer table")[0].style.setProperty(
      "min-width",
      tableWidth + "px",
      "important"
    );
    $("#tableContainer table")[0].style.setProperty(
      "max-width",
      tableWidth + "px",
      "important"
    );
    $("#tableWidth").val(tableWidth);

    //update layout height
    var tableHeight = $("#tableContainer table").height();
    var laHeight = 0;
    $("#tableContainer .layoutContainer .layout")
      .reverse()
      .each(function () {
        var he = $(this).find("p").height();
        laHeight = laHeight + he;
        $(this).css("height", tableHeight + laHeight + 2);
      });
  },
  //Function to zoom the table
  zoomTable: function (val) {
    if (val) {
      document.getElementById("tableContainer").style.transform =
        "scale(" + val + ")";
      $(".zoomTable").text("Zoom (" + val * 100 + "%)");
      $(".zoomTable").attr("data-zoom", val);
    }
  },
  addLogicalBreaksToLinks: function (currLink) {
    var linkStr = currLink;
    //var linkStr = 'http://dx.doi.org/10.1136/openhrt-2016-000417';
    //linkStr = 'http://static.www.bmj.com/sites/default/files/responseattachments/2015/10/Figure%20271015.docx';
    var lineBreakChar = "\u200B"; //String.fromCodePoint(0x200B);
    // split the given link into protocol and remaining part
    var linkPartsArr = /^(https?:\/\/(?:www\.)?|www\.)(.*)$/g.exec(linkStr);
    if (linkPartsArr == null) {
      linkPartsArr = ["", "", linkStr];
    }
    var protocolStr = linkPartsArr[1];
    // split the remaining part of the link into array
    var temp = linkPartsArr[2];
    var processedLinkStrArr = [protocolStr + lineBreakChar];
    var index = 0;
    // if the temp string begins with alphanumeric characters and has a punctuation then take that part alone for processing
    while (/^.*?[^a-z0-9]/i.test(temp) || index++ < 25) {
      var tempArr = /(.*?)([^a-z0-9])/i.exec(temp);
      temp = temp.replace(/^.*?[^a-z0-9]/i, "");
      if (tempArr == null) {
        var linkStrPart = temp;
        var linkStrPunc = "";
        index = 100; // push the index to higher value so the loop will break
      } else {
        var linkStrPart = tempArr[1];
        // updated by PM, May 5, 2017
        // if length of string before the punctuation is one, then its not okay to split the string at that point
        // so skip adding the link break character for that punctuation
        if (linkStrPart.length == 1) {
          var linkStrPunc = tempArr[2];
        } else {
          var linkStrPunc = tempArr[2] + lineBreakChar;
        }
      }
      // as a design assumption we try to split the character only if we have a minimum of 8 characters
      // we split at 4 characters
      if (linkStrPart.length > 20) {
        var currStrArr = linkStrPart.match(/.{1,4}/g);
        // merge the last element of the array with its previous element and remove the last element
        // this is done to avoid leaving those characters on a separate line on the proof
        var len = currStrArr.length;
        if (len > 1) {
          currStrArr[len - 2] = currStrArr[len - 2] + currStrArr[len - 1];
          currStrArr.pop();
        }
        processedLinkStrArr = processedLinkStrArr.concat(
          currStrArr.join(lineBreakChar)
        );
      }
      if (linkStrPart + linkStrPunc != "") {
        processedLinkStrArr.push(linkStrPart + linkStrPunc);
      }
    }
    // if the last character is a punctuation then the lineBreakChar would have been added before it. please remove.
    var processedLinkStr = processedLinkStrArr.join("");
    return processedLinkStr;
  },
  /**
   * Function to get the all text node from element
   * https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
   */
  textNodesUnder: function (el) {
    var n,
      a = [],
      walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    while ((n = walk.nextNode())) a.push(n);
    return a;
  },
  formatTableFromCS: function (layoutType) {
    $(".la-container").fadeIn();
    if (!$(".la-container-status").length)
      $(".la-container").append(
        '<div class="la-container-status" style="width: 100%;top: 55%;position: absolute;">Running the table setter ...</div>'
      );
    else $(".la-container-status").text("Running the table setter ...");

    // var proofPrefix = $('body').attr('data-proof-prefix');
    var proofPrefix = $(kriya.selection.startContainer)
      .closest("#contentContainer")
      .attr("data-proof-config-id");
    var table = $("#tableContainer table");
    table.removeAttr("data-table-type-fix");
    var tableData = this.getTableHTML();
    if (layoutType)
      tableData = $(tableData).attr("data-table-type-fix", layoutType).get(0)
        .outerHTML;
    var parameters = {
      customer: kriya.config.content.customer,
      project: kriya.config.content.project,
      proofConfig: proofPrefix,
      doi: kriya.config.content.doi + ".formatTable",
      fileData: '<div class="body">' + tableData + "</div>",
      stage: kriya.config.content.stage,
    };
    kriya.general.sendAPIRequest(
      "structurecontent",
      parameters,
      function (res) {
        if (res.error) {
          $(".la-container").fadeOut();
        } else if (res) {
          var data = res.replace(/&apos;/g, "'");
          var response = $("<r>" + data + "</r>");
          if (
            $(response).find("response").length > 0 &&
            $(response).find("response content").length > 0
          ) {
            var r = $(response).find("table");
            if (r.length > 0) {
              // if table setter failed
              if (
                $(r).attr("data-tablesetter-failed") &&
                $(r).attr("data-tablesetter-status")
              ) {
                $(".la-container-status").text("Table setter failed ..");
                setTimeout(function () {
                  $(".la-container").fadeOut();
                }, 2000);

                $(".errMsg").text($(r).attr("data-tablesetter-status"));
                return;
              }
              ts.autoTypesetTable = true;
              $(table).after(r.get(0).outerHTML);
              $(table).remove();

              // initialise view for the updated table
              {
                ts.setColIndex();
                ts.initResize();
                ts.setColumnWidth();
                ts.updateWidthStatus();

                $("table colgroup col").each(function (i) {
                  ts.validateColumn(i + 1);
                  ts.iniCharAlign(i + 1, true);
                  ts.iniValign(i + 1);
                  ts.iniRotateText(i + 1);
                });
              }

              // update autoTypeset table information so that these are "NOT" set as manual change( which is being tracked in data-changed-attributes)
              var tableObj = $("#tableContainer table:first");
              $(tableObj).attr(
                "data-table-type",
                $(tableObj).attr("data-table-type-fix")
              );
              $(tableObj).removeAttr("data-table-type-fix");
              // kriya.general.updateTableData(tableObj,ts.autoTypesetTable);
              ts.autoTypesetTable = false;
            }
          }
          $(".la-container").fadeOut();
        }
      },
      function (err) {
        if (onError && typeof onError == "function") {
          onError(err);
        }
      }
    );
  },
};

//document.write('<link type="text/css" rel="stylesheet" href="'+ts.tableSettings.configPath+'" media="all">');

$(document).ready(function (e) {
  ts.initConfig();
  $(".la-container").fadeIn();
  var everythingLoaded = setInterval(function () {
    if (/loaded|complete/.test(document.readyState)) {
      //Trigger initialize fiunction after all style file and config files are loaded
      clearInterval(everythingLoaded);
      console.log(document.readyState);
      ts.ini(function () {
        ts.initResize();
        ts.updateWidthStatus();
        $(".la-container").fadeOut();
        if (
          $("#tableContainer table").length &&
          $("#tableContainer table").attr("data-tablesetter-failed") &&
          $("#tableContainer table").attr("data-tablesetter-status")
        ) {
          // table setter failed, calling formatTable to set the table
          ts.formatTableFromCS(false); // false set to not to fix to a layoutType
        }
      });
    }
  }, 10);

  $(document).on("click", "#cellIndent", function () {
    var emspace = 0;
    var jrnlPara = $("[currentSelection=true]").find("p:first");
    if (jrnlPara.length > 0) {
      var selectionHtml = jrnlPara.html();
      if (selectionHtml.match(/\u2003/g)) {
        emspace = selectionHtml.match(/\u2003/g).length;
      }
    } else {
      var selectionHtml = $("[currentSelection=true]").html();
      if (selectionHtml.match(/\u2003/g)) {
        emspace = selectionHtml.match(/\u2003/g).length;
      }
    }
    //var emspace = $('[currentSelection=true]').attr('data-emspace');
    emspace = emspace ? parseFloat(emspace) + 1 : "1";
    $("[currentSelection=true]").attr("data-emspace", emspace);
    var jrnlPara = $("[currentSelection=true]").find("p");
    if (jrnlPara.length > 0) {
      jrnlPara.prepend("&emsp;");
    } else {
      $("[currentSelection=true]").prepend("&emsp;");
    }
    $(this).addClass("active");
  });
  $(document).on("click", "#cellOutdent", function () {
    var emspace = 0;
    var jrnlPara = $("[currentSelection=true]").find("p");
    if (jrnlPara.length > 0) {
      jrnlPara.each(function () {
        var selectionHtml = $(this).html();
        if (selectionHtml.match(/\u2003/g)) {
          emspace = selectionHtml.match(/\u2003/g).length;
        }
        selectionHtml = selectionHtml.replace(/^\u2003/, "");
        $(this).html(selectionHtml);
      });
    } else {
      var selectionHtml = $("[currentSelection=true]").html();
      emspace = selectionHtml.match(/\u2003/g).length;
      selectionHtml = selectionHtml.replace(/^\u2003/, "");
      $("[currentSelection=true]").html(selectionHtml);
    }
    emspace = emspace && emspace != "0" ? parseFloat(emspace) - 1 : "0";
    $("[currentSelection=true]").attr("data-emspace", emspace);
    if (emspace == 0) {
      $("#cellIndent").removeClass("active");
    }
  });
  $(document).on("click", "#textAlign span[align-name]", function () {
    var alignName = $(this).attr("align-name");
    ts.removeCharAlign($("[currentSelection=true]"));

    $("[currentSelection=true],[currentSelection=true] p").attr(
      "align",
      alignName
    );
    $("#textAlign .active").removeClass("active");
    $(this).addClass("active");
  });
  $(document).on("change", "#columnAlign", function () {
    if ($("[currentSelection=true]").length > 0) {
      var columnIndex = parseFloat(
        $("[currentSelection=true]:first").attr("data-col-index")
      );
      var changeWidth = $(this).val();
      //ts.adjustColumn(columnIndex-1,changeWidth);
      ts.addWidthToCol(columnIndex - 1, changeWidth);
    }
  });
  $(document).on("click", "#charAlign li", function () {
    var characterName = $(this).attr("align-name");

    var character = $(this).attr("char");
    character.match(/u/i)
      ? ((character = "\\" + character),
        (character = unescape(JSON.parse('"' + character + '"')))) //if charcter has unicode value convert that to character
      : (character = character);

    //remove the text align
    $("[currentSelection=true],[currentSelection=true] p").removeAttr("align");
    //$('[currentSelection=true] p').css('text-align','');
    if ($("[currentSelection=true] p").length > 0) {
      ts.charAlign($("[currentSelection=true] p"), character);
    } else {
      ts.charAlign($("[currentSelection=true]"), character);
    }
    $("[currentSelection=true]").removeAttr("align");
    $("[currentSelection=true]").attr("data-align", character);

    $(this)
      .closest("ul")
      .prev(".dropdown-button")
      .find(".charAlign")
      .html($(this).text());
  });

  $(document).on("change", "#colspan", function () {
    var colspan = $(this).val();
    if (colspan < 2) {
      $("[currentSelection=true]").removeAttr("colspan");
    } else {
      $("[currentSelection=true]").attr("colspan", colspan);
    }

    $(".la-container").show();
    setTimeout(function () {
      ts.setColIndex();
      ts.setColumnWidth();
      ts.autoAdjustColumn();

      $(".la-container").hide();
    }, 0);
  });

  $(document).on("change", "#fontSize", function () {
    var tableElement = $("#tableContainer table");
    var reduceVal = parseFloat($(this).val());
    var layoutName = tableElement.attr("data-table-type");
    var fontSize = ts.getActualFontSize(layoutName);
    if (!fontSize) {
      return false;
    }

    fontSize.table = fontSize.table + reduceVal + "px";
    fontSize.tbody = fontSize.tbody + reduceVal + "px";
    fontSize.thead = fontSize.thead + reduceVal + "px";

    tableElement.css("font-size", fontSize.table);
    tableElement.attr("data-font-size", fontSize.table);
    tableElement.find("thead td, thead th").css("font-size", fontSize.thead);
    tableElement.find("thead").attr("data-font-size", fontSize.thead);
    tableElement.find("tbody td, tbody th").css("font-size", fontSize.tbody);
    tableElement.find("tbody").attr("data-font-size", fontSize.tbody);

    //validate all column after adjust the font size
    $("table colgroup col").each(function (i) {
      ts.validateColumn(i + 1);
    });

    ts.updateWidthStatus();
  });
  $(document).on("click", "#verticalAlign li", function () {
    var valign = $(this).attr("align-name");
    $("[currentSelection=true]").attr("valign", valign);
    $(this)
      .closest("ul")
      .prev(".dropdown-button")
      .find(".verticalAlign")
      .html($(this).text());
  });

  $(document).on("click", "#rotateText li", function () {
    var rotateName = $(this).attr("rotate-name");
    $(".la-container").show();
    setTimeout(function () {
      $("[currentSelection=true]").each(function () {
        ts.rotateText(this, rotateName);
      });
      $(".la-container").hide();
    }, 0);
    $(this)
      .closest("ul")
      .prev(".dropdown-button")
      .find(".rotateText")
      .html($(this).text());
  });

  $(document).on("change", "#stub-column", function () {
    if ($(this).prop("checked") == true) {
      ts.layoutWithStub(false);
    } else {
      ts.layoutWithStub(true);
    }
    $(".la-container").show();
    setTimeout(function () {
      ts.setColumnWidth();
      ts.autoAdjustColumn();
      ts.updateWidthStatus();
      $(".la-container").hide();
    }, 0);
  });

  $(document).on("click", "#layoutType li", function () {
    var layoutName = $(this).attr("layout-name");
    $("#tableContainer  table").attr("data-table-type", layoutName);
    $(this)
      .closest("ul")
      .prev(".dropdown-button")
      .find(".layoutType")
      .html($(this).text());
    ts.formatTableFromCS(layoutName);
    $("#tableContainer  table").removeAttr("data-table-type-fix");

    // $('.la-container').show();
    // setTimeout(function() {
    // 	ts.setColumnWidth();
    // 	ts.autoAdjustColumn();

    // 	//initialize the char align
    // 	var colLength = $('#tableContainer table colgroup col').length;
    // 	for(i=1;i<=colLength;i++){
    // 		// ts.iniCharAlign(i);
    // 	}
    // 	ts.updateWidthStatus();
    // 	$('.la-container').hide();
    // }, 0);
  });

  //select the cells when click on the td or th
  $(document).on("click", "td,th", function (eve) {
    //Select the entire column when ctrlKey pressed else select only clicked cell
    if (eve.ctrlKey || eve.metaKey) {
      if ($(this).attr("currentSelection") == "true") {
        //if already has the selection remove that selection
        $(this).removeAttr("currentSelection");
      } else {
        if (!eve.shiftKey) {
          $('[currentSelection="true"]').removeAttr("currentSelection");
        }
        $(this).attr("currentSelection", "true");
      }
    } else {
      if ($(this)[0].tagName == "TH") {
        if ($(this).attr("currentSelection") == "true") {
          //if already has the selection remove that selection
          $(this).removeAttr("currentSelection");
        } else {
          if (!eve.shiftKey) {
            $('[currentSelection="true"]').removeAttr("currentSelection");
          }
          $(this).attr("currentSelection", "true");
        }
      } else {
        var columnCells = $(
          ":not(thead td,thead th)[data-col-index=" +
            $(this).attr("data-col-index") +
            "]"
        );
        if (columnCells.attr("currentSelection") == "true") {
          //if already has the selection remove that selection
          columnCells.removeAttr("currentSelection");
        } else {
          if (!eve.shiftKey) {
            $('[currentSelection="true"]').removeAttr("currentSelection");
          }
          columnCells.attr("currentSelection", "true");
        }
      }
    }

    var selctedStyle = ts.getSelectedColumnStyle();

    //if multiple columns select hide the character align options
    if (!selctedStyle["data-col-index"]) {
      $("#columnAlign,#colspan").addClass("disabled").val("");
    } else {
      //set the width when click on the column
      var indexVal = $('[currentSelection="true"]:first').attr(
        "data-col-index"
      );
      var selectedWidth = parseFloat(
        $("#tableContainer  table col:eq(" + (indexVal - 1) + ")").attr("width")
      );
      $("#columnAlign").removeClass("disabled").val(selectedWidth);
      $("#colspan").removeClass("disabled");
    }

    //activate the selected cell text alignment in tool bar
    selctedStyle["align"]
      ? ($("#toolbar #textAlign .active").removeClass("active"),
        $(
          '#textAlign span[align-name="' + selctedStyle["align"] + '"]'
        ).addClass("active"))
      : $("#toolbar #textAlign .active").removeClass("active");
    //activate the selected cell text indent in tool bar
    selctedStyle["data-emspace"] && selctedStyle["data-emspace"] != "0"
      ? $("#cellIndent").addClass("active")
      : $("#cellIndent").removeClass("active");
    //activate the selected cell char align style in tool bar
    if (selctedStyle["data-align"]) {
      var charName = $(
        '#charAlign li[char="' + selctedStyle["data-align"] + '"]'
      ).text();
      if (!charName) {
        $.each(ts.tableSettings.specialChar, function (key, val) {
          var regExString = "\\" + val;
          var re = new RegExp(regExString, "gi");
          if (re.test(selctedStyle["data-align"])) {
            charName = $('#charAlign li[char="' + val + '"]').text();
          }
        });
      }
      if (!charName) {
        charName =
          selctedStyle["data-align"].charAt(0).toUpperCase() +
          selctedStyle["data-align"].slice(1);
      }
      $("#charAlign")
        .closest("ul")
        .prev(".dropdown-button")
        .find(".charAlign")
        .html(charName);
    } else {
      $("#charAlign")
        .closest("ul")
        .prev(".dropdown-button")
        .find(".charAlign")
        .html("Char Align");
    }

    // to disable char align if is set already and is not center based char align
    if (
      !config.tableSetter.charAlignCenter &&
      selctedStyle["data-auto-align"]
    ) {
      $('[data-activates="charAlign"]').addClass("disabled");
    } else {
      $('[data-activates="charAlign"]').removeClass("disabled");
    }

    //if enable-valign property is set on config, enable valign option
    var parentNodeName = $(this).parent().parent()[0].tagName.toLowerCase();
    if (
      config &&
      config.tableSetter &&
      config.tableSetter[parentNodeName] &&
      config.tableSetter[parentNodeName]["enable-vlaign"] &&
      config.tableSetter[parentNodeName]["enable-vlaign"] == "true"
    ) {
      $('[data-activates="verticalAlign"]').removeClass("disabled");
    }
    // to disable vertical align if is set already
    if (selctedStyle["valign"]) {
      $('[data-activates="verticalAlign"]').addClass("disabled");
    } else {
      $('[data-activates="verticalAlign"]').removeClass("disabled");
    }

    //unicodeChar = "u" + selctedStyle['data-align'].charCodeAt(0).toString(16), //convert char to unicode

    //activate the selected cell vertical algn style in tool bar
    var vAlignName = undefined;
    var roatedText = undefined;
    selctedStyle["valign"]
      ? ((vAlignName = $(
          '#verticalAlign li[align-name="' + selctedStyle["valign"] + '"]'
        ).text()),
        $("#verticalAlign")
          .closest("ul")
          .prev(".dropdown-button")
          .find(".verticalAlign")
          .html(vAlignName))
      : $("#verticalAlign")
          .closest("ul")
          .prev(".dropdown-button")
          .find(".verticalAlign")
          .html("Vertical Align");

    selctedStyle["data-rotate"]
      ? ((roatedText = $(
          '#rotateText li[align-name="' + selctedStyle["data-rotate"] + '"]'
        ).text()),
        $("#rotateText")
          .closest("ul")
          .prev(".dropdown-button")
          .find(".rotateText")
          .html(roatedText))
      : $("#rotateText")
          .closest("ul")
          .prev(".dropdown-button")
          .find(".rotateText")
          .html("Rotate Text");

    selctedStyle["colspan"]
      ? $("#colspan").val(selctedStyle["colspan"])
      : $("#colspan").val("");
  });
});

function ERROR(msg) {
  if (!msg) {
    return false;
  }
  console.log(msg);
}

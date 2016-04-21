var initGraphs = function() {

    var firebaseURL = "https://flexsensorvalues.firebaseio.com";

    var ref = new Firebase(firebaseURL);

    var origSelectedGraphType = $("#graphTypeSelect").find(":selected").text();

    selectGraph(origSelectedGraphType, "Hourly Average");

    $("#graphSelect").on('change', function() {
        var selectedGraph = $(this).find(":selected").text();
        var selectedGraphType = $("#graphTypeSelect").find(":selected").text();

        selectGraph(selectedGraphType, selectedGraph);

    });

    $("#graphTypeSelect").on('change', function() {
        var selectedGraphType = $(this).find(":selected").text();
        var selectedGraph = $("#graphSelect").find(":selected").text();

        selectGraph(selectedGraphType, selectedGraph);

    });

    function selectGraph(selectedGraphType, selectedGraph) {
        var graphType = "";

        if (selectedGraphType == "Line Graph") {
            graphType = "line";
        } else if (selectedGraphType == "Bar Graph") {
            graphType = "bar";
        } else if (selectedGraphType == "Table") {
            graphType = "table";
        } else if (selectedGraphType == "Pie Chart (By Section)") {
            graphType = "pie";
        } else if (selectedGraphType == "Line Graph (By Range)") {
            graphType = "range";
        }

        if (selectedGraph == "Hourly Average") {
            setupHourlyGraph(graphType);
        } else if (selectedGraph == "Daily Average") {
            setupDailyGraph(graphType);
        } else if (selectedGraph == "Weekly Average") {
            setupWeeklyGraph(graphType);
        } else if (selectedGraph == "Bad Posture Log") {
            setupPostureLog();
        }
    }

    function setupPostureLog() {
        var table = "<div class='row'><div class='col s12'><h5>Recommended posture is between -25\xB0 and 25\xB0</h5><table class='animated fadeIn highlight centered striped'>";
        table += "<thead><tr><th data-field='date'>Date of Occurrence</th>";
        table += "<th data-field='time'>Time</th>";
        table += "<th data-field='degrees'>Average Posture (\xB0)</th>";
        table += "</tr></thead>";
        table += "<tbody id='postureLog'>";

        $("#chart").html("");

        var firstTimeBadPosture = true;

        ref.child("badPosture").on("value", function(snapshot) {
            var valuesStr = snapshot.val();

            if (firstTimeBadPosture) {

                //Just get initial values

                if (valuesStr != null && valuesStr) {
                    var allValues = valuesStr.split(","); //[26*2016/02/18 12:30:33, 32*2016/02/18 12:30:33, 26*2016/02/18 12:30:33, 32*2016/02/18 12:30:33]
                    for (var i = allValues.length - 1; i >= 0; i--) {
                        var val = allValues[i];
                        var eachVal = val.split("*");
                        var degrees = eachVal[0];
                        var fullTimeStamp = eachVal[1];
                        var date = fullTimeStamp.split(" ")[0];
                        var time = fullTimeStamp.split(" ")[1];
                        table += "<tr style='height: 100px !important'><td>" + date + "</td><td>" + time + "</td><td>" + degrees + "\xB0</td></tr>";
                    }

                    $("#chart").html(table + "</tbody></table></div></div>");

                    firstTimeBadPosture = false;

                } else {
                    $("#chart").html("<h4>No data to display</h4>");
                }
            } else {
                //Check if value changed
                var valuesStr = snapshot.val();

                if (valuesStr != null && typeof valuesStr) {
                    var allValues = valuesStr.split(","); //[26*2016/02/18 12:30:33, 32*2016/02/18 12:30:33, 26*2016/02/18 12:30:33, 32*2016/02/18 12:30:33]

                    var val = allValues[allValues.length - 1];
                    var eachVal = val.split("*");
                    var degrees = eachVal[0];
                    var fullTimeStamp = eachVal[1];
                    var date = fullTimeStamp.split(" ")[0];
                    var time = fullTimeStamp.split(" ")[1];

                    $("#postureLog").prepend("<tr style='height: 100px !important'><td>" + date + "</td><td>" + time + "</td><td>" + degrees + "\xB0</td></tr>");
                } else {
                    $("#chart").html("<h4>No data to display</h4>");
                }
            }

        });

    }

    function setupHourlyGraph(graph_type) {


        ref.child("hourly").on("value", function(snapshot) {
            var valuesStr = snapshot.val();

            var numMinutes = [];

            if (valuesStr != null && valuesStr != undefined) {

                var allStrValues = valuesStr.split("+");

                var allNumberValues = [];

                for (var j = 0; j < allStrValues.length; j++) {
                    allNumberValues.push(parseFloat(allStrValues[j]));
                }


                for (var i = 1; i <= allNumberValues.length; i++) {
                    numMinutes.push(i * 5);
                }

                if (graph_type == "line") {

                    $('#chart').highcharts({
                        title: {
                            text: 'Hourly Average Posture',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Flex Sensor Data',
                            x: -20
                        },
                        xAxis: {
                            title: {
                                text: "Minutes"
                            },
                            categories: numMinutes
                        },
                        yAxis: {
                            title: {
                                text: 'Average Posture (\xB0)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#94D5FF'
                            }]
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues
                        }]
                    });
                } else if (graph_type == "bar") {
                    $('#chart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Hourly Average Posture'
                        },
                        subtitle: {
                            text: 'Flex Sensor Data'
                        },
                        xAxis: {
                            title: {
                                text: "Minutes"
                            },
                            categories: numMinutes,
                            crosshair: true
                        },
                        yAxis: {
                            min: -20,
                            title: {
                                text: 'Average Posture (\xB0)'
                            }
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues

                        }]
                    });
                } else if (graph_type == "table") {
                    var table = "<div class='row'><div class='col s12'><table class='animated fadeIn highlight centered striped'>";
                    table += "<thead><tr><th data-field='date'>Minutes</th>";
                    table += "<th data-field='degrees'>Average Posture (\xB0)</th>";
                    table += "</tr></thead>";
                    table += "<tbody id='graphLog'>";

                    $("#chart").html("");

                    $("#chart").html(table + "</tbody></table></div></div>");

                    console.log(numMinutes);

                    for (var i = 0; i < numMinutes.length; i++) {
                        $("#graphLog").append("<tr style='height: 100px !important'><td>" + numMinutes[i] + "</td><td>" + allNumberValues[i] + "\xB0</td></tr>");
                    }
                } else if (graph_type == "pie") {
                    var total = allNumberValues.length;
                    var numRecommended = 0;
                    var numBackwards = 0;
                    var numForwards = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            numBackwards++;
                        } else if (value > 25) {
                            numForwards++;
                        } else if (value >= -25 && value <= 25) {
                            numRecommended++;
                        }
                    });

                    $('#chart').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Hourly Average Posture'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Time',
                            colorByPoint: true,
                            data: [{
                                name: 'Recommended Posture',
                                y: (numRecommended / total) * 100
                            }, {
                                name: 'Bending Backwards',
                                y: (numBackwards / total) * 100
                            }, {
                                name: 'Bending Forwards',
                                y: (numForwards / total) * 100
                            }]
                        }]
                    });
                } else if (graph_type == "range") {
                    var ranges = [];
                    var averages = [];

                    var i = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            ranges.push([numMinutes[i], -360, -25]);
                        } else if (value > 25) {
                            ranges.push([numMinutes[i], 25, 360]);
                        } else if (value >= -25 && value <= 25) {
                            ranges.push([numMinutes[i], -25, 25]);
                        }

                        averages.push([numMinutes[i], value]);

                        i++;

                    });

                    $('#chart').highcharts({

                        title: {
                            text: 'Hourly Average Posture'
                        },

                        xAxis: {
                            title: {
                                text: "Minutes"
                            }
                        },

                        yAxis: {
                            title: {
                                text: "Average Posture (\xB0)"
                            }
                        },

                        tooltip: {
                            crosshairs: true,
                            shared: true,
                            valueSuffix: '\xB0'
                        },

                        legend: {},

                        series: [{
                            name: 'Posture',
                            data: averages,
                            zIndex: 1,
                            marker: {
                                fillColor: 'white',
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[0]
                            }
                        }, {
                            name: 'Range',
                            data: ranges,
                            type: 'arearange',
                            lineWidth: 0,
                            linkedTo: ':previous',
                            color: Highcharts.getOptions().colors[0],
                            fillOpacity: 0.3,
                            zIndex: 0
                        }]
                    });
                }
            }

        });

    }

    function setupDailyGraph(graph_type) {

        ref.child("daily").on("value", function(snapshot) {
            var valuesStr = snapshot.val();

            var numHours = [];

            if (valuesStr != null && valuesStr != undefined) {

                var allStrValues = valuesStr.split("+");

                var allNumberValues = [];

                for (var j = 0; j < allStrValues.length; j++) {
                    allNumberValues.push(parseFloat(allStrValues[j]));
                }


                for (var i = 1; i <= allNumberValues.length; i++) {
                    numHours.push(i);
                }

                if (graph_type == "line") {

                    $('#chart').highcharts({
                        title: {
                            text: 'Daily Average Posture',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Flex Sensor Data',
                            x: -20
                        },
                        xAxis: {
                            title: {
                                text: "Hours"
                            },
                            categories: numHours
                        },
                        yAxis: {
                            title: {
                                text: 'Average Posture (\xB0)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#94D5FF'
                            }]
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues
                        }]
                    });
                } else if (graph_type == "bar") {
                    $('#chart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Daily Average Posture'
                        },
                        subtitle: {
                            text: 'Flex Sensor Data'
                        },
                        xAxis: {
                            title: {
                                text: "Hours"
                            },
                            categories: numHours,
                            crosshair: true
                        },
                        yAxis: {
                            min: -20,
                            title: {
                                text: 'Average Posture (\xB0)'
                            }
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues

                        }]
                    });
                } else if (graph_type == "table") {
                    var table = "<div class='row'><div class='col s12'><table class='animated fadeIn highlight centered striped'>";
                    table += "<thead><tr><th data-field='date'>Hours</th>";
                    table += "<th data-field='degrees'>Average Posture (\xB0)</th>";
                    table += "</tr></thead>";
                    table += "<tbody id='graphLog'>";

                    $("#chart").html("");

                    $("#chart").html(table + "</tbody></table></div></div>");

                    for (var i = 0; i < numHours.length; i++) {
                        $("#graphLog").append("<tr style='height: 100px !important'><td>" + numHours[i] + "</td><td>" + allNumberValues[i] + "\xB0</td></tr>");
                    }
                } else if (graph_type == "pie") {
                    var total = allNumberValues.length;
                    var numRecommended = 0;
                    var numBackwards = 0;
                    var numForwards = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            numBackwards++;
                        } else if (value > 25) {
                            numForwards++;
                        } else if (value >= -25 && value <= 25) {
                            numRecommended++;
                        }
                    });

                    $('#chart').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Daily Average Posture'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Time',
                            colorByPoint: true,
                            data: [{
                                name: 'Recommended Posture',
                                y: (numRecommended / total) * 100
                            }, {
                                name: 'Bending Backwards',
                                y: (numBackwards / total) * 100
                            }, {
                                name: 'Bending Forwards',
                                y: (numForwards / total) * 100
                            }]
                        }]
                    });
                } else if (graph_type == "range") {
                    var ranges = [];
                    var averages = [];

                    var i = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            ranges.push([numHours[i], -360, -25]);
                        } else if (value > 25) {
                            ranges.push([numHours[i], 25, 360]);
                        } else if (value >= -25 && value <= 25) {
                            ranges.push([numHours[i], -25, 25]);
                        }

                        averages.push([numHours[i], value]);

                        i++;

                    });

                    $('#chart').highcharts({

                        title: {
                            text: 'Daily Average Posture'
                        },

                        xAxis: {
                            title: {
                                text: "Hours"
                            }
                        },

                        yAxis: {
                            title: {
                                text: "Average Posture (\xB0)"
                            }
                        },

                        tooltip: {
                            crosshairs: true,
                            shared: true,
                            valueSuffix: '\xB0'
                        },

                        legend: {},

                        series: [{
                            name: 'Posture',
                            data: averages,
                            zIndex: 1,
                            marker: {
                                fillColor: 'white',
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[0]
                            }
                        }, {
                            name: 'Range',
                            data: ranges,
                            type: 'arearange',
                            lineWidth: 0,
                            linkedTo: ':previous',
                            color: Highcharts.getOptions().colors[0],
                            fillOpacity: 0.3,
                            zIndex: 0
                        }]
                    });
                }
            }

        });

    }

    function setupWeeklyGraph(graph_type) {

        ref.child("weekly").on("value", function(snapshot) {
            var valuesStr = snapshot.val();

            var numDays = [];

            if (valuesStr != null && valuesStr != undefined) {

                var allStrValues = valuesStr.split("+");

                var allNumberValues = [];

                for (var j = 0; j < allStrValues.length; j++) {
                    allNumberValues.push(parseFloat(allStrValues[j]));
                }

                for (var i = 1; i <= allNumberValues.length; i++) {
                    numDays.push(i);
                }

                if (graph_type == "line") {

                    $('#chart').highcharts({
                        title: {
                            text: 'Weekly Average Posture',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Flex Sensor Data',
                            x: -20
                        },
                        xAxis: {
                            title: {
                                text: "Days"
                            },
                            categories: numDays
                        },
                        yAxis: {
                            title: {
                                text: 'Average Posture (\xB0)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#94D5FF'
                            }]
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues
                        }]
                    });
                } else if (graph_type == "bar") {
                    $('#chart').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Weekly Average Posture'
                        },
                        subtitle: {
                            text: 'Flex Sensor Data'
                        },
                        xAxis: {
                            title: {
                                text: "Days"
                            },
                            categories: numDays,
                            crosshair: true
                        },
                        yAxis: {
                            min: -20,
                            title: {
                                text: 'Average Posture (\xB0)'
                            }
                        },
                        tooltip: {
                            valueSuffix: '\xB0'
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: 'Average Posture',
                            data: allNumberValues

                        }]
                    });

                } else if (graph_type == "table") {
                    var table = "<div class='row'><div class='col s12'><table class='animated fadeIn highlight centered striped'>";
                    table += "<thead><tr><th data-field='date'>Days</th>";
                    table += "<th data-field='degrees'>Average Posture (\xB0)</th>";
                    table += "</tr></thead>";
                    table += "<tbody id='graphLog'>";

                    $("#chart").html("");

                    $("#chart").html(table + "</tbody></table></div></div>");

                    for (var i = 0; i < numDays.length; i++) {
                        $("#graphLog").append("<tr style='height: 100px !important'><td>" + numDays[i] + "</td><td>" + allNumberValues[i] + "\xB0</td></tr>");
                    }
                } else if (graph_type == "pie") {
                    var total = allNumberValues.length;
                    var numRecommended = 0;
                    var numBackwards = 0;
                    var numForwards = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            numBackwards++;
                        } else if (value > 25) {
                            numForwards++;
                        } else if (value >= -25 && value <= 25) {
                            numRecommended++;
                        }
                    });

                    $('#chart').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Weekly Average Posture'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Time',
                            colorByPoint: true,
                            data: [{
                                name: 'Recommended Posture',
                                y: (numRecommended / total) * 100
                            }, {
                                name: 'Bending Backwards',
                                y: (numBackwards / total) * 100
                            }, {
                                name: 'Bending Forwards',
                                y: (numForwards / total) * 100
                            }]
                        }]
                    });
                } else if (graph_type == "range") {
                    var ranges = [];
                    var averages = [];

                    var i = 0;

                    allNumberValues.forEach(function(value) {
                        if (value < -25) {
                            ranges.push([numDays[i], -360, -25]);
                        } else if (value > 25) {
                            ranges.push([numDays[i], 25, 360]);
                        } else if (value >= -25 && value <= 25) {
                            ranges.push([numDays[i], -25, 25]);
                        }

                        averages.push([numDays[i], value]);

                        i++;

                    });

                    $('#chart').highcharts({

                        title: {
                            text: 'Weekly Average Posture'
                        },

                        xAxis: {
                            title: {
                                text: "Days"
                            }
                        },

                        yAxis: {
                            title: {
                                text: "Average Posture (\xB0)"
                            }
                        },

                        tooltip: {
                            crosshairs: true,
                            shared: true,
                            valueSuffix: '\xB0'
                        },

                        legend: {},

                        series: [{
                            name: 'Posture',
                            data: averages,
                            zIndex: 1,
                            marker: {
                                fillColor: 'white',
                                lineWidth: 2,
                                lineColor: Highcharts.getOptions().colors[0]
                            }
                        }, {
                            name: 'Range',
                            data: ranges,
                            type: 'arearange',
                            lineWidth: 0,
                            linkedTo: ':previous',
                            color: Highcharts.getOptions().colors[0],
                            fillOpacity: 0.3,
                            zIndex: 0
                        }]
                    });
                }
            }

        });

    }
};
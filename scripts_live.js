/* ==========================================================================
	JS Scripts For Achieving Custom Functionalities
	========================================================================== */

var surveyID;
var worklifeChart;
var salaryField;
var worklifeField;

$(function() {
	initSurvey();

	console.log('survey init');

	$('.chart-worklifesalary:visible').livequery(function() {
		worklifeChart = new AmCharts.AmXYChart();
		populateWorklifeChart(worklifeChart);
		worklifeChart.write("chartdiv");
	});

	$(salaryField + ', '+ worklifeField).change(function() {
		if(typeof worklifeChart !== 'undefined'){
			updateWorkLifeChart();
		};
	});

	/* Initializing plugins */
	$(document).on("click", '[data-toggle="collapse"]', $.fn.toggleCollapse);
	initOverlay();
});

$(window).on('load', function() {
	/* Page specific scripts */
	setUpAboutFields();
	setUpIncomeFields();
	setUpNetWorthFields();
});

function initSurvey() {
	bodyID = $('body').attr('id');
	surveyID = bodyID.replace('sgbody-','');

	salaryField = 'input#sgE-'+surveyID+'-6-143-element';
	worklifeField = 'input#sgE-'+surveyID+'-6-150-element';
}

/* Set up overlay
 * Plugin used: https://github.com/dimsemenov/Magnific-Popup */
function initOverlay() {
	$('.open-popup-link').magnificPopup({type:'inline', alignTop:true});
	$('.mp-img').magnificPopup({type:'image', mainClass:'mfp-fade'});

	if ($("#page-guide").length) {
		$(window).load(function() {
			setTimeout(function() {
			  $.magnificPopup.open({
				items: [
					{
						src: '#page-guide',
						type: 'inline'
					}
				],
				type: 'inline', // this is default type
				alignTop: true
			});
			}, 0);  // equals 10 seconds
		});
	}
}

/* Set up different view for Partners based on query parameter */
function setUpPartnerView(partnerParam) {
	if (partnerParam) {
		$('.fmd-topbar').addClass('branded');
	}
}

/* Set up different view for Mode (retirement/resilience) based on query parameter */
function setUpModeView(modeParam) {
	var $pageHeading = $('.sg-header .sg-title');
	var pageHeadingText;

	if (modeParam) {
		switch(modeParam) {
			case "retirement":
				pageHeadingText = "Retirement Readiness Test";
				break;
			case "resilience":
				pageHeadingText = "Financial Resilience Test";
				break;
			default:
				pageHeadingText = $pageHeading.text();
		}

		$pageHeading.text(pageHeadingText);
	}
}

function survey(selector, callback) {
	var input = $(selector);
	var oldvalue = input.val();
	setInterval(function() {
		if (input.val()!=oldvalue){
		oldvalue = input.val();
		callback(oldvalue);
	}}, 100);
}

/* Scripts for page: Your Income */
function setUpIncomeFields() {
	/* Field array */
	var fieldArray = [
		{"source":"sgE-"+surveyID+"-5-86-element",  "target":"sgE-"+surveyID+"-5-87-element"},
		{"source":"sgE-"+surveyID+"-5-98-element",  "target":"sgE-"+surveyID+"-5-99-element"},
		{"source":"sgE-"+surveyID+"-5-104-element", "target":"sgE-"+surveyID+"-5-105-element"},
		{"source":"sgE-"+surveyID+"-5-170-element", "target":"sgE-"+surveyID+"-5-171-element"},
		{"source":"sgE-"+surveyID+"-5-179-element", "target":"sgE-"+surveyID+"-5-180-element"},
		{"source":"sgE-"+surveyID+"-5-182-element", "target":"sgE-"+surveyID+"-5-183-element"},
		{"source":"sgE-"+surveyID+"-5-184-element", "target":"sgE-"+surveyID+"-5-185-element"},
		{"source":"sgE-"+surveyID+"-7-78-element",  "target":"sgE-"+surveyID+"-7-88-element"},
		{"source":"sgE-"+surveyID+"-7-90-element",  "target":"sgE-"+surveyID+"-7-89-element"},
		{"source":"sgE-"+surveyID+"-7-92-element",  "target":"sgE-"+surveyID+"-7-91-element"},
		{"source":"sgE-"+surveyID+"-7-94-element",  "target":"sgE-"+surveyID+"-7-93-element"},
		{"source":"sgE-"+surveyID+"-7-103-element", "target":"sgE-"+surveyID+"-7-110-element"},
		{"source":"sgE-"+surveyID+"-7-109-element", "target":"sgE-"+surveyID+"-7-111-element"},
		{"source":"sgE-"+surveyID+"-7-115-element", "target":"sgE-"+surveyID+"-7-117-element"},
		{"source":"sgE-"+surveyID+"-7-116-element", "target":"sgE-"+surveyID+"-7-118-element"},
		{"source":"sgE-"+surveyID+"-7-119-element", "target":"sgE-"+surveyID+"-7-120-element"},
		{"source":"sgE-"+surveyID+"-7-121-element", "target":"sgE-"+surveyID+"-7-123-element"},
		{"source":"sgE-"+surveyID+"-7-122-element", "target":"sgE-"+surveyID+"-7-124-element"},
		{"source":"sgE-"+surveyID+"-7-125-element", "target":"sgE-"+surveyID+"-7-126-element"},
		{"source":"sgE-"+surveyID+"-7-127-element", "target":"sgE-"+surveyID+"-7-129-element"},
		{"source":"sgE-"+surveyID+"-7-128-element", "target":"sgE-"+surveyID+"-7-130-element"},
	];

	/* Based on Field array modify assigned text field value after slider value change */
	$.each(fieldArray, function(key, value) {
		var $sourceField = $('#'+value.source);

		$sourceField.on('change',
			function(e) {
				var $this = $(this);
				$.each(fieldArray, function(index, value) {
					 if($this.attr('id') === value.source) {
						$('#'+value.target).val($this.val());
						return false;
					 }
				});
			}
		);
	});
}

/* Scripts for page: Net Worth */
function setUpNetWorthFields() {
	var networth = 0;
	$('#networth-positive li').each(
		function() {
		networth += parseInt($(this).text().trim()) || 0;
	});

	$('#networth-negative li').each(
		function() {
		networth -= parseInt($(this).text().trim() || 0);
	});
  
	networths = networth.toString();

	$('#networth-total').html("$"+networths.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
}

/* Populates the Work-life & Salary chart */
function populateWorklifeChart(chartWorkLifeSalary) {  
	chartWorkLifeSalary.dataLoader = {
		//url: "https://www.fmd.com.au/ams/hwhajax.js?question=satisfaction&surveyid=2242308",
		url: "https://www.fmd.com.au/ams/hwhajax.js?question=satisfaction&surveyid="+surveyID,
		postProcess: function(data, options) {
			if (data === null) {
				data = [];
				options.chart.addLabel("50%", "50%", "No Data Available");
			}
			return data;
		},
		complete: function(data,options) {
			var salaryValue = $(salaryField).val();
			var workLifeValue = $(worklifeField).val();
			data.dataProvider.push({"salary_user": salaryValue, "worklife_user": workLifeValue});
			chartWorkLifeSalary.invalidateSize();
		}
	};
	
	// XY Chart
	chartWorkLifeSalary.startDuration = 1;
	chartWorkLifeSalary.marginTop = 30;
	chartWorkLifeSalary.addLabel(35, 10, "Very Happy", "left", 11, "#000", 0, 1, "bold", "");
	chartWorkLifeSalary.addLabel("!17", "!27", "Very Happy", "right", 11, "#000", 0, 1, "bold", "");
	chartWorkLifeSalary.addLabel(35, "!27", "Not Happy", "left", 11, "#000", 0, 1, "bold", "");

	// X Axis
	var xAxis = new AmCharts.ValueAxis();
	xAxis.title = "Salary";
	xAxis.position = "bottom";
	xAxis.autoGridCount = false;
	xAxis.gridCount = 11;
	xAxis.axisColor = "#000";
	xAxis.gridColor = "#fff";
	xAxis.gridAlpha = 1;
	xAxis.labelsEnabled = false;
	xAxis.minimum = 0;
	xAxis.maximum = 110;
	chartWorkLifeSalary.addValueAxis(xAxis);

	// Y Axis
	var yAxis = new AmCharts.ValueAxis();
	yAxis.title = "Work-life Balance";
	yAxis.position = "left";
	yAxis.autoGridCount = false;
	yAxis.gridCount = 11;
	yAxis.axisColor = "#000";
	yAxis.gridColor = "#fff";
	yAxis.gridAlpha = 1;
	yAxis.labelsEnabled = false;
	yAxis.minimum = 0;
	yAxis.maximum = 110;
	chartWorkLifeSalary.addValueAxis(yAxis);	

	// Stat Graph
	var statGraph = new AmCharts.AmGraph();
	statGraph.lineColor = "#FF6600";
	statGraph.balloonText = "Salary:[[x]] Work-life:[[y]]";
	statGraph.xField = "salary";
	statGraph.yField = "worklife";
	statGraph.lineAlpha = 0;
	statGraph.bullet = "diamond";
	chartWorkLifeSalary.addGraph(statGraph);

	// User Point
	var userGraph = new AmCharts.AmGraph();
	userGraph.lineColor = "#007179";
	userGraph.balloonText = "Salary:[[x]] Work-life:[[y]]";
	userGraph.xField = "salary_user";
	userGraph.yField = "worklife_user";
	userGraph.lineAlpha = 1;
	userGraph.customBullet = "https://surveygizmolibrary.s3.amazonaws.com/library/367927/chartbullet.png";
	userGraph.bulletSize = 32;
	userGraph.labelOffset = -40;
	chartWorkLifeSalary.addGraph(userGraph);

	return chartWorkLifeSalary;
}

/* Updates the Work-life & Salary chart */
function updateWorkLifeChart() {
	var salaryValue = $(salaryField).val();
	var workLifeValue = $(worklifeField).val();

	/* Removes and re-adds user-defined values */
	worklifeChart.dataProvider.splice(-1,1);
	worklifeChart.dataProvider.push({"salary_user": salaryValue, "worklife_user": workLifeValue});		
	worklifeChart.validateData();
}


/* Populates the Summary chart */
function populateSummaryChart(sessionId, dataSet) {
	AmCharts.ready(function() {
		
		var summaryData = [
			{ "column-title": "Total score", "column": "score-total", "result":dataSet[0] },
			{ "column-title": "Scaled score", "column": "score-totalscaled", "result":dataSet[1] },
			{ "column-title": "Happiness", "column": "score-happiness", "result":dataSet[2] },
			{ "column-title": "Goals", "chart-column": "score-goals", "result":dataSet[3], "lineColor":"#0A7178"  },
			{ "column-title": "Income", "chart-column": "score-income", "result":dataSet[4], "lineColor":"#7b2a82"},
			{ "column-title": "Assets and Debt", "chart-column": "score-debtasset", "result":dataSet[5],  "lineColor":"#a34023" },
			{ "column-title": "Super", "chart-column": "score-super", "result":dataSet[6], "lineColor":"#f36b25" },
			{ "column-title": "Insurance", "chart-column": "score-insurance", "result":dataSet[7], "lineColor":"#A69C9C" },
			{ "column-title": "Legacy", "chart-column": "score-legacy", "result":dataSet[8], "lineColor":"#cfab7a"}
		];

		// Radar chart
		summaryChart = new AmCharts.AmRadarChart();
		summaryChart.categoryField = "chart-column";
		summaryChart.borderColor = "transparent";

		var hwhScore = summaryData[1].result;
		$('#hwh-score').html(hwhScore);
		
		if (hwhScore > 66) {
			$('#hwh-meaning').html('You have a strong understanding of the wealth management principals that lead to health, wealth and happiness. A professional adviser can take over time consuming money management tasks and refine your investment strategy to maximise wealth.');
		} else if (hwhScore > 33 ) {
			$('#hwh-meaning').html('You have a good understanding of financial management and doing the right thing with your money is important to you. A structured financial plan will ensure you are taking advantage of every opportunity to achieve your goals sooner.');
		} else if (hwhScore <= 33) {
			$('#hwh-meaning').html('You have made a great start with the basics but are yet to tackle the planning and investment strategies that will make the biggest difference to your financial future. Professional advice can put you on the fast track to health wealth and happiness.');
		}

		summaryData.removeValue('column', 'score-total');
		summaryData.removeValue('column', 'score-totalscaled');
		summaryData.removeValue('column', 'score-happiness');
		summaryData.removeValue('column', 'incomplete');

		summaryChart.dataProvider = summaryData;

		setUpSocialListLinks(hwhScore);

		// Value axis
		var valueAxis = new AmCharts.ValueAxis();
		valueAxis.radarCategoriesEnabled = false;
		valueAxis.color = "#514244";
		valueAxis.boldLabels = true;
		valueAxis.gridCount = 5;
		valueAxis.autoGridCount = false;
		valueAxis.axisColor = "#fff";
		valueAxis.gridColor = "#fff";
		valueAxis.gridAlpha = 1;
		valueAxis.maximum = 10;
		summaryChart.addValueAxis(valueAxis);

		// Graphs
		var graphGoals = new AmCharts.AmGraph();
		graphGoals.valueField = "result";
		graphGoals.bullet = "round";
		graphGoals.bulletSize = 13;
		graphGoals.balloonText = "[[column-title]]: [[value]]";
		graphGoals.lineColor = "#514245";
		graphGoals.lineColorField = "lineColor";
		graphGoals.lineThickness = 3;
		summaryChart.addGraph(graphGoals);

		summaryChart.write("summary-chart");		
	});
}

function setUpSocialListLinks(hwhScore) {
	$(".page_your-score .twitter").attr('href','http://twitter.com/share?text=I%20got%20' + hwhScore + '%20on%20the%20%40fmdfinancial%20Health%2C%20Wealth%20and%20Happiness%20Profiler%20%23hwhproject%20-%20see%20your%20score%20here%3A&url=https%3A%2F%2Fwww.fmd.com.au%2Fhwh');
	$(".page_your-score .linkedin").attr('href','http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.fmd.com.au%2Fhwh&title=I%20got%20' + hwhScore + '%20on%20the%20%40fmdfinancial%20Health%2C%20Wealth%20and%20Happiness%20Profiler%20-%20see%20your%20score%20here%3A%20https%3A%2F%2Fwww.fmd.com.au%2Fhwh');
	$(".page_your-score .facebook").attr('href','http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.fmd.com.au%2Fhwh&title=I%20got%20' + hwhScore + '%20on%20the%20%40fmdfinancial%20Health%2C%20Wealth%20and%20Happiness%20Profiler%20%23hwhproject%20-%20see%20your%20score%20here%3A%20https%3A%2F%2Fwww.fmd.com.au%2Fhwh');
}

Array.prototype.removeValue = function(name, value){
	var array = $.map(this, function(v,i){
		return v[name] === value ? null : v;
	});
	this.length = 0;
	this.push.apply(this, array);
}

/* Scripts for page: Superannuation */
function pageScriptsSuperannuation(sessionID) {
	var thesuperField = 'input#sgE-'+surveyID+'-12-70-element';
	var partnersuperField = 'input#sgE-'+surveyID+'-12-186-element';
	var superEvalField = 'input#sgE-'+surveyID+'-12-252-element';
	
	/* Set evaluation text on page load */
	$('#supereval').text($(superEvalField).val());

	$(thesuperField + ', ' + partnersuperField).change(
		function() {
			thesuper = $(thesuperField).val();
			partnersuper = $(partnersuperField).val();
			geturl = 'https://www.fmd.com.au/ams/hwhajax.js?question=super-evaluation&sessionid='+ sessionID +'&partial=1&super=' + thesuper + '&partnersuper=' + partnersuper + '&surveyid='+ surveyID;
			
			console.log(geturl);
			$('#super').text(thesuper);
			$('#partnersuper').text(partnersuper);
			$('#geturl').text(geturl);
			$.getJSON(geturl, function(data) {
				$.each( data, function(key,val) {
					/* Set evaluation text after each ajax call */
					$(superEvalField).val(val);
					$('#supereval').text(val);
				});
			});
		}
	);
}

var maindecade;
var partnerdecade;
function setUpAboutFields() {
	$('.age-radio input[name="sgE-'+surveyID+'-3-81"]').change(
		function(e) {
			maindecade = this.title.substring(0,1);
			$('#sgE-'+surveyID+'-3-82-box legend span').remove();
			$('#sgE-'+surveyID+'-3-82-box legend').prepend('<span>'+maindecade+'</span>');
	});

	$('.age-radio input[name="sgE-'+surveyID+'-3-175"]').change(
		function(e) {
			partnerdecade = this.title.substring(0,1);
			$('#sgE-'+surveyID+'-3-176-box legend span').remove();
			$('#sgE-'+surveyID+'-3-176-box legend').prepend('<span>'+partnerdecade+'</span>');
	});
}

/* Namespacing */
/*
if (!window.FMD) window.FMD = {};
window.FMD.util = {};
*/

/* >> Plugin: Toggles visibility of the target element */
$.fn.toggleCollapse = function(e) {   
	e.preventDefault();

	var triggerElem = $(this);
	var targetElem = $(this).data('target');

	$(targetElem).slideFadeToggle();
	$(triggerElem).toggleClass('active');
};

/* >> Plugin: Combines slide and fade animations */
$.fn.slideFadeToggle  = function(speed, easing, callback) {
	return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
};
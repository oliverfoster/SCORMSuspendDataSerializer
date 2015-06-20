
var types = [
	{
		"name": "mcq/gmcqs with 3 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,false],
			[true, true, true]
		]
	},
	{
		"name": "mcq/gmcqs with 5 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,false,true],
			[true, true, true, true, true]
		]
	},
	{
		"name": "mcq/gmcqs with 10 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[true, true, false, true, true,false, false, true, true, true]
		]
	},
	{
		"name": "mcq/gmcqs with 20 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[true, true, true, true, true,true, true, false, true, true,true, true, true, true, false,true, true, false, true, true]
		]
	},
	{
		"name": "slider with range of 1-15",
		"count": 0,
		"data": [
			[2, 255],
			[true,false,true],
			[15]
		]
	},
	{
		"name": "slider with range of 1-255 max",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[255]
		]
	},
	{
		"name": "slider with range of 1-65535",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[65535]
		]
	},
	{
		"name": "matching with 3 dropdowns each having 1-15 options",
		"count": 0,
		"size": "large",
		"data": [
			[2, 255],
			[true,true,true],
			[15,15,15]
		]
	},
	{
		"name": "matching with 5 dropdowns each having 1-15 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[15,2,15,15,8]
		]
	},
	{
		"name": "matching with 5 dropdowns each having 1-255 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[255,13,255]
		]
	},
	{
		"name": "matching with 5 dropdowns each having 1-255 options",
		"count": 0,
		"data": [
			[2, 255],
			[true,true,true],
			[1,255,255,99,255]
		]
	}
];



$(function() {

	var $sliderContainer = $(".sliders");
	_.each(types, function(type, index) {
		var $input = $('<div class="slider"><span class="quantity" index="'+index+'"></span>'+type.name+'<br><input type="range" name="'+type.name+'" index="'+index+'" min="0" max="100" value="0"></div>');
		$sliderContainer.append($input);
	});

	var $sliderControls = $("input[type='range']", $sliderContainer);
	$sliderControls.on("change input", evaluate);

});


function evaluate (event) {
	var $target = $(event.target);

	var index = parseInt($target.attr("index"),10);
	types[index].count = parseInt($target.val(),10);

	var $quantity = $(".quantity[index='"+index+"'");
	if (types[index].count === 0) $quantity.html("");
	else $quantity.html(types[index].count+" x ");

	var returned = assembleTest();

	var $results = $(".results");



	$results.html(returned.log);

	$(".encoded").html(returned.data);
	$(".json").html(returned.json);
	
}

function assembleTest() {
	var tester = [];
	var count = 0;
	var log = "";
	var index = 0;
	for (var i = 0, l = types.length; i < l; i++) {
		if (types[i].count === 0) continue;
		log += "\t"+types[i].count + " x " + types[i].name + "\n";
		count += types[i].count;
		for (var t = 0, tl = types[i].count; t < tl; t++) {
			index++;
			var item = $.extend(true, [], types[i].data);
			item[0][1] = index;
			tester.push(item);
		}
	}
	if (count === 0) {
		$("body").addClass("no-results");
		return { log :"No Question Components Selected", data: "", json: "" };
	}
	var returned = test(tester);
	log = (returned.passed ? "Passed Compression Test - Serialized, Deserialized, Compared " : "Failed Compression Test ") + "\nPerformed Serialize + Deserialize in " + (returned.time / 1000) + " seconds\n\n" + "Selected " + count + " Question Components:\n\n" + log
	log += "\n\nSCORMSuspendDataSerializer:\n";
	log += "\tPercentage Usage: " + Math.round((100/3072) * returned.data.length) + "%" + "\n";
	log += "\tBytes Required: " + returned.data.length + " bytes of 3072 byte limit" + "\n";
	
	log += "\n\nJSON Equivalent:\n";
	log += "\tPercentage Usage: " + Math.round((100/3072) * JSON.stringify(tester).length) + "%" + "\n";
	log += "\tBytes Required: " + JSON.stringify(tester).length + " bytes of 3072 byte limit" + "\n";
	
	returned.log = log;
	returned.count = count;
	returned.json = JSON.stringify(tester);
	$("body").removeClass("no-results");
	return returned;
}

function compare(val1, val2) {
	if (val1 instanceof Array) {
		if (val1.length != val2.length) {
			//console.log("Failed", val1, val2);
			return false;
		}
		failed = false;
		for (var i = 0, l = val1.length; i < l; i++) {
			if (!compare(val1[i], val2[i])) {
				
				failed = true;
			}
		}
		if (failed) {
			//console.log("Failed", val1, val2);
			return false;
		} else {
			return true;
		}
	} else {
		if (val1 == val2) {
			//console.log("Passed");
			return true;
		} else {
			//console.log("Failed", val1, val2);
			return false;
		}
	}
}

function test(arr) {
	var start = (new Date()).getTime();
	var base64 = SCORMSuspendData.serialize( arr );
	var arr2 = SCORMSuspendData.deserialize( base64 );
	var end = (new Date()).getTime();

	return {
		passed: compare(arr, arr2),
		data: base64,
		time: end - start
	};
}
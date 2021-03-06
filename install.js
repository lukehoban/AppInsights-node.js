﻿/**
* runs on on install
* creates a file in the directory above npm called "ai.config" based on the config.json template, to be instrumented by the user
* pulls javascript sdk from CDN, writes the content to a js file called ai.js and appends list of exports to be used by appInsights
*/

var fs = require('fs');
var http = require('http');
var divider = "//BROWSER_APPINSIGHTS_SCRIPT_PLACEHOLDER";

fs.readFile("ai_stub.js", function (error, instrumentationData) {
    if (error) {
        throw "Could not load instrumentation snippet. " + error;
    }
    
    var instrumentation = instrumentationData.toString();
    if (instrumentation.indexOf(divider) >= 0) {
        http.get("http://dstest.blob.core.windows.net/cdntest/ai-node.0.12.4.js", function (response) {
            
            var browserAppInsights = "";
            response.on('data', function (data) {
                browserAppInsights += data;
            });
            
            response.on('end', function () {
                var nodeAppInsights = instrumentation.replace(divider, browserAppInsights);
                
                //create a local node version of ai.js from cdn
                var file = fs.createWriteStream("ai.js");
                file.write(nodeAppInsights);
                
                console.log("installed!");
            });
        });
    }
});
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allsamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var newsample = allsamples.filter(sampleobject => sampleobject.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    var firstsample = newsample[0]
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = newsample[0].otu_ids
    var labels = newsample[0].otu_labels
    var samp_values = newsample[0].sample_values
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topbacteria = newsample.sort((a,b) => b.sample_values - a.sample_values);
    var top10bacteriavalues = topbacteria[0].sample_values.slice(0,10)
    var top10bacteriaids = topbacteria[0].otu_ids.slice(0,10)
    var top10bacterialabels = topbacteria[0].otu_labels.slice(0,10)
    // var yticks = top10bacteriaids.map(String);
    var yticks = top10bacteriaids.map (i => 'OTU ' + i);
    // var top10ids = topbacteria
    // // 8. Create the trace for the bar chart. 
    var barData = {
      x: top10bacteriavalues,
      y: yticks,
      text: top10bacterialabels,
      type: "bar",
      orientation: "h",
    };
    var trace = [barData];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Bacteria Cultures Found",
      xaxis: {
        title: 'Values',
            },
      yaxis: {
        autorange: 'reversed',
        type: 'category'
            }

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", trace, barLayout);
    

    // 1. Create the trace for the bubble chart.
    var bacteria_values = topbacteria[0].sample_values
    var bacteria_ids = topbacteria[0].otu_ids
    var bacteria_labels = topbacteria[0].otu_labels
    var trace_bubble = {
      x: bacteria_ids,
      y: bacteria_values,
      text: bacteria_labels,
      mode: 'markers',
      marker: {
        color: bacteria_ids,
        size: bacteria_values,
        colorscale: 'Jet',
        type: "bubble"
      }
      
    };
    var bubbleData = [trace_bubble];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {
          title: "OTU ID"
        },      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData, bubbleLayout); 

        // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wfreq = result.wfreq;
    // 4. Create the trace for the gauge chart.
    var trace_gauge = {
      
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Belly Button Washing Frequency" + '<br />' + "Scrubs Per Week"},
      color: ['red','orange','yellow','lightgreen','darkgreen'],
      type: "indicator",
		  mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: {'color': 'black'},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
      }
    };
    var gaugeData = [trace_gauge];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
     Title: "Belly Button Washing Frequency"
  };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

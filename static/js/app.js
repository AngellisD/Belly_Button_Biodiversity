  // @TODO: Complete the following function that builds the metadata panel
  function buildMetadata (sample) {
   
  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`/metadata/$[sample}`).then(metaData => {


    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select('#sample-metadata')

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metaData).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key}: ${value}`);
    })

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log(sampleData);
 

    // @TODO: Build a Bubble Chart using the sample data
    let otuID = sampleData.otu_ids;
    let sampleValues = sampleData.sample_values;
    let otuLabels = sampleData.otu_labels;
  
    // @TODO: Build a Pie Chart
    let trace1 = {
      x: otuID,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuID,
        colorscale: 'Earth'
      }
    };

    // HINT: You will need to use slice() to grab the top 10 sample_values,

    let data = [trace1];

    let layout = {
    title: 'Bubble Chart'
  };

  Plotly.newPlot('bubble', data, layout);
})
  // otu_ids, and labels (10 each).
  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log(sampleData);

    let pie_values=sampleData.sample_values.slice(0,10);
    let pie_labels=sampleData.otu_ids.slice(0,10);
    let pie_hover=sampleData.otu_labels.slice(0,10);

    let data =[{
      values:pie_values,
      labels:pie_labels,
      hovertext:pie_hover,
      type: 'pie'
    }];
    Plotly.newPlot('pie', data); 
  });
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


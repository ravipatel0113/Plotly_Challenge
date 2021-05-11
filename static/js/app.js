// const data = "samples.json";

// d3.json(data).then(function(url){
//     console.log(url);
// });
var dropdownset = d3.select('#selDataset');

var metadata = d3.select('#sample-metadata');

var barchart = d3.select('#bar');

var gaugechart = d3.select('#gauge');

var bubblechart = d3.select('#bubble');

//const datapromise = d3.json(data);
//console.log("Data Promise: ", datapromise);

function cleardata(){

    //dropdownset.html('');
    metadata.html('');
    barchart.html('');
    gaugechart.html('');
    bubblechart.html('');
};

//d3.selectAll('#selDataset').on('change', init);
// function unpack(rows, index) {
//     return rows.map(function(row) {
//       return row[index];
//     });
// };

function init(){

    cleardata();

    
    d3.json('./samples.json').then((data => {
        data.names.forEach((name => {
            var option = dropdownset.append('option');
            option.text(name);
        }));

        var initId = dropdownset.property('value');

        plotcharts(initId);
        
    }));
};


function plotcharts(id){

    d3.json('./samples.json').then((data => {
        
        
        var singlesimple = data.samples.filter(selectid => selectid.id == id)[0];
        console.log(singlesimple);

        var otu_id = [];
        var otu_labels = [];
        var sample_values = [];

        Object.entries(singlesimple).forEach(([key, value]) =>{
            
            switch(key){

                case 'otu_ids':
                    otu_id.push(value);
                    break;
                case 'sample_values':
                    sample_values.push(value);
                    
                    break;
                case 'otu_labels':
                    otu_labels.push(value);
                    
                    break;
                default:
                    break;
            }

            //console.log(`Key: ${key} and Value: ${value}`);
        });
        console.log(`ID: ${otu_id}`);
        console.log(`Sample Values: ${sample_values}`);
        console.log(`OTU labels: ${otu_labels}`);
        var top_otu_id = otu_id[0].slice(0,10).reverse();
        var top_sample_values = sample_values[0].slice(0,10).reverse();
        var top_otu_labels =otu_labels[0].slice(0,10).reverse();
        console.log(`Top 10 IDs: ${top_otu_id}`);
        console.log(`Top 10 Values: ${top_sample_values}`);
        console.log(`Top 10 Labels: ${top_otu_labels}`);


        var bartrace = [{
            x: top_sample_values,
            y: top_otu_id,
            text : top_otu_labels,
            type: 'bar',
            orientation: 'h'
        }];
        //var data = [bartrace];

        Plotly.newPlot('bar', bartrace);

    }));
    



};

function optionChanged(id){
    cleardata();

    plotcharts(id);
};
init();

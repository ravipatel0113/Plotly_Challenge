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
        
        var metatable = data.metadata.filter(personID => personID.id == id)[0];
        var washfreq = metatable.wfreq;
        console.log(`Wash Frequency is: ${washfreq}`);
        Object.entries(metatable).forEach(([key, value])=>{
            var meta = metadata.append('option');
            meta.text(`${key}:  ${value}`);
            // d3.select('#sample-metadata')
            // .data(meta)
            // .enter()
            // .append('value')
            // .html (function (d){
            //     return console.log(`${key},${value}`)
            // });
            console.log(`Key: ${key} and Values: ${value}`)
        });
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

        var top_otu = top_otu_id.map(object => 'OTU' + object);
        console.log(top_otu);

        var bartrace = [{
            x: top_sample_values,
            y: top_otu,
            text : top_otu_labels,
            type: 'bar',
            orientation: 'h'
        }];
        
        var barlayout = {
            xaxis :{
                title: "Sample Values"
            },
            yaxis : {
                title: "OTU IDs"
            },
            title :{
                text : "TOP 10 OTU IDs for Test Subject"
            }
        }
        
        barplot(bartrace, barlayout);
        
        var bubbletrace = [{
            x: otu_id[0],
            y: sample_values[0],
            text: otu_labels[0],
            //type: 'bubble',
            mode: 'markers',
            marker: {
                color: otu_id[0],
                size: sample_values[0],
                colorscale: 'Earth'
            }
        }];
        bubbleplot(bubbletrace);

        var gaugechart = [{
            domain: {x: [0,1],
            y: [0,1]},
            value: washfreq,
            mode: 'gauge+number+delta',
            type: 'indicator',
            delta: {reference: 2},
            gauge: {
                axis: {range: [0,9],
                tickmode: 'linear',
                tickfont: {
                size: 15
                }
            },
            bar: {color: 'rgba(8,29,88,0)'},
            //steps: [{range: [0,9], color: "blue"}]},
            steps: [{ range: [0, 1], color: '#e6ffb3' },
                        { range: [1, 2], color: '#d5ff80' },
                        { range: [2, 3], color: '#d5ff80' },
                        { range: [3, 4], color: '#ccff66' },
                        { range: [4, 5], color: '#bbff33' },
                        { range: [5, 6], color: '#b3ff1a' },
                        { range: [6, 7], color: '#99e600' },
                        { range: [7, 8], color: '#77b300' },
                        { range: [8, 9], color: '#669900' }]
            },
            threshold: {
                line: {color: 'black', width : 4},
                thickness: 0.75,
                needleShape: 'NeedleShape.Hexagon',
                value: washfreq
            },
            series: [{
                values: washfreq,
                csize: '5%'
            }]

        }];
        var layoutgauge = {
            height: 500,
            width: 475,
            title: {
                text: `<b>Test Subject ${id}</b><br><b>Belly Button Washing Frequency</b><br><br>Scrubs per Week`,
                         font: {
                        size: 18,
                        color: 'rgb(34,94,168)'
                            }
                    }
        };

        Plotly.newPlot('gauge', gaugechart, layoutgauge);
    }));
    



};
function barplot(layout, bardata )
{
    Plotly.newPlot('bar', layout, bardata);
};

function bubbleplot(bubbledata)
{
    Plotly.newPlot('bubble', bubbledata);
}

function optionChanged(id){
    cleardata();

    plotcharts(id);
};
init();

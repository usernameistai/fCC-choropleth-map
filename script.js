let eduUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let eduData;
let countyData;
let id;
let county;
let percentAdults;

let svg = d3.select('svg');
let tooltip = d3.select('#tooltip');

let data = 
  async () => 
    await d3.json(countyUrl)
      .then((data, err) => {
        if(err) {
          console.error(err);
        } else {
          countyData = topojson.feature(data, data.objects.counties).features; // converts to geojson
          console.log(countyData, "countydata");
          // Included the second json data fetch function inside as oppposed to separately
          let data1 = 
            async () => 
              await d3.json(eduUrl)
                .then((data, err) => {
                  if(err) {
                    console.error(err);
                  } else {
                    eduData = data;
                    console.log(eduData, "edudata");
                    drawMap();
                  }
                });
          data1();    
        } 
      });
data();
// we now have two json objects to get the data from
// let data1 = 
//   async () => 
//     await d3.json(eduUrl)
//       .then((data, err) => {
//         if(err) {
//           console.error(err);
//         } else {
//           eduData = data;
//           console.log(eduData, "edudata");
//           drawMap();
//         }
//       });
let drawMap = () => {
  
  svg.selectAll('path')
     .data(countyData)
     .enter()
     .append('path')
     .attr('d', d3.geoPath()) // d defines a path to be drawn
     .attr('class', 'county')
     .attr('fill', (item) => {
        // console.log(item.id, "fips")
        id = item.id;
        // console.log(item.fips)
        county = eduData.find(item => {
          return item.fips === id;
        });
        percentAdults = county.bachelorsOrHigher;
        if(percentAdults <= 12) {
          return '#e5f5e0';
        } else if (percentAdults <= 21) {
          return '#c7e9c0';
        } else if (percentAdults <= 30) {
          return '#a1d99b';
        } else if (percentAdults <= 39) {
          return '#74c476';
        } else if (percentAdults <= 48) {
          return '#41ab5d';
        } else if (percentAdults <= 57) {
          return '#238b45';
        } else {
          return '#006d2c';
        }
      })
      // tried doing a switch statement but couln't get it working
      .attr('data-fips', item => item.id)
      .attr('data-education', item => {
        id = item.id;
        // console.log(eduData, "smells")
        county = eduData.find(item => item.fips === id);
        return percentAdults = county.bachelorsOrHigher;
        // return percentAdults;
      })
      .on('mouseover', (event, item) => {
        tooltip.transition().style('visibility', 'visible');

        id = item.id;
        county = eduData.find(item => item.fips === id);

        tooltip.text(county.fips + ' ' + county.area_name + ', ' + 
                      county.state + ' ' + county.bachelorsOrHigher + '%');
        tooltip.attr('data-education', county.bachelorsOrHigher);
        tooltip.style('left', (event.pageX + 10) + 'px');
        tooltip.style('top', (event.pageY - 33) + 'px');
      })
      .on('mouseout', (event, item) => tooltip.transition().style('visibility', 'hidden')); 
};

// console.log(countyData, "drawmap");

// drawMap();

let lessThanOnePercent = ['education', 'school', 'working', 'high school students', 'workforce development',
    'innovation', '12 education', 'community colleges', 'elementary', 'job creation', 'salary', 'job', 'jobs',
    'low income', 'public education', 'teaching', 'capital', 'police', 'prosperity']
let mappedTerms = lessThanOnePercent.map(d => '#circle_'+d.replaceAll(' ', '_')).join(', ')


d3.select(window).on('load', async () => {
    wordsObject = await d3.json('data/words.json')

    generateBubbleSwarm(wordsObject)
    generateTable(wordsObject)
    attachSortHandlers()

    d3.select('body').on('click', resetStoryBoard, true)

    let storyTellingGroup = d3.select('#bubble-swarm svg').append('g').attr('id', 'storyPieces')
        .attr("transform", "translate (5, 100)")
        

    storyTellingGroup.append('rect')
        .attr('id', 'storyRectanlge')
        .attr('width', 0) //415
        .attr('height', 0) //140
        .attr('rx', '5')
        .style('fill', 'white')
        .attr('stroke-width', '2')
        .attr('stroke', 'black')
        .attr('opacity', '1')

    storyTellingGroup.append('text')
        .attr('id', 'text1')
        .attr("transform", "translate (205, 22)")
        //.text('Topics mentioned equally (less than 1% difference)')
        .attr('text-anchor', 'middle')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text2')
        .attr("transform", "translate (205, 38)")
        //.text('between Republicans and Democrats include:')
        .attr('text-anchor', 'middle')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text3')
        .attr("transform", "translate (205, 60)")
        .attr('width', '500')
        //.text("'education', 'school', 'working', 'high school students',")
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text4')
        .attr("transform", "translate (205, 75)")
        .attr('width', '500')
        //.text("'workforce development', 'innovation', '12 education',")
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text5')
        .attr("transform", "translate (205, 90)")
        .attr('width', '500')
        //.text("'community colleges', 'elementary', 'job creation', 'salary',")
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text6')
        .attr("transform", "translate (205, 105)")
        .attr('width', '500')
        //.text("'job', 'jobs', 'low income', 'public education', 'teaching'")
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('opacity', '0')
    storyTellingGroup.append('text')
        .attr('id', 'text7')
        .attr("transform", "translate (205, 120)")
        .attr('width', '500')
        //.text("'capital', 'police', and 'prosperity'")
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .attr('opacity', '0')

})



function storyTelling() {
    d3.select('body').attr('class', 'button-clicked')
    d3.select('#buttons').attr('class', 'button-clicked-misc')
    d3.selectAll(mappedTerms).style('opacity', '1')
    d3.select('#storyRectanlge').attr('width', 415).attr('height', 140)

    d3.select('#text1').text('Topics mentioned equally (less than 1% difference)').style('opacity', '1')
    d3.select('#text2').text('between Republicans and Democrats include:').style('opacity', '1')
    d3.select('#text3').text("education', 'school', 'working', 'high school students',").style('opacity', '1')
    d3.select('#text4').text("'workforce development', 'innovation', '12 education',").style('opacity', '1')
    d3.select('#text5').text("'community colleges', 'elementary', 'job creation', 'salary',").style('opacity', '1')
    d3.select('#text6').text("'job', 'jobs', 'low income', 'public education', 'teaching'").style('opacity', '1')
    d3.select('#text7').text("'capital', 'police', and 'prosperity'.").style('opacity', '1')

}


function resetStoryBoard() {
    d3.select('body').classed('button-clicked', false)
    d3.select('#buttons').attr('class', '')
    d3.selectAll(mappedTerms).style('opacity', '0.75')
    d3.select('#storyRectanlge').attr('width', 0).attr('height', 0)
    d3.select('#text1').text('')
    d3.select('#text2').text('')
    d3.select('#text3').text('')
    d3.select('#text4').text('')
    d3.select('#text5').text('')
    d3.select('#text6').text('')
    d3.select('#text7').text('')
}




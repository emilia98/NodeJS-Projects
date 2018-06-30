$(() => {
    let searchable = $('#searchable');
    let select = $('<select>');
    let suggestions = $('#suggestions');
    let empty = $('<div id="empty-suggests">No suggestions to show</div>');

    // console.log(searchable);
    $(searchable).on('input', () => {
        let query = $(searchable).val();
        $.ajax({
            url: '/search/country/' + query,
            success: (data) => {
                suggestions.empty();
                if (data.length === 0) {
                    suggestions.append(empty);
                    return;
                }

                for (let country of data) {
                    let suggest = $('<div>');


                    /*let match = $('<b>');
                    let regEx = new RegExp(query);
                    let matching = country.name.match(regEx);
                    console.log(matching.index);*/
                    let indexOfMatch = country.name.toLowerCase().indexOf(query.toLowerCase());
                    //console.log(indexOfMatch);
                    let text = country.name.slice(0, Math.max(0, indexOfMatch));
                    // console.log(text);
                    //match.text()
                    
                    //console.log(indexOfMatch + query.length);
                    text += `<b class="highlight">${country.name.slice(indexOfMatch, indexOfMatch + query.length)}</b>`;
                    //console.log(text);
                    text += country.name.slice(indexOfMatch + query.length);
                     //console.log(text);
                    suggest.html(text);
                    suggest.appendTo(suggestions);
                }
            },
            error: (err) => {
                suggestions.empty();
                suggestions.append(empty);
            }
        })
        // console.log($(searchable).val());
    });
    // alert('loaded');
})
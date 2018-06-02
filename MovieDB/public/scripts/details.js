$(() => {
    let movies = $('.movie');
    
    movies.click(function (e) {
        let id = $(this).attr('data-id');
        let url = `http://localhost:8080/movies/details/${id}`;
        history.pushState('', '', url);
        location.reload();
    });
});
$(() => {
    const replaceMe = $('#replaceMe');
    const addBtn = $('#addBtn');
    const msgDiv = $('<div>');
    const msgH2 = $('<h2>');

    const movieTitle = $('#movieTitle');
    const movieYear = $('#movieYear');
    const moviePoster = $('#moviePoster');
    const movieDesciption = $('#movieDescription');
    const inputsToCheck = [movieTitle, movieYear, moviePoster];

    $(addBtn).click(function (e) {
        e.preventDefault();

         if(replaceMe) {
            replaceMe.detach();
        } 
        validateInputs();
    });

    function validateInputs() {
        let inputs = inputsToCheck;
        let error = false;

        for(let input of inputs) {
            if($(input).val().length === 0) {
                error = true;
                break;
            }
        }

        if(movieDesciption.val().length === 0) {
            error = true;
        }

        if(error) {
            msgDiv.attr("id", "errBox");
            msgH2.text("Please fill all fields");
            msgH2.attr("id", "errMsg");
            errorBox = $('#errBox');
            error = true;
        } else {
            msgDiv.attr("id", "succssesBox");
            msgH2.text("Movie Added");
            msgH2.attr("id", "succssesMsg");
        }

        msgDiv.append(msgH2);
        msgDiv.appendTo($('body'));

        if(!error) {
            $(addBtn).val('Back To Home');
            $(addBtn).unbind('click').click(function() {
               
            });
        }
    }
}); 

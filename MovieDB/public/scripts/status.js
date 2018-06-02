$(() => {
  let status = $('#status');

  status.click(function (e) {
    e.preventDefault();

    $.ajax({
      url: '/',
      headers: { StatusHeader: 'Full' },
      success: (data) => {
        history.pushState(null, '', '/status');
        location.reload();
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
});

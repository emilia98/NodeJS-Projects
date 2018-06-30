let list = [
    {
        "name": "Afghanistan",
        "code": "AF"
    },
    {
        "name": "land Islands",
        "code": "AX"
    },
    {
        "name": "Albania",
        "code": "AL"
    },
    {
        "name": "Algeria",
        "code": "DZ"
    },
    {
        "name": "American Samoa",
        "code": "AS"
    },
    {
        "name": "AndorrA",
        "code": "AD"
    },
    {
        "name": "Angola",
        "code": "AO"
    },
    {
        "name": "Anguilla",
        "code": "AI"
    },
    {
        "name": "Antarctica",
        "code": "AQ"
    },
    {
        "name": "Antigua and Barbuda",
        "code": "AG"
    },
    {
        "name": "Argentina",
        "code": "AR"
    },
    {
        "name": "Armenia",
        "code": "AM"
    },
    {
        "name": "Aruba",
        "code": "AW"
    },
    {
        "name": "Australia",
        "code": "AU"
    },
    {
        "name": "Austria",
        "code": "AT"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ"
    },
];

let obj = {
    data: list,
    onPage: 5,

}

paginate(obj);
function paginate(options) {
    let data = options.data;
    let paginatedData = [];
    let pageIndex = 1;
    console.log(data.length);
    let pagesCount = Math.ceil(data.length / options.onPage);

    // for(let )
    console.log(pagesCount);
}
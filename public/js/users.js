var database = firebase.database();

$(function () {
    getData();
});

function getData() {
    database.ref("users").on('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            $('#table-content').empty();
            snapshot.forEach(function (data) {
                var val = data.val();
                content += '<tr>';

                if (val.id) {
                    content += '<td>' + val.id + '</td>';
                } else {
                    content += '<td> - </td>';
                }

                if (val.name) {
                    content += '<td class="text-nowrap">' + val.name + '</td>';
                } else {
                    content += '<td> - </td>';
                }

                if (val.email) {
                    content += '<td>' + val.email + ' </td>';
                } else {
                    content += '<td> - </td>';
                }
                if (val.number) {
                    content += '<td>' + val.number + ' </td>';
                } else {
                    content += '<td> - </td>';
                }

                content += '</tr>';
            })
            $('#table-content').append(content);
            $("#table-content").each(function (elem, index) {
                var arr = $.makeArray($("tr", this).detach());
                arr.reverse();
                $(this).append(arr);
            })
        }
    })
};


function excel_export() {
    var today = new Date();
    date_str = (('0' + (today.getMonth() + 1)).slice(-2) + '-'
        + ('0' + today.getDate()).slice(-2)
        + '-' + today.getFullYear())

    time = ('0' + (today.getHours())).slice(-2)
        + "_" + ('0' + (today.getMinutes())).slice(-2)

    let table = document.getElementsByTagName("table");
    TableToExcel.convert(table[0], {
        name: `users-data-export__` + date_str + `__` + time + `.xlsx`,
        sheet: {
            name: 'Sheet 1'
        }
    });
};


function search() {
    var searchTerm = document.getElementById("search").value.toLowerCase();
    $('#table-content tr').each(function () {
        var lineStr = $(this).text().toLowerCase();
        if (lineStr.indexOf(searchTerm) < 0) {
            $(this).remove();
        }
    });

    if ($('#table-content tr').length == 0) {
        var noData = '<p class="m-5 text-center">No data available.</p>';
        $('#table-responsive').append(noData);
    }
    document.getElementById("search").disabled = true;
};


function ClearFields() {
    location.reload();
};
var database = firebase.database();
var id;
var select_date;

$(function () {
    $(document).on('click', '.open-map', function (e) {
        e.preventDefault();
        var dom = $(this),
            mapUrl = dom.data('map-url');
        if (location) {
            window.open(
                mapUrl,
                'popUpWindow',
                'height=500,width=900,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
            );
        }
    })
})

function open_modal(x) {
    id = x;
    $("#modal_select").modal("show");
}

function getData() {
    $("#modal_select").modal("hide");
    select_date = $("#select_date").val();

    database.ref("data").orderByChild("date").equalTo(select_date).on('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            $('#table-content').empty();
            snapshot.forEach(function (data) {
                var val = data.val();
                if (val.id == id) {
                    content += '<tr>';
                    if (val.id) {
                        content += '<td>' + val.id + '</td>';
                    } else {
                        content += '<td> - </td>';
                    }

                    if (val.date) {
                        content += '<td class="text-nowrap">' + val.date + '</td>';
                    } else {
                        content += '<td> - </td>';
                    }

                    if (val.time) {
                        content += '<td>' + val.time + '</td>';
                    } else {
                        content += '<td> - </td>';
                    }

                    if (val.temp) {
                        var a = val.temp;
                        a = a.toFixed(1);
                        if (val.temp > 37.5) {
                            content += '<td class="text-nowrap"><span class="text-white badge bg-danger"><b>' + a + ' &deg;C</b></span>&nbsp;<span class="text-white badge bg-danger">HIGH</span></td>';

                        } else {
                            content += '<td class="text-nowrap"><span class="text-white badge bg-success"><b>' + a + ' &deg;C</b></span>&nbsp;<span class="text-white badge bg-success">NORMAL</span></td>';
                        }
                    } else {
                        content += '<td> - </td>';

                    }

                    if (val.heart) {
                        if (val.heart >= 150) {
                            content += '<td class="text-nowrap"><span class="text-white badge bg-danger"><b>' + val.heart + ' bpm</b></span>&nbsp;<span class="text-white badge bg-danger">HIGH</span></td>';

                        } else {
                            content += '<td class="text-nowrap"><span class="text-white badge bg-success"><b>' + val.heart + ' bpm</b></span>&nbsp;<span class="text-white badge bg-success">NORMAL</span></td>';
                        }
                    } else {
                        content += '<td> - </td>';
                    }

                    if (val.loc) {
                        var a = val.loc;
                        a = a.toString();
                        content += '<td data-hyperlink="https://www.google.com/maps/search/?api=1&query=' + a + '"><a class="open-map text-nowrap" style="cursor: pointer; text-decoration: none;" data-map-url="https://www.google.com/maps/search/?api=1&query=' + a + '"><b>Open Map</b></a></td>';
                    } else {
                        content += '<td> - </td>';
                    }

                    content += '</tr>';

                    $("#device_select").prop("hidden", true);
                    $("#table_data").prop("hidden", false);
                } else {
                    if ($('#myModal').hasClass('in')) {
                        console.log("no data found.")
                    } else {
                        $("#modal_nodata").modal("show");

                    }
                }
            })
            $('#table-content').append(content);
            $("#table-content").each(function (elem, index) {
                var arr = $.makeArray($("tr", this).detach());
                arr.reverse();
                $(this).append(arr);
            })

            var table = document.getElementById("table1");
            var tbodyRowCount = table.tBodies[0].rows.length;
            document.getElementById('data_num').innerHTML = '[ ' + tbodyRowCount + ' ] data gathered';

        } else {
            $("#modal_nodata").modal("show");
        }
    })
};



function excel_export() {
    let table = document.getElementsByTagName("table");
    TableToExcel.convert(table[0], {
        name: `archive-export__` + id + `__` + select_date + `.xlsx`,
        sheet: {
            name: 'Sheet 1'
        }
    });
};

function ClearFields() {
    location.reload();
};
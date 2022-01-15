var database = firebase.database();
var date_str;
var time;

var loc_1 = "";
var loc_2 = "";

$(function () {
    console.log("v 1.7");
    getData();

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
});


function open_map(x) {
    var loc;
    if (x == 1) {
        loc = loc_1;
    } else {
        loc = loc_2;
    }
    if (location) {
        window.open(
            loc,
            'popUpWindow',
            'height=500,width=900,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes'
        );
    }
}

function getData() {
    var today = new Date();
    date_str = (('0' + (today.getMonth() + 1)).slice(-2) + '-'
        + ('0' + today.getDate()).slice(-2)
        + '-' + today.getFullYear())

    database.ref("latest").on('value', function (snapshot) {
        if (snapshot.exists()) {
            var val = snapshot.val();

            if (val.date_1) {
                $("#latest_date_1").val(val.date_1);
            }

            if (val.time_1) {
                $("#latest_time_1").val(val.time_1);
            }

            if (val.temp_1) {
                var a = val.temp_1;
                a = a.toFixed(1);
                $("#latest_temp_1").text(a);
                if (val.temp_1 > 37.5) {
                    $("#stat_temp_1").empty().append('<span class="badge bg-danger mb-2">DANGER</span>')
                    $("#stat_htemp_1").removeClass().addClass("card-footer p-2 bg-danger");
                } else {
                    $("#stat_temp_1").empty().append('<span class="badge bg-success mb-2">NORMAL</span>')
                    $("#stat_htemp_1").removeClass().addClass("card-footer p-2 bg-success");
                }
            }

            if (val.heart_1) {
                $("#latest_heart_1").text(val.heart_1);
                if (val.heart_1 >= 150) {
                    $("#stat_heart_1").empty().append('<span class="badge bg-danger mb-2">DANGER</span>')
                    $("#stat_hfoot_1").removeClass().addClass("card-footer p-2 bg-danger");
                } else {
                    $("#stat_heart_1").empty().append('<span class="badge bg-success mb-2">NORMAL</span>')
                    $("#stat_hfoot_1").removeClass().addClass("card-footer p-2 bg-success");
                }
            }

            if (val.loc_1) {
                var a = val.loc_1;
                a = a.toString();
                loc_1 = `https://www.google.com/maps/search/?api=1&query=${a}`;
            }

            if (val.date_2) {
                $("#latest_date_2").val(val.date_2);
            }

            if (val.time_2) {
                $("#latest_time_2").val(val.time_2);
            }

            if (val.temp_2) {
                var a = val.temp_2;
                a = a.toFixed(1);
                $("#latest_temp_2").text(a);
                if (val.temp_2 > 37.5) {
                    $("#stat_temp_2").empty().append('<span class="badge bg-danger mb-2">DANGER</span>')
                    $("#stat_htemp_2").removeClass().addClass("card-footer p-2 bg-danger");
                } else {
                    $("#stat_temp_2").empty().append('<span class="badge bg-success mb-2">NORMAL</span>')
                    $("#stat_htemp_2").removeClass().addClass("card-footer p-2 bg-success");
                }
            }

            if (val.heart_2) {
                $("#latest_heart_2").text(val.heart_2);
                if (val.heart_2 >= 150) {
                    $("#stat_heart_2").empty().append('<span class="badge bg-danger mb-2">DANGER</span>')
                    $("#stat_hfoot_2").removeClass().addClass("card-footer p-2 bg-danger");
                } else {
                    $("#stat_heart_2").empty().append('<span class="badge bg-success mb-2">NORMAL</span>')
                    $("#stat_hfoot_2").removeClass().addClass("card-footer p-2 bg-success");
                }
            }


            if (val.loc_2) {
                var a = val.loc_2;
                a = a.toString();
                loc_2 = `https://www.google.com/maps/search/?api=1&query=${a}`;
            }

        }
    })


};

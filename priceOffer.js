jQuery(function ($) {

    $('.one-way').click(function () {
        $(".return-date").hide();
        $(".oneway-unavailable").removeClass("hidden");
        $(".api-error").addClass('hidden');
        $(".empty-data").addClass('hidden');
        $(".search-btn").css("pointer-events", "none");
    });

    $('.return-trip').click(function () {
        $(".return-date").show();
        $(".oneway-unavailable").addClass('hidden');
        $(".search-btn").css("pointer-events", "auto");
    });

    $('.price-checkbox-label').click(function () {
        $(".price-checkbox-input").toggleClass('price-checkbox-input-checked');
    });


    $('#searchFilter').submit(function (e) {
        removeLoadedData();
        var originCity = $('#fromCountry').val();
        var departureCity = $('#toCountry').val();
        var url = "http://localhost:3030/promotions";
        var departureDate = $('#departureDate').val();
        var returnDate = $('#returnDate').val();
        var flexiDate = $('.trip-selection').find('.price-checkbox-input-checked');
        var endPointUrl = url + '?origin=' + originCity + '&destination=' + departureCity + '&departureDate=' + departureDate + '&returnDate=' + returnDate;
        if (flexiDate.length) {
            endPointUrl = url + '?origin=' + originCity + '&destination=' + departureCity + '&departureDate=' + departureDate;
        }
        $.ajax({
            url: endPointUrl,
            dataType: "json",
            type: "GET",
            success: function (response) {
                if (response.length != 0) {
                    var obj = response;
                    searchLocation();
                    loadData(obj);
                    $(".empty-data").addClass('hidden');

                } else {
                    $(".empty-data").removeClass('hidden');
                    removeLoadedData();
                }
            },
            error: function (error) {
                $(".api-error").removeClass('hidden');
                console.log('Error in get API call : ' + error.message);
            }
        });
        e.preventDefault();
        return false;
    });

    function removeLoadedData() {
        $('.search-result').addClass("hidden-result");
        $('.origin').empty();
        $('.destination').empty();
        $('.search-table-result').empty();
    }

    function searchLocation() {
        var originCity = $('#fromCountry').val();
        var departureCity = $('#toCountry').val();
        $('.search-result').removeClass("hidden-result");
        $('.origin').append(
            '<span class="country-selected origin" aria-label='+originCity+'>'+ originCity +'</span>');
        $('.destination').append('<span class="country-selected destination" aria-label='+departureCity+'>'+ departureCity +'</span>');
        $(".api-error").addClass('hidden');
    };

    function loadData(obj) {
        $('.search-result-table').removeClass("hidden-result");
        $.each(obj, function (index, data) {
            $('.search-table-result').append(
                '<tr><td aria-label=' + data.departureDate + '>' + data.departureDate + '</td><td aria-label='+ data.returnDate + '>'  + data.returnDate + '</td><td aria-label='+ data.seatAvailability + '>' + data.seatAvailability + '</td><td aria-label=' + data.offerType + '>' + data.offerType + '</td><td aria-label=' + data.price.currency + data.price.amount + '>'  + data.price.currency + ' ' + data.price.amount + '</td></tr>'
            )
        })
    };

    $('th').each(function (obj) {
        $(this).click(function () {
            if ($(this).is('.asc')) {
                $(this).removeClass('asc');
                $(this).addClass('desc selected');
                $(this).find('i').removeClass('fa-sort-asc').addClass('fa-sort-desc');
                sortOrder = -1;
            } else {
                $(this).addClass('asc selected');
                $(this).removeClass('desc');
                $(this).find('i').removeClass('fa-sort').addClass('fa-sort-asc');
                sortOrder = 1;
            }
            $(this).siblings().removeClass('asc selected');
            $(this).siblings().removeClass('desc selected');
            $(this).siblings().find('i').removeClass('fa-sort-asc').addClass('fa-sort');
            $(this).siblings().find('i').removeClass('fa-sort-desc').addClass('fa-sort');
            var arrData = $('table').find('tbody >tr:has(td)').get();
            arrData.sort(function (a, b) {
                var val1 = $(a).children('td').eq(obj).text().toUpperCase();
                var val2 = $(b).children('td').eq(obj).text().toUpperCase();
                if ($.isNumeric(val1) && $.isNumeric(val2))
                    return sortOrder == 1 ? val1 - val2 : val2 - val1;
                else
                    return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
            });
            $.each(arrData, function (index, row) {
                $('tbody').append(row);
            });

        });
    });
});

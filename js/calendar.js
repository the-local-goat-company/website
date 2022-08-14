let pad = function(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

let format_time = function(date){
    hour = date.getHours()
    minute = pad(date.getMinutes(), 2)

    tod = "am"

    if(hour >= 12){
        tod = "pm"
    }

    if(hour > 12){
        hour = hour - 12
    }

    return `${hour}:${minute} ${tod}`
}

let get_events = function(info, successCallback, failureCallback) {
    events_url = 'data/events.json';

    $.ajax({
        dataType: "json",
        url: events_url,
        cache: false,
        success: function(data){
            successCallback(data)
        },
        error: function (jqXHR, textStatus, errorThrown){
            failureCallback(errorThrown)
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    let $modal_title = $('.modal-title')
    let $modal_body = $('.modal-body')
    let el_last_event = null

    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: get_events,
        eventDisplay: 'block',
        eventClick: function(info) {
            if(el_last_event){
                el_last_event.style.removeProperty('border-color')
            }

            $modal_title.html(info.event.title)
            $modal_body.html('')

            if('description' in info.event.extendedProps){
                $modal_body.html(info.event.extendedProps.description)
                $modal_body.append('<br/><br/>')
            }

            let times = `
                <div> Start: ${format_time(info.event.start)} </div>
                <div> End: ${format_time(info.event.end)} </div>
            `

            $modal_body.append(times)

            $('#eventModal').modal()
        
            // change the border color just for fun
            info.el.style.borderColor = 'red';
            el_last_event = info.el;
          }
    });
    calendar.render();
});
$(function() {
    getData('1');
    getData('2');
    $('.search__input').on('input', searchUpdate);
    //$('.options-cell').on('click', function(){getUsers(this)});
});

function displayOptions(users, el){
    /*$(el).append(`
        <div class="popover">
            <p>Give Album To:</p>
            <select id="select">`)

    for (x in users){
        $('#select').append(`<option value='` + users[x].name + `'>`+ users[x].name + `</option>`)
    }
    
    $(el).append( '</select></div>')*/
}


/*Search Functions*/
function searchUpdate(){
    var searchVal = $('.search__input').val();
        var count = 0;
        $('.table__row').css('display','flex');
        $('.alert').css('display','none');
        $('.title').each(function(index){
            if(($(this).text()).indexOf(searchVal) <  0){
                count++;
                $(this).parent().css('display','none');
            }
        });
        if(count == $('.title').length){
            $('.alert').css('display','inline-block');
        }
}


/*Table Functions*/
function populateTable(data, id){
    for (d in data){
        $('#'+id).append(
            `<div class='table__row' draggable='true' ondragstart='drag(event, this)' id='album`+data[d].id+`'>
                <div class='table__cell table__cell--short id'>`+data[d].id+`</div>
                <div class='table__cell table__cell title'>`+data[d].title+`</div>
            </div>`
        )
    }
    
}

function updateTable(data){
    $('#album'+data.id).remove();
    $('#table'+data.userId).append(
            `<div class='table__row' draggable='true' ondragstart='drag(event, this)' id='album`+data.id+`'>
                <div class='table__cell table__cell--short id'>`+data.id+`</div>
                <div class='table__cell table__cell title'>`+data.title+`</div>
            </div>`
        )
}



function getData(id){
    $.ajax({
        url: 'http://jsonplaceholder.typicode.com/albums?userId='+id,
        method: 'GET'
    }).then(function(data) {
        populateTable(data, 'table'+id);
    });
}


/*Drag Functions*/
function allowDrop(ev, el) {
    $(el).css('opacity','0.5');
    ev.preventDefault();
}

function drag(ev, el) {
    ev.dataTransfer.setData("text", el.id);
}


function drop(ev, el) {
    ev.preventDefault();
    var originId = ev.dataTransfer.getData("text");
    var albumId = originId.replace("album","");
    var usrId = el.id.replace("table","");
    console.log("Move " + albumId + " to "+usrId);
   $.ajax('http://jsonplaceholder.typicode.com/albums/'+albumId, {
      method: 'PATCH',
      data: {
        userId: usrId
      }
    }).then(function(data) {
        updateTable(data);
    });
    
    
}


/*User Functions*/
function getUsers(el){
    $.ajax('http://jsonplaceholder.typicode.com/users/', {
      method: 'GET',
    }).then(function(data) {
        displayOptions(data, el);
    });

}


    

$(function() {
    getData('1');
    getData('2');
    getUsers();
    $('.search__input').on('input', function(){
        searchUpdate(this);
    });
    
});



/*Search Functions*/
function searchUpdate(el){
    searchId = el.id;
    idNum = searchId.replace('search','');
    var searchVal = $('#'+searchId).val();
    var count = 0;
    $('tr').css('display','table-row');
    $('#alert'+idNum).css('display','none');
    $('#table'+idNum+' .title').each(function(index){
        if(($(this).text()).indexOf(searchVal) <  0){
            count++;
            $(this).parent().css('display','none');
        }
    });
    if(count == $('#table'+idNum+' .title').length){
        $('#alert'+idNum).css('display','inline-block');
    }
}


/*Table Functions*/
function populateTable(data, id){
    for (d in data){
        $('#'+id).append(
            `<tr draggable='true' ondragstart='drag(event, this, `+data[d].userId+` )' id='album`+data[d].id+`' ondragend = "dragEnd()">
                <td><input id='checkbox`+data[d].id+`' type="checkbox"></td>
                <td class='id'>`+data[d].id+`</td>
                <td class='title'>`+data[d].title+`</td>
                <td><select onchange="onSelect(this)" class="select" id="select`+data[d].id+`"><option selected="selected">Select</option></select></td>
            </tr>`
        )
        console.log(data[d].userId);
        getUsers(data[d].userId, data[d].id);
    }    
}

function updateTable(data){
    $('#album'+data.id).remove();
    $('#table'+data.userId).append(
            `<tr draggable='true' ondragstart='drag(event, this,`+data.userId+`)' id='album`+data.id+`' ondragend = "dragEnd()">
                <td><input id='checkbox`+data.id+`' type="checkbox"></td>
                <td class='id'>`+data.id+`</td>
                <td class='title'>`+data.title+`</td>
                <td><select onchange="onSelect(this)" class="select" id="select`+data.id+`"><option selected="selected">Select</option></select></td>
            </tr>`
        )
    getUsers(data.userId, data.id);
}



function getData(id){
    $.ajax({
        url: 'http://jsonplaceholder.typicode.com/albums?userId='+id,
        method: 'GET'
    }).then(function(data) {
        populateTable(data, 'table'+id);
    });
}

function onSelect(el){
    userId = $(el).val();
    albumId = (el.id.replace('select',''));
    moveAlbum(albumId, userId)
}

/*Drag Functions*/
function allowDrop(ev, el) {
    //$(el).css('opacity','0.5');
    ev.preventDefault();
}

function drag(ev, el, userId) {
    $(el).find('input').prop('checked', true);
    ev.dataTransfer.setData("text", el.id);
    if(userId == 1){
        $('#table2').css('opacity','0.5');
        $('#table2').css('border','2px dashed black');
    }
    else{
        $('#table1').css('opacity','0.5');
        $('#table1').css('border','2px dashed black');
    }
}

function dragEnd(){
    $('.table').css('opacity', '1');
    $('.table').css('border', 'none');
}

function drop(ev, el) {
    ev.preventDefault();
    var usrId = el.id.replace("table","");
    var selected = $('input:checked')
    
    for (s in selected){
        idNum = (selected[s].id).replace("checkbox","");
        moveAlbum(idNum, usrId);
        console.log("Move " + idNum + " to "+usrId);
    }
}


function moveAlbum(albumId, usrId){
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
function getUsers(userId, albumId){
    $.ajax('http://jsonplaceholder.typicode.com/users/', {
      method: 'GET',
    }).then(function(data) {
        for(d in data){
            if(data[d].id==userId){
                continue;
            }
            $('#select'+albumId).append('<option value="'+data[d].id+'">'+data[d].name+'</option>')
        }
    });

}


    

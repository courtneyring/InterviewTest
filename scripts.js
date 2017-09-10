$(function() {
    getData('1');
    getData('2');
    populateDropdown('1', '2');
    $('.search__input').on('input', function(){
        searchUpdate(this);
    });
    
});



/*Search Functions*/

//Function - On key press, reset table, and then hide rows with titles that don't contain the string
//If no titles match, display alert
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

//Function - use data var to create a row in the table, then call getUsers
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
        getUsers(data[d].userId, data[d].id);
    }    
}

//Function - remove row from current table, then append it to the table of the new user
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


//Function - Get album data of user(id) then call populate table with the data and the associated table
function getData(id){
    $.ajax({
        url: 'http://jsonplaceholder.typicode.com/albums?userId='+id,
        method: 'GET'
    }).then(function(data) {
        $('#table'+id + ' tbody').empty();
        
        populateTable(data, 'table'+id);
    });
}

//Function - on select of dropdown in table, get the userId and albumId, then call moveAlbum with those args
function onSelect(el){
    userId = $(el).val();
    albumId = (el.id.replace('select',''));
    moveAlbum(albumId, userId)
}

/*Drag Functions*/

//Function - prevents default behavior of drop zone during drag event
function allowDrop(ev, el) {
    ev.preventDefault();
}

//Function - On drag, check the associated checkbox, set the element Id for the event data transfer and style drop zone
function drag(ev, el, userId) {
    $(el).find('input').prop('checked', true);
    ev.dataTransfer.setData("text", el.id);
    var tables = $('table');
    $.each(tables,function(t){
        tables[t] = $(tables[t]).attr('id').replace('table','');
    })
    
    if(userId == tables[0]){
        $('#table'+tables[1]).css('opacity','0.5');
        $('#table'+tables[1]).css('border','2px dashed black');
    }
    else{
        $('#table'+tables[0]).css('opacity','0.5');
        $('#table'+tables[0]).css('border','2px dashed black');
    }
}


//Function - On drag end, return table styles to initial
function dragEnd(){
    $('.table').css('opacity', '1');
    $('.table').css('border', 'none');
}

//function - on drop, loop through the selected albums and call moveAlgum for each
function drop(ev, el) {
    ev.preventDefault();
    var usrId = el.id.replace("table","");
    var selected = $('input:checked')
    
    $.each( selected, function( s ) {
        idNum = ($(selected[s]).attr('id')).replace("checkbox","");
        moveAlbum(idNum, usrId);
        console.log("Move " + idNum + " to "+usrId);
    });
    
}

//Function - Send a patch request and use the response data to call update table
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

//Function - get users using get request, and populate the given album dropdown
//Skips the user of the current table
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

//Function - Populates the Switch User dropdown
//skips the users of the currently displayed tables
function populateDropdown(leftUser, rightUser){
    $.ajax('http://jsonplaceholder.typicode.com/users/', {
      method: 'GET',
    }).then(function(data) {
        for(d in data){
            if(data[d].id==leftUser || data[d].id==rightUser ){
                continue;
            }
            $('#userSelect'+leftUser).append('<option value="'+data[d].id+'">'+data[d].name+'</option>')
            $('#userSelect'+rightUser).append('<option value="'+data[d].id+'">'+data[d].name+'</option>')
            
        }
    });

}


//Function - on switch user, replace the selected user with the user currently displayed in table in the dropdown
function updateDropdown(selectedId, idName, idNum){
    console.log('.userSelect'+' option[value="'+selectedId+'"]')
    $('.userSelect'+' option[value="'+selectedId+'"]').remove();
    $('.userSelect').append('<option value="'+idNum+'">'+idName+'</option>')
}


//Function - on switch user, swap out id numbers and populate the table with the new data
function userSelect(el, side){
    var idNum = $(el).attr('id'). replace('userSelect','');
    var idName = $('#title'+idNum).text();
    var newId = $(el).val();
    var newName = $('#userSelect'+idNum+' option[value="'+newId+'"]').text();
    
    $('#title'+idNum).text(newName);
    $('#title'+idNum).attr('id','title'+newId);
        
    updateDropdown(newId, idName, idNum);
    $('#userSelect'+idNum).attr('id','userSelect'+newId);
    
    $('#search'+idNum).attr('id','search'+newId);
    $('#alert'+idNum).attr('id','alert'+newId);
    $('#table'+idNum).attr('id','table'+newId);
    
    
    getData(newId);
    
}
    

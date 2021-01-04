let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){

    $.ajax({
        url:"http://localhost:3001/api/orderitems/getall/"+getCookie(),
        method:"GET",
        success:function(data)
        {
            
        }
    });
});
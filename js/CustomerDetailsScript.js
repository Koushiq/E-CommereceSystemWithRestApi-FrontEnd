$(document).ready(function(){
  
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    console.log("http://localhost:3001/api/shippers/"+getCookie());
    $.ajax({
        url:"http://localhost:3001/api/shippers/"+getCookie(),
        method: 'GET',
        success: function(res) {
           if(res!=undefined)
           {
                var sid = getCookie();
                console.log(sid);
                console.log(res.ShipperId);
                if(res.ShipperId!=sid)
                {
                    alert('Unauthorized');
                    window.location.href = "ShipperHome.html";
                }
                else
                {
                    var loadInfo=function(){
                        var customerId = parseInt(getUrlParameter('id'));
                        console.log(customerId);

                        $.ajax({
                            url:"http://localhost:3001/api/customers/info/"+customerId,
                            method: "GET",
                            complete: function(xmlhttp,status){
                                if(xmlhttp.status==200)
                                {
                                    var data=xmlhttp.responseJSON;
                                    var str='';
                                    str+="<tr><td><b>Username: </b></td><td>"+data.Username+"</td></tr><tr><td><b>Name</b></td><td>"+(data.FirstName+" "+data.Lastname)+"</td></tr><tr><td><b>Address: </b></td><td>"+data.Address+"</td></tr>";
                                    $("#customerInfo").html(str);
                                }
                                else
                                {
                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                }
                            }
                        });
                    }

                    loadInfo();
                }
           }
           else
           {
               alert('Unauthorized');
               window.location.href = "ShipperHome.html";
           }
        },
        error:function(res)
        {
            alert('Unauthorized');
            window.location.href = "ShipperHome.html";
        }
    });
});

function validate(User)
{
    let errorLog =  {};
    for (let key in User) {
        
        if(User[key]=="")
        {
            errorLog[key+"Err"]=key+" can not be empty";
        }

      }
      return errorLog;
}
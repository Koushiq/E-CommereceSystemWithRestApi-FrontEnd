$(document).ready(function(){
    console.log("http://localhost:3001/api/admins/"+getCookie());
    $.ajax({
        url:"http://localhost:3001/api/admins/"+getCookie(),
        method: 'GET',
        success: function(res) {
           if(res!=undefined)
           {
              
              if(res[4]!='1')
              {
                alert('Unauthorized');
                window.location.href = "admin.html";
              }
              else
              {
                $.ajax({
                    url:"http://localhost:3001/api/products/",
                    method:'GET',
                    success:function(res)
                    {
                        let str ='';
                        console.log(res);
                        for(let i=0;i<res.length;i++)
                        {
                            str+="<tr><td>"+res[i].ProductId+"</td><td>"+res[i].ProductName+"</td><td>"+res[i].Quantity+"</td><td>"+res[i].Price+"</td><td>"+res[i].Description+"</td><td>"+res[i].CreatedAt+"</td><td>"+res[i].CategoryId+"</td><td>"+res[i].OfferId+"</td><td>"+res[i].FilePath+"</td></tr>";
                        }
                        
                        $("#datatable").append(str);
                    }
                });
              }
           }
           else
           {
               alert('Unauthorized');
               window.location.href = "admin.html";
           }
        },
        error:function(res)
        {
            alert('Unauthorized');
            window.location.href = "admin.html";
        }
    });
});
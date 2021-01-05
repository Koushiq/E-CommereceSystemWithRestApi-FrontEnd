let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;


$(document).ready(function(){
    let userData = null;
    $.ajax({
        url:"http://localhost:3001/api/customers/balance/"+getCookie(),
        method:"GET",
        success:function(response){
            userData=response;
            console.log(userData);

            $.ajax({
                url:"http://localhost:3001/api/walletentry/getinfo/"+userData[0].CustomerId,
                method:"GET",
                success:function(responseServer)
                {
                    console.log(responseServer);
                    let str=``;
                    for(let i=0;i<responseServer.length;i++)
                    {
                        str+=`<tr><td>`+responseServer[i].Amount+`</td><td>`+responseServer[i].Status+`</td><td>`+responseServer[i].RequestedAt+`</td>`;
                        if(responseServer[i].ActionAt!=undefined)
                        {
                            str+=`<td>`+responseServer[i].ActionAt+`</td></tr>`;
                        }
                        else
                        {
                            str+=`<td>No Action Yet </td></tr>`;
                        }
                    }
                    $("#rechargelog").append(str);
                },
                failed:function(){
                    alert('not found ');
                }
            });

        }
    });
    
    $('form').submit(function(e){
        e.preventDefault();
        let amount = $("#amount").val();
        // validation
        let regExp = /[a-zA-Z]/g;
        if(amount<1)
        {
            alert('amount cannot be zero empty or negative');
        }
        else if(regExp.test(amount))
        {
            alert('invalid data format');
        }
        else
        {
            
          
           $.ajax({
                url:"http://localhost:3001/api/walletentry",
                method:"POST",
                data:{
                    "CustomerId":userData[0].CustomerId,
                    "Amount":amount,
                    "RequestedAt":date,
                    "Status":"Pending",
                },
                success:function(response)
                {
                    alert('Successfully Requested');
                    window.location.href="wallet.html";
                },
                failed:function()
                {
                    alert('Not Successfully Requested');
                }
            });
        }



    });
});
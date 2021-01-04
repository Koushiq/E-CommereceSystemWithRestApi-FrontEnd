let date = new Date().toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '') ;

$(document).ready(function(){
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
                    var loadOrders=function(){
                        $.ajax({
                            url:"http://localhost:3001/api/orders",
                            method: "GET",
                            complete: function(xmlhttp,status){
                                console.log(xmlhttp);
                                if(xmlhttp.status==200)
                                {
                                    var data=xmlhttp.responseJSON;
                                    var str='';
                                    var exp='';
                                    for (var i = 0; i < data.length; i++)
                                    {
                                        if(data[i].Status=="To Be Delivered")
                                        {
                                            console.log('i am here ');
                                            if(data[i].express=='1')
                                            {
                                                exp="Yes";
                                            }
                                            else
                                            {
                                                exp="No";
                                            }
                                            str+="<tr><td>"+data[i].OrderId+"</td><td>"+data[i].DateOrdered+"</td><td>"+data[i].Status+"</td><td>"+exp+"</td><td>"+data[i].TotalCost+"</td><td><a href="+"../views/CustomerDetails.html?id="+data[i].CustomerId+">Customer Info</a></td><td><button class="+"deliverbtn"+" id="+data[i].OrderId+">Deliver This</button></td></tr>";
                                        }
                                    }
                                    $("#orderList tbody").html(str);
                                    changeStatus();
                                }
                                else
                                {
                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                }
                            }
                        });
                    }

                    loadOrders();

                    var changeStatus=function(){
                        $(".deliverbtn").click(function(){
                            var id = this.id;
                            console.log(id);
                            $.ajax({
                                url:"http://localhost:3001/api/orders/"+id,
                                method: "GET",
                                complete:function(xmlhttp,status){
                                    if(xmlhttp.status==200)
                                    {
                                        var order = xmlhttp.responseJSON;
                                        $.ajax({
                                            url:"http://localhost:3001/api/orders/"+id,
                                            method: "PUT",
                                            header:"Content-Type:application/json",
                                            data:{
                                                    "TotalCost":order.TotalCost,
                                                    "Express":order.Express,
                                                    "Status":"On the Way",
                                                    "DateOrdered":order.DateOrdered,
                                                    "CustomerId":order.CustomerId,
                                                    "ShipperId":sid
                                            },
                                            complete:function(xmlhttp,status){
                                                if(xmlhttp.status==200)
                                                {
                                                    loadOrders();
                                                    $("#msg").html("Order is On the Way!");
                                                }
                                                else
                                                {
                                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                    }
                                }
                            });
                        });
                    }

                    var updateTable=function(){
                        var selected = $("#selectList").val();

                        $.ajax({
                            url:"http://localhost:3001/api/orders",
                            method: "GET",
                            complete: function(xmlhttp,status){
                                if(xmlhttp.status==200)
                                {
                                    var data=xmlhttp.responseJSON;
                                    var str='';
                                    var exp='';
                                    for (var i = 0; i < data.length; i++)
                                    {
                                        if(selected=="Orders on the way")
                                        {
                                            if(data[i].Status=="On the Way")
                                            {
                                                if(data[i].Express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].OrderId+"</td><td>"+data[i].DateOrdered+"</td><td>"+data[i].Status+"</td><td>"+exp+"</td><td>"+data[i].TotalCost+"</td><td><a href="+"../views/CustomerDetails.html?id="+data[i].CustomerId+">Customer Info</a></td><td>N/A</td></tr>";
                                            }
                                            $("#tableHeader").html("Orders on the way");
                                        }
                                        else if(selected=="Orders Delivered")
                                        {
                                            if(data[i].Status=="Delivered")
                                            {
                                                if(data[i].Express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                    str+="<tr><td>"+data[i].OrderId+"</td><td>"+data[i].DateOrdered+"</td><td>"+data[i].Status+"</td><td>"+exp+"</td><td>"+data[i].TotalCost+"</td><td><a href="+"../views/CustomerDetails.html?id="+data[i].CustomerId+">Customer Info</a></td><td>N/A</td></tr>";
                                            }
                                            $("#tableHeader").html("Orders Delivered");
                                        }
                                        else if(selected=="My Deliveries")
                                        {
                                            if(data[i].ShipperId==sid && data[i].Status=="On the Way")
                                            {
                                                if(data[i].Express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].OrderId+"</td><td>"+data[i].DateOrdered+"</td><td>"+data[i].Status+"</td><td>"+exp+"</td><td>"+data[i].TotalCost+"</td><td><a href="+"../views/CustomerDetails.html?id="+data[i].CustomerId+">Customer Info</a></td><td><button class="+"deliverydonebtn"+" id="+data[i].OrderId+">Confirm Delivery</button></td></tr>";
                                            }
                                            $("#tableHeader").html("My Deliveries");
                                        }
                                        else if(selected=="Pending Express Orders")
                                        {
                                            if(data[i].Status=="To Be Delivered" && data[i].Express == '1')
                                            {
                                                if(data[i].Express=='1')
                                                {
                                                    exp="Yes"
                                                }
                                                else
                                                {
                                                    exp="No"
                                                }
                                                str+="<tr><td>"+data[i].OrderId+"</td><td>"+data[i].DateOrdered+"</td><td>"+data[i].Status+"</td><td>"+exp+"</td><td>"+data[i].TotalCost+"</td><td><a href="+"../views/CustomerDetails.html?id="+data[i].CustomerId+">Customer Info</a></td><td><button class="+"deliverbtn"+" id="+data[i].OrderId+">Deliver This</button></td></tr>";
                                            }
                                            $("#tableHeader").html("Pending Express Orders");
                                        }
                                    }

                                    $("#orderList tbody").html(str);
                                    changeStatus();
                                    
                                    $(".deliverydonebtn").click(function(){
                                        var id = this.id;
                                        console.log(id);
                                        $.ajax({
                                            url:"http://localhost:3001/api/orders/"+id,
                                            method: "GET",
                                            complete:function(xmlhttp,status){
                                                if(xmlhttp.status==200)
                                                {
                                                    var order = xmlhttp.responseJSON;
                                                    $.ajax({
                                                        url:"http://localhost:3001/api/orders/"+id,
                                                        method: "PUT",
                                                        header:"Content-Type:application/json",
                                                        data:{
                                                                "TotalCost":order.TotalCost,
                                                                "Express":order.Express,
                                                                "Status":"Delivered",
                                                                "DateOrdered":order.DateOrdered,
                                                                "DateDelivered":date,
                                                                "CustomerId":order.CustomerId,
                                                                "ShipperId":order.ShipperId
                                                        },
                                                        complete:function(xmlhttp,status){
                                                            if(xmlhttp.status==200)
                                                            {
                                                                loadOrders();
                                                                $("#msg").html("Order has been delivered!");
                                                            }
                                                            else
                                                            {
                                                                $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                            }
                                                        }
                                                    });
                                                }
                                                else
                                                {
                                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                                }
                                            }
                                        });
                                    });
                                }
                                else
                                {
                                    $("#msg").html(xmlhttp.status+": "+xmlhttp.statusText);
                                }
                            }
                        });
                    }

                    $("#selectList").change(function(){
                        var selected = $("#selectList").val();

                        if(selected=="Pending Orders")
                        {
                            loadOrders();
                            $("#tableHeader").html("Pending Orders");
                        }
                        else
                        {
                            updateTable();
                        }
                    });

                    var cleartextboxes=function(){
                        $("#msg").html("");
                    }
                }
           }
           else
           {
               alert('Unauthorized xx ');
               window.location.href = "ShipperHome.html";
           }
        },
        error:function(res)
        {
            alert('Unauthorized  zzz');
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